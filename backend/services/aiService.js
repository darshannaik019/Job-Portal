import logger from '../utils/logger.js';

/**
 * Fallback scoring algorithm (Keyword matching)
 */
const fallbackScoreResume = (resumeText, job) => {
  if (!resumeText) {
    return { 
      score: 35, 
      feedback: "No resume text was extracted. Match score is based on basic contact details; please upload a detailed resume." 
    };
  }

  const text = resumeText.toLowerCase();
  
  // Combine job details for keyword matching
  const jobTitle = job.title.toLowerCase();
  const jobDesc = job.description.toLowerCase();
  const requirements = (job.requirements || []).map(r => r.toLowerCase());

  // Extract candidate keywords/skills
  const keyTerms = [...requirements, jobTitle];
  if (keyTerms.length === 0) {
    return {
      score: 85,
      feedback: "No strict requirements defined for this job. Resume fits basic eligibility criteria."
    };
  }

  let matches = 0;
  const uniqueTerms = [...new Set(keyTerms)].filter(term => term.length > 2);
  
  uniqueTerms.forEach(term => {
    // Check for exact word matches or close substring matches
    if (text.includes(term)) {
      matches++;
    }
  });

  const ratio = uniqueTerms.length > 0 ? matches / uniqueTerms.length : 0.5;
  const score = Math.round(30 + (ratio * 65)); // base score of 30, max 95

  return {
    score: Math.min(98, Math.max(30, score)),
    feedback: `Matched ${matches} key job requirement terms. Candidate exhibits relevant capabilities in ${jobTitle} domains. (Offline Keyword Analysis)`
  };
};

/**
 * Score resume text against job details using Gemini API or Fallback
 */
export const scoreResumeWithAI = async (resumeText, job) => {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey || apiKey.includes('placeholder')) {
    logger.info('Gemini API key not found. Using local keyword-matching algorithm.');
    return fallbackScoreResume(resumeText, job);
  }

  try {
    const prompt = `You are a professional HR recruiter. Carefully analyze the candidate's resume text and score how well they match the job specifications.

Job Title: ${job.title}
Job Description: ${job.description}
Job Requirements: ${JSON.stringify(job.requirements || [])}

Candidate Resume Text:
${resumeText}

Provide:
1. A match score between 0 and 100 representing how well the resume matches the job.
2. A 2-3 sentence constructive feedback explanation of the score.

You MUST respond in clean JSON format with exactly this structure:
{
  "score": number,
  "feedback": "string"
}`;

    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;
    
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: prompt
              }
            ]
          }
        ],
        generationConfig: {
          responseMimeType: "application/json"
        }
      })
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    const resultText = data.candidates?.[0]?.content?.parts?.[0]?.text;
    
    if (!resultText) {
      throw new Error("Empty response from Gemini API");
    }

    // Clean response (sometimes APIs wrap json in markdown formatting)
    const cleanedText = resultText
      .replace(/```json/g, '')
      .replace(/```/g, '')
      .trim();

    const parsedResult = JSON.parse(cleanedText);
    
    return {
      score: typeof parsedResult.score === 'number' ? parsedResult.score : 50,
      feedback: parsedResult.feedback || "Resume analyzed successfully."
    };

  } catch (error) {
    logger.error(`AI scoring failed, falling back: ${error.message}`);
    return fallbackScoreResume(resumeText, job);
  }
};
