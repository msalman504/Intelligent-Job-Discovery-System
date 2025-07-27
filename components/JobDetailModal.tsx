import React, { useEffect, useState, useCallback } from 'react';
import { Job, JobAnalysis, ResumeAnalysis } from '../types';
import { analyzeJobDescription, analyzeResumeAndJob, generateTailoredResume } from '../services/geminiService';
import { ICONS } from '../constants';

interface JobDetailModalProps {
  job: Job | null;
  onClose: () => void;
  onAnalysisComplete: (jobId: string, analysis: JobAnalysis) => void;
}

const AnalysisPill: React.FC<{ label: string; value: string | number; colorClass: string; }> = ({ label, value, colorClass }) => (
    <div className={`text-center p-3 rounded-lg bg-gray-700/50 border ${colorClass}`}>
        <div className="text-xs text-gray-400 uppercase tracking-wider">{label}</div>
        <div className="text-xl font-bold text-white">{value}</div>
    </div>
);

export const JobDetailModal: React.FC<JobDetailModalProps> = ({ job, onClose, onAnalysisComplete }) => {
  const [analysis, setAnalysis] = useState<JobAnalysis | undefined>(job?.analysis);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  const [resumeText, setResumeText] = useState('');
  const [resumeAnalysis, setResumeAnalysis] = useState<ResumeAnalysis | null>(null);
  const [tailoredResume, setTailoredResume] = useState<string | null>(null);
  const [isAnalyzingResume, setIsAnalyzingResume] = useState(false);
  const [isGeneratingResume, setIsGeneratingResume] = useState(false);
  const [resumeError, setResumeError] = useState('');

  const performAnalysis = useCallback(async (currentJob: Job) => {
    if (!currentJob) return;

    setIsLoading(true);
    setError('');
    try {
      const result = await analyzeJobDescription(currentJob);
      setAnalysis(result);
      onAnalysisComplete(currentJob.id, result);
    } catch (e) {
      setError('Failed to get AI analysis. Please try again.');
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  }, [onAnalysisComplete]);
  
  useEffect(() => {
    if (job && !job.analysis) {
      performAnalysis(job);
    } else {
      setAnalysis(job?.analysis);
    }
    // Reset resume-related state when modal opens with a new job
    setResumeText('');
    setResumeAnalysis(null);
    setTailoredResume(null);
    setResumeError('');
  }, [job, performAnalysis]);
  
  const handleResumeAnalysis = async () => {
    if (!job || !resumeText.trim()) return;
    setIsAnalyzingResume(true);
    setResumeError('');
    setResumeAnalysis(null);
    setTailoredResume(null);
    try {
        const result = await analyzeResumeAndJob(job, resumeText);
        setResumeAnalysis(result);
    } catch (e) {
        setResumeError('Failed to analyze resume. Please try again.');
        console.error(e);
    } finally {
        setIsAnalyzingResume(false);
    }
  };

  const handleGenerateResume = async () => {
    if (!job || !resumeText.trim()) return;
    setIsGeneratingResume(true);
    setResumeError('');
    setTailoredResume(null);
    try {
        const result = await generateTailoredResume(job, resumeText);
        setTailoredResume(result);
    } catch (e) {
        setResumeError('Failed to generate tailored resume. Please try again.');
        console.error(e);
    } finally {
        setIsGeneratingResume(false);
    }
  };


  if (!job) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50 transition-opacity" onClick={onClose}>
      <div className="bg-gray-800 rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden border border-gray-700" onClick={(e) => e.stopPropagation()}>
        <div className="p-4 border-b border-gray-700 flex justify-between items-center gap-4 flex-shrink-0">
          <div className="flex items-center gap-4">
            {job.employerLogo && <img src={job.employerLogo} alt={`${job.company} logo`} className="w-16 h-16 object-contain rounded-md bg-white p-1" />}
            <div>
              <h2 className="text-2xl font-bold text-blue-300">{job.title}</h2>
              <p className="text-gray-300">{job.company} - <span className="text-gray-400">{job.location}</span></p>
            </div>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-white text-3xl font-bold self-start">&times;</button>
        </div>
        
        <div className="flex-grow overflow-y-auto p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
             {job.applyLink && (
                 <a
                    href={job.applyLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block bg-green-600 text-white font-bold py-2 px-6 rounded-md hover:bg-green-500 transition-colors mb-4"
                >
                    Apply Now &rarr;
                </a>
            )}
            <h3 className="text-lg font-semibold text-gray-200 mb-2">Job Description</h3>
            <div className="prose prose-invert prose-sm max-w-none text-gray-300 whitespace-pre-wrap font-sans bg-gray-900/50 p-4 rounded-md">
                {job.description || "No description provided."}
            </div>

            <div className="mt-6">
                <h3 className="text-lg font-semibold text-gray-200 mb-2 flex items-center gap-2">
                    {ICONS.GEMINI} Resume ATS Analysis
                </h3>
                <div className="bg-gray-900/50 p-4 rounded-md">
                    <textarea
                        className="w-full bg-gray-700/50 border border-gray-600 rounded-md px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none transition h-40"
                        placeholder="Paste your resume here to analyze it against the job description..."
                        value={resumeText}
                        onChange={(e) => setResumeText(e.target.value)}
                        disabled={isAnalyzingResume || isGeneratingResume}
                    />
                    <div className="flex items-center gap-4 mt-3">
                        <button 
                            onClick={handleResumeAnalysis}
                            disabled={!resumeText.trim() || isAnalyzingResume || isGeneratingResume}
                            className="bg-purple-600 text-white font-bold py-2 px-4 rounded-md hover:bg-purple-500 transition-colors disabled:bg-gray-500 disabled:cursor-not-allowed flex items-center justify-center min-w-[150px]">
                            {isAnalyzingResume ? ICONS.SPINNER : 'Analyze & Match'}
                        </button>
                         <button 
                            onClick={handleGenerateResume}
                            disabled={!resumeText.trim() || isAnalyzingResume || isGeneratingResume}
                            className="bg-teal-600 text-white font-bold py-2 px-4 rounded-md hover:bg-teal-500 transition-colors disabled:bg-gray-500 disabled:cursor-not-allowed flex items-center justify-center min-w-[150px]">
                            {isGeneratingResume ? ICONS.SPINNER : 'Tailor Resume'}
                        </button>
                    </div>
                     {resumeError && <div className="text-red-400 mt-3 p-2 bg-red-900/50 rounded-md">{resumeError}</div>}
                </div>
              </div>

              {isAnalyzingResume && (
                <div className="mt-4 flex flex-col items-center justify-center text-center text-gray-400 h-40 bg-gray-700/30 rounded-lg">
                    {ICONS.SPINNER}
                    <p className="mt-2">Performing ATS analysis...</p>
                </div>
              )}

              {resumeAnalysis && !isAnalyzingResume && (
                  <div className="mt-4 space-y-4 bg-gray-900/50 p-4 rounded-md">
                      <div className="flex items-center gap-4">
                          <h4 className="text-lg font-semibold text-gray-200">Analysis Result:</h4>
                          <div className="flex items-baseline gap-2">
                              <span className="text-3xl font-bold text-purple-400">{resumeAnalysis.matchScore}</span>
                              <span className="text-gray-400">/ 10 Match Score</span>
                          </div>
                      </div>
                       <div className="bg-gray-700/50 p-3 rounded-lg">
                            <h5 className="font-semibold text-green-300 mb-1">✅ What Matches</h5>
                            <p className="text-sm text-gray-400 whitespace-pre-wrap">{resumeAnalysis.positiveFeedback}</p>
                        </div>
                        <div className="bg-gray-700/50 p-3 rounded-lg">
                            <h5 className="font-semibold text-yellow-300 mb-1">🔍 Areas for Improvement</h5>
                            <p className="text-sm text-gray-400 whitespace-pre-wrap">{resumeAnalysis.improvementAreas}</p>
                        </div>
                         <div className="bg-gray-700/50 p-3 rounded-lg">
                            <h5 className="font-semibold text-red-300 mb-1">🔑 Missing Keywords</h5>
                            <div className="flex flex-wrap gap-2 mt-2">
                                {resumeAnalysis.missingKeywords.length > 0 ? resumeAnalysis.missingKeywords.map(keyword => <span key={keyword} className="bg-red-900/70 text-red-300 text-xs px-2 py-1 rounded-full">{keyword}</span>) : <span className="text-sm text-gray-400">No major keywords missing. Good job!</span>}
                            </div>
                        </div>
                  </div>
              )}

              {isGeneratingResume && (
                <div className="mt-4 flex flex-col items-center justify-center text-center text-gray-400 h-64 bg-gray-700/30 rounded-lg">
                    {ICONS.SPINNER}
                    <p className="mt-2">Generating your tailored resume...</p>
                    <p className="text-sm">This can take a moment.</p>
                </div>
              )}

              {tailoredResume && !isGeneratingResume && (
                  <div className="mt-4 space-y-4 bg-gray-900/50 p-4 rounded-md">
                      <div className="flex justify-between items-center">
                        <h4 className="text-lg font-semibold text-gray-200">AI-Tailored Resume</h4>
                        <button
                            onClick={() => navigator.clipboard.writeText(tailoredResume)}
                            className="bg-blue-600 text-white text-xs font-bold py-1 px-3 rounded-md hover:bg-blue-500 transition-colors"
                        >
                            Copy
                        </button>
                      </div>
                      <div className="prose prose-invert prose-sm max-w-none text-gray-300 whitespace-pre-wrap font-sans bg-gray-700/50 p-4 rounded-md">
                          {tailoredResume}
                      </div>
                  </div>
              )}

          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-200 mb-2 flex items-center gap-2">
                {ICONS.GEMINI} AI Analysis
            </h3>
            {isLoading && (
              <div className="flex items-center justify-center h-64 bg-gray-700/30 rounded-lg">
                <div className="text-center">
                    {ICONS.SPINNER}
                    <p className="mt-2 text-gray-400">Analyzing...</p>
                </div>
              </div>
            )}
            {error && <div className="text-red-400 p-4 bg-red-900/50 rounded-md">{error}</div>}
            {analysis && !isLoading && (
              <div className="space-y-4">
                <div className="grid grid-cols-3 gap-2">
                    <AnalysisPill label="Sentiment" value={analysis.sentiment} colorClass="border-gray-600"/>
                    <AnalysisPill label="Urgency" value={analysis.urgencyScore} colorClass="border-yellow-500/50"/>
                    <AnalysisPill label="Growth" value={analysis.growthScore} colorClass="border-green-500/50"/>
                </div>

                <div className="bg-gray-700/50 p-3 rounded-lg">
                    <h4 className="font-semibold text-gray-300 mb-1">Summary</h4>
                    <p className="text-sm text-gray-400">{analysis.summary}</p>
                </div>

                <div className="bg-gray-700/50 p-3 rounded-lg">
                    <h4 className="font-semibold text-gray-300 mb-1">Salary</h4>
                    <p className="text-sm text-gray-400">{analysis.extractedSalary}</p>
                </div>

                <div className="bg-gray-700/50 p-3 rounded-lg">
                    <h4 className="font-semibold text-gray-300 mb-1">Key Skills</h4>
                    <div className="flex flex-wrap gap-2 mt-2">
                        {analysis.keySkills.map(skill => <span key={skill} className="bg-blue-900/70 text-blue-300 text-xs px-2 py-1 rounded-full">{skill}</span>)}
                    </div>
                </div>

                <div className="bg-gray-700/50 p-3 rounded-lg">
                    <h4 className="font-semibold text-gray-300 mb-1">Benefits</h4>
                     <div className="flex flex-wrap gap-2 mt-2">
                        {analysis.benefits.map(benefit => <span key={benefit} className="bg-green-900/70 text-green-300 text-xs px-2 py-1 rounded-full">{benefit}</span>)}
                    </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};