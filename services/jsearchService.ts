
import { Job } from '../types';

// IMPORTANT: Replace "YOUR_JSEARCH_API_KEY_HERE" with your own key from RapidAPI.
// Get a key by subscribing to the API on https://rapidapi.com/apidojo/api/jsearch
const JSEARCH_API_KEY = 'dc07b1cc72msh98ba0366072e82ap19397ajsn93fd91327e49';

export const isJsearchApiKeyConfigured = !!JSEARCH_API_KEY;

const JSEARCH_API_URL = 'https://jsearch.p.rapidapi.com/search';

// This function maps the JSearch API response to our internal Job type.
const mapApiDataToJob = (apiJob: any): Omit<Job, 'analysis' | 'score'> => {
    const locationParts = [apiJob.job_city, apiJob.job_state, apiJob.job_country].filter(Boolean);
    return {
        id: apiJob.job_id,
        title: apiJob.job_title,
        company: apiJob.employer_name,
        location: locationParts.join(', ') || 'Not specified',
        description: apiJob.job_description,
        source: apiJob.job_publisher || 'Unknown',
        applyLink: apiJob.job_apply_link,
        employerLogo: apiJob.employer_logo,
    };
};

export const searchJobs = async (query: string): Promise<Job[]> => {
    if (!isJsearchApiKeyConfigured) {
        throw new Error("JSearch API key not configured. Please add your key to services/jsearchService.ts.");
    }

    const options = {
        method: 'GET',
        headers: {
            'X-RapidAPI-Key': JSEARCH_API_KEY,
            'X-RapidAPI-Host': 'jsearch.p.rapidapi.com'
        }
    };

    try {
        const response = await fetch(`${JSEARCH_API_URL}?query=${encodeURIComponent(query)}&num_pages=1`, options);
        if (!response.ok) {
            const errorData = await response.json().catch(() => ({})); // Catch if response is not json
            const message = errorData?.message || errorData?.error || response.statusText;
            throw new Error(`JSearch API error: ${message}`);
        }
        
        const result = await response.json();
        
        if (!result.data || !Array.isArray(result.data)) {
             console.warn("JSearch API returned no data or unexpected format:", result);
             return [];
        }

        return result.data.map(apiJob => ({
            ...mapApiDataToJob(apiJob),
            score: 5.0, // Default score before analysis
        }));
        
    } catch (error) {
        console.error("Error fetching from JSearch API:", error);
         // Let the specific error messages (from the check or the API response) propagate
        if(error instanceof Error) throw error;
        // Fallback for non-Error types thrown
        throw new Error("Failed to fetch jobs. The API key might be invalid or expired. Check console for details.");
    }
};
