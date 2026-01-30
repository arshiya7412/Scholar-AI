import React, { useState, useEffect, useRef } from 'react';
import { ShieldBan, Clock, Bell, Volume2, Lock, Unlock, Play, Pause, RotateCcw } from 'lucide-react';

const FocusTools: React.FC = () => {
  const [apps, setApps] = useState([
    { name: 'Instagram', icon: '📸', blocked: false },
    { name: 'TikTok', icon: '🎵', blocked: false },
    { name: 'Snapchat', icon: '👻', blocked: false },
    { name: 'Video Games', icon: '🎮', blocked: false },
    { name: 'Messages', icon: '💬', blocked: false },
  ]);

  const [timeLeft, setTimeLeft] = useState(25 * 60); // 25 minutes default
  const [isActive, setIsActive] = useState(false);
  const [isBreak, setIsBreak] = useState(false);
  const [alarmPlaying, setAlarmPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    let interval: number | null = null;

    if (isActive && timeLeft > 0) {
      interval = window.setInterval(() => {
        setTimeLeft((time) => time - 1);
      }, 1000);
    } else if (timeLeft === 0 && isActive) {
      setIsActive(false);
      playAlarm();
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, timeLeft]);

  const toggleBlock = (index: number) => {
    const newApps = [...apps];
    newApps[index].blocked = !newApps[index].blocked;
    setApps(newApps);
  };

  const blockAll = () => {
    setApps(apps.map(app => ({ ...app, blocked: true })));
  };

  const playAlarm = () => {
    setAlarmPlaying(true);
    // Simple beep sound using Web Audio API if no file provided, 
    // but here we simulate with a visual indicator and a delayed stop
    // In a real app, use new Audio('/alarm.mp3').play()
    setTimeout(() => setAlarmPlaying(false), 5000); 
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const resetTimer = () => {
    setIsActive(false);
    setTimeLeft(isBreak ? 5 * 60 : 25 * 60);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex items-center gap-3 mb-2">
        <ShieldBan className="w-8 h-8 text-indigo-600" />
        <h1 className="text-3xl font-bold text-slate-800">Focus Zone</h1>
      </div>
      <p className="text-slate-500">Minimize distractions and manage your time effectively.</p>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Timer Section */}
        <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm flex flex-col items-center justify-center relative overflow-hidden">
          {alarmPlaying && (
            <div className="absolute inset-0 bg-red-500/10 z-0 animate-pulse flex items-center justify-center">
                <Bell className="w-32 h-32 text-red-500 opacity-20 alarm-ring" />
            </div>
          )}
          
          <div className="relative z-10 text-center">
             <div className="flex items-center justify-center gap-2 mb-6">
                <button 
                    onClick={() => { setIsBreak(false); setTimeLeft(25*60); setIsActive(false); }}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${!isBreak ? 'bg-indigo-100 text-indigo-700' : 'text-slate-500 hover:bg-slate-100'}`}
                >
                    Focus Mode
                </button>
                <button 
                    onClick={() => { setIsBreak(true); setTimeLeft(5*60); setIsActive(false); }}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${isBreak ? 'bg-emerald-100 text-emerald-700' : 'text-slate-500 hover:bg-slate-100'}`}
                >
                    Break Mode
                </button>
             </div>

             <div className="text-7xl font-bold text-slate-800 font-mono mb-8 tracking-wider">
                {formatTime(timeLeft)}
             </div>

             <div className="flex gap-4">
                <button 
                    onClick={() => setIsActive(!isActive)}
                    className="w-16 h-16 rounded-full bg-indigo-600 text-white flex items-center justify-center hover:bg-indigo-700 shadow-lg hover:scale-105 transition-all"
                >
                    {isActive ? <Pause className="w-8 h-8 fill-current" /> : <Play className="w-8 h-8 ml-1 fill-current" />}
                </button>
                <button 
                    onClick={resetTimer}
                    className="w-16 h-16 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center hover:bg-slate-200 transition-colors"
                >
                    <RotateCcw className="w-6 h-6" />
                </button>
             </div>
          </div>
        </div>

        {/* App Blocker Section */}
        <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
           <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                 <Lock className="w-5 h-5 text-red-500" />
                 App Blocker
              </h2>
              <button 
                onClick={blockAll}
                className="text-xs font-semibold text-indigo-600 hover:bg-indigo-50 px-3 py-1.5 rounded-lg transition-colors"
              >
                Block All
              </button>
           </div>
           
           <div className="space-y-3">
              {apps.map((app, idx) => (
                  <div key={idx} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-100">
                      <div className="flex items-center gap-3">
                          <span className="text-2xl">{app.icon}</span>
                          <span className="font-medium text-slate-700">{app.name}</span>
                      </div>
                      <button 
                        onClick={() => toggleBlock(idx)}
                        className={`relative w-12 h-6 rounded-full transition-colors duration-200 ease-in-out ${app.blocked ? 'bg-red-500' : 'bg-slate-300'}`}
                      >
                         <span className={`absolute top-1 left-1 bg-white w-4 h-4 rounded-full shadow transition-transform duration-200 ease-in-out ${app.blocked ? 'translate-x-6' : 'translate-x-0'}`} />
                      </button>
                  </div>
              ))}
           </div>
           
           <div className="mt-6 p-4 bg-yellow-50 rounded-xl border border-yellow-100 text-sm text-yellow-800 flex gap-3">
              <ShieldBan className="w-5 h-5 flex-shrink-0" />
              <p>
                  Note: Apps selected here will be visually flagged. Enable "Do Not Disturb" on your device for system-wide blocking.
              </p>
           </div>
        </div>
      </div>
    </div>
  );
};

export default FocusTools;
