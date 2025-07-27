
import React from 'react';
import { Job } from '../types';
import { ICONS } from '../constants';

interface JobCardProps {
  job: Job;
  onSelect: (job: Job) => void;
}

const getScoreColor = (score: number) => {
    if (score > 7) return 'border-green-400/50';
    if (score > 4) return 'border-yellow-400/50';
    if (score < 0) return 'border-gray-600/50'; // For loading state
    return 'border-red-400/50';
}

const SpinnerIcon = () => (
    <svg className="animate-spin h-6 w-6 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg>
);


export const JobCard: React.FC<JobCardProps> = ({ job, onSelect }) => {
  const isScoring = job.score < 0;

  return (
    <div
      onClick={() => onSelect(job)}
      className={`bg-gray-800/70 p-4 rounded-lg border ${getScoreColor(job.score)} hover:bg-gray-700/70 hover:border-blue-400/70 cursor-pointer transition-all duration-200 group`}
    >
      <div className="flex justify-between items-start">
        <div className="flex-1 min-w-0">
          <h3 className="font-bold text-lg text-blue-300 group-hover:text-blue-200 truncate">{job.title}</h3>
          <p className="text-gray-300 truncate">{job.company}</p>
          <p className="text-gray-400 text-sm truncate">{job.location}</p>
        </div>
        <div className="flex flex-col items-end ml-4" title={job.scoreJustification}>
            <span className="text-xs text-gray-400">Match Score</span>
            <div className="h-8 flex items-center justify-center">
              {isScoring ? (
                  <SpinnerIcon />
              ) : (
                  <span className={`text-2xl font-bold ${getScoreColor(job.score).replace('border-','text-')}`}>{job.score.toFixed(1)}</span>
              )}
            </div>
        </div>
      </div>
      <p className="text-sm text-gray-400 mt-3 line-clamp-2">{job.description}</p>
      <div className="text-right text-xs text-gray-500 mt-2">
        Source: <span className="font-semibold">{job.source}</span>
      </div>
    </div>
  );
};
