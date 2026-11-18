const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1';

/**
 * Streams AI cover letter generation via Server-Sent Events (SSE).
 * Reports exact real-time progress percentage (0-100%) and streamed text chunks.
 *
 * @param {Object} payload - Generation inputs
 * @param {Object} handlers
 * @param {(data: { percent: number, stage: string }) => void} [handlers.onProgress]
 * @param {(data: { chunk: string, percent: number, wordCount: number, stage: string }) => void} [handlers.onChunk]
 * @param {(data: { percent: number, stage: string, text: string, wordCount: number, model: string, latencyMs: number }) => void} [handlers.onDone]
 * @param {AbortSignal} [handlers.signal]
 */
export const streamCoverLetter = async (
  payload,
  { onProgress, onChunk, onDone, signal } = {}
) => {
  const response = await fetch(`${API_BASE}/cover-letters/generate`, {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'text/event-stream',
      'X-Portal': 'user',
    },
    body: JSON.stringify(payload),
    signal,
  });

  if (!response.ok) {
    let message = 'Failed to generate cover letter. Please try again.';
    try {
      const errBody = await response.json();
      if (errBody?.message) message = errBody.message;
    } catch {
      // ignore non-json error bodies
    }
    const err = new Error(message);
    err.status = response.status;
    throw err;
  }

  if (!response.body) {
    throw new Error('Streaming is not supported by your browser.');
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder('utf-8');
  let buffer = '';
  let finalResult = null;

  const processBlock = (block) => {
    if (!block.trim()) return;
    let eventName = 'message';
    const dataLines = [];

    for (const line of block.split(/\r?\n/)) {
      if (line.startsWith('event:')) {
        eventName = line.slice(6).trim();
      } else if (line.startsWith('data:')) {
        dataLines.push(line.slice(5).trim());
      }
    }

    if (dataLines.length === 0) return;
    let parsed;
    try {
      parsed = JSON.parse(dataLines.join('\n'));
    } catch {
      return;
    }

    if (eventName === 'progress') {
      onProgress?.(parsed);
    } else if (eventName === 'chunk') {
      onChunk?.(parsed);
    } else if (eventName === 'done') {
      finalResult = parsed;
      onDone?.(parsed);
    } else if (eventName === 'error') {
      throw new Error(parsed?.message || 'Cover letter generation failed.');
    }
  };

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });

    const blocks = buffer.split(/\r?\n\r?\n/);
    buffer = blocks.pop() || '';

    for (const block of blocks) {
      processBlock(block);
    }
  }

  if (buffer.trim()) {
    processBlock(buffer);
  }

  return finalResult;
};
