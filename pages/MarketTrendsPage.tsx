
import React, { useState, useCallback, useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line, AreaChart, Area } from 'recharts';
import { ICONS } from '../constants';

// --- Data Definitions for different markets ---

const MARKET_DATA = {
    ROOFING: {
        name: 'Roofing & Construction',
        summary: "The construction sector exhibits strong seasonal hiring, peaking in spring and summer. Demand is highest in rapidly developing states like Texas and Florida. Salaries for experienced roles are rising steadily due to a skilled labor shortage, indicating high value for expertise.",
        hiringTrendData: [
            { name: 'Jan', Volume: 40 }, { name: 'Feb', Volume: 35 }, { name: 'Mar', Volume: 60 },
            { name: 'Apr', Volume: 75 }, { name: 'May', Volume: 85 }, { name: 'Jun', Volume: 80 },
        ],
        salaryData: [
            { name: 'Entry', Salary: 45 }, { name: 'Mid', Salary: 65 },
            { name: 'Senior', Salary: 85 }, { name: 'Expert', Salary: 110 },
        ],
        geoData: [
            { name: 'Texas', Demand: 95 }, { name: 'Florida', Demand: 88 }, { name: 'Arizona', Demand: 72 },
            { name: 'Colorado', Demand: 65 }, { name: 'N. Carolina', Demand: 60 }, { name: 'Georgia', Demand: 55 },
        ],
        colors: { primary: '#8884d8', secondary: '#8884d8' }
    },
    REAL_ESTATE: {
        name: 'Real Estate',
        summary: "Hiring in real estate is closely tied to economic indicators like interest rates, showing moderate volatility. Major metropolitan areas are perennial hotspots, but there is a growing trend in secondary markets. Compensation is heavily commission-based, with high earning potential for top performers.",
        hiringTrendData: [
            { name: 'Jan', Volume: 44 }, { name: 'Feb', Volume: 49 }, { name: 'Mar', Volume: 58 },
            { name: 'Apr', Volume: 55 }, { name: 'May', Volume: 61 }, { name: 'Jun', Volume: 70 },
        ],
        salaryData: [
            { name: 'Agent', Salary: 40 }, { name: 'Broker', Salary: 75 },
            { name: 'Sr. Broker', Salary: 120 }, { name: 'Principal', Salary: 180 },
        ],
        geoData: [
            { name: 'California', Demand: 85 }, { name: 'Florida', Demand: 92 }, { name: 'New York', Demand: 78 },
            { name: 'Texas', Demand: 75 }, { name: 'Arizona', Demand: 68 }, { name: 'Illinois', Demand: 62 },
        ],
        colors: { primary: '#82ca9d', secondary: '#82ca9d' }
    },
    SOFTWARE: {
        name: 'Software Engineering',
        summary: "The tech sector maintains robust and consistent hiring demand, with a primary focus on specialized skills like AI/ML and cloud computing. Geographic demand is diversifying from traditional tech hubs. Salaries are highly competitive, with significant compensation packages for senior and specialized roles.",
        hiringTrendData: [
            { name: 'Jan', Volume: 90 }, { name: 'Feb', Volume: 85 }, { name: 'Mar', Volume: 95 },
            { name: 'Apr', Volume: 92 }, { name: 'May', Volume: 88 }, { name: 'Jun', Volume: 98 },
        ],
        salaryData: [
            { name: 'Junior', Salary: 80 }, { name: 'Mid-Level', Salary: 125 },
            { name: 'Senior', Salary: 165 }, { name: 'Staff/Principal', Salary: 220 },
        ],
        geoData: [
            { name: 'Bay Area', Demand: 98 }, { name: 'Seattle', Demand: 90 }, { name: 'New York', Demand: 88 },
            { name: 'Austin', Demand: 85 }, { name: 'Remote', Demand: 80 }, { name: 'Boston', Demand: 75 },
        ],
        colors: { primary: '#ffc658', secondary: '#ffc658' }
    }
};

type MarketKey = keyof typeof MARKET_DATA;

const ChartCard: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
    <div className="bg-gray-800/50 p-6 rounded-lg border border-gray-700/50">
        <h3 className="text-lg font-semibold text-blue-300 mb-4">{title}</h3>
        <div style={{ width: '100%', height: 300 }}>
            {children}
        </div>
    </div>
);

