import React from 'react';
import { ViewState } from '../types';
import { 
  LayoutDashboard, 
  CalendarDays, 
  MessageCircleCode, 
  LineChart, 
  LogOut,
  GraduationCap,
  ShieldBan
} from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
  currentView: ViewState;
  setView: (view: ViewState) => void;
  userName: string;
}

const Layout: React.FC<LayoutProps> = ({ children, currentView, setView, userName }) => {
  const navItems = [
    { view: ViewState.DASHBOARD, label: 'Dashboard', icon: LayoutDashboard },
    { view: ViewState.PLANNER, label: 'Study Planner', icon: CalendarDays },
    { view: ViewState.FOCUS_TOOLS, label: 'Focus Zone', icon: ShieldBan },
    { view: ViewState.CHAT, label: 'AI Tutor', icon: MessageCircleCode },
    { view: ViewState.PROGRESS, label: 'Progress', icon: LineChart },
  ];

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-slate-200 hidden md:flex flex-col">
        <div className="p-6 flex items-center gap-3">
          <div className="bg-indigo-600 p-2 rounded-lg">
            <GraduationCap className="text-white w-6 h-6" />
          </div>
          <span className="text-xl font-bold text-slate-800">Scholar AI</span>
        </div>

        <nav className="flex-1 px-4 py-4 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentView === item.view;
            return (
              <button
                key={item.view}
                onClick={() => setView(item.view)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                  isActive 
                    ? 'bg-indigo-50 text-indigo-700 font-medium' 
                    : 'text-slate-500 hover:bg-slate-50 hover:text-slate-700'
                }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? 'text-indigo-600' : 'text-slate-400'}`} />
                {item.label}
              </button>
            );
          })}
        </nav>

        <div className="p-4 border-t border-slate-100">
          <div className="flex items-center gap-3 px-4 py-3 mb-2">
            <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold text-sm">
              {userName.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 overflow-hidden">
              <p className="text-sm font-medium text-slate-700 truncate">{userName}</p>
              <p className="text-xs text-slate-400">Student</p>
            </div>
          </div>
          <button 
            onClick={() => setView(ViewState.LOGIN)}
            className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-500 hover:bg-red-50 rounded-lg transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Mobile Header (Visible only on small screens) */}
      <div className="md:hidden fixed top-0 w-full bg-white z-10 border-b border-slate-200 p-4 flex justify-between items-center">
         <div className="flex items-center gap-2">
            <GraduationCap className="text-indigo-600 w-6 h-6" />
            <span className="font-bold text-slate-800">Scholar AI</span>
         </div>
         <button onClick={() => setView(ViewState.DASHBOARD)} className="text-sm text-indigo-600 font-medium">Menu</button>
      </div>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto pt-16 md:pt-0">
        <div className="max-w-5xl mx-auto p-4 md:p-8">
          {children}
        </div>
      </main>
      
      {/* Mobile Bottom Nav */}
      <div className="md:hidden fixed bottom-0 w-full bg-white border-t border-slate-200 flex justify-around p-3 z-10">
          {navItems.map((item) => {
             const Icon = item.icon;
             const isActive = currentView === item.view;
             return (
               <button 
                 key={item.view}
                 onClick={() => setView(item.view)}
                 className={`flex flex-col items-center gap-1 ${isActive ? 'text-indigo-600' : 'text-slate-400'}`}
               >
                 <Icon className="w-5 h-5" />
                 <span className="text-[10px]">{item.label}</span>
               </button>
             )
          })}
      </div>
    </div>
  );
};

export default Layout;