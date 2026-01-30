import React, { useEffect, useState } from 'react';
import { StudentProfile } from '../types';
import { analyzeProgress } from '../services/geminiService';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { Trophy, TrendingUp, Target, Loader2 } from 'lucide-react';

interface ProgressProps {
  profile: StudentProfile;
}

const mockData = [
  { day: 'Mon', hours: 1.5, focusScore: 65 },
  { day: 'Tue', hours: 2.5, focusScore: 70 },
  { day: 'Wed', hours: 2.0, focusScore: 60 },
  { day: 'Thu', hours: 3.5, focusScore: 85 },
  { day: 'Fri', hours: 1.0, focusScore: 50 },
  { day: 'Sat', hours: 4.0, focusScore: 90 },
  { day: 'Sun', hours: 3.0, focusScore: 80 },
];

const Progress: React.FC<ProgressProps> = ({ profile }) => {
  const [analysis, setAnalysis] = useState<string>('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate fetching analysis
    const getAnalysis = async () => {
        try {
            const result = await analyzeProgress(profile, mockData);
            setAnalysis(result);
        } catch (e) {
            setAnalysis("Unable to generate analysis at the moment.");
        } finally {
            setLoading(false);
        }
    };
    getAnalysis();
  }, [profile]);

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
        <h2 className="text-2xl font-bold text-slate-800">Weekly Progress</h2>
        
        {/* Charts Container */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                <h3 className="text-lg font-semibold text-slate-700 mb-4 flex items-center gap-2">
                    <Target className="w-5 h-5 text-indigo-500" />
                    Study Hours vs Goal
                </h3>
                <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={mockData}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} />
                            <XAxis dataKey="day" axisLine={false} tickLine={false} />
                            <YAxis axisLine={false} tickLine={false} />
                            <Tooltip 
                                cursor={{fill: '#f1f5f9'}}
                                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                            />
                            <Bar dataKey="hours" fill="#6366f1" radius={[4, 4, 0, 0]} barSize={32} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
                <p className="text-xs text-center text-slate-400 mt-2">Goal: {profile.dailyStudyHours} hours/day</p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                <h3 className="text-lg font-semibold text-slate-700 mb-4 flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-emerald-500" />
                    Focus Consistency
                </h3>
                <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={mockData}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} />
                            <XAxis dataKey="day" axisLine={false} tickLine={false} />
                            <YAxis axisLine={false} tickLine={false} domain={[0, 100]} />
                            <Tooltip 
                                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                            />
                            <Line type="monotone" dataKey="focusScore" stroke="#10b981" strokeWidth={3} dot={{r: 4}} activeDot={{r: 6}} />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>

        {/* AI Insight */}
        <div className="bg-gradient-to-r from-slate-800 to-slate-900 rounded-2xl p-6 text-white shadow-lg">
            <div className="flex items-start gap-4">
                <div className="bg-white/10 p-3 rounded-xl">
                    <Trophy className="w-8 h-8 text-yellow-400" />
                </div>
                <div className="flex-1">
                    <h3 className="text-lg font-bold mb-2">Mentor's Insights</h3>
                    {loading ? (
                        <div className="flex items-center gap-2 text-slate-300">
                            <Loader2 className="w-4 h-4 animate-spin" /> Analyzing your performance...
                        </div>
                    ) : (
                         <div className="text-slate-200 text-sm leading-relaxed whitespace-pre-line">
                            {analysis}
                         </div>
                    )}
                </div>
            </div>
        </div>
    </div>
  );
};

export default Progress;
