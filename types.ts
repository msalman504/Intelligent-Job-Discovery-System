
export enum Page {
  JOB_DISCOVERY = 'JOB_DISCOVERY',
  MARKET_TRENDS = 'MARKET_TRENDS',
  WATCHLIST = 'WATCHLIST',
  MY_RESUME = 'MY_RESUME',
}

export interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  description:string;
  source: string;
  applyLink?: string;
  employerLogo?: string;
  analysis?: JobAnalysis;
  score: number; // Represents the resume match score (0-10)
  scoreJustification?: string;
}

export interface JobAnalysis {
  sentiment: 'Positive' | 'Neutral' | 'Negative';
  urgencyScore: number;
  growthScore: number;
  extractedSalary: string;
  keySkills: string[];
  benefits: string[];
  summary: string;
}

export interface ResumeAnalysis {
  matchScore: number;
  positiveFeedback: string;
  improvementAreas: string;
  missingKeywords: string[];
}
