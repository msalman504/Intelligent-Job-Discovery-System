
import React from 'react';
import { Page } from './types';

export const ICONS: { [key: string]: React.ReactNode } = {
  [Page.JOB_DISCOVERY]: (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
    </svg>
  ),
  [Page.MARKET_TRENDS]: (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
    </svg>
  ),
  [Page.WATCHLIST]: (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
    </svg>
  ),
  [Page.MY_RESUME]: (
     <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    </svg>
  ),
  SPINNER: (
    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg>
  ),
  GEMINI: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M5.75997 1.34C6.27997 0.5 7.43997 0.5 7.95997 1.34L11.52 7.93C11.81 8.42 12.49 8.61 12.99 8.35L19.53 5.05C20.41 4.62 21.38 5.6 20.95 6.47L17.65 13.01C17.39 13.51 17.58 14.19 18.07 14.48L21.66 16.72C22.5 17.24 22.5 18.4 21.66 18.92L18.07 21.16C17.58 21.45 17.39 22.13 17.65 22.63L20.95 29.17C21.38 30.05 20.41 31.02 19.53 30.59L12.99 27.29C12.49 27.03 11.81 27.22 11.52 27.71L7.95997 34.3C6.71997 36.31 3.55997 35.1 3.55997 32.75V2.89C3.55997 0.54 6.71997 -0.71 7.95997 1.34" transform="scale(0.7) translate(-2, -8)" fill="url(#paint0_linear_1_2)"/>
      <defs>
      <linearGradient id="paint0_linear_1_2" x1="12" y1="0" x2="12" y2="24" gradientUnits="userSpaceOnUse">
      <stop stopColor="#8E44AD"/>
      <stop offset="1" stopColor="#3498DB"/>
      </linearGradient>
      </defs>
    </svg>
  ),
};

export const PREDEFINED_SEARCHES = [
  'Roofer in Texas',
  'Real estate agent remote',
  'Construction project manager in Florida',
  'Software Engineer in New York',
];
