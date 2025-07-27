
import React, { useState, useCallback } from 'react';
import { SearchBar } from '../components/SearchBar';
import { JobCard } from '../components/JobCard';
import { JobDetailModal } from '../components/JobDetailModal';
import { Job, JobAnalysis } from '../types';
import { searchJobs } from '../services/jsearchService';
import { getJobMatchScore } from '../services/geminiService';
import { ICONS } from '../constants';

interface JobDiscoveryPageProps {
  resume: string;
}

export const JobDiscoveryPage: React.FC<JobDiscoveryPageProps> = ({ resume }) => {
  const [searchQuery, setSearchQuery] = useState('Roofer in Texas');
  const [jobs, setJobs] = useState<Job[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);

  const handleSearch = useCallback(async (query: string) => {
    if (!resume.trim()) {
      setError("Please add your resume in the 'My Resume' tab to get job match scores.");
      return;
    }

    setIsLoading(true);
    setError(null);
    setJobs([]);
    try {
      const liveJobs = await searchJobs(query);
      // Set initial jobs with a placeholder scoring state
      setJobs(liveJobs.map(j => ({ ...j, score: -1, scoreJustification: 'Analyzing match...' })));
      
      // Asynchronously score each job against the resume
      for (const job of liveJobs) {
        try {
          const { score, justification } = await getJobMatchScore(job, resume);
          setJobs(prevJobs => prevJobs.map(j => 
            j.id === job.id ? { ...j, score, scoreJustification: justification } : j
          ));
        } catch (e) {
          console.error(`Failed to score job ${job.id}`, e);
          setJobs(prevJobs => prevJobs.map(j => 
            j.id === job.id ? { ...j, score: 0, scoreJustification: 'AI analysis failed for this job.' } : j
          ));
        }
      }

    } catch (e: any) {
      setError(e.message || 'An unknown error occurred. Check your JSearch API key.');
      setJobs([]);
    } finally {
      setIsLoading(false);
    }
  }, [resume]);

  const handleAnalysisComplete = useCallback((jobId: string, analysis: JobAnalysis) => {
      setJobs(prevJobs => prevJobs.map(j => {
          if (j.id === jobId) {
              return { ...j, analysis }; // Score is set by resume match, not this analysis
          }
          return j;
      }));
       setSelectedJob(prevJob => {
        if (prevJob && prevJob.id === jobId) {
          return { ...prevJob, analysis };
        }
        return prevJob;
      });

  }, []);

  return (
    <div>
      <SearchBar
        onSearch={handleSearch}
        isLoading={isLoading}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />

      {error && <div className="text-center p-4 bg-red-900/50 text-red-300 rounded-lg">{error}</div>}
      
      {isLoading && jobs.length === 0 && (
          <div className="flex flex-col items-center justify-center text-center text-gray-400 h-64">
            {ICONS.SPINNER}
            <p className="mt-4 text-lg">Searching for live job opportunities...</p>
            <p className="text-sm">This may take a moment.</p>
          </div>
      )}

      {!isLoading && jobs.length === 0 && !error && (
        <div className="text-center text-gray-500 py-16">
          <h2 className="text-2xl font-semibold">Welcome to Job Discovery</h2>
          <p className="mt-2">Use the search bar above to find and score jobs against your resume.</p>
           {!resume && (
             <p className="mt-4 p-3 bg-blue-900/50 text-blue-200 rounded-lg">
                Pro Tip: Add your resume on the "My Resume" page for personalized job matching!
            </p>
           )}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3 gap-4">
        {jobs.sort((a,b) => b.score - a.score).map((job) => (
          <JobCard key={job.id} job={job} onSelect={setSelectedJob} />
        ))}
      </div>

      <JobDetailModal 
        job={selectedJob} 
        onClose={() => setSelectedJob(null)}
        onAnalysisComplete={handleAnalysisComplete}
      />
    </div>
  );
};
