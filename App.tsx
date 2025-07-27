
import React, { useState, useCallback, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { JobDiscoveryPage } from './pages/JobDiscoveryPage';
import { MarketTrendsPage } from './pages/MarketTrendsPage';
import { WatchlistPage } from './pages/WatchlistPage';
import { MyResumePage } from './pages/MyResumePage';
import { Page } from './types';
import { Header } from './components/Header';
import { isGeminiApiKeyConfigured } from './services/geminiService';
import { isJsearchApiKeyConfigured } from './services/jsearchService';


const ApiKeyBanner: React.FC = () => {
  const missingKeys: string[] = [];
  if (!isGeminiApiKeyConfigured) {
    missingKeys.push("Google Gemini");
  }
  if (!isJsearchApiKeyConfigured) {
    missingKeys.push("JSearch");
  }

  if (missingKeys.length === 0) {
    return null;
  }

  return (
    <div className="bg-yellow-500 text-black p-3 text-center font-semibold fixed top-0 left-0 w-full z-[100] shadow-lg">
      <strong>Action Required:</strong> API Key(s) not configured for: {missingKeys.join(', ')}. 
      The app will not function correctly. Please add your key(s) in the <code>/services</code> folder.
    </div>
  );
};


const App: React.FC = () => {
  const [activePage, setActivePage] = useState<Page>(Page.JOB_DISCOVERY);
  const [resume, setResume] = useState<string>('');
  const areKeysMissing = !isGeminiApiKeyConfigured || !isJsearchApiKeyConfigured;

  useEffect(() => {
    // Load resume from local storage on initial render
    const savedResume = localStorage.getItem('resume');
    if (savedResume) {
      setResume(savedResume);
    }
  }, []);

  const handleSetResume = (resumeText: string) => {
    setResume(resumeText);
    localStorage.setItem('resume', resumeText);
  };

  const renderPage = useCallback((): React.ReactNode => {
    switch (activePage) {
      case Page.JOB_DISCOVERY:
        return <JobDiscoveryPage resume={resume} />;
      case Page.MARKET_TRENDS:
        return <MarketTrendsPage />;
      case Page.WATCHLIST:
        return <WatchlistPage />;
      case Page.MY_RESUME:
        return <MyResumePage resume={resume} setResume={handleSetResume} />;
      default:
        return <JobDiscoveryPage resume={resume} />;
    }
  }, [activePage, resume]);

  return (
    <div className="flex h-screen bg-gray-900 text-gray-100 font-sans">
       <ApiKeyBanner />
      <Sidebar activePage={activePage} setActivePage={setActivePage} />
      <div className={`flex-1 flex flex-col overflow-hidden ${areKeysMissing ? 'pt-[52px]' : ''}`}>
        <Header />
        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8 bg-gray-800/50">
          {renderPage()}
        </main>
      </div>
    </div>
  );
};

export default App;
