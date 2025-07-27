
import React, { useState, useEffect } from 'react';

interface MyResumePageProps {
  resume: string;
  setResume: (text: string) => void;
}

export const MyResumePage: React.FC<MyResumePageProps> = ({ resume, setResume }) => {
  const [text, setText] = useState(resume);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setText(resume);
  }, [resume]);

  const handleSave = () => {
    setResume(text);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000); // Hide message after 2 seconds
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-2xl font-bold text-gray-100">My Resume</h2>
          <p className="text-gray-400 mt-1">
            Paste your resume below. It will be saved locally in your browser and used to score jobs.
          </p>
        </div>
        <button
            onClick={handleSave}
            className="bg-blue-600 text-white font-bold py-2 px-6 rounded-md hover:bg-blue-500 transition-colors disabled:bg-gray-500 min-w-[120px]"
        >
            {saved ? 'Saved!' : 'Save Resume'}
        </button>
      </div>

      <div className="bg-gray-800/50 p-4 rounded-lg border border-gray-700/50">
        <textarea
          className="w-full bg-gray-900/70 border border-gray-600 rounded-md px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:outline-none transition h-[60vh] font-mono text-sm"
          placeholder="Paste your full resume here..."
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
      </div>
       {saved && (
        <div className="fixed bottom-10 right-10 bg-green-600 text-white py-2 px-4 rounded-lg shadow-lg animate-fade-in">
          Resume saved successfully!
        </div>
      )}
    </div>
  );
};
