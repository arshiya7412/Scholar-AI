import React, { useState } from 'react';
import { StudentProfile, DailyPlan } from '../types';
import { generateStudyPlan, updateStudyPlan } from '../services/geminiService';
import { Sparkles, Clock, Book, RotateCcw, Send, Edit3, Loader2 } from 'lucide-react';

interface PlannerProps {
  profile: StudentProfile;
}

const Planner: React.FC<PlannerProps> = ({ profile }) => {
  const [plan, setPlan] = useState<DailyPlan | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  // Customization state
  const [adjustPrompt, setAdjustPrompt] = useState('');
  const [isAdjusting, setIsAdjusting] = useState(false);

  const handleGeneratePlan = async () => {
    setLoading(true);
    setError('');
    try {
      const newPlan = await generateStudyPlan(profile);
      setPlan(newPlan);
    } catch (err) {
      setError('Failed to generate plan. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleAdjustPlan = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!adjustPrompt.trim() || !plan) return;

    setIsAdjusting(true);
    try {
        const updatedPlan = await updateStudyPlan(plan, adjustPrompt, profile);
        setPlan(updatedPlan);
        setAdjustPrompt('');
    } catch (err) {
        setError('Could not update the plan. Try again.');
    } finally {
        setIsAdjusting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] text-center space-y-4">
        <div className="relative">
            <div className="w-16 h-16 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
            <Sparkles className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-indigo-600 w-6 h-6" />
        </div>
        <div>
            <h2 className="text-xl font-bold text-slate-800">Designing your day...</h2>
            <p className="text-slate-500">Analyzing your subjects and goals.</p>
        </div>
      </div>
    );
  }

  if (!plan) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] text-center max-w-lg mx-auto">
        <div className="bg-indigo-50 p-6 rounded-full mb-6">
            <Clock className="w-12 h-12 text-indigo-600" />
        </div>
        <h2 className="text-2xl font-bold text-slate-800 mb-3">No Plan for Today Yet</h2>
        <p className="text-slate-500 mb-8">
            Let our AI create a personalized schedule that balances your strengths, weaknesses, and breaks.
        </p>
        <button
          onClick={handleGeneratePlan}
          className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-8 rounded-xl shadow-lg hover:shadow-xl transition-all flex items-center gap-2"
        >
          <Sparkles className="w-5 h-5" />
          Generate Today's Plan
        </button>
        {error && <p className="text-red-500 mt-4">{error}</p>}
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500 pb-20 md:pb-0">
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-8 text-white shadow-lg">
        <div className="flex justify-between items-start">
            <div>
                <h2 className="text-2xl font-bold mb-2">Today's Blueprint</h2>
                <p className="text-indigo-100 opacity-90">{plan.date}</p>
            </div>
            <button 
                onClick={handleGeneratePlan}
                className="bg-white/20 hover:bg-white/30 text-white p-2 rounded-lg transition-colors"
                title="Regenerate Plan"
            >
                <RotateCcw className="w-5 h-5" />
            </button>
        </div>
        <div className="mt-6 bg-white/10 backdrop-blur-sm p-4 rounded-xl border border-white/20">
            <p className="font-medium italic">"{plan.motivationalQuote}"</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Timeline */}
        <div className="lg:col-span-2 relative">
             <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-slate-200 hidden md:block"></div>
             <div className="space-y-6">
                {plan.sessions.map((session, index) => (
                    <div key={index} className="relative flex flex-col md:flex-row gap-6 group">
                        {/* Time Bubble */}
                        <div className="md:w-32 flex-shrink-0 flex md:justify-end">
                            <div className="bg-white border border-slate-200 text-slate-600 font-semibold py-1 px-3 rounded-lg text-sm shadow-sm h-fit z-10">
                                {session.time}
                            </div>
                        </div>

                        {/* Card */}
                        <div className="flex-1 bg-white p-5 rounded-2xl border border-slate-200 shadow-sm group-hover:shadow-md transition-shadow relative">
                            <div className="absolute top-5 -left-2 w-4 h-4 bg-white border-2 border-slate-200 rotate-45 hidden md:block"></div>
                            <div className="flex justify-between items-start mb-2">
                                <h3 className="font-bold text-lg text-slate-800 flex items-center gap-2">
                                    <Book className="w-4 h-4 text-indigo-500" />
                                    {session.subject}
                                </h3>
                                <span className="text-xs font-medium text-slate-500 bg-slate-100 px-2 py-1 rounded-full">
                                    {session.duration}
                                </span>
                            </div>
                            <p className="text-slate-600 mb-4">{session.activity}</p>
                            
                            <div className="bg-indigo-50 text-indigo-700 text-sm p-3 rounded-lg flex items-start gap-2">
                                <Sparkles className="w-4 h-4 mt-0.5 flex-shrink-0" />
                                {session.tip}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>

        {/* AI Customization Sidebar */}
        <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sticky top-6">
                <div className="flex items-center gap-2 mb-4 text-slate-800">
                    <Edit3 className="w-5 h-5 text-indigo-600" />
                    <h3 className="font-bold">Adjust Plan</h3>
                </div>
                <p className="text-sm text-slate-500 mb-4">
                    Something came up? Tell the AI to tweak your schedule.
                </p>
                <form onSubmit={handleAdjustPlan}>
                    <textarea
                        value={adjustPrompt}
                        onChange={(e) => setAdjustPrompt(e.target.value)}
                        placeholder="e.g., I have a dentist appointment at 4pm, or I'm too tired for Math..."
                        className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl mb-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none h-32"
                    />
                    <button
                        type="submit"
                        disabled={!adjustPrompt.trim() || isAdjusting}
                        className="w-full bg-slate-900 text-white py-2 rounded-xl text-sm font-medium hover:bg-slate-800 disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                        {isAdjusting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                        Update Schedule
                    </button>
                </form>
            </div>
        </div>
      </div>
    </div>
  );
};

export default Planner;
