import React, { useState } from 'react';
import Layout from './components/Layout';
import Login from './components/Login';
import ProfileSetup from './components/ProfileSetup';
import Dashboard from './components/Dashboard';
import Planner from './components/Planner';
import AIChat from './components/AIChat';
import Progress from './components/Progress';
import FocusTools from './components/FocusTools';
import { ViewState, StudentProfile } from './types';

const App: React.FC = () => {
  const [view, setView] = useState<ViewState>(ViewState.LOGIN);
  const [userName, setUserName] = useState('');
  const [profile, setProfile] = useState<StudentProfile | null>(null);
  
  // Mock streak data
  const [streak] = useState(5);

  const handleLogin = (name: string) => {
    setUserName(name);
    // In a real app, we would check if profile exists for this user
    setView(ViewState.PROFILE_SETUP);
  };

  const handleProfileComplete = (newProfile: StudentProfile) => {
    setProfile(newProfile);
    setView(ViewState.DASHBOARD);
  };

  const renderContent = () => {
    switch (view) {
      case ViewState.LOGIN:
        return <Login onLogin={handleLogin} />;
      
      case ViewState.PROFILE_SETUP:
        return <ProfileSetup initialName={userName} onComplete={handleProfileComplete} />;
      
      case ViewState.DASHBOARD:
        if (!profile) return null;
        return <Dashboard profile={profile} setView={setView} streak={streak} />;
      
      case ViewState.PLANNER:
        if (!profile) return null;
        return <Planner profile={profile} />;
      
      case ViewState.CHAT:
        if (!profile) return null;
        return <AIChat profile={profile} />;
      
      case ViewState.PROGRESS:
        if (!profile) return null;
        return <Progress profile={profile} />;

      case ViewState.FOCUS_TOOLS:
        return <FocusTools />;
        
      default:
        return <div>View not found</div>;
    }
  };

  // If we are in Login or Profile Setup, we don't show the main dashboard layout
  if (view === ViewState.LOGIN || view === ViewState.PROFILE_SETUP) {
    return renderContent();
  }

  // Main Layout for authenticated views
  return (
    <Layout currentView={view} setView={setView} userName={userName}>
      {renderContent()}
    </Layout>
  );
};

export default App;
