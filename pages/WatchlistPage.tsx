import React, { useState, useCallback } from 'react';
import { ICONS } from '../constants';
import { searchJobs } from '../services/jsearchService';
import { Job, JobAnalysis } from '../types';
import { JobDetailModal } from '../components/JobDetailModal';

const expertSources = [
    { name: "NRCA Job Board", query: 'roofer on nrca.net' },
    { name: "NAR Career Center", query: 'real estate agent on nar.realtor' },
    { name: "Construction Publications", query: 'superintendent on constructiondive.com' },
    { name: "Building Permits", query: 'hiring project manager construction Austin, TX' },

];

const directCompanies = [
    { name: "Zillow Group", query: 'software engineer at Zillow' },
    { name: "Beacon Roofing Supply", query: 'driver at Beacon Roofing Supply' },
    { name: "Keller Williams", query: 'real estate at Keller Williams' },
    { name: "Tesla (Energy)", query: 'roofer at Tesla' },
];

export const WatchlistPage: React.FC = () => {
    const [loadingSource, setLoadingSource] = useState<string | null>(null);
    const [results, setResults] = useState<Job[]>([]);
    const [currentSource, setCurrentSource] = useState('');
    const [error, setError] = useState('');
    const [selectedJob, setSelectedJob] = useState<Job | null>(null);

    const handleFetch = useCallback(async (name: string, query: string) => {
        setLoadingSource(name);
        setCurrentSource(name);
        setResults([]);
        setError('');
        try {
            const liveJobs = await searchJobs(query);
            // Override source for display consistency on this page
            const jobsWithSource = liveJobs.map(job => ({ ...job, source: name }));
            setResults(jobsWithSource);
        } catch (e) {
            setError(`Failed to fetch jobs for ${name}. Check your JSearch API Key.`);
            console.error(e);
        } finally {
            setLoadingSource(null);
        }
    }, []);
    
    // Analysis is performed in the modal, but we don't need to update the view here.
    const handleAnalysisComplete = (jobId: string, analysis: JobAnalysis) => {
        // Find the job in the main results and update it for the modal
        setSelectedJob(prev => prev ? {...prev, analysis} : null);
    };

    const SourceButton: React.FC<{name: string, query: string}> = ({name, query}) => (
        <button
            onClick={() => handleFetch(name, query)}
            disabled={!!loadingSource}
            className="w-full text-left p-3 bg-gray-700/60 rounded-md hover:bg-gray-600/80 transition-colors disabled:opacity-50 flex justify-between items-center"
        >
            <span>{name}</span>
            {loadingSource === name ? ICONS.SPINNER : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
            )}
        </button>
    );

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-full">
            <div className="md:col-span-1 flex flex-col gap-6">
                <div>
                    <h2 className="text-xl font-bold text-blue-300 mb-3">Expert-Level Sources</h2>
                    <div className="space-y-2">
                        {expertSources.map(s => <SourceButton key={s.name} {...s}/>)}
                    </div>
                </div>
                <div>
                    <h2 className="text-xl font-bold text-blue-300 mb-3">Direct Company Watchlist</h2>
                    <div className="space-y-2">
                        {directCompanies.map(s => <SourceButton key={s.name} {...s}/>)}
                    </div>
                </div>
            </div>
            <div className="md:col-span-2 bg-gray-800/50 p-4 rounded-lg border border-gray-700/50 overflow-y-auto">
                {currentSource && <h2 className="text-xl font-bold text-gray-200 mb-4">Results from: <span className="text-blue-400">{currentSource}</span></h2>}
                {error && <div className="text-red-400 p-2 my-2 bg-red-900/50 rounded">{error}</div>}
                
                {loadingSource && !results.length && (
                    <div className="flex items-center justify-center h-full text-gray-400">
                        <div className="text-center">
                            {ICONS.SPINNER}
                            <p className="mt-2">Contacting source...</p>
                        </div>
                    </div>
                )}

                {!loadingSource && !results.length && !error && (
                    <div className="flex items-center justify-center h-full text-gray-500">
                        <p>Select a source to view live job opportunities.</p>
                    </div>
                )}

                <div className="space-y-4">
                    {results.map(job => (
                        <div key={job.id} onClick={() => setSelectedJob(job)} className="bg-gray-800 p-4 rounded-lg hover:bg-gray-700 cursor-pointer transition-colors">
                            <h3 className="font-bold text-lg text-blue-300">{job.title}</h3>
                            <p className="text-gray-300">{job.company}</p>
                            <p className="text-gray-400 text-sm">{job.location}</p>
                        </div>
                    ))}
                </div>
                 <JobDetailModal 
                    job={selectedJob} 
                    onClose={() => setSelectedJob(null)}
                    onAnalysisComplete={handleAnalysisComplete}
                />
            </div>
        </div>
    );
};