import fs from 'fs';
import path from 'path';
import { exec } from 'child_process';
import util from 'util';
import mammoth from 'mammoth';
import ResumeAnalysis from '../models/resumeAnalysis.js';
import Resume from '../models/resume.js';
import User from '../models/user.js';
import { extractResumeDataWithGroq } from './groqUtil.js';

const execAsync = util.promisify(exec);

/**
 * Parses resume text from a file buffer and saves structured data using Groq API.
 * 
 * @param {Buffer} fileBuffer - The uploaded file buffer.
 * @param {string} mimetype - The MIME type of the uploaded file.
 * @param {string} resumeId - The ID of the saved Resume record.
 */
export const parseResumeAndSave = async (fileBuffer, mimetype, resumeId) => {
  try {
    let text = '';
    
    // 1. Extract raw text from the file buffer based on MIME type
    if (mimetype === 'application/pdf') {
      const tempFilePath = path.join('/tmp', `resume_${resumeId}.pdf`);
      
      // Write buffer to temporary file
      fs.writeFileSync(tempFilePath, fileBuffer);
      
      try {
        // Run python script using pymupdf4llm
        const scriptPath = path.join(process.cwd(), 'scripts', 'extract_pdf.py');
        const { stdout, stderr } = await execAsync(`python3 "${scriptPath}" "${tempFilePath}"`);
        
        if (stderr && stderr.includes('Error')) {
          console.error(`Python script error: ${stderr}`);
        }
        
        text = stdout;
      } finally {
        // Clean up temporary file
        if (fs.existsSync(tempFilePath)) {
          fs.unlinkSync(tempFilePath);
        }
      }
    } else if (
      mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' || 
      mimetype === 'application/msword'
    ) {
      const docxData = await mammoth.extractRawText({ buffer: fileBuffer });
      text = docxData.value;
    } else {
      console.warn(`Unsupported file type for parsing: ${mimetype}`);
      return;
    }

    if (!text || text.trim().length === 0) {
      console.warn('Could not extract any text from the resume file.');
      return;
    }

    // 2. Extract structured data using Groq
    const extractedData = await extractResumeDataWithGroq(text);

    // 3. Save or update the ResumeAnalysis record in the database
    const analysis = await ResumeAnalysis.findOne({ where: { resume_id: resumeId } });
    
    if (analysis) {
      await analysis.update({
        extracted_name: extractedData.extracted_name,
        extracted_email: extractedData.extracted_email,
        education: extractedData.education,
        experience: extractedData.experience,
        projects: extractedData.projects,
        certifications: extractedData.certifications,
        summary: extractedData.summary,
        extracted_skills: extractedData.extracted_skills
      });
    } else {
      await ResumeAnalysis.create({
        resume_id: resumeId,
        extracted_name: extractedData.extracted_name,
        extracted_email: extractedData.extracted_email,
        education: extractedData.education,
        experience: extractedData.experience,
        projects: extractedData.projects,
        certifications: extractedData.certifications,
        summary: extractedData.summary,
        extracted_skills: extractedData.extracted_skills
      });
    }
    
    console.log(`Successfully parsed and saved resume analysis for resume_id: ${resumeId}`);

    // 4. Update the User profile with extracted contact and link information
    const resume = await Resume.findByPk(resumeId);
    if (resume && resume.user_id) {
      const user = await User.findByPk(resume.user_id);
      if (user) {
        let userUpdated = false;
        if (extractedData.extracted_phone) {
          user.phone = extractedData.extracted_phone;
          userUpdated = true;
        }
        if (extractedData.extracted_website) {
          user.website = extractedData.extracted_website;
          userUpdated = true;
        }
        if (extractedData.extracted_linkedin) {
          user.linkedin_url = extractedData.extracted_linkedin;
          userUpdated = true;
        }
        if (extractedData.extracted_github) {
          user.github_url = extractedData.extracted_github;
          userUpdated = true;
        }
        
        if (userUpdated) {
          await user.save();
          console.log(`Successfully updated profile links for user_id: ${user.id}`);
        }
      }
    }
  } catch (error) {
    console.error(`Failed to parse and save resume data for resume_id: ${resumeId}:`, error);
  }
};
