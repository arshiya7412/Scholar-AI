import React, { useState } from 'react';
import { GraduationCap, ArrowRight } from 'lucide-react';

interface LoginProps {
  onLogin: (name: string) => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [name, setName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      onLogin(name);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden">
        <div className="p-8 md:p-12">
          <div className="flex justify-center mb-6">
            <div className="bg-indigo-100 p-4 rounded-full">
              <GraduationCap className="w-10 h-10 text-indigo-600" />
            </div>
          </div>
          
          <h1 className="text-3xl font-bold text-center text-slate-800 mb-2">Welcome Back!</h1>
          <p className="text-center text-slate-500 mb-8">Let's achieve your academic goals together.</p>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-slate-700 mb-2">
                What should we call you?
              </label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-3 bg-white rounded-xl border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all text-slate-900 placeholder-slate-400"
                placeholder="Enter your name"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-6 rounded-xl transition-colors flex items-center justify-center gap-2 group"
            >
              Get Started
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </form>
        </div>
        <div className="bg-slate-50 px-8 py-4 text-center text-sm text-slate-500 border-t border-slate-100">
          Ready to learn? Your AI mentor awaits.
        </div>
      </div>
    </div>
  );
};

export default Login;