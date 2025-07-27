
import { GoogleGenAI, Type } from "@google/genai";
import { Job, JobAnalysis, ResumeAnalysis } from '../types';

// IMPORTANT: Replace "YOUR_GEMINI_API_KEY_HERE" with your actual Google Gemini API key.
// You can get a key from Google AI Studio: https://aistudio.google.com/app/apikey
const API_KEY = PASTE_GEMINI_API_KEY;

export const isGeminiApiKeyConfigured = !!API_KEY;

let ai: GoogleGenAI | null = null;
if (isGeminiApiKeyConfigured) {
    ai = new GoogleGenAI({ apiKey: API_KEY });
}

const checkAiInitialized = () => {
    if (!ai) {
        throw new Error("Gemini API key not configured. Please add your key to services/geminiService.ts.");
    }
};

const analysisSchema = {
    type: Type.OBJECT,
    properties: {
        sentiment: { type: Type.STRING, enum: ['Positive', 'Neutral', 'Negative'] },
        urgencyScore: { type: Type.NUMBER, description: "A score from 1-10 indicating hiring urgency." },
        growthScore: { type: Type.NUMBER, description: "A score from 1-10 indicating company growth signals." },
        extractedSalary: { type: Type.STRING, description: "e.g., '$80,000 - $100,000 per year' or 'Not mentioned'." },
        keySkills: { type: Type.ARRAY, items: { type: Type.STRING } },
        benefits: { type: Type.ARRAY, items: { type: Type.STRING } },
        summary: { type: Type.STRING, description: "A 2-3 sentence summary of the opportunity." },
    },
    required: ["sentiment", "urgencyScore", "growthScore", "extractedSalary", "keySkills", "benefits", "summary"],
};

const resumeAnalysisSchema = {
    type: Type.OBJECT,
    properties: {
        matchScore: { type: Type.NUMBER, description: "A score from 1-10 on how well the resume matches the job description." },
        positiveFeedback: { type: Type.STRING, description: "Detailed positive feedback on what aspects of the resume align well with the job." },
        improvementAreas: { type: Type.STRING, description: "Constructive feedback on areas where the resume could be improved to better match the job." },
        missingKeywords: { type: Type.ARRAY, items: { type: Type.STRING }, description: "A list of important keywords from the job description that are missing from the resume." },
    },
    required: ["matchScore", "positiveFeedback", "improvementAreas", "missingKeywords"],
};

const jobMatchScoreSchema = {
    type: Type.OBJECT,
    properties: {
        score: { type: Type.NUMBER, description: "A score from 0 to 10 on how well the resume matches the job description, where 10 is a perfect match." },
        justification: { type: Type.STRING, description: "A one-sentence justification for the score, highlighting the strongest match or a key missing element." },
    },
    required: ["score", "justification"],
};

export const getJobMatchScore = async (job: Omit<Job, 'analysis' | 'score' | 'scoreJustification'>, resumeText: string): Promise<{ score: number; justification: string }> => {
    checkAiInitialized();
    try {
        const prompt = `Analyze how well the following resume matches the job description. Provide a score from 0-10 and a brief, one-sentence justification.

        **Job Description:**
        Title: ${job.title}
        Description: ${job.description}

        ---

        **Resume:**
        ${resumeText}
        
        ---
        Provide your analysis based on the schema. Focus on relevant skills, experience, and qualifications.`;

        const response = await ai!.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: jobMatchScoreSchema,
            },
        });

        const jsonText = response.text.trim();
        return JSON.parse(jsonText);
    } catch (error) {
        console.error("Error getting job match score:", error);
        throw new Error("Failed to get job match score from AI.");
    }
};


export const analyzeJobDescription = async (job: Job): Promise<JobAnalysis> => {
    checkAiInitialized();
    try {
        const prompt = `Analyze the following job posting and provide a detailed analysis.
        Job Title: ${job.title}
        Company: ${job.company}
        Location: ${job.location}
        Description: ${job.description}
        
        Analyze for sentiment, urgency (look for words like 'immediate', 'asap', 'urgent'), growth signals (like 'new team', 'expansion', 'fast-growing'), salary, key skills, and benefits. Provide a concise summary.`;

        const response = await ai!.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: analysisSchema,
            },
        });

        const jsonText = response.text.trim();
        return JSON.parse(jsonText) as JobAnalysis;
    } catch (error) {
        console.error("Error analyzing job description:", error);
        throw new Error("Failed to analyze job from AI.");
    }
};

export const analyzeResumeAndJob = async (job: Job, resumeText: string): Promise<ResumeAnalysis> => {
    checkAiInitialized();
    try {
        const prompt = `Analyze the provided resume against the following job description. Evaluate how well the resume matches the job requirements, identify missing keywords, and provide a matching score out of 10.

        **Job Description:**
        Title: ${job.title}
        Company: ${job.company}
        Description: ${job.description}

        ---

        **User's Resume:**
        ${resumeText}

        ---

        Provide a detailed analysis based on the schema. The feedback should be constructive and help the user tailor their resume effectively.`;

        const response = await ai!.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: resumeAnalysisSchema,
            },
        });

        const jsonText = response.text.trim();
        return JSON.parse(jsonText) as ResumeAnalysis;
    } catch (error) {
        console.error("Error analyzing resume and job:", error);
        throw new Error("Failed to perform resume analysis from AI.");
    }
};

export const generateTailoredResume = async (job: Job, resumeText: string): Promise<string> => {
    checkAiInitialized();
    try {
        const prompt = `Rewrite the following resume to be perfectly tailored for the provided job description. Emphasize the most relevant skills and experiences. Rephrase bullet points to align with the job's requirements and desired qualifications. The output should be a complete, professional resume in plain text format, ready to be copied.

        **Job Description:**
        Title: ${job.title}
        Company: ${job.company}
        Description: ${job.description}

        ---

        **User's Original Resume:**
        ${resumeText}

        ---
        
        Generate the tailored resume now.`;

        const response = await ai!.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
        });

        return response.text;
    } catch (error) {
        console.error("Error generating tailored resume:", error);
        throw new Error("Failed to generate tailored resume from AI.");
    }
};