export const MarketTrendsPage: React.FC = () => {
    const [activeMarketKey, setActiveMarketKey] = useState<MarketKey>('ROOFING');
    const [isLoading, setIsLoading] = useState(false);

    const handleSelectMarket = useCallback((key: MarketKey) => {
        if (key === activeMarketKey) return;

        setIsLoading(true);
        // Simulate AI analysis delay
        setTimeout(() => {
            setActiveMarketKey(key);
            setIsLoading(false);
        }, 1200);
    }, [activeMarketKey]);

    const activeMarket = useMemo(() => MARKET_DATA[activeMarketKey], [activeMarketKey]);
    
    const renderContent = () => {
        if (isLoading) {
            return (
                <div className="flex flex-col items-center justify-center text-center text-gray-400 h-[60vh]">
                    {ICONS.SPINNER}
                    <p className="mt-4 text-lg">Analyzing market trends with Gemini...</p>
                    <p className="text-sm">Gathering insights for {MARKET_DATA[activeMarketKey].name}.</p>
                </div>
            );
        }

        return (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-fade-in">
                <ChartCard title="Monthly Hiring Volume">
                    <ResponsiveContainer>
                        <BarChart data={activeMarket.hiringTrendData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#4a5568" />
                            <XAxis dataKey="name" stroke="#a0aec0" />
                            <YAxis stroke="#a0aec0" />
                            <Tooltip contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #4a5568' }} />
                            <Bar dataKey="Volume" fill={activeMarket.colors.primary} />
                        </BarChart>
                    </ResponsiveContainer>
                </ChartCard>
                
                <ChartCard title="Salary Benchmarks (in $1,000s)">
                    <ResponsiveContainer>
                        <LineChart data={activeMarket.salaryData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#4a5568" />
                            <XAxis dataKey="name" stroke="#a0aec0" />
                            <YAxis stroke="#a0aec0" />
                            <Tooltip contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #4a5568' }} />
                            <Line type="monotone" dataKey="Salary" stroke={activeMarket.colors.primary} strokeWidth={2} />
                        </LineChart>
                    </ResponsiveContainer>
                </ChartCard>

                 <ChartCard title="Geographic Demand Hotspots">
                    <ResponsiveContainer>
                        <AreaChart data={activeMarket.geoData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#4a5568" />
                            <XAxis dataKey="name" stroke="#a0aec0" />
                            <YAxis dataKey="Demand" stroke="#a0aec0" />
                            <Tooltip contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #4a5568' }} />
                            <Area type="monotone" dataKey="Demand" stroke={activeMarket.colors.secondary} fill={activeMarket.colors.secondary} fillOpacity={0.3} />
                        </AreaChart>
                    </ResponsiveContainer>
                </ChartCard>
            </div>
        )
    };

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-100">Market Intelligence Dashboard</h2>
            <div className="flex flex-wrap gap-3">
                {(Object.keys(MARKET_DATA) as MarketKey[]).map(key => (
                    <button
                        key={key}
                        onClick={() => handleSelectMarket(key)}
                        disabled={isLoading}
                        className={`px-4 py-2 rounded-lg font-semibold transition-all duration-200 border-2 ${
                            activeMarketKey === key && !isLoading
                                ? 'bg-blue-600 border-blue-500 text-white'
                                : 'bg-gray-700/50 border-gray-600 text-gray-300 hover:bg-gray-700 hover:border-gray-500'
                        } disabled:opacity-50 disabled:cursor-not-allowed`}
                    >
                        {MARKET_DATA[key].name}
                    </button>
                ))}
            </div>
           
            <div className="p-5 bg-gradient-to-r from-purple-900/20 to-blue-900/20 border border-purple-500/30 rounded-lg">
              <h3 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-300 to-blue-300 mb-2 flex items-center gap-2">
                {ICONS.GEMINI} AI-Generated Summary
              </h3>
              <p className="text-purple-100/80 mt-1">
                {isLoading ? 'Generating new insights...' : activeMarket.summary}
              </p>
           </div>
           
           {renderContent()}
        </div>
    );
};
