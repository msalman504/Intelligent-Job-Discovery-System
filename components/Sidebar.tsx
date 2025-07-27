
import React from 'react';
import { Page } from '../types';
import { ICONS } from '../constants';

interface SidebarProps {
  activePage: Page;
  setActivePage: (page: Page) => void;
}

const NavItem: React.FC<{
  page: Page;
  label: string;
  activePage: Page;
  setActivePage: (page: Page) => void;
  icon: React.ReactNode;
}> = ({ page, label, activePage, setActivePage, icon }) => {
  const isActive = activePage === page;
  return (
    <li
      className={`flex items-center p-3 my-1 rounded-lg cursor-pointer transition-all duration-200 ${
        isActive
          ? 'bg-blue-600/20 text-blue-300'
          : 'text-gray-400 hover:bg-gray-700/50 hover:text-gray-200'
      }`}
      onClick={() => setActivePage(page)}
    >
      {icon}
      <span className="ml-4 font-medium">{label}</span>
    </li>
  );
};

export const Sidebar: React.FC<SidebarProps> = ({ activePage, setActivePage }) => {
  return (
    <nav className="w-64 bg-gray-900 p-4 border-r border-gray-700/50 flex flex-col h-full">
      <div className="flex-grow">
        <ul>
          <NavItem
            page={Page.JOB_DISCOVERY}
            label="Job Discovery"
            activePage={activePage}
            setActivePage={setActivePage}
            icon={ICONS[Page.JOB_DISCOVERY]}
          />
           <NavItem
            page={Page.MY_RESUME}
            label="My Resume"
            activePage={activePage}
            setActivePage={setActivePage}
            icon={ICONS[Page.MY_RESUME]}
          />
          <NavItem
            page={Page.MARKET_TRENDS}
            label="Market Trends"
            activePage={activePage}
            setActivePage={setActivePage}
            icon={ICONS[Page.MARKET_TRENDS]}
          />
          <NavItem
            page={Page.WATCHLIST}
            label="Source Watchlist"
            activePage={activePage}
            setActivePage={setActivePage}
            icon={ICONS[Page.WATCHLIST]}
          />
        </ul>
      </div>
      <div className="text-center text-xs text-gray-500">
        <p>&copy; 2024 Job Discovery System</p>
        <p>Live data with AI-powered analysis.</p>
      </div>
    </nav>
  );
};
