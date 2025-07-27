
import React from 'react';
import { ICONS } from '../constants';

export const Header: React.FC = () => {
  return (
    <header className="flex-shrink-0 bg-gray-900/80 backdrop-blur-sm border-b border-gray-700/50 p-4 flex items-center justify-between z-10">
      <div className="flex items-center space-x-3">
        {ICONS.GEMINI}
        <h1 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-500">
          Intelligent Job Discovery
        </h1>
      </div>
      
    </header>
  );
};
