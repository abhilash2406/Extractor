import Resume from '../../models/resume.js';
import {
  FEATURE_COUNTER_KEYS,
  incrementFeatureCounter,
  getFeatureCounter,
} from '../../models/featureCounter.js';
import {
  streamCoverLetterWithGroq,
  COVER_LETTER_LENGTH_TARGETS,
} from '../../utils/groqUtil.js';
import { logger } from '../../config/winston-config.js';

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/**
 * Validates request payload before starting SSE stream.
 */
export const validateCoverLetterInput = (body = {}) => {
  const jobTitle = (body.jobTitle || '').trim();
  const companyName = (body.companyName || '').trim();

  if (!jobTitle || jobTitle.length < 2) {
    const err = new Error('Please enter a target job title (at least 2 characters).');
    err.statusCode = 400;
    throw err;
  }

  if (!companyName || companyName.length < 2) {
    const err = new Error('Please enter a company name (at least 2 characters).');
    err.statusCode = 400;
    throw err;
  }

  const length = COVER_LETTER_LENGTH_TARGETS[body.length] ? body.length : 'standard';

  return {
    jobTitle: jobTitle.slice(0, 150),
    companyName: companyName.slice(0, 150),
    hiringManager: (body.hiringManager || 'Hiring Team').trim().slice(0, 120),
    keySkills: (body.keySkills || '').trim().slice(0, 600),
    tone: (body.tone || 'Confident & Impact-Driven').trim().slice(0, 80),
    length,
    jobDescription: (body.jobDescription || '').trim().slice(0, 3500),
    candidateName: (body.candidateName || '').trim().slice(0, 120),
    candidateEmail: (body.candidateEmail || '').trim().slice(0, 150),
    candidatePhone: (body.candidatePhone || '').trim().slice(0, 40),
    experienceSummary: (body.experienceSummary || '').trim().slice(0, 1000),
    resumeId: body.resumeId && UUID_REGEX.test(body.resumeId) ? body.resumeId : null,
  };
};

/**
 * Streams AI cover letter generation with exact token-driven progress percentages.
 * Does NOT save the cover letter content; only increments the aggregate counter for admin telemetry.
 */
export const generateCoverLetterStreamService = async (
  rawBody,
  currentUser = null,
  emit = () => {}
) => {
  const startedAt = Date.now();
  const input = validateCoverLetterInput(rawBody);

  emit('progress', {
    percent: 5,
    stage: 'Validating role & company details...',
  });

  // Optionally enrich with user's saved resume (if authenticated & owned)
  let resumeContext = null;
  if (input.resumeId && currentUser?.id) {
    emit('progress', {
      percent: 12,
      stage: 'Importing context from your saved resume...',
    });

    const savedResume = await Resume.findOne({
      where: { id: input.resumeId, user_id: currentUser.id },
      attributes: ['id', 'title', 'content'],
    });

    if (savedResume?.content && typeof savedResume.content === 'object') {
      const c = savedResume.content;
      const personal = c.personal || c.personalInfo || {};
      if (!input.candidateName && (personal.fullName || personal.name)) {
        input.candidateName = personal.fullName || personal.name;
      }
      if (!input.candidateEmail && personal.email) {
        input.candidateEmail = personal.email;
      }
      if (!input.candidatePhone && personal.phone) {
        input.candidatePhone = personal.phone;
      }
      resumeContext = {
        summary: c.summary || personal.summary || '',
        experience: c.experience || [],
        projects: c.projects || [],
        skills: c.skills || [],
      };
    }
  } else if (currentUser) {
    if (!input.candidateName && currentUser.username) {
      input.candidateName = currentUser.username;
    }
    if (!input.candidateEmail && currentUser.email) {
      input.candidateEmail = currentUser.email;
    }
  }

  emit('progress', {
    percent: 18,
    stage: 'Connecting to Groq LPU inference engine...',
  });

  let lastPercent = 18;

  const result = await streamCoverLetterWithGroq(
    { ...input, resumeContext },
    ({ chunk, wordCount, targetWords }) => {
      // Exact progress between 20% and 95% mapped linearly to streamed words vs. target budget
      const ratio = targetWords > 0 ? Math.min(1, wordCount / targetWords) : 0.5;
      const computed = Math.min(95, Math.max(20, Math.round(20 + ratio * 75)));
      const percent = Math.max(lastPercent, computed);
      lastPercent = percent;

      let stage = 'Drafting opening hook...';
      if (percent >= 75) {
        stage = 'Polishing closing & call-to-action...';
      } else if (percent >= 42) {
        stage = 'Tailoring experience & key achievements...';
      }

      emit('chunk', {
        chunk,
        percent,
        wordCount,
        stage,
      });
    }
  );

  emit('progress', {
    percent: 98,
    stage: 'Finalizing cover letter...',
  });

  // Increment aggregate admin counter (no cover letter text stored!)
  try {
    await incrementFeatureCounter(FEATURE_COUNTER_KEYS.COVER_LETTER_GENERATED, 1);
  } catch (counterErr) {
    logger.error(`Failed to increment cover letter counter: ${counterErr.message}`);
  }

  const latencyMs = Date.now() - startedAt;

  emit('done', {
    percent: 100,
    stage: 'Cover letter ready!',
    text: result.text,
    wordCount: result.wordCount,
    model: result.model,
    latencyMs,
  });

  return result;
};

/**
 * Returns total cover letters generated count for admin analytics.
 */
export const getCoverLetterCountService = async () => {
  const count = await getFeatureCounter(FEATURE_COUNTER_KEYS.COVER_LETTER_GENERATED);
  return { count };
};
