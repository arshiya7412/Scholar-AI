import React from 'react';
import { StudentProfile, ViewState } from '../types';
import { PlayCircle, MessageCircle, TrendingUp, Calendar, Zap, BookOpen } from 'lucide-react';

interface DashboardProps {
  profile: StudentProfile;
  setView: (view: ViewState) => void;
  streak: number;
}

const Dashboard: React.FC<DashboardProps> = ({ profile, setView, streak }) => {
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">Hello, {profile.name}! 👋</h1>
          <p className="text-slate-500">You've got this! Let's make today productive.</p>
        </div>
        <div className="flex items-center gap-2 bg-orange-50 border border-orange-100 text-orange-700 px-4 py-2 rounded-full font-medium">
          <Zap className="w-5 h-5 fill-orange-500 text-orange-500" />
          <span>{streak} Day Streak</span>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <button 
          onClick={() => setView(ViewState.PLANNER)}
          className="group relative overflow-hidden bg-gradient-to-br from-indigo-500 to-purple-600 p-6 rounded-2xl text-white shadow-lg hover:shadow-xl transition-all hover:-translate-y-1 text-left"
        >
          <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-white opacity-10 rounded-full group-hover:scale-150 transition-transform duration-500"></div>
          <Calendar className="w-8 h-8 mb-4 text-indigo-100" />
          <h3 className="text-xl font-bold mb-1">View Study Plan</h3>
          <p className="text-indigo-100 text-sm opacity-90">Check your schedule for today.</p>
        </button>

        <button 
          onClick={() => setView(ViewState.CHAT)}
          className="group relative overflow-hidden bg-white border border-slate-200 p-6 rounded-2xl text-slate-800 shadow-sm hover:shadow-md transition-all hover:-translate-y-1 text-left"
        >
          <MessageCircle className="w-8 h-8 mb-4 text-emerald-500" />
          <h3 className="text-xl font-bold mb-1">Ask AI Tutor</h3>
          <p className="text-slate-500 text-sm">Stuck on a concept? Get help instantly.</p>
        </button>

        <button 
          onClick={() => setView(ViewState.PROGRESS)}
          className="group relative overflow-hidden bg-white border border-slate-200 p-6 rounded-2xl text-slate-800 shadow-sm hover:shadow-md transition-all hover:-translate-y-1 text-left"
        >
          <TrendingUp className="w-8 h-8 mb-4 text-blue-500" />
          <h3 className="text-xl font-bold mb-1">Track Progress</h3>
          <p className="text-slate-500 text-sm">See how much you've improved.</p>
        </button>
      </div>

      {/* Snapshot */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
            <h2 className="font-bold text-lg text-slate-800 mb-4 flex items-center gap-2">
                <BookOpen className="text-indigo-500 w-5 h-5" />
                Focus Areas
            </h2>
            <div className="space-y-3">
                {profile.weaknesses.length > 0 ? (
                    profile.weaknesses.map((subject, idx) => (
                        <div key={idx} className="flex items-center justify-between p-3 bg-red-50 rounded-xl border border-red-100">
                            <span className="font-medium text-slate-700">{subject}</span>
                            <span className="text-xs font-semibold text-red-600 bg-white px-2 py-1 rounded-md">Priority</span>
                        </div>
                    ))
                ) : (
                    <div className="p-4 text-center text-slate-500 bg-slate-50 rounded-xl">
                        No specific weak areas listed. Keep balancing all subjects!
                    </div>
                )}
            </div>
        </div>
        
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col justify-center items-center text-center">
            <div className="w-16 h-16 bg-indigo-50 rounded-full flex items-center justify-center mb-4">
                <PlayCircle className="w-8 h-8 text-indigo-600" />
            </div>
            <h3 className="text-xl font-bold text-slate-800 mb-2">Ready to Start?</h3>
            <p className="text-slate-500 mb-6 max-w-xs">
                Open your Study Planner to generate today's optimized schedule based on your goals.
            </p>
            <button 
                onClick={() => setView(ViewState.PLANNER)}
                className="bg-indigo-600 text-white px-6 py-2 rounded-xl font-medium hover:bg-indigo-700 transition-colors"
            >
                Start Studying
            </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
