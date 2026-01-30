import React, { useState } from 'react';
import { StudentProfile, StudentType } from '../types';
import { BookOpen, Check, Target, Brain, Clock, Calendar, Plus, Trash2, Gauge } from 'lucide-react';

interface ProfileSetupProps {
  initialName: string;
  onComplete: (profile: StudentProfile) => void;
}

const ProfileSetup: React.FC<ProfileSetupProps> = ({ initialName, onComplete }) => {
  const [step, setStep] = useState(1);
  const [profile, setProfile] = useState<StudentProfile>({
    name: initialName,
    gradeLevel: '',
    studentType: 'Average',
    subjects: [],
    strengths: [],
    weaknesses: [],
    dailyStudyHours: 2,
    upcomingExams: ''
  });

  const [subjectInput, setSubjectInput] = useState('');
  
  // State for exam list builder
  const [examName, setExamName] = useState('');
  const [examDate, setExamDate] = useState('');
  const [examList, setExamList] = useState<{name: string, date: string}[]>([]);

  const handleNext = () => setStep(s => s + 1);
  const handleBack = () => setStep(s => s - 1);

  const addSubject = (list: 'subjects' | 'strengths' | 'weaknesses', value: string) => {
    if (value.trim() && !profile[list].includes(value)) {
      setProfile(prev => ({ ...prev, [list]: [...prev[list], value] }));
    }
  };

  const removeSubject = (list: 'subjects' | 'strengths' | 'weaknesses', value: string) => {
    setProfile(prev => ({ ...prev, [list]: prev[list].filter(s => s !== value) }));
  };

  const addExam = () => {
    if (examName && examDate) {
      const newList = [...examList, { name: examName, date: examDate }];
      setExamList(newList);
      setExamName('');
      setExamDate('');
      // Update profile string representation
      const examString = newList.map(e => `${e.name} on ${e.date}`).join(', ');
      setProfile(prev => ({ ...prev, upcomingExams: examString }));
    }
  };

  const removeExam = (idx: number) => {
    const newList = examList.filter((_, i) => i !== idx);
    setExamList(newList);
    const examString = newList.map(e => `${e.name} on ${e.date}`).join(', ');
    setProfile(prev => ({ ...prev, upcomingExams: examString }));
  };

  const renderStep = () => {
    switch(step) {
      case 1:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
              <BookOpen className="text-indigo-500" />
              Academic Basics
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Current Grade/Level</label>
                <select 
                  className="w-full p-3 bg-white border border-slate-200 text-slate-900 rounded-xl outline-none focus:ring-2 focus:ring-indigo-200"
                  value={profile.gradeLevel}
                  onChange={e => setProfile({...profile, gradeLevel: e.target.value})}
                >
                  <option value="">Select Level</option>
                  <option value="High School - Freshman">High School - Freshman</option>
                  <option value="High School - Sophomore">High School - Sophomore</option>
                  <option value="High School - Junior">High School - Junior</option>
                  <option value="High School - Senior">High School - Senior</option>
                  <option value="College - Undergraduate">College - Undergraduate</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Learning Pace</label>
                <div className="grid grid-cols-3 gap-3">
                    {(['Slow Bloomer', 'Average', 'Strong'] as StudentType[]).map((type) => (
                        <button
                            key={type}
                            onClick={() => setProfile({...profile, studentType: type})}
                            className={`p-3 rounded-xl text-sm border transition-all ${
                                profile.studentType === type
                                ? 'bg-indigo-600 text-white border-indigo-600 shadow-md'
                                : 'bg-white text-slate-600 border-slate-200 hover:border-indigo-300'
                            }`}
                        >
                            {type}
                        </button>
                    ))}
                </div>
                <p className="text-xs text-slate-500 mt-1">
                    This helps the AI adjust its teaching speed and complexity.
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">What subjects are you studying?</label>
                <div className="flex gap-2 mb-2">
                  <input 
                    type="text" 
                    value={subjectInput}
                    onChange={e => setSubjectInput(e.target.value)}
                    onKeyDown={e => {
                        if(e.key === 'Enter') {
                            addSubject('subjects', subjectInput);
                            setSubjectInput('');
                        }
                    }}
                    placeholder="e.g. Math, Biology, History"
                    className="flex-1 p-3 bg-white border border-slate-200 text-slate-900 rounded-xl outline-none focus:ring-2 focus:ring-indigo-200"
                  />
                  <button 
                    onClick={() => {
                        addSubject('subjects', subjectInput);
                        setSubjectInput('');
                    }}
                    className="bg-slate-800 text-white px-4 rounded-xl hover:bg-slate-900"
                  >
                    Add
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {profile.subjects.map(s => (
                    <span key={s} className="bg-slate-100 text-slate-700 px-3 py-1 rounded-full text-sm flex items-center gap-2">
                      {s}
                      <button onClick={() => removeSubject('subjects', s)} className="text-slate-400 hover:text-red-500">×</button>
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );
      case 2:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
              <Brain className="text-indigo-500" />
              Strengths & Weaknesses
            </h2>
            <p className="text-slate-500 text-sm">Select from your subjects above.</p>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-green-50 p-4 rounded-xl border border-green-100">
                <h3 className="font-semibold text-green-800 mb-3 flex items-center gap-2">
                  <Target className="w-4 h-4" /> Strongest Subjects
                </h3>
                <div className="flex flex-wrap gap-2">
                  {profile.subjects.map(s => (
                    <button
                      key={s}
                      onClick={() => {
                        if (profile.strengths.includes(s)) removeSubject('strengths', s);
                        else addSubject('strengths', s);
                      }}
                      className={`px-3 py-1 rounded-full text-sm border transition-colors ${
                        profile.strengths.includes(s) 
                          ? 'bg-green-500 text-white border-green-600' 
                          : 'bg-white text-slate-600 border-slate-200 hover:border-green-300'
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              <div className="bg-orange-50 p-4 rounded-xl border border-orange-100">
                <h3 className="font-semibold text-orange-800 mb-3 flex items-center gap-2">
                   Needs Improvement
                </h3>
                <div className="flex flex-wrap gap-2">
                  {profile.subjects.map(s => (
                    <button
                      key={s}
                      onClick={() => {
                        if (profile.weaknesses.includes(s)) removeSubject('weaknesses', s);
                        else addSubject('weaknesses', s);
                      }}
                      className={`px-3 py-1 rounded-full text-sm border transition-colors ${
                        profile.weaknesses.includes(s) 
                          ? 'bg-orange-500 text-white border-orange-600' 
                          : 'bg-white text-slate-600 border-slate-200 hover:border-orange-300'
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );
      case 3:
        return (
            <div className="space-y-6">
            <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
              <Clock className="text-indigo-500" />
              Goals & Exams
            </h2>
            
            <div className="space-y-6">
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Daily Study Goal (Hours)</label>
                    <input 
                        type="range" 
                        min="0.5" 
                        max="8" 
                        step="0.5"
                        value={profile.dailyStudyHours}
                        onChange={e => setProfile({...profile, dailyStudyHours: parseFloat(e.target.value)})}
                        className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer"
                    />
                    <div className="mt-2 text-center font-bold text-indigo-600 text-xl">
                        {profile.dailyStudyHours} Hours / Day
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Upcoming Exams or Deadlines</label>
                    
                    {/* Add Exam Form */}
                    <div className="flex flex-col md:flex-row gap-2 mb-4">
                        <input
                            type="text"
                            placeholder="Exam Name (e.g. Math Midterm)"
                            value={examName}
                            onChange={(e) => setExamName(e.target.value)}
                            className="flex-1 p-3 bg-white border border-slate-200 text-slate-900 rounded-xl outline-none focus:ring-2 focus:ring-indigo-200"
                        />
                        <div className="flex gap-2">
                            <input
                                type="date"
                                value={examDate}
                                onChange={(e) => setExamDate(e.target.value)}
                                className="p-3 bg-white border border-slate-200 text-slate-900 rounded-xl outline-none focus:ring-2 focus:ring-indigo-200"
                            />
                            <button 
                                onClick={addExam}
                                disabled={!examName || !examDate}
                                className="bg-indigo-600 text-white px-4 rounded-xl hover:bg-indigo-700 disabled:opacity-50 flex items-center justify-center"
                            >
                                <Plus className="w-5 h-5" />
                            </button>
                        </div>
                    </div>

                    {/* Exam List */}
                    <div className="space-y-2">
                        {examList.length === 0 && (
                            <div className="text-slate-400 text-center py-4 bg-slate-50 rounded-xl border border-dashed border-slate-200">
                                <Calendar className="w-6 h-6 mx-auto mb-1 opacity-50" />
                                No exams added yet.
                            </div>
                        )}
                        {examList.map((exam, idx) => (
                            <div key={idx} className="flex items-center justify-between p-3 bg-white border border-slate-200 rounded-xl">
                                <div className="flex items-center gap-3">
                                    <div className="bg-indigo-50 text-indigo-600 p-2 rounded-lg">
                                        <Calendar className="w-4 h-4" />
                                    </div>
                                    <div>
                                        <p className="font-medium text-slate-800">{exam.name}</p>
                                        <p className="text-xs text-slate-500">{exam.date}</p>
                                    </div>
                                </div>
                                <button onClick={() => removeExam(idx)} className="text-slate-400 hover:text-red-500">
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
          </div>
        )
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden">
        <div className="bg-indigo-600 p-6 text-white flex justify-between items-center">
            <div>
                <h1 className="text-2xl font-bold">Set Up Profile</h1>
                <p className="text-indigo-100 text-sm">Help us personalize your experience, {initialName}.</p>
            </div>
            <div className="text-3xl font-bold opacity-20">0{step}</div>
        </div>
        
        <div className="p-8">
            {renderStep()}
        </div>

        <div className="p-6 bg-slate-50 border-t border-slate-100 flex justify-between">
            {step > 1 ? (
                <button 
                    onClick={handleBack}
                    className="px-6 py-2 text-slate-600 hover:bg-slate-200 rounded-lg font-medium transition-colors"
                >
                    Back
                </button>
            ) : <div></div>}
            
            {step < 3 ? (
                 <button 
                    onClick={handleNext}
                    disabled={step === 1 && profile.subjects.length === 0}
                    className={`px-6 py-2 bg-indigo-600 text-white rounded-lg font-medium transition-colors ${
                        step === 1 && profile.subjects.length === 0 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-indigo-700'
                    }`}
                >
                    Next
                </button>
            ) : (
                <button 
                    onClick={() => onComplete(profile)}
                    className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium flex items-center gap-2 transition-colors"
                >
                    <Check className="w-4 h-4" /> Finish Setup
                </button>
            )}
        </div>
      </div>
    </div>
  );
};

export default ProfileSetup;