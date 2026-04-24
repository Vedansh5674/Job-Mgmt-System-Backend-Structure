const { GoogleGenAI } = require('@google/genai');
const logger = require('../utils/logger');

// Initialize the Gemini client
const genAI = new GoogleGenAI(process.env.GEMINI_API_KEY || '');

const analyzeResume = async (resumeText, jobDescription) => {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    
    const prompt = `
      You are an expert technical recruiter. 
      Analyze the following resume against the provided job description.
      Provide a score out of 100 on how well the candidate matches the job.
      Also provide a brief 2-3 sentence summary of strengths and weaknesses.
      
      Format your response as a JSON object with the following structure:
      {
        "score": number,
        "summary": "string",
        "strengths": ["string"],
        "weaknesses": ["string"]
      }
      
      Job Description:
      ${jobDescription}
      
      Resume Text:
      ${resumeText}
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    // Clean the response in case it contains markdown
    const jsonString = text.replace(/```json\n?|\n?```/g, '').trim();
    return JSON.parse(jsonString);
  } catch (error) {
    logger.error('Error analyzing resume with AI:', error);
    throw error;
  }
};

const getJobRecommendations = async (userSkills, allJobs) => {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    
    const jobsData = allJobs.map(job => ({ 
      id: job._id, 
      title: job.title, 
      skills: job.skills, 
      description: job.description 
    }));
    
    const prompt = `
      You are an AI career advisor.
      Based on the user's skills: ${userSkills.join(', ')}
      
      Select the top 3 best matching jobs from the following list.
      Return ONLY a JSON array of the recommended job IDs.
      
      Format:
      ["jobId1", "jobId2", "jobId3"]
      
      Available Jobs:
      ${JSON.stringify(jobsData)}
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    const jsonString = text.replace(/```json\n?|\n?```/g, '').trim();
    return JSON.parse(jsonString);
  } catch (error) {
    logger.error('Error getting AI job recommendations:', error);
    throw error;
  }
};

module.exports = {
  analyzeResume,
  getJobRecommendations
};
