import groq from '../config/groq-config.js';

/**
 * Extracts structured data from raw resume text using Groq API.
 * 
 * @param {string} text - The raw text extracted from the resume file.
 * @returns {Promise<Object>} - The parsed JSON data matching ResumeAnalysis schema.
 */
export const extractResumeDataWithGroq = async (text) => {
  const prompt = `
You are an expert HR AI assistant. Your task is to extract structured information from the provided resume text.
Return the information strictly in JSON format. Do not add any extra text or markdown formatting.
If a field is not found, set its value to null.

The JSON schema must be exactly as follows:
{
  "extracted_name": "String (The full name of the candidate)",
  "extracted_email": "String (The email address of the candidate)",
  "extracted_phone": "String (The phone number of the candidate)",
  "extracted_website": "String (The personal website URL of the candidate)",
  "extracted_linkedin": "String (The LinkedIn profile URL of the candidate)",
  "extracted_github": "String (The GitHub profile URL of the candidate)",
  "education": [ 
    { "institution": "String", "degree": "String", "duration": "String" }
  ],
  "experience": [
    { "company": "String", "role": "String", "duration": "String", "description": "String" }
  ],
  "projects": [
    { "title": "String", "description": "String" }
  ],
  "certifications": [
    "String (Name of the certification)"
  ],
  "summary": "String (A short summary or objective of the candidate)",
  "extracted_skills": [
    "String (Skill name)"
  ]
}

Resume Text:
"""
${text}
"""
  `;

  try {
    const chatCompletion = await groq.chat.completions.create({
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
      model: 'llama-3.1-8b-instant',
      temperature: 0.1,
      response_format: { type: 'json_object' },
    });

    const content = chatCompletion.choices[0]?.message?.content;
    
    if (content) {
      return JSON.parse(content);
    }
    
    throw new Error('Groq returned an empty response');
  } catch (error) {
    console.error('Error extracting resume data with Groq:', error);
    throw error;
  }
};

/**
 * Generates a professional job description using Groq API.
 * 
 * @param {string} title - Job Title
 * @param {string[]} skills - Array of required skills
 * @param {number} minExperience - Minimum years of experience
 * @param {string} minEducation - Minimum education level
 * @returns {Promise<string>} - Generated job description in text/markdown format.
 */
export const generateJobDescriptionWithGroq = async (title, skills, minExperience, minEducation) => {
  const prompt = `
You are an expert HR Manager and Technical Recruiter. Your task is to write a highly professional, engaging, and clear Job Description for a new open position.

Job Details provided by the admin:
- Job Title: ${title || 'Not specified'}
- Required Skills: ${skills && skills.length > 0 ? skills.join(', ') : 'Not specified'}
- Minimum Experience: ${minExperience !== undefined ? minExperience + ' years' : 'Not specified'}
- Minimum Education: ${minEducation || 'Not specified'}

Write a comprehensive job description that includes:
1. A brief, exciting overview of the role and its impact.
2. Key Responsibilities (bullet points).
3. Requirements & Qualifications (bullet points), incorporating the requested skills, education, and experience.
4. Why join us (a brief section on culture and growth).

Format the response beautifully using markdown (like bolding, bullet points). Keep it concise (around 200-300 words). DO NOT include placeholder text like "[Company Name]" — just write it generically or use "our team" so it can be used directly without edits. Do NOT return JSON, just the raw markdown text.
  `;

  try {
    const chatCompletion = await groq.chat.completions.create({
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
      model: 'llama-3.1-8b-instant',
      temperature: 0.7,
    });

    const content = chatCompletion.choices[0]?.message?.content;
    
    if (content) {
      return content.trim();
    }
    
    throw new Error('Groq returned an empty response');
  } catch (error) {
    console.error('Error generating job description with Groq:', error);
    throw error;
  }
};

/**
 * Generates multiple-choice questions using Groq API.
 * 
 * @param {string} topic - The topic for the questions
 * @param {string} difficulty - The difficulty level (Easy, Medium, Hard)
 * @returns {Promise<Array>} - Parsed JSON array containing 10 question objects.
 */
export const generateQuestionWithGroq = async (topic, difficulty) => {
  const prompt = `
You are an expert technical interviewer and educator. Your task is to generate 10 high-quality, professional multiple-choice questions on the given topic.

Topic: ${topic}
Difficulty: ${difficulty}

Return the questions strictly in JSON format. Do not add any extra text or markdown formatting.
The JSON schema must be exactly as follows:
{
  "questions": [
    {
      "question": "String (The question text itself)",
      "option_a": "String (First possible answer)",
      "option_b": "String (Second possible answer)",
      "option_c": "String (Third possible answer)",
      "option_d": "String (Fourth possible answer)",
      "correct_answer": "String (Exactly one character: 'A', 'B', 'C', or 'D')"
    }
  ]
}

Ensure you generate exactly 10 questions. Ensure the options are plausible and the correct_answer is accurate. Do not include A, B, C, D in the option text itself (e.g. use "React Router", not "A. React Router").
  `;

  try {
    const chatCompletion = await groq.chat.completions.create({
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
      model: 'llama-3.1-8b-instant',
      temperature: 0.6,
      response_format: { type: 'json_object' },
    });

    const content = chatCompletion.choices[0]?.message?.content;
    
    if (content) {
      const parsed = JSON.parse(content);
      return parsed.questions || [];
    }
    
    throw new Error('Groq returned an empty response');
  } catch (error) {
    console.error('Error generating questions with Groq:', error);
    throw error;
  }
};
