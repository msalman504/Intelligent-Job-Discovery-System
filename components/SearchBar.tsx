import React from 'react';
import { PREDEFINED_SEARCHES, ICONS } from '../constants';

interface SearchBarProps {
  onSearch: (query: string) => void;
  isLoading: boolean;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

export const SearchBar: React.FC<SearchBarProps> = ({ onSearch, isLoading, searchQuery, setSearchQuery }) => {
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      onSearch(searchQuery);
    }
  };

  return (
    <div className="bg-gray-800/50 p-4 rounded-lg border border-gray-700/50 mb-6">
      <form onSubmit={handleSearch} className="flex items-center space-x-2">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder='e.g., "Roofer in Texas" or "Remote real estate agent"'
          className="flex-grow bg-gray-700/50 border border-gray-600 rounded-md px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
          disabled={isLoading}
        />
        <button
          type="submit"
          disabled={isLoading || !searchQuery.trim()}
          className="bg-blue-600 text-white font-bold py-2 px-4 rounded-md hover:bg-blue-500 transition-colors disabled:bg-gray-500 disabled:cursor-not-allowed flex items-center justify-center w-28"
        >
          {isLoading ? ICONS.SPINNER : 'Search'}
        </button>
      </form>
      <div className="mt-3 flex flex-wrap gap-2">
        <span className="text-sm text-gray-400 mr-2 self-center">Try:</span>
        {PREDEFINED_SEARCHES.slice(0, 4).map((query) => (
          <button
            key={query}
            onClick={() => {
              setSearchQuery(query);
              onSearch(query);
            }}
            disabled={isLoading}
            className="text-xs bg-gray-700 hover:bg-gray-600 text-gray-300 px-2 py-1 rounded-md transition-colors disabled:opacity-50"
          >
            {query}
          </button>
        ))}
      </div>
    </div>
  );
};