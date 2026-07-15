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
