/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { 
  Baby, 
  Smile, 
  Sparkles, 
  Flame, 
  Zap, 
  Activity, 
  Heart, 
  Calculator, 
  Plus, 
  Trash2, 
  UserPlus, 
  Brain, 
  MessageSquare, 
  PlusCircle, 
  ChevronRight, 
  ChevronDown,
  ChevronUp, 
  Droplet, 
  Footprints, 
  Moon, 
  Dumbbell, 
  Apple, 
  User, 
  CheckCircle2, 
  Target, 
  Stethoscope, 
  Loader2, 
  Calendar, 
  TrendingUp, 
  UserCheck, 
  RefreshCw, 
  AlertCircle, 
  Utensils, 
  X,
  Sparkle
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Profile, 
  DailyTracker, 
  MealLog, 
  HealthAssessment, 
  ChatMessage, 
  DietPreference, 
  HealthGoal, 
  RelationType, 
  ActivityLevel 
} from './types';
import { 
  AGE_CATEGORIES, 
  getAgeCategory, 
  EXERCISE_LIBRARY, 
  RECIPIES_LIBRARY, 
  INITIAL_PROFILES, 
  INITIAL_TRACKER_HISTORY 
} from './constants';

export default function App() {
  // --- AUTHENTICATION STATE (Simulated) ---
  const [user, setUser] = useState<{ email: string; name: string } | null>(() => {
    const saved = localStorage.getItem('lsf_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [authEmail, setAuthEmail] = useState('');
  const [authName, setAuthName] = useState('');

  // --- PROFILES STATE ---
  const [profiles, setProfiles] = useState<Profile[]>(() => {
    const saved = localStorage.getItem('lsf_profiles');
    return saved ? JSON.parse(saved) : INITIAL_PROFILES;
  });
  const [activeProfileId, setActiveProfileId] = useState<string>(() => {
    const saved = localStorage.getItem('lsf_active_id');
    return saved || (INITIAL_PROFILES[0]?.id || '');
  });

  // --- DAILY TRACKERS STATE (mapped by profileId) ---
  const [trackerHistory, setTrackerHistory] = useState<Record<string, DailyTracker[]>>(() => {
    const saved = localStorage.getItem('lsf_trackers');
    if (saved) return JSON.parse(saved);
    
    // Default mock histories for our initial profiles
    return {
      'p-self': INITIAL_TRACKER_HISTORY,
      'p-child': [
        {
          date: '2026-06-29',
          waterIntake: 900,
          steps: 4200,
          sleep: 11.5,
          exerciseDuration: 90,
          caloriesConsumed: 950,
          caloriesBurned: 150,
          mealsLogged: [
            { id: 'm-c1', mealType: 'Breakfast', name: 'Oat paste with formula', calories: 180, protein: 5, carbs: 25, fat: 4 },
            { id: 'm-c2', mealType: 'Lunch', name: 'Mashed banana & avocado', calories: 210, protein: 3, carbs: 32, fat: 11 }
          ]
        },
        {
          date: '2026-06-28',
          waterIntake: 1100,
          steps: 5100,
          sleep: 12,
          exerciseDuration: 120,
          caloriesConsumed: 1020,
          caloriesBurned: 180,
          mealsLogged: []
        }
      ],
      'p-grandparent': [
        {
          date: '2026-06-29',
          waterIntake: 1600,
          steps: 4100,
          sleep: 6.5,
          exerciseDuration: 15,
          caloriesConsumed: 1600,
          caloriesBurned: 180,
          mealsLogged: [
            { id: 'm-g1', mealType: 'Breakfast', name: 'Lemon cod flakes with spinach', calories: 290, protein: 26, carbs: 10, fat: 8 }
          ]
        }
      ]
    };
  });

  // --- HEALTH ASSESSMENTS STATE (mapped by profileId) ---
  const [assessments, setAssessments] = useState<Record<string, HealthAssessment>>(() => {
    const saved = localStorage.getItem('lsf_assessments');
    return saved ? JSON.parse(saved) : {};
  });

  // --- CHAT STATE (mapped by profileId) ---
  const [chatHistories, setChatHistories] = useState<Record<string, ChatMessage[]>>(() => {
    const saved = localStorage.getItem('lsf_chats');
    return saved ? JSON.parse(saved) : {};
  });

  // --- NAVIGATION STATE ---
  const [activeTab, setActiveTab] = useState<'dashboard' | 'assessment' | 'nutrition' | 'fitness' | 'tracker' | 'family' | 'chat'>('dashboard');

  // --- INTERACTIVE PROFILE EDITOR STATE ---
  const [showAddProfileModal, setShowAddProfileModal] = useState(false);
  const [newProfileName, setNewProfileName] = useState('');
  const [newProfileAge, setNewProfileAge] = useState<number>(30);
  const [newProfileGender, setNewProfileGender] = useState<'Male' | 'Female' | 'Other'>('Male');
  const [newProfileHeight, setNewProfileHeight] = useState<number>(170);
  const [newProfileWeight, setNewProfileWeight] = useState<number>(65);
  const [newProfileActivity, setNewProfileActivity] = useState<ActivityLevel>('Moderately Active');
  const [newProfileGoal, setNewProfileGoal] = useState<HealthGoal>('Healthy Lifestyle');
  const [newProfileDiet, setNewProfileDiet] = useState<DietPreference>('Vegetarian');
  const [newProfileRelation, setNewProfileRelation] = useState<RelationType>('Self');
  const [newProfileConditions, setNewProfileConditions] = useState<string>('');
  
  // New body measurements states
  const [newProfileChest, setNewProfileChest] = useState<number>(95);
  const [newProfileWaist, setNewProfileWaist] = useState<number>(80);
  const [newProfileHips, setNewProfileHips] = useState<number>(95);
  const [newProfileBodyFat, setNewProfileBodyFat] = useState<number>(18);
  const [newProfileBodyType, setNewProfileBodyType] = useState<'Ectomorph' | 'Mesomorph' | 'Endomorph' | 'Not Specified'>('Mesomorph');

  // --- MEAL LOGGING FORM STATE ---
  const [mealLogName, setMealLogName] = useState('');
  const [mealLogType, setMealLogType] = useState<'Breakfast' | 'Lunch' | 'Dinner' | 'Snack'>('Breakfast');
  const [mealLogCal, setMealLogCal] = useState<number>(300);
  const [mealLogProt, setMealLogProt] = useState<number>(15);
  const [mealLogCarb, setMealLogCarb] = useState<number>(40);
  const [mealLogFat, setMealLogFat] = useState<number>(10);
  const [selectedMealPlanTab, setSelectedMealPlanTab] = useState<'loss' | 'gain' | 'keto' | 'vegan'>('loss');
  const [selectedEggPreference, setSelectedEggPreference] = useState<'with-eggs' | 'egg-free'>('with-eggs');
  const [expandedExerciseId, setExpandedExerciseId] = useState<string | null>(null);

  // --- TRACKER INPUT STATE (for today) ---
  const [inputWater, setInputWater] = useState<number>(250);
  const [inputSteps, setInputSteps] = useState<string>('1000');
  const [inputSleep, setInputSleep] = useState<string>('8');
  const [inputExercise, setInputExercise] = useState<string>('30');
  const [inputCalBurned, setInputCalBurned] = useState<string>('200');

  // --- CHAT SCREEN STATE ---
  const [chatMessageInput, setChatMessageInput] = useState('');
  const [isChatLoading, setIsChatLoading] = useState(false);

  // --- ASSESSMENT STATE ---
  const [isAssessmentLoading, setIsAssessmentLoading] = useState(false);
  const [assessmentError, setAssessmentError] = useState<string | null>(null);

  // --- NOTIFICATION BANNER STATE ---
  const [toastMsg, setToastMsg] = useState<{ text: string; type: 'success' | 'info' | 'error' } | null>(null);

  // --- PERSISTENCE SYNCHRONIZER ---
  useEffect(() => {
    localStorage.setItem('lsf_profiles', JSON.stringify(profiles));
  }, [profiles]);

  useEffect(() => {
    localStorage.setItem('lsf_active_id', activeProfileId);
  }, [activeProfileId]);

  useEffect(() => {
    localStorage.setItem('lsf_trackers', JSON.stringify(trackerHistory));
  }, [trackerHistory]);

  useEffect(() => {
    localStorage.setItem('lsf_assessments', JSON.stringify(assessments));
  }, [assessments]);

  useEffect(() => {
    localStorage.setItem('lsf_chats', JSON.stringify(chatHistories));
  }, [chatHistories]);

  // Toast trigger helper
  const triggerToast = (text: string, type: 'success' | 'info' | 'error' = 'success') => {
    setToastMsg({ text, type });
    setTimeout(() => {
      setToastMsg(null);
    }, 4000);
  };

  // Get active profile objects
  const activeProfile = profiles.find(p => p.id === activeProfileId) || profiles[0] || INITIAL_PROFILES[0];
  const activeAgeCategory = getAgeCategory(activeProfile.age);
  const activeCategoryDetails = AGE_CATEGORIES.find(c => c.name === activeAgeCategory) || AGE_CATEGORIES[0];

  // Helper: get today's YYYY-MM-DD
  const getTodayDateString = () => {
    return new Date().toISOString().split('T')[0];
  };

  // Helper: Get or initialize today's tracker object
  const getTodayTracker = (): DailyTracker => {
    const todayStr = getTodayDateString();
    const historyList = trackerHistory[activeProfile.id] || [];
    const existing = historyList.find(t => t.date === todayStr);
    
    if (existing) return existing;

    const newToday: DailyTracker = {
      date: todayStr,
      waterIntake: 0,
      steps: 0,
      sleep: 0,
      exerciseDuration: 0,
      caloriesConsumed: 0,
      caloriesBurned: 0,
      mealsLogged: []
    };
    return newToday;
  };

  // Sync state values on profile change or load
  useEffect(() => {
    const today = getTodayTracker();
    setInputSteps(today.steps.toString());
    setInputSleep(today.sleep.toString());
    setInputExercise(today.exerciseDuration.toString());
    setInputCalBurned(today.caloriesBurned.toString());
  }, [activeProfileId]);

  // Handle User Login
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!authEmail) return;
    const cleanUser = {
      email: authEmail,
      name: authName || authEmail.split('@')[0]
    };
    setUser(cleanUser);
    localStorage.setItem('lsf_user', JSON.stringify(cleanUser));
    triggerToast(`Logged in successfully as ${cleanUser.name}!`);
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('lsf_user');
    triggerToast("Logged out of session.", "info");
  };

  // Handle Add Profile
  const handleAddProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProfileName) {
      triggerToast("Please provide a name.", "error");
      return;
    }

    const id = 'p-' + Date.now();
    const newP: Profile = {
      id,
      name: newProfileName,
      age: Number(newProfileAge),
      gender: newProfileGender,
      height: Number(newProfileHeight),
      weight: Number(newProfileWeight),
      activityLevel: newProfileActivity,
      goals: newProfileGoal,
      medicalConditions: newProfileConditions ? newProfileConditions.split(',').map(c => c.trim()) : ['None'],
      dietPreference: newProfileDiet,
      relation: newProfileRelation,
      createdAt: new Date().toISOString(),
      chest: Number(newProfileChest),
      waist: Number(newProfileWaist),
      hips: Number(newProfileHips),
      bodyFat: Number(newProfileBodyFat),
      bodyType: newProfileBodyType
    };

    setProfiles(prev => [...prev, newP]);
    setActiveProfileId(id);
    
    // Seed an initial blank record for the new profile
    setTrackerHistory(prev => ({
      ...prev,
      [id]: [{
        date: getTodayDateString(),
        waterIntake: 0,
        steps: 0,
        sleep: 0,
        exerciseDuration: 0,
        caloriesConsumed: 0,
        caloriesBurned: 0,
        mealsLogged: []
      }]
    }));

    // Reset fields
    setNewProfileName('');
    setNewProfileAge(30);
    setNewProfileHeight(170);
    setNewProfileWeight(65);
    setNewProfileChest(95);
    setNewProfileWaist(80);
    setNewProfileHips(95);
    setNewProfileBodyFat(18);
    setNewProfileBodyType('Mesomorph');
    setNewProfileConditions('');
    setShowAddProfileModal(false);
    triggerToast(`Created wellness profile for ${newP.name}!`);
  };

  // Handle Delete Profile
  const handleDeleteProfile = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (profiles.length <= 1) {
      triggerToast("You must maintain at least one health profile.", "error");
      return;
    }
    const remaining = profiles.filter(p => p.id !== id);
    setProfiles(remaining);
    if (activeProfileId === id) {
      setActiveProfileId(remaining[0].id);
    }
    triggerToast("Profile deleted.", "info");
  };

  // Dynamically update profile measurements & body type
  const updateProfileMeasurement = (field: 'chest' | 'waist' | 'hips' | 'bodyFat' | 'bodyType', value: any) => {
    setProfiles(prev => prev.map(p => p.id === activeProfile.id ? { ...p, [field]: value } : p));
  };

  // BMI calculation & analysis
  const calculateBMI = (h: number, w: number) => {
    if (!h || !w) return { bmi: 0, category: 'N/A' };
    const meterHeight = h / 100;
    const score = w / (meterHeight * meterHeight);
    let category = 'Normal';
    
    if (score < 18.5) category = 'Underweight';
    else if (score >= 30) category = 'Obese';
    else if (score >= 25) category = 'Overweight';
    
    return { bmi: Number(score.toFixed(1)), category };
  };

  const bmiDetails = calculateBMI(activeProfile.height, activeProfile.weight);

  // Update tracking sliders / inputs for today
  const saveTodayTrackerItem = (key: keyof DailyTracker, value: any) => {
    const todayStr = getTodayDateString();
    const currentList = trackerHistory[activeProfile.id] || [];
    const index = currentList.findIndex(t => t.date === todayStr);

    let updatedList = [...currentList];
    if (index !== -1) {
      updatedList[index] = { ...updatedList[index], [key]: value };
    } else {
      const todayObj = getTodayTracker();
      updatedList.unshift({ ...todayObj, [key]: value });
    }

    setTrackerHistory(prev => ({
      ...prev,
      [activeProfile.id]: updatedList
    }));
  };

  // Log a Meal to today's log
  const handleAddMeal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!mealLogName) {
      triggerToast("Please provide the food name.", "error");
      return;
    }

    const todayStr = getTodayDateString();
    const currentList = trackerHistory[activeProfile.id] || [];
    const todayIndex = currentList.findIndex(t => t.date === todayStr);
    
    let todayObj = todayIndex !== -1 ? currentList[todayIndex] : getTodayTracker();
    
    const newMeal: MealLog = {
      id: 'ml-' + Date.now(),
      mealType: mealLogType,
      name: mealLogName,
      calories: Number(mealLogCal),
      protein: Number(mealLogProt),
      carbs: Number(mealLogCarb),
      fat: Number(mealLogFat)
    };

    const updatedMeals = [...(todayObj.mealsLogged || []), newMeal];
    const totalCals = updatedMeals.reduce((acc, curr) => acc + curr.calories, 0);

    let updatedList = [...currentList];
    if (todayIndex !== -1) {
      updatedList[todayIndex] = {
        ...todayObj,
        mealsLogged: updatedMeals,
        caloriesConsumed: totalCals
      };
    } else {
      updatedList.unshift({
        ...todayObj,
        mealsLogged: updatedMeals,
        caloriesConsumed: totalCals
      });
    }

    setTrackerHistory(prev => ({
      ...prev,
      [activeProfile.id]: updatedList
    }));

    setMealLogName('');
    triggerToast(`Logged ${newMeal.name}!`);
  };

  // Delete Meal
  const handleDeleteMeal = (mealId: string) => {
    const todayStr = getTodayDateString();
    const currentList = trackerHistory[activeProfile.id] || [];
    const todayIndex = currentList.findIndex(t => t.date === todayStr);

    if (todayIndex === -1) return;

    let todayObj = currentList[todayIndex];
    const updatedMeals = todayObj.mealsLogged.filter(m => m.id !== mealId);
    const totalCals = updatedMeals.reduce((acc, curr) => acc + curr.calories, 0);

    let updatedList = [...currentList];
    updatedList[todayIndex] = {
      ...todayObj,
      mealsLogged: updatedMeals,
      caloriesConsumed: totalCals
    };

    setTrackerHistory(prev => ({
      ...prev,
      [activeProfile.id]: updatedList
    }));
    triggerToast("Meal log removed.", "info");
  };

  // AI assessment trigger
  const runAiAssessment = async () => {
    setIsAssessmentLoading(true);
    setAssessmentError(null);
    try {
      const response = await fetch('/api/gemini/assess', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          profile: activeProfile,
          trackerHistory: trackerHistory[activeProfile.id] || []
        })
      });

      if (!response.ok) {
        throw new Error("Assessment request failed. Check server log.");
      }

      const data = await response.json();
      setAssessments(prev => ({
        ...prev,
        [activeProfile.id]: {
          ...data,
          profileId: activeProfile.id,
          timestamp: new Date().toLocaleDateString('en-US', { hour: '2-digit', minute: '2-digit' })
        }
      }));
      triggerToast("AI Clinical Assessment completed successfully!", "success");
    } catch (err: any) {
      console.error(err);
      setAssessmentError(err.message || "Failed to generate assessment.");
      triggerToast("Assessment failed. Verify API configuration.", "error");
    } finally {
      setIsAssessmentLoading(false);
    }
  };

  // Chat message submission
  const sendChatMessage = async (presetMessage?: string) => {
    const textToSend = presetMessage || chatMessageInput;
    if (!textToSend.trim()) return;

    if (!presetMessage) {
      setChatMessageInput('');
    }

    const newUserMsg: ChatMessage = {
      id: 'msg-' + Date.now(),
      role: 'user',
      content: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    const currentHistory = chatHistories[activeProfile.id] || [];
    const updatedHistory = [...currentHistory, newUserMsg];

    setChatHistories(prev => ({
      ...prev,
      [activeProfile.id]: updatedHistory
    }));

    setIsChatLoading(true);

    try {
      const response = await fetch('/api/gemini/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: textToSend,
          history: currentHistory,
          profile: activeProfile
        })
      });

      if (!response.ok) {
        throw new Error("Chat request failed.");
      }

      const data = await response.json();
      
      const newModelMsg: ChatMessage = {
        id: 'msg-' + (Date.now() + 1),
        role: 'model',
        content: data.text,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setChatHistories(prev => ({
        ...prev,
        [activeProfile.id]: [...updatedHistory, newModelMsg]
      }));
    } catch (err) {
      console.error(err);
      const errorMsg: ChatMessage = {
        id: 'msg-' + (Date.now() + 1),
        role: 'model',
        content: "⚠️ I encountered an error. Please confirm your **GEMINI_API_KEY** is configured in **Settings > Secrets** or try again shortly.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setChatHistories(prev => ({
        ...prev,
        [activeProfile.id]: [...updatedHistory, errorMsg]
      }));
    } finally {
      setIsChatLoading(false);
    }
  };

  const clearChatHistory = () => {
    setChatHistories(prev => ({
      ...prev,
      [activeProfile.id]: []
    }));
    triggerToast("Chat history cleared.", "info");
  };

  // Get current active assessment or a default
  const activeAssessment: HealthAssessment | undefined = assessments[activeProfile.id];

  // Helper for age group rendering colors
  const getAgeBadgeStyle = (age: number) => {
    if (age < 1) return 'bg-rose-50 text-rose-700 border-rose-200';
    if (age <= 3) return 'bg-amber-50 text-amber-700 border-amber-200';
    if (age <= 12) return 'bg-sky-50 text-sky-700 border-sky-200';
    if (age <= 19) return 'bg-purple-50 text-purple-700 border-purple-200';
    if (age <= 35) return 'bg-emerald-50 text-emerald-700 border-emerald-200';
    if (age <= 55) return 'bg-blue-50 text-blue-700 border-blue-200';
    return 'bg-violet-50 text-violet-700 border-violet-200';
  };

  return (
    <div id="lifespanfit-root" className="min-h-screen bg-slate-50 text-slate-900 font-sans antialiased flex flex-col">
      
      {/* Toast Notification */}
      <AnimatePresence>
        {toastMsg && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={`fixed top-4 right-4 z-50 px-4 py-3 rounded-xl shadow-lg border flex items-center gap-3 text-sm font-medium ${
              toastMsg.type === 'success' ? 'bg-emerald-50 text-emerald-800 border-emerald-200' :
              toastMsg.type === 'error' ? 'bg-rose-50 text-rose-800 border-rose-200' :
              'bg-slate-800 text-slate-100 border-slate-700'
            }`}
          >
            <CheckCircle2 className={`w-4 h-4 ${toastMsg.type === 'error' ? 'text-rose-500' : 'text-emerald-500'}`} />
            <span>{toastMsg.text}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* --- AUTHENTICATION SHIELD / WELCOME SCREEN --- */}
      {!user ? (
        <div className="flex-1 flex items-center justify-center p-4 py-16 bg-radial from-slate-50 to-slate-100">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-md bg-white p-8 rounded-3xl border border-slate-200/80 shadow-xl"
          >
            <div className="text-center mb-6">
              <div className="mx-auto w-14 h-14 bg-emerald-600 rounded-2xl flex items-center justify-center text-white shadow-md shadow-emerald-200 mb-3">
                <Heart className="w-8 h-8 animate-pulse" />
              </div>
              <h1 className="text-2xl font-bold tracking-tight text-slate-900 font-sans">LifeSpanFit AI</h1>
              <p className="text-xs text-slate-500 mt-1">Healthy Living Guidance for Every Age, Every Stage of Life.</p>
              <div className="text-[10px] font-mono mt-1 text-emerald-600 bg-emerald-50 px-2.5 py-0.5 rounded-full inline-block">VisionaryTraffic.in</div>
            </div>

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">YOUR NAME</label>
                <input 
                  type="text" 
                  required
                  placeholder="e.g. Avasthi Manoj"
                  value={authName}
                  onChange={e => setAuthName(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">EMAIL ADDRESS</label>
                <input 
                  type="email" 
                  required
                  placeholder="e.g. manoj@visionarytraffic.in"
                  value={authEmail}
                  onChange={e => setAuthEmail(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
                />
              </div>

              <button 
                type="submit" 
                className="w-full bg-slate-900 hover:bg-slate-800 text-white font-medium py-3 rounded-xl transition duration-150 shadow-md text-sm cursor-pointer flex items-center justify-center gap-2"
              >
                <span>Access Clinical Workspace</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </form>

            <div className="relative flex py-4 items-center">
              <div className="flex-grow border-t border-slate-200"></div>
              <span className="flex-shrink mx-4 text-slate-400 text-[10px] uppercase font-bold tracking-wider">Alternative Sandbox Login</span>
              <div className="flex-grow border-t border-slate-200"></div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <button 
                onClick={() => {
                  setUser({ email: 'avasthimanoj426@gmail.com', name: 'Avasthi Manoj' });
                  triggerToast("Google Sandbox Login active.");
                }}
                className="px-4 py-2 border border-slate-200 rounded-xl text-xs font-medium text-slate-600 hover:bg-slate-50 flex items-center justify-center gap-2 cursor-pointer"
              >
                <span className="w-2.5 h-2.5 rounded-full bg-red-500"></span>
                <span>Google Login</span>
              </button>
              <button 
                onClick={() => {
                  setUser({ email: 'guest@visionarytraffic.in', name: 'Guest Practitioner' });
                  triggerToast("Guest Sandbox Login active.");
                }}
                className="px-4 py-2 border border-slate-200 rounded-xl text-xs font-medium text-slate-600 hover:bg-slate-50 flex items-center justify-center gap-2 cursor-pointer"
              >
                <span className="w-2.5 h-2.5 rounded-full bg-slate-500"></span>
                <span>Practitioner Pass</span>
              </button>
            </div>

            <p className="text-[10px] text-slate-400 text-center mt-6 leading-relaxed">
              *By logging in, you accept localized database hosting rules. AI insights are generated securely via Google AI Studio proxy engines.
            </p>
          </motion.div>
        </div>
      ) : (
        <>
          {/* --- CORE WORKSPACE NAVIGATION BAR --- */}
          <header className="sticky top-0 z-40 bg-white border-b border-slate-200/80 px-6 py-3 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center text-white shadow-md">
                <Heart className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-slate-900 text-lg tracking-tight">LifeSpanFit AI</span>
                  <span className="text-[10px] bg-slate-100 px-2 py-0.5 rounded-full text-slate-600 border border-slate-200 font-mono font-medium">v1.2-beta</span>
                </div>
                <div className="text-[10px] text-slate-400">Personalized Longevity Engine • <span className="font-semibold text-emerald-600">VisionaryTraffic.in</span></div>
              </div>
            </div>

            {/* Account Quick Status & Active Profile Swapper */}
            <div className="flex items-center gap-3 flex-wrap">
              <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200/80 rounded-2xl p-1 px-3">
                <span className="text-xs text-slate-500 mr-1.5 hidden lg:inline">Active Patient:</span>
                <div className="flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                  <span className="text-xs font-semibold text-slate-800">{activeProfile.name}</span>
                  <span className="text-[10px] font-mono px-2 py-0.5 bg-white border border-slate-200 rounded-md text-slate-600">
                    {activeProfile.age} yrs
                  </span>
                </div>
              </div>

              {/* Profile selector dropdown */}
              <select 
                value={activeProfileId}
                onChange={e => setActiveProfileId(e.target.value)}
                className="bg-white border border-slate-200 rounded-xl px-3 py-1.5 text-xs font-semibold text-slate-700 outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer"
              >
                {profiles.map(p => (
                  <option key={p.id} value={p.id}>
                    👤 {p.name} ({p.relation})
                  </option>
                ))}
              </select>

              <button 
                onClick={() => setShowAddProfileModal(true)}
                className="p-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200/60 rounded-xl text-xs font-medium cursor-pointer flex items-center gap-1"
                title="Add Family Profile"
              >
                <UserPlus className="w-4 h-4" />
                <span className="hidden sm:inline">Add Member</span>
              </button>

              <button 
                onClick={handleLogout}
                className="p-1.5 px-3 border border-slate-200 rounded-xl text-xs font-medium text-slate-500 hover:bg-slate-50 cursor-pointer"
              >
                Sign Out
              </button>
            </div>
          </header>

          {/* MAIN GRID WRAPPER */}
          <div className="flex-1 flex flex-col md:flex-row">
            
            {/* SIDEBAR TABS */}
            <aside className="w-full md:w-64 bg-white border-r border-slate-200/80 p-4 flex flex-col gap-1.5 shrink-0">
              
              <div className="px-3 py-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                Clinical Modules
              </div>

              <button 
                onClick={() => setActiveTab('dashboard')}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-semibold transition cursor-pointer ${
                  activeTab === 'dashboard' ? 'bg-slate-100 text-emerald-600' : 'text-slate-500 hover:bg-slate-100'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Activity className="w-4 h-4" />
                  <span>Clinical Dashboard</span>
                </div>
                <ChevronRight className="w-3.5 h-3.5 opacity-60" />
              </button>

              <button 
                onClick={() => setActiveTab('assessment')}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-semibold transition cursor-pointer ${
                  activeTab === 'assessment' ? 'bg-slate-100 text-emerald-600' : 'text-slate-500 hover:bg-slate-100'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Stethoscope className="w-4 h-4" />
                  <div className="flex items-center gap-1.5">
                    <span>AI Diagnostics</span>
                    <span className="text-[9px] bg-emerald-600 text-white px-1.5 rounded-full font-bold">LIVE</span>
                  </div>
                </div>
                <ChevronRight className="w-3.5 h-3.5 opacity-60" />
              </button>

              <button 
                onClick={() => setActiveTab('nutrition')}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-semibold transition cursor-pointer ${
                  activeTab === 'nutrition' ? 'bg-slate-100 text-emerald-600' : 'text-slate-500 hover:bg-slate-100'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Apple className="w-4 h-4" />
                  <span>Dietitian & Recipes</span>
                </div>
                <ChevronRight className="w-3.5 h-3.5 opacity-60" />
              </button>

              <button 
                onClick={() => setActiveTab('fitness')}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-semibold transition cursor-pointer ${
                  activeTab === 'fitness' ? 'bg-slate-100 text-emerald-600' : 'text-slate-500 hover:bg-slate-100'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Dumbbell className="w-4 h-4" />
                  <span>Exercise & Trainer</span>
                </div>
                <ChevronRight className="w-3.5 h-3.5 opacity-60" />
              </button>

              <button 
                onClick={() => setActiveTab('tracker')}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-semibold transition cursor-pointer ${
                  activeTab === 'tracker' ? 'bg-slate-100 text-emerald-600' : 'text-slate-500 hover:bg-slate-100'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Calendar className="w-4 h-4" />
                  <span>Wellness Log</span>
                </div>
                <ChevronRight className="w-3.5 h-3.5 opacity-60" />
              </button>

              <div className="px-3 py-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider mt-4 mb-2">
                Unified Accounts
              </div>

              <button 
                onClick={() => setActiveTab('family')}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-semibold transition cursor-pointer ${
                  activeTab === 'family' ? 'bg-slate-100 text-emerald-600' : 'text-slate-500 hover:bg-slate-100'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <User className="w-4 h-4" />
                  <span>Family Profiles</span>
                </div>
                <span className="text-[10px] bg-slate-200 text-slate-600 font-mono font-bold px-2 py-0.5 rounded-md">
                  {profiles.length}
                </span>
              </button>

              <button 
                onClick={() => setActiveTab('chat')}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-semibold transition cursor-pointer ${
                  activeTab === 'chat' ? 'bg-slate-100 text-emerald-600' : 'text-slate-500 hover:bg-slate-100'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Brain className="w-4 h-4 text-emerald-600" />
                  <div className="flex items-center gap-1">
                    <span>Clinical Chat</span>
                    <span className="text-[9px] text-emerald-600 bg-emerald-50 px-1 py-0.2 rounded-md font-bold">24/7</span>
                  </div>
                </div>
                <ChevronRight className="w-3.5 h-3.5 opacity-60" />
              </button>

              {/* Patient Detail Summary in Sidebar */}
              <div className="mt-auto pt-6 border-t border-slate-200">
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/60">
                  <div className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider mb-2">Active Milestone</div>
                  <div className="flex items-center gap-2.5 mb-2">
                    <div className="w-8 h-8 rounded-lg bg-emerald-50 border border-emerald-200/50 flex items-center justify-center text-emerald-600">
                      {activeProfile.age < 1 ? <Baby className="w-4.5 h-4.5" /> :
                       activeProfile.age >= 56 ? <Heart className="w-4.5 h-4.5" /> : 
                       <Smile className="w-4.5 h-4.5" />}
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-800">{activeAgeCategory}</h4>
                      <p className="text-[9px] text-slate-500">Range: {activeCategoryDetails.ageRange}</p>
                    </div>
                  </div>
                  <p className="text-[10px] text-slate-600 leading-relaxed mb-3">
                    {activeCategoryDetails.description}
                  </p>
                  <div className="text-[9px] text-emerald-800 bg-emerald-50 p-2 rounded-lg font-medium leading-relaxed border border-emerald-100">
                    <span className="font-bold">Focus:</span> {activeCategoryDetails.keyFocus}
                  </div>
                </div>
              </div>
            </aside>

            {/* --- MAIN TAB CONTENT WINDOW --- */}
            <main id="clinical-workspace-content" className="flex-1 p-6 overflow-y-auto max-w-7xl mx-auto w-full">
              
              {/* --- TAB 1: CLINICAL DASHBOARD --- */}
              {activeTab === 'dashboard' && (
                <div className="space-y-6">
                  
                  {/* Top Welcome Banner */}
                  <div className="bg-white border border-slate-200/80 p-6 rounded-3xl shadow-sm relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="absolute right-0 top-0 translate-x-12 -translate-y-12 w-64 h-64 bg-emerald-50 rounded-full opacity-60 blur-2xl pointer-events-none"></div>
                    
                    <div className="relative z-10">
                      <div className="flex items-center gap-2 mb-1.5">
                        <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full uppercase tracking-wider">Life Stage Wellness</span>
                        <span className={`text-xs font-bold border px-2 py-0.5 rounded-full ${getAgeBadgeStyle(activeProfile.age)}`}>
                          {activeAgeCategory} ({activeProfile.age} yrs)
                        </span>
                      </div>
                      <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Welcome, {activeProfile.name}</h2>
                      <p className="text-xs text-slate-500 mt-1 max-w-2xl">
                        Comprehensive longevity roadmap calculated for your physical markers. Complete your diagnostic questionnaire to generate custom AI health indices.
                      </p>
                    </div>

                    <button 
                      onClick={() => setActiveTab('assessment')}
                      className="relative z-10 flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-xs px-5 py-3 rounded-xl transition shadow-md shadow-emerald-100 cursor-pointer text-center"
                    >
                      <Brain className="w-4 h-4" />
                      <span>{activeAssessment ? "Review Assessment" : "Run AI Diagnostics"}</span>
                    </button>
                  </div>

                  {/* Physical Parameters Summary Card Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    
                    {/* BMI Calculator Widget */}
                    <div className="bg-white border border-slate-200/80 p-5 rounded-2xl shadow-sm flex flex-col justify-between">
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-xs font-semibold text-slate-500">Calculated BMI</span>
                        <Calculator className="w-4 h-4 text-emerald-600" />
                      </div>
                      <div>
                        <div className="flex items-baseline gap-2">
                          <span className="text-3xl font-extrabold text-slate-900 font-mono">{bmiDetails.bmi}</span>
                          <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">kg/m²</span>
                        </div>
                        <p className="text-xs font-medium text-slate-700 mt-1">
                          Category: <span className="font-bold text-emerald-600">{bmiDetails.category}</span>
                        </p>
                      </div>
                      <div className="border-t border-slate-100 mt-4 pt-3 text-[10px] text-slate-400">
                        {activeProfile.age < 2 ? "Infant BMI uses standard growth milestones." : `Healthy range: 18.5 - 24.9.`}
                      </div>
                    </div>

                    {/* Calorie Goals Widget */}
                    <div className="bg-white border border-slate-200/80 p-5 rounded-2xl shadow-sm flex flex-col justify-between">
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-xs font-semibold text-slate-500">Daily Calorie Target</span>
                        <Apple className="w-4 h-4 text-amber-500" />
                      </div>
                      <div>
                        <div className="flex items-baseline gap-1">
                          <span className="text-3xl font-extrabold text-slate-900 font-mono">
                            {activeAssessment?.caloriesTarget || (activeProfile.age < 5 ? 1000 : activeProfile.gender === 'Male' ? 2200 : 1800)}
                          </span>
                          <span className="text-xs text-slate-400">kcal/day</span>
                        </div>
                        <p className="text-xs text-slate-500 mt-1 font-medium">
                          Based on **{activeProfile.activityLevel}**
                        </p>
                      </div>
                      <div className="border-t border-slate-100 mt-4 pt-3 text-[10px] text-slate-400">
                        Goal: <span className="font-semibold text-slate-700">{activeProfile.goals}</span>
                      </div>
                    </div>

                    {/* Medical / Pathological Alerts */}
                    <div className="bg-white border border-slate-200/80 p-5 rounded-2xl shadow-sm flex flex-col justify-between">
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-xs font-semibold text-slate-500">Clinical Markers</span>
                        <Stethoscope className="w-4 h-4 text-blue-500" />
                      </div>
                      <div>
                        <div className="flex flex-wrap gap-1.5">
                          {activeProfile.medicalConditions.map((c, i) => (
                            <span key={i} className="text-[10px] font-bold bg-slate-100 text-slate-700 px-2 py-0.5 rounded border border-slate-200">
                              {c}
                            </span>
                          ))}
                        </div>
                        <p className="text-[10px] text-slate-500 mt-2">
                          Diet preference: <span className="font-semibold text-slate-700">{activeProfile.dietPreference}</span>
                        </p>
                      </div>
                      <div className="border-t border-slate-100 mt-4 pt-3 text-[10px] text-slate-400">
                        Profile Type: <span className="font-semibold text-slate-700">{activeProfile.relation}</span>
                      </div>
                    </div>

                    {/* AI Assessment Index Score Widget */}
                    <div className="bg-white border border-slate-200/80 p-5 rounded-2xl shadow-sm flex flex-col justify-between">
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-xs font-semibold text-slate-500">AI Longevity Index</span>
                        <Brain className="w-4 h-4 text-purple-500" />
                      </div>
                      {activeAssessment ? (
                        <div>
                          <div className="flex items-baseline gap-1">
                            <span className="text-3xl font-extrabold text-emerald-600 font-mono">{activeAssessment.healthScore}</span>
                            <span className="text-xs text-slate-400">/100</span>
                          </div>
                          <p className="text-[10px] text-slate-500 mt-1 font-medium">
                            Nutrition: {activeAssessment.nutritionScore} • Fitness: {activeAssessment.fitnessScore}
                          </p>
                        </div>
                      ) : (
                        <div>
                          <p className="text-xs text-slate-500 italic">No diagnostic score compiled.</p>
                          <button 
                            onClick={() => setActiveTab('assessment')}
                            className="text-xs text-emerald-600 font-bold hover:underline mt-1 cursor-pointer"
                          >
                            Click to compile ⚡
                          </button>
                        </div>
                      )}
                      <div className="border-t border-slate-100 mt-4 pt-3 text-[10px] text-slate-400">
                        {activeAssessment ? `Dated: ${activeAssessment.timestamp}` : "Status: Raw markers logged"}
                      </div>
                    </div>

                  </div>

                  {/* Today's Diagnostic Tracking Progress Indicators */}
                  <div className="bg-white border border-slate-200/80 p-6 rounded-3xl shadow-sm">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
                      <div>
                        <h3 className="text-base font-bold text-slate-900">Today's Biometric Log & Tracking</h3>
                        <p className="text-xs text-slate-500">Record water intake, physical steps, sleep and sleep parameters to refresh your daily health indexes.</p>
                      </div>
                      <button 
                        onClick={() => setActiveTab('tracker')}
                        className="text-xs font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 px-3.5 py-1.5 rounded-xl border border-emerald-200/50 cursor-pointer"
                      >
                        Adjust Targets / History
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-4 gap-6">
                      
                      {/* Water Tracker Gauge */}
                      <div className="bg-slate-50 border border-slate-200/40 p-4 rounded-2xl flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-blue-100 border border-blue-200 flex items-center justify-center text-blue-600 shrink-0">
                          <Droplet className="w-6 h-6" />
                        </div>
                        <div className="flex-1">
                          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Water Log</div>
                          <div className="text-lg font-extrabold text-slate-900 font-mono">
                            {getTodayTracker().waterIntake} <span className="text-xs text-slate-400 font-normal">/ 2500 ml</span>
                          </div>
                          {/* Quick Add Water */}
                          <div className="flex gap-1 mt-1.5">
                            <button 
                              onClick={() => saveTodayTrackerItem('waterIntake', getTodayTracker().waterIntake + 250)}
                              className="text-[10px] font-bold bg-white hover:bg-blue-50 text-blue-700 border border-blue-200 rounded px-1.5 py-0.5 cursor-pointer"
                            >
                              +250ml
                            </button>
                            <button 
                              onClick={() => saveTodayTrackerItem('waterIntake', getTodayTracker().waterIntake + 500)}
                              className="text-[10px] font-bold bg-white hover:bg-blue-50 text-blue-700 border border-blue-200 rounded px-1.5 py-0.5 cursor-pointer"
                            >
                              +500ml
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Steps Log */}
                      <div className="bg-slate-50 border border-slate-200/40 p-4 rounded-2xl flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-emerald-100 border border-emerald-200 flex items-center justify-center text-emerald-600 shrink-0">
                          <Footprints className="w-6 h-6" />
                        </div>
                        <div className="flex-1">
                          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Vascular Steps</div>
                          <div className="text-lg font-extrabold text-slate-900 font-mono">
                            {getTodayTracker().steps.toLocaleString()} <span className="text-xs text-slate-400 font-normal">/ 8k</span>
                          </div>
                          {/* Quick Incrementor */}
                          <div className="flex gap-1 mt-1.5">
                            <button 
                              onClick={() => saveTodayTrackerItem('steps', getTodayTracker().steps + 1000)}
                              className="text-[10px] font-bold bg-white hover:bg-emerald-50 text-emerald-700 border border-emerald-200 rounded px-1.5 py-0.5 cursor-pointer"
                            >
                              +1,000 steps
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Sleep log */}
                      <div className="bg-slate-50 border border-slate-200/40 p-4 rounded-2xl flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-violet-100 border border-violet-200 flex items-center justify-center text-violet-600 shrink-0">
                          <Moon className="w-6 h-6" />
                        </div>
                        <div className="flex-1">
                          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Sleep cycle</div>
                          <div className="text-lg font-extrabold text-slate-900 font-mono">
                            {getTodayTracker().sleep} <span className="text-xs text-slate-400 font-normal">hrs</span>
                          </div>
                          <div className="text-[10px] text-slate-500 mt-1">
                            Target: {activeProfile.age >= 56 ? '7h' : activeProfile.age < 12 ? '10-12h' : '8h'}
                          </div>
                        </div>
                      </div>

                      {/* Calories consumed */}
                      <div className="bg-slate-50 border border-slate-200/40 p-4 rounded-2xl flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-amber-100 border border-amber-200 flex items-center justify-center text-amber-600 shrink-0">
                          <Utensils className="w-6 h-6" />
                        </div>
                        <div className="flex-1">
                          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Calories Consumed</div>
                          <div className="text-lg font-extrabold text-slate-900 font-mono">
                            {getTodayTracker().caloriesConsumed} <span className="text-xs text-slate-400 font-normal">kcal</span>
                          </div>
                          <button 
                            onClick={() => setActiveTab('nutrition')}
                            className="text-[10px] font-bold text-amber-700 hover:underline mt-1 block cursor-pointer"
                          >
                            Meal logs ({getTodayTracker().mealsLogged?.length || 0}) 📝
                          </button>
                        </div>
                      </div>

                    </div>
                  </div>

                  {/* Split Layout: Dynamic AI Advice Checklist & Guidelines */}
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    
                    {/* Left & center block: AI Assessment results summary if available */}
                    <div className="bg-white border border-slate-200/80 p-6 rounded-3xl shadow-sm lg:col-span-2 space-y-6">
                      <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                        <div>
                          <h3 className="text-base font-bold text-slate-900">Personalized Longevity Analysis</h3>
                          <p className="text-xs text-slate-500">Calculated clinical diagnostic indicators mapped specifically for your demographic profile.</p>
                        </div>
                        {activeAssessment && (
                          <div className="text-xs font-semibold text-slate-500 flex items-center gap-1.5">
                            <Sparkle className="w-3.5 h-3.5 text-emerald-600" />
                            <span>AI Calibrated</span>
                          </div>
                        )}
                      </div>

                      {activeAssessment ? (
                        <div className="space-y-4">
                          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/50">
                            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Clinical Summary</h4>
                            <p className="text-xs text-slate-700 leading-relaxed font-normal">
                              {activeAssessment.summary}
                            </p>
                          </div>

                          <div className="space-y-3">
                            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Key Wellness Insights</h4>
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                              {activeAssessment.keyInsights.slice(0, 3).map((insight, idx) => (
                                <div key={idx} className="p-3 bg-emerald-50/40 rounded-xl border border-emerald-100/60 flex gap-2">
                                  <div className="w-5 h-5 rounded-full bg-emerald-100/60 flex items-center justify-center text-emerald-800 text-[10px] font-bold shrink-0">
                                    {idx + 1}
                                  </div>
                                  <span className="text-[11px] text-slate-700 leading-relaxed font-medium">
                                    {insight}
                                  </span>
                                </div>
                              ))}
                            </div>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 border-t border-slate-100 pt-4">
                            <div>
                              <h5 className="text-xs font-bold text-slate-800 mb-2 flex items-center gap-1.5">
                                <Apple className="w-3.5 h-3.5 text-amber-600" />
                                <span>Dietary Adjustments</span>
                              </h5>
                              <ul className="space-y-1.5">
                                {activeAssessment.dietaryAdvice.slice(0, 3).map((item, i) => (
                                  <li key={i} className="text-[11px] text-slate-600 leading-snug flex items-start gap-1.5">
                                    <span className="text-emerald-500 font-bold shrink-0">▪</span>
                                    <span>{item}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>

                            <div>
                              <h5 className="text-xs font-bold text-slate-800 mb-2 flex items-center gap-1.5">
                                <Dumbbell className="w-3.5 h-3.5 text-emerald-600" />
                                <span>Physical Movement</span>
                              </h5>
                              <ul className="space-y-1.5">
                                {activeAssessment.exerciseAdvice.slice(0, 3).map((item, i) => (
                                  <li key={i} className="text-[11px] text-slate-600 leading-snug flex items-start gap-1.5">
                                    <span className="text-emerald-500 font-bold shrink-0">▪</span>
                                    <span>{item}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>

                            <div>
                              <h5 className="text-xs font-bold text-slate-800 mb-2 flex items-center gap-1.5">
                                <Stethoscope className="w-3.5 h-3.5 text-blue-600" />
                                <span>Preventive Screens</span>
                              </h5>
                              <ul className="space-y-1.5">
                                {activeAssessment.preventiveCare.slice(0, 3).map((item, i) => (
                                  <li key={i} className="text-[11px] text-slate-600 leading-snug flex items-start gap-1.5">
                                    <span className="text-emerald-500 font-bold shrink-0">▪</span>
                                    <span>{item}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="text-center py-10">
                          <div className="w-12 h-12 rounded-full bg-emerald-50 flex items-center justify-center mx-auto text-emerald-600 mb-3 border border-emerald-100">
                            <Brain className="w-6 h-6 animate-pulse" />
                          </div>
                          <h4 className="text-sm font-bold text-slate-800">Generate AI Health Scores</h4>
                          <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1 mb-4">
                            Your biometrics profile is loaded. Let our diagnostic model generate custom wellness scores and safe preventive care.
                          </p>
                          <button 
                            onClick={() => setActiveTab('assessment')}
                            className="bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold px-4 py-2.5 rounded-xl transition cursor-pointer"
                          >
                            Compile Clinical Analysis
                          </button>
                        </div>
                      )}
                    </div>

                    {/* Right block: Disease prevention center educational card */}
                    <div className="bg-white border border-slate-200/80 p-6 rounded-3xl shadow-sm flex flex-col justify-between">
                      <div>
                        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Preventive Care Academy</div>
                        <h3 className="text-base font-bold text-slate-900 mb-2">Disease Prevention Center</h3>
                        <p className="text-xs text-slate-500 mb-4 leading-relaxed">
                          Age is a significant vector in medical risk factors. Take preventive control of common wellness concerns early.
                        </p>

                        <div className="space-y-2.5">
                          <div className="p-3 bg-slate-50 border border-slate-200/40 rounded-xl">
                            <h4 className="text-xs font-bold text-slate-800 flex items-center justify-between">
                              <span>Obesity & Metabolic Care</span>
                              <span className="text-[9px] bg-amber-50 text-amber-700 px-1.5 rounded">Common</span>
                            </h4>
                            <p className="text-[10px] text-slate-500 mt-1 leading-snug">
                              Maintain a consistent caloric deficit and steady non-exercise activity thermogenesis (NEAT) such as steps.
                            </p>
                          </div>

                          <div className="p-3 bg-slate-50 border border-slate-200/40 rounded-xl">
                            <h4 className="text-xs font-bold text-slate-800 flex items-center justify-between">
                              <span>Skeletal Osteoporosis</span>
                              <span className="text-[9px] bg-blue-50 text-blue-700 px-1.5 rounded">Age 45+</span>
                            </h4>
                            <p className="text-[10px] text-slate-500 mt-1 leading-snug">
                              Prevent bone demineralization through resistance strength exercises and regular dietary calcium paired with D3.
                            </p>
                          </div>

                          <div className="p-3 bg-slate-50 border border-slate-200/40 rounded-xl">
                            <h4 className="text-xs font-bold text-slate-800 flex items-center justify-between">
                              <span>Endocrine Hypertension</span>
                              <span className="text-[9px] bg-rose-50 text-rose-700 px-1.5 rounded">Cardiac</span>
                            </h4>
                            <p className="text-[10px] text-slate-500 mt-1 leading-snug">
                              Support vessel flexibility by limiting high-sodium processed foods and maintaining high-potassium intake.
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="pt-4 border-t border-slate-100 mt-4">
                        <button 
                          onClick={() => {
                            setActiveTab('chat');
                            triggerToast("Consulting Clinical Assistant...");
                          }}
                          className="w-full text-center text-xs font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 py-2.5 rounded-xl border border-emerald-200/30 transition cursor-pointer"
                        >
                          Ask AI Assistant About Risk Prevention
                        </button>
                      </div>
                    </div>

                  </div>

                </div>
              )}

              {/* --- TAB 2: HEALTH ASSESSMENT QUESTIONNAIRE --- */}
              {activeTab === 'assessment' && (
                <div className="space-y-6">
                  
                  <div className="bg-white border border-slate-200/80 p-6 rounded-3xl shadow-sm">
                    <h2 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
                      <Stethoscope className="w-5 h-5 text-emerald-600" />
                      <span>AI Health Assessment & Score Card</span>
                    </h2>
                    <p className="text-xs text-slate-500 mt-1">
                      Our system reviews active family biometrics (Age, Gender, Weight, Height, Activity targets) and dynamically queries Gemini AI to formulate clinical metrics.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    
                    {/* Diagnostic profile snapshot & run controls */}
                    <div className="bg-white border border-slate-200/80 p-6 rounded-3xl shadow-sm space-y-4 h-fit">
                      <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2.5">Biometric Snapshot</h3>
                      
                      <div className="space-y-3">
                        <div className="flex justify-between text-xs">
                          <span className="text-slate-500">Patient Name:</span>
                          <span className="font-semibold text-slate-800">{activeProfile.name}</span>
                        </div>
                        <div className="flex justify-between text-xs">
                          <span className="text-slate-500">Demographic Stage:</span>
                          <span className="font-semibold text-slate-800">{activeAgeCategory} ({activeProfile.age} yrs)</span>
                        </div>
                        <div className="flex justify-between text-xs">
                          <span className="text-slate-500">Physical Markers:</span>
                          <span className="font-semibold text-slate-800">{activeProfile.height}cm, {activeProfile.weight}kg</span>
                        </div>
                        <div className="flex justify-between text-xs">
                          <span className="text-slate-500">Metabolic Status:</span>
                          <span className="font-semibold text-slate-800">{activeProfile.activityLevel}</span>
                        </div>
                        <div className="flex justify-between text-xs">
                          <span className="text-slate-500">Current Health Goal:</span>
                          <span className="font-semibold text-emerald-700 font-bold">{activeProfile.goals}</span>
                        </div>
                        <div className="flex justify-between text-xs">
                          <span className="text-slate-500">Lifestyle Conditions:</span>
                          <span className="font-semibold text-slate-800">{activeProfile.medicalConditions.join(", ")}</span>
                        </div>
                      </div>

                      <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/60 text-xs text-slate-600 leading-relaxed">
                        <span className="font-bold">Pediatric/Geriatric Compliance:</span> Recommendations adjust strictly for infants (developmental focus), children (high-nutrition support), and seniors (joint safety preservation).
                      </div>

                      {isAssessmentLoading ? (
                        <div className="space-y-2">
                          <div className="flex items-center justify-center gap-2 bg-slate-100 text-slate-600 font-semibold py-3 rounded-xl text-xs border border-slate-200">
                            <Loader2 className="w-4 h-4 animate-spin text-emerald-600" />
                            <span>Compiling medical records...</span>
                          </div>
                          <p className="text-[10px] text-center text-slate-400 italic">"Generating custom macronutrient limits & bone density exercises..."</p>
                        </div>
                      ) : (
                        <button 
                          onClick={runAiAssessment}
                          className="w-full bg-slate-900 hover:bg-slate-800 text-white font-semibold py-3 rounded-xl text-xs transition shadow-md shadow-slate-200 cursor-pointer flex items-center justify-center gap-2"
                        >
                          <Brain className="w-4 h-4 text-emerald-400" />
                          <span>Generate Clinical Assessment</span>
                        </button>
                      )}

                      {assessmentError && (
                        <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-[11px] text-rose-700 leading-normal">
                          <strong className="font-bold">Error:</strong> {assessmentError}
                        </div>
                      )}
                    </div>

                    {/* Left: Dynamic Scores and Reports */}
                    <div className="lg:col-span-2 space-y-6">
                      
                      {activeAssessment ? (
                        <div className="space-y-6">
                          
                          {/* Diagnostic Scores Gauge Wheels */}
                          <div className="bg-white border border-slate-200/80 p-6 rounded-3xl shadow-sm">
                            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">Calculated AI Indices</h3>
                            
                            <div className="grid grid-cols-3 gap-4 text-center">
                              
                              <div className="space-y-2">
                                <div className="relative mx-auto w-20 h-20 flex items-center justify-center">
                                  <svg className="absolute w-full h-full -rotate-90">
                                    <circle cx="40" cy="40" r="34" className="stroke-slate-100 fill-none" strokeWidth="6" />
                                    <circle cx="40" cy="40" r="34" className="stroke-emerald-600 fill-none" strokeWidth="6" 
                                      strokeDasharray={`${2 * Math.PI * 34}`} 
                                      strokeDashoffset={`${2 * Math.PI * 34 * (1 - activeAssessment.healthScore / 100)}`} 
                                      strokeLinecap="round"
                                    />
                                  </svg>
                                  <span className="text-xl font-extrabold text-slate-800 font-mono">{activeAssessment.healthScore}</span>
                                </div>
                                <div className="text-xs font-bold text-slate-700">Health Index</div>
                              </div>

                              <div className="space-y-2">
                                <div className="relative mx-auto w-20 h-20 flex items-center justify-center">
                                  <svg className="absolute w-full h-full -rotate-90">
                                    <circle cx="40" cy="40" r="34" className="stroke-slate-100 fill-none" strokeWidth="6" />
                                    <circle cx="40" cy="40" r="34" className="stroke-amber-500 fill-none" strokeWidth="6" 
                                      strokeDasharray={`${2 * Math.PI * 34}`} 
                                      strokeDashoffset={`${2 * Math.PI * 34 * (1 - activeAssessment.nutritionScore / 100)}`} 
                                      strokeLinecap="round"
                                    />
                                  </svg>
                                  <span className="text-xl font-extrabold text-slate-800 font-mono">{activeAssessment.nutritionScore}</span>
                                </div>
                                <div className="text-xs font-bold text-slate-700">Nutrition Index</div>
                              </div>

                              <div className="space-y-2">
                                <div className="relative mx-auto w-20 h-20 flex items-center justify-center">
                                  <svg className="absolute w-full h-full -rotate-90">
                                    <circle cx="40" cy="40" r="34" className="stroke-slate-100 fill-none" strokeWidth="6" />
                                    <circle cx="40" cy="40" r="34" className="stroke-blue-500 fill-none" strokeWidth="6" 
                                      strokeDasharray={`${2 * Math.PI * 34}`} 
                                      strokeDashoffset={`${2 * Math.PI * 34 * (1 - activeAssessment.fitnessScore / 100)}`} 
                                      strokeLinecap="round"
                                    />
                                  </svg>
                                  <span className="text-xl font-extrabold text-slate-800 font-mono">{activeAssessment.fitnessScore}</span>
                                </div>
                                <div className="text-xs font-bold text-slate-700">Fitness Index</div>
                              </div>

                            </div>
                          </div>

                          {/* Full Report Details Card */}
                          <div className="bg-white border border-slate-200/80 p-6 rounded-3xl shadow-sm space-y-6">
                            
                            <div>
                              <div className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider mb-1">Clinical Assessment Summary</div>
                              <p className="text-xs text-slate-700 leading-relaxed font-normal">
                                {activeAssessment.summary}
                              </p>
                            </div>

                            <div className="grid grid-cols-2 gap-4 border-t border-slate-100 pt-4">
                              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/50">
                                <span className="text-[10px] font-bold text-slate-400 block mb-0.5 uppercase tracking-wider">Ideal Weight Guidance</span>
                                <span className="text-sm font-extrabold text-slate-800">{activeAssessment.idealWeightRange}</span>
                              </div>
                              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/50">
                                <span className="text-[10px] font-bold text-slate-400 block mb-0.5 uppercase tracking-wider">Recommended Calorie Intake</span>
                                <span className="text-sm font-extrabold text-slate-800 font-mono">{activeAssessment.caloriesTarget} kcal / day</span>
                              </div>
                            </div>

                            <div className="space-y-4 border-t border-slate-100 pt-4">
                              
                              <div>
                                <h4 className="text-xs font-bold text-slate-800 flex items-center gap-1.5 mb-2.5">
                                  <Apple className="w-4 h-4 text-amber-500" />
                                  <span>Nutritional & Diet Recommendations</span>
                                </h4>
                                <ul className="space-y-2">
                                  {activeAssessment.dietaryAdvice.map((advice, i) => (
                                    <li key={i} className="text-xs text-slate-600 bg-amber-50/20 border border-amber-100/40 p-3 rounded-xl flex items-start gap-2.5">
                                      <span className="w-5 h-5 rounded-full bg-amber-100/50 text-amber-800 text-[10px] font-bold shrink-0 flex items-center justify-center">
                                        {i + 1}
                                      </span>
                                      <span className="leading-relaxed font-normal">{advice}</span>
                                    </li>
                                  ))}
                                </ul>
                              </div>

                              <div>
                                <h4 className="text-xs font-bold text-slate-800 flex items-center gap-1.5 mb-2.5">
                                  <Dumbbell className="w-4 h-4 text-emerald-600" />
                                  <span>Safe Movement & Exercise Routines</span>
                                </h4>
                                <ul className="space-y-2">
                                  {activeAssessment.exerciseAdvice.map((advice, i) => (
                                    <li key={i} className="text-xs text-slate-600 bg-emerald-50/20 border border-emerald-100/40 p-3 rounded-xl flex items-start gap-2.5">
                                      <span className="w-5 h-5 rounded-full bg-emerald-100/50 text-emerald-800 text-[10px] font-bold shrink-0 flex items-center justify-center">
                                        {i + 1}
                                      </span>
                                      <span className="leading-relaxed font-normal">{advice}</span>
                                    </li>
                                  ))}
                                </ul>
                              </div>

                              <div>
                                <h4 className="text-xs font-bold text-slate-800 flex items-center gap-1.5 mb-2.5">
                                  <Stethoscope className="w-4 h-4 text-blue-500" />
                                  <span>Age-Appropriate Preventive Care Checklist</span>
                                </h4>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                  {activeAssessment.preventiveCare.map((item, i) => (
                                    <div key={i} className="p-3 bg-blue-50/20 border border-blue-100/40 rounded-xl text-xs text-slate-600 flex gap-2">
                                      <span className="text-blue-500 font-extrabold shrink-0">✓</span>
                                      <span className="leading-snug">{item}</span>
                                    </div>
                                  ))}
                                </div>
                              </div>

                            </div>

                          </div>
                        </div>
                      ) : (
                        <div className="bg-white border border-slate-200/80 p-12 rounded-3xl shadow-sm text-center">
                          <div className="w-16 h-16 rounded-full bg-emerald-50 border border-emerald-100 flex items-center justify-center mx-auto text-emerald-600 mb-4 shadow-sm">
                            <Brain className="w-8 h-8 animate-pulse" />
                          </div>
                          <h3 className="text-lg font-bold text-slate-900">No Assessment Record Compiled Yet</h3>
                          <p className="text-xs text-slate-500 max-w-sm mx-auto mt-2 mb-6">
                            LifeSpanFit AI utilizes high-performance Gemini models to evaluate complex multi-marker wellness indicators. Compile your profile metrics today.
                          </p>
                          <button 
                            onClick={runAiAssessment}
                            className="bg-slate-900 hover:bg-slate-800 text-white font-medium px-6 py-3 rounded-xl text-xs transition cursor-pointer"
                          >
                            Compile {activeProfile.name}'s Records
                          </button>
                        </div>
                      )}

                    </div>

                  </div>

                </div>
              )}

              {/* --- TAB 3: DIETITIAN & RECIPES --- */}
              {activeTab === 'nutrition' && (() => {
                // local component static data to define the dynamic goal-calibrated meal menus
                const mealPlanDetails = {
                  loss: {
                    title: "Calorie Deficit Plan (Low Carbs & Low Fat)",
                    subtitle: "Engineered specifically to minimize carbohydrates and lipids to accelerate fat cell oxidation while protecting hard-earned muscular tissue.",
                    target: selectedEggPreference === 'with-eggs' 
                      ? "~1,500 kcal • 40% Protein • 25% Carbs • 35% Fats"
                      : "~1,440 kcal • 39% Protein • 26% Carbs • 35% Fats",
                    protein: selectedEggPreference === 'with-eggs' ? 150 : 141,
                    carbs: selectedEggPreference === 'with-eggs' ? 94 : 93,
                    fat: selectedEggPreference === 'with-eggs' ? 58 : 56,
                    note: selectedEggPreference === 'with-eggs'
                      ? "Perfect for weight management, leaning out, or metabolic resets."
                      : "Egg-free variation using tofu and light cottage cheese to maintain low-glycemic, calorie-restricted goals.",
                    meals: selectedEggPreference === 'with-eggs' ? [
                      { type: "Breakfast", name: "Baked Avocado & Egg White Soufflé with Spinach", cal: 320, protein: 24, carbs: 8, fat: 12 },
                      { type: "Lunch", name: "Herb Grilled Lemon Sole with Asparagus & Baby Kale Salad", cal: 390, protein: 42, carbs: 12, fat: 10 },
                      { type: "Dinner", name: "Rosemary Roasted Turkey Breast over Steamed Cauliflower Rice", cal: 450, protein: 48, carbs: 15, fat: 11 },
                      { type: "Snack", name: "Organic Low-Fat Greek Yogurt with Fresh Raspberries", cal: 180, protein: 20, carbs: 10, fat: 1 }
                    ] : [
                      { type: "Breakfast", name: "Sautéed Baby Spinach & Turmeric Tofu Scramble", cal: 260, protein: 22, carbs: 9, fat: 11 },
                      { type: "Lunch", name: "Herb Grilled Lemon Sole with Asparagus & Baby Kale Salad", cal: 390, protein: 42, carbs: 12, fat: 10 },
                      { type: "Dinner", name: "Rosemary Roasted Turkey Breast over Steamed Cauliflower Rice", cal: 450, protein: 48, carbs: 15, fat: 11 },
                      { type: "Snack", name: "Low-Fat Cottage Cheese with Fresh Blueberries & Flax Seeds", cal: 190, protein: 19, carbs: 12, fat: 2 }
                    ]
                  },
                  gain: {
                    title: "Somatic Mass Plan (High Carbs & High Protein)",
                    subtitle: "Formulated with massive quantities of clean complex carbs to saturate muscular glycogen stores and high protein ratios to construct body mass.",
                    target: selectedEggPreference === 'with-eggs'
                      ? "~3,510 kcal • 30% Protein • 45% Carbs • 25% Fats"
                      : "~3,200 kcal • 30% Protein • 45% Carbs • 25% Fats",
                    protein: selectedEggPreference === 'with-eggs' ? 263 : 240,
                    carbs: selectedEggPreference === 'with-eggs' ? 395 : 360,
                    fat: selectedEggPreference === 'with-eggs' ? 97 : 88,
                    note: selectedEggPreference === 'with-eggs'
                      ? "Optimal for weight gain, athletic hypertrophy, and growing kids."
                      : "Egg-free variation utilizing oats, whey/plant proteins, and nuts/avocados to satisfy high-caloric hypertrophy demands safely.",
                    meals: selectedEggPreference === 'with-eggs' ? [
                      { type: "Breakfast", name: "Power Protein Nutty Oats with Whole Scrambled Eggs & Honey", cal: 750, protein: 48, carbs: 80, fat: 22 },
                      { type: "Lunch", name: "Triple Grilled Chicken Breast over Cilantro Quinoa & Avocado", cal: 850, protein: 60, carbs: 95, fat: 22 },
                      { type: "Dinner", name: "Wild Seared Salmon Fillet with Baked Sweet Potato & Asparagus", cal: 920, protein: 65, carbs: 110, fat: 26 },
                      { type: "Snack", name: "Hard-Boiled Organic Eggs & Almond Butter Rice Cakes", cal: 440, protein: 28, carbs: 35, fat: 18 }
                    ] : [
                      { type: "Breakfast", name: "Power Protein Nutty Oats with Hemp Seeds, Real Honey & Whey", cal: 720, protein: 45, carbs: 85, fat: 20 },
                      { type: "Lunch", name: "Triple Grilled Chicken Breast over Cilantro Quinoa & Avocado", cal: 850, protein: 60, carbs: 95, fat: 22 },
                      { type: "Dinner", name: "Wild Seared Salmon Fillet with Baked Sweet Potato & Asparagus", cal: 920, protein: 65, carbs: 110, fat: 26 },
                      { type: "Snack", name: "Peanut Butter, Oat Milk & Banana Cream Gainer Shake", cal: 480, protein: 30, carbs: 60, fat: 15 }
                    ]
                  },
                  keto: {
                    title: "Keto Anti-Inflammatory (Low Carb / High Joint-Fat)",
                    subtitle: "Designed to lower glycemic load and promote nutritional ketosis to reduce joint stiffness and foster steady neural focus.",
                    target: selectedEggPreference === 'with-eggs'
                      ? "~1,900 kcal • 25% Protein • 5% Carbs • 70% Fats"
                      : "~1,830 kcal • 24% Protein • 5% Carbs • 71% Fats",
                    protein: selectedEggPreference === 'with-eggs' ? 118 : 104,
                    carbs: selectedEggPreference === 'with-eggs' ? 24 : 19,
                    fat: selectedEggPreference === 'with-eggs' ? 147 : 147,
                    note: selectedEggPreference === 'with-eggs'
                      ? "Highly anti-inflammatory, great for seniors and neural clarity."
                      : "Egg-free ketogenic alternative substituting traditional scrambled breakfast eggs with smoked salmon, avocados, and raw macadamia nuts.",
                    meals: selectedEggPreference === 'with-eggs' ? [
                      { type: "Breakfast", name: "Sautéed Spinach & Organic Eggs Scrambled in Grass-Fed Butter", cal: 420, protein: 26, carbs: 3, fat: 34 },
                      { type: "Lunch", name: "Mediterranean Sardine Salad with Extra Virgin Olive Oil & Walnuts", cal: 520, protein: 34, carbs: 5, fat: 40 },
                      { type: "Dinner", name: "Slow-Braised Garlic Beef Chuck Roast with Pan-Seared Zucchini", cal: 680, protein: 44, carbs: 7, fat: 52 },
                      { type: "Snack", name: "Deviled Eggs with Avocado Mayo & Cayenne Pepper", cal: 240, protein: 13, carbs: 2, fat: 20 }
                    ] : [
                      { type: "Breakfast", name: "Seared Avocado & Smoked Salmon over Asparagus Spears", cal: 410, protein: 22, carbs: 4, fat: 33 },
                      { type: "Lunch", name: "Mediterranean Sardine Salad with Extra Virgin Olive Oil & Walnuts", cal: 520, protein: 34, carbs: 5, fat: 40 },
                      { type: "Dinner", name: "Slow-Braised Garlic Beef Chuck Roast with Pan-Seared Zucchini", cal: 680, protein: 44, carbs: 7, fat: 52 },
                      { type: "Snack", name: "Handful of Lightly Salted Raw Macadamia Nuts", cal: 220, protein: 4, carbs: 3, fat: 22 }
                    ]
                  },
                  vegan: {
                    title: "Plant-Powered Vitality (High-Fiber & Complex Carbs)",
                    subtitle: "Saturated with heart-healthy polyphenols, micronutrients, and high fiber content to cultivate a thriving gut microbiome.",
                    target: "~2,100 kcal • 20% Protein • 55% Carbs • 25% Fats",
                    protein: 105,
                    carbs: 288,
                    fat: 58,
                    note: "100% dairy-free, allergen-safe, high endurance clean fuel. Plant-based is inherently egg-free.",
                    meals: [
                      { type: "Breakfast", name: "Mixed Berry & Organic Chia Seeds with Warm Coconut Milk", cal: 360, protein: 12, carbs: 45, fat: 14 },
                      { type: "Lunch", name: "Spiced Chickpea & French Lentil Buddha Bowl with Avocado", cal: 620, protein: 28, carbs: 82, fat: 16 },
                      { type: "Dinner", name: "Crispy Grilled Sesame Tempeh over Steamed Jasmine Rice & Peas", cal: 740, protein: 36, carbs: 98, fat: 18 },
                      { type: "Snack", name: "Organic Peanut Butter Slathered on Crispy Apple Slices", cal: 260, protein: 8, carbs: 28, fat: 12 }
                    ]
                  }
                };

                const currentPlan = mealPlanDetails[selectedMealPlanTab];

                const logEntireMealPlan = (planKey: 'loss' | 'gain' | 'keto' | 'vegan') => {
                  const plan = mealPlanDetails[planKey];
                  const todayStr = getTodayDateString();
                  const currentList = trackerHistory[activeProfile.id] || [];
                  const todayIndex = currentList.findIndex(t => t.date === todayStr);
                  let todayObj = todayIndex !== -1 ? currentList[todayIndex] : getTodayTracker();
                  
                  const loggedMealsToAdd = plan.meals.map((m, idx) => ({
                    id: `ml-auto-${Date.now()}-${idx}`,
                    mealType: m.type as any,
                    name: m.name,
                    calories: m.cal,
                    protein: m.protein,
                    carbs: m.carbs,
                    fat: m.fat
                  }));
                  
                  const updatedMeals = [...(todayObj.mealsLogged || []), ...loggedMealsToAdd];
                  const totalCals = updatedMeals.reduce((acc, curr) => acc + curr.calories, 0);
                  
                  let updatedList = [...currentList];
                  if (todayIndex !== -1) {
                    updatedList[todayIndex] = { ...todayObj, mealsLogged: updatedMeals, caloriesConsumed: totalCals };
                  } else {
                    updatedList.push({
                      ...todayObj,
                      date: todayStr,
                      mealsLogged: updatedMeals,
                      caloriesConsumed: totalCals
                    });
                  }
                  setTrackerHistory(prev => ({ ...prev, [activeProfile.id]: updatedList }));
                  triggerToast(`Logged all 4 meals of the "${plan.title}" instantly for today!`);
                };

                return (
                  <div className="space-y-6">
                    
                    <div className="bg-white border border-slate-200/80 p-6 rounded-3xl shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div>
                        <h2 className="text-xl font-bold text-slate-900 tracking-tight">AI Nutritionist & Meal Planning</h2>
                        <p className="text-xs text-slate-500 mt-1">
                          Age-specific solid-introduction (infants), high-protein (athletes), or easy-digestible guidelines (seniors) calibrated for **{activeProfile.dietPreference}** lifestyles.
                        </p>
                      </div>
                      <div className="bg-slate-100 text-slate-700 px-3 py-1 text-xs rounded-xl font-bold border border-slate-200">
                        Preference: {activeProfile.dietPreference}
                      </div>
                    </div>

                    {/* NEW CUSTOM GOAL-CALIBRATED MEAL MENUS SECTION */}
                    <div className="bg-white border border-slate-200/80 p-6 rounded-3xl shadow-sm space-y-6">
                      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-100 pb-4">
                        <div>
                          <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-wider font-mono">Calorie-Calibrated Meal Menus</span>
                          <h3 className="text-base font-bold text-slate-900 mt-0.5">Custom Diet Plans & Macro Targets</h3>
                        </div>
                        
                        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                          {/* Eggs vs Non-Eggs Preference Switch */}
                          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-2xl border border-slate-200/40">
                            <button
                              onClick={() => setSelectedEggPreference('with-eggs')}
                              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1 cursor-pointer ${
                                selectedEggPreference === 'with-eggs'
                                  ? 'bg-white text-amber-700 shadow-sm border border-amber-200/30'
                                  : 'text-slate-500 hover:text-slate-800'
                              }`}
                            >
                              <span>🍳 Eggs</span>
                            </button>
                            <button
                              onClick={() => setSelectedEggPreference('egg-free')}
                              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1 cursor-pointer ${
                                selectedEggPreference === 'egg-free'
                                  ? 'bg-white text-emerald-700 shadow-sm border border-emerald-200/30'
                                  : 'text-slate-500 hover:text-slate-800'
                              }`}
                            >
                              <span>🍃 Non-Eggs</span>
                            </button>
                          </div>

                          {/* Selector Tabs for Meal Plans */}
                          <div className="flex flex-wrap gap-1 bg-slate-50 p-1 rounded-2xl border border-slate-200/60 max-w-fit">
                            <button
                              onClick={() => setSelectedMealPlanTab('loss')}
                              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                                selectedMealPlanTab === 'loss' 
                                  ? 'bg-emerald-600 text-white shadow-sm' 
                                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
                              }`}
                            >
                              Weight Loss
                            </button>
                            <button
                              onClick={() => setSelectedMealPlanTab('gain')}
                              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                                selectedMealPlanTab === 'gain' 
                                  ? 'bg-emerald-600 text-white shadow-sm' 
                                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
                              }`}
                            >
                              Weight Gain
                            </button>
                            <button
                              onClick={() => setSelectedMealPlanTab('keto')}
                              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                                selectedMealPlanTab === 'keto' 
                                  ? 'bg-emerald-600 text-white shadow-sm' 
                                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
                              }`}
                            >
                              Anti-Inflam Keto
                            </button>
                            <button
                              onClick={() => setSelectedMealPlanTab('vegan')}
                              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                                selectedMealPlanTab === 'vegan' 
                                  ? 'bg-emerald-600 text-white shadow-sm' 
                                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
                              }`}
                            >
                              Pure Vegan
                            </button>
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                        {/* Selected plan specifications */}
                        <div className="lg:col-span-4 bg-slate-50 rounded-2xl border border-slate-200/80 p-5 space-y-4">
                          <div className="space-y-1">
                            <span className="text-[10px] font-bold text-slate-400 uppercase font-mono tracking-wider">Plan Directive</span>
                            <h4 className="text-sm font-bold text-slate-950">{currentPlan.title}</h4>
                            <p className="text-xs text-slate-500 leading-relaxed font-normal mt-1.5">
                              {currentPlan.subtitle}
                            </p>
                          </div>

                          <div className="bg-white border border-slate-200/60 p-3 rounded-xl">
                            <span className="text-[10px] font-bold text-slate-400 uppercase font-mono block">Macro Breakdown Targets</span>
                            <div className="text-xs font-extrabold text-slate-800 mt-1">{currentPlan.target}</div>
                            
                            {/* Graphic representation bar of macros */}
                            <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden mt-3 flex">
                              <div style={{ width: selectedMealPlanTab === 'loss' ? '40%' : selectedMealPlanTab === 'gain' ? '30%' : selectedMealPlanTab === 'keto' ? '25%' : '20%' }} className="bg-blue-500 h-full"></div>
                              <div style={{ width: selectedMealPlanTab === 'loss' ? '25%' : selectedMealPlanTab === 'gain' ? '45%' : selectedMealPlanTab === 'keto' ? '5%' : '55%' }} className="bg-amber-500 h-full"></div>
                              <div style={{ width: selectedMealPlanTab === 'loss' ? '35%' : selectedMealPlanTab === 'gain' ? '25%' : selectedMealPlanTab === 'keto' ? '70%' : '25%' }} className="bg-pink-500 h-full"></div>
                            </div>
                            <div className="flex justify-between items-center text-[9px] text-slate-400 mt-1.5 font-semibold">
                              <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span> P: {currentPlan.protein}g</span>
                              <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span> C: {currentPlan.carbs}g</span>
                              <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-pink-500"></span> F: {currentPlan.fat}g</span>
                            </div>
                          </div>

                          <div className="bg-emerald-50/50 border border-emerald-100 p-3.5 rounded-xl">
                            <span className="text-[9px] font-bold text-emerald-800 uppercase font-mono block tracking-wider">Coaching Insight</span>
                            <p className="text-[11px] text-emerald-700 font-normal mt-1 leading-relaxed">
                              {currentPlan.note}
                            </p>
                          </div>

                          <button
                            onClick={() => logEntireMealPlan(selectedMealPlanTab)}
                            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2.5 rounded-xl text-xs transition cursor-pointer flex items-center justify-center gap-1.5 shadow-sm"
                          >
                            <CheckCircle2 className="w-4 h-4" />
                            Log Meal Plan Eaten Today
                          </button>
                        </div>

                        {/* Interactive Meal List cards */}
                        <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
                          {currentPlan.meals.map((meal, index) => {
                            const hasEgg = meal.name.toLowerCase().includes('egg');
                            return (
                              <div key={index} className="bg-white border border-slate-200/60 p-4 rounded-2xl shadow-sm hover:border-slate-300 transition-all flex flex-col justify-between">
                                <div className="space-y-1.5">
                                  <div className="flex items-center justify-between">
                                    <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-100">
                                      {meal.type}
                                    </span>
                                    <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full flex items-center gap-1 ${
                                      hasEgg 
                                        ? 'bg-amber-50 text-amber-800 border border-amber-200/50' 
                                        : 'bg-emerald-50 text-emerald-800 border border-emerald-200/50'
                                    }`}>
                                      {hasEgg ? '🍳 Eggs Included' : '🍃 Egg-Free (Non-Eggs)'}
                                    </span>
                                  </div>
                                  <h4 className="text-xs font-bold text-slate-900 line-clamp-2 mt-1">{meal.name}</h4>
                                </div>

                                <div className="mt-4 pt-3 border-t border-slate-100 flex justify-between items-center">
                                  <div className="space-y-0.5">
                                    <span className="text-[9px] text-slate-400 font-medium font-mono uppercase block">Nutrients</span>
                                    <div className="text-[10px] font-bold text-slate-600">
                                      P: <span className="text-slate-800">{meal.protein}g</span> • C: <span className="text-slate-800">{meal.carbs}g</span> • F: <span className="text-slate-800">{meal.fat}g</span>
                                    </div>
                                  </div>
                                  <span className="font-mono text-sm font-extrabold text-slate-900">{meal.cal} kcal</span>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    
                    {/* Log custom meal eaten */}
                    <div className="bg-white border border-slate-200/80 p-6 rounded-3xl shadow-sm space-y-4 h-fit">
                      <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2">Log Daily Food Intake</h3>
                      
                      <form onSubmit={handleAddMeal} className="space-y-3">
                        <div>
                          <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Meal Name</label>
                          <input 
                            type="text" 
                            required
                            placeholder="e.g. Scrambled eggs, Greek yogurt bowl"
                            value={mealLogName}
                            onChange={e => setMealLogName(e.target.value)}
                            className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-1 focus:ring-emerald-500"
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Meal Period</label>
                            <select 
                              value={mealLogType}
                              onChange={e => setMealLogType(e.target.value as any)}
                              className="w-full px-3 py-2 bg-white rounded-xl border border-slate-200 text-xs focus:outline-none"
                            >
                              <option value="Breakfast">Breakfast</option>
                              <option value="Lunch">Lunch</option>
                              <option value="Dinner">Dinner</option>
                              <option value="Snack">Snack</option>
                            </select>
                          </div>
                          <div>
                            <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Calories (kcal)</label>
                            <input 
                              type="number" 
                              required
                              value={mealLogCal}
                              onChange={e => setMealLogCal(Number(e.target.value))}
                              className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-3 gap-1.5 border-t border-slate-100 pt-3">
                          <div>
                            <label className="block text-[9px] font-bold text-slate-400 uppercase text-center">Protein (g)</label>
                            <input 
                              type="number" 
                              value={mealLogProt}
                              onChange={e => setMealLogProt(Number(e.target.value))}
                              className="w-full text-center px-1 py-1 border border-slate-200 rounded text-xs"
                            />
                          </div>
                          <div>
                            <label className="block text-[9px] font-bold text-slate-400 uppercase text-center">Carbs (g)</label>
                            <input 
                              type="number" 
                              value={mealLogCarb}
                              onChange={e => setMealLogCarb(Number(e.target.value))}
                              className="w-full text-center px-1 py-1 border border-slate-200 rounded text-xs"
                            />
                          </div>
                          <div>
                            <label className="block text-[9px] font-bold text-slate-400 uppercase text-center">Fat (g)</label>
                            <input 
                              type="number" 
                              value={mealLogFat}
                              onChange={e => setMealLogFat(Number(e.target.value))}
                              className="w-full text-center px-1 py-1 border border-slate-200 rounded text-xs"
                            />
                          </div>
                        </div>

                        <button 
                          type="submit"
                          className="w-full bg-slate-950 text-white font-bold py-2.5 rounded-xl text-xs mt-2 hover:bg-slate-800 transition cursor-pointer"
                        >
                          Save Meal Entry
                        </button>
                      </form>
                    </div>

                    {/* Today's Logged Meals & Recipe Library */}
                    <div className="lg:col-span-2 space-y-6">
                      
                      {/* Logged meals list for today */}
                      <div className="bg-white border border-slate-200/80 p-6 rounded-3xl shadow-sm">
                        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">Today's Logged Meals</h3>
                        
                        {getTodayTracker().mealsLogged?.length > 0 ? (
                          <div className="space-y-2.5 max-h-60 overflow-y-auto pr-1">
                            {getTodayTracker().mealsLogged.map((meal) => (
                              <div key={meal.id} className="p-3 bg-slate-50 border border-slate-200/50 rounded-xl flex items-center justify-between gap-4">
                                <div>
                                  <div className="flex items-center gap-2">
                                    <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-2 py-0.2 rounded">
                                      {meal.mealType}
                                    </span>
                                    <h4 className="text-xs font-bold text-slate-800">{meal.name}</h4>
                                  </div>
                                  <p className="text-[10px] text-slate-400 mt-1">
                                    P: <span className="font-semibold text-slate-600">{meal.protein}g</span> • 
                                    C: <span className="font-semibold text-slate-600">{meal.carbs}g</span> • 
                                    F: <span className="font-semibold text-slate-600">{meal.fat}g</span>
                                  </p>
                                </div>
                                <div className="flex items-center gap-3">
                                  <span className="font-mono text-xs font-extrabold text-slate-800">{meal.calories} kcal</span>
                                  <button 
                                    onClick={() => handleDeleteMeal(meal.id)}
                                    className="p-1 text-rose-500 hover:bg-rose-50 rounded-lg cursor-pointer"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              </div>
                            ))}

                            {/* Macro totals summation banner */}
                            <div className="p-3 border-t border-dashed border-slate-200 text-[10px] text-slate-500 flex justify-between">
                              <span>Consumed Total today:</span>
                              <span className="font-bold text-slate-800">
                                {getTodayTracker().mealsLogged.reduce((acc, c) => acc + c.calories, 0)} kcal •{' '}
                                {getTodayTracker().mealsLogged.reduce((acc, c) => acc + c.protein, 0)}g Protein
                              </span>
                            </div>
                          </div>
                        ) : (
                          <div className="text-center py-6 text-xs text-slate-400 italic">
                            No food items logged for today.
                          </div>
                        )}
                      </div>

                      {/* Recipe Library for current stage */}
                      <div className="bg-white border border-slate-200/80 p-6 rounded-3xl shadow-sm">
                        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Age Stage Food Recommendations</h3>
                        <p className="text-[11px] text-slate-500 mb-4">Healthy, balanced recipes custom calibrated for **{activeAgeCategory}** stage.</p>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                          {(RECIPIES_LIBRARY[activeAgeCategory as keyof typeof RECIPIES_LIBRARY] || RECIPIES_LIBRARY['Young Adults']).map((recipe, idx) => (
                            <div key={idx} className="p-4 bg-slate-50 border border-slate-200/60 rounded-2xl flex flex-col justify-between space-y-3">
                              <div>
                                <h4 className="text-xs font-bold text-slate-800">{recipe.name}</h4>
                                <span className="text-[10px] font-mono font-medium text-emerald-700 block mt-1">{recipe.macro}</span>
                                <p className="text-[10px] text-slate-500 mt-2 leading-relaxed font-normal">
                                  {recipe.notes}
                                </p>
                              </div>
                              <div className="border-t border-slate-200/40 pt-2 flex items-center justify-between">
                                <span className="font-mono text-[10px] font-bold text-slate-700">{recipe.cal} kcal</span>
                                <button 
                                  onClick={() => {
                                    const parsedMacros = recipe.macro.split(',').map(m => Number(m.trim().replace(/[^0-9.]/g, '')));
                                    const mockMeal: MealLog = {
                                      id: 'ml-' + Date.now() + idx,
                                      mealType: 'Breakfast',
                                      name: recipe.name,
                                      calories: recipe.cal,
                                      protein: parsedMacros[1] || 10,
                                      carbs: parsedMacros[0] || 30,
                                      fat: parsedMacros[2] || 8
                                    };
                                    // Add to logged meals
                                    const todayStr = getTodayDateString();
                                    const currentList = trackerHistory[activeProfile.id] || [];
                                    const todayIndex = currentList.findIndex(t => t.date === todayStr);
                                    let todayObj = todayIndex !== -1 ? currentList[todayIndex] : getTodayTracker();
                                    const updatedMeals = [...(todayObj.mealsLogged || []), mockMeal];
                                    const totalCals = updatedMeals.reduce((acc, curr) => acc + curr.calories, 0);

                                    let updatedList = [...currentList];
                                    if (todayIndex !== -1) {
                                      updatedList[todayIndex] = { ...todayObj, mealsLogged: updatedMeals, caloriesConsumed: totalCals };
                                    } else {
                                      updatedList.unshift({ ...todayObj, mealsLogged: updatedMeals, caloriesConsumed: totalCals });
                                    }
                                    setTrackerHistory(prev => ({ ...prev, [activeProfile.id]: updatedList }));
                                    triggerToast(`Logged recipe: ${recipe.name}!`);
                                  }}
                                  className="text-[10px] font-bold text-emerald-700 hover:bg-emerald-50 px-2 py-1 rounded border border-emerald-200/50 cursor-pointer"
                                >
                                  Log Eaten
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                    </div>

                  </div>

                </div>
              );
            })()}

              {/* --- TAB 4: FITNESS & TRAINER --- */}
              {activeTab === 'fitness' && (
                <div className="space-y-6">
                  
                  <div className="bg-white border border-slate-200/80 p-6 rounded-3xl shadow-sm">
                    <h2 className="text-xl font-bold text-slate-900 tracking-tight">AI Physical Fitness & Trainer</h2>
                    <p className="text-xs text-slate-500 mt-1">
                      Safe cardiovascular, mobility, and resistance guidelines programmed specifically for **{activeAgeCategory}** ({activeProfile.age} yrs old).
                    </p>
                  </div>

                  {/* INTERACTIVE 3D-LIKE BODY SCANNER & PROPORTIONS TUNER */}
                  <div className="bg-slate-900 text-slate-100 rounded-3xl border border-slate-800 p-6 shadow-xl relative overflow-hidden">
                    {/* Glowing grid background for holographic look */}
                    <div className="absolute inset-0 opacity-[0.03] bg-[linear-gradient(to_right,#808080_1px,transparent_1px),linear-gradient(to_bottom,#808080_1px,transparent_1px)] bg-[size:14px_24px]"></div>
                    
                    <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8">
                      {/* Left Side: Sci-Fi 3D Hologram Avatar */}
                      <div className="lg:col-span-5 flex flex-col items-center justify-center bg-slate-950/80 rounded-2xl border border-slate-800 p-6 relative min-h-[360px] overflow-hidden">
                        <div className="absolute top-4 left-4 text-[10px] font-mono text-emerald-400 flex items-center gap-1.5 uppercase tracking-wider">
                          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                          Holographic Scanner V3.5
                        </div>
                        
                        {/* Circular Rotating Hologram Scanners */}
                        <div className="absolute w-72 h-72 border border-dashed border-slate-800/60 rounded-full animate-[spin_40s_linear_infinite]"></div>
                        <div className="absolute w-52 h-52 border border-dashed border-emerald-500/20 rounded-full animate-[spin_20s_linear_infinite_reverse]"></div>
                        <div className="absolute w-36 h-36 border border-slate-800/40 rounded-full"></div>
                        
                        {/* Interactive Responsive Avatar Outline */}
                        <div className="relative w-48 h-72 flex items-center justify-center">
                          <svg viewBox="0 0 100 180" className="w-full h-full text-slate-800 filter drop-shadow-[0_0_15px_rgba(16,185,129,0.15)] transition-all duration-300">
                            {/* Scanning horizontal line */}
                            <line x1="0" y1="10" x2="100" y2="10" stroke="rgba(16,185,129,0.3)" strokeWidth="1.5" className="animate-[bounce_3s_infinite]" />
                            
                            {/* Head */}
                            <circle cx="50" cy="22" r="14" fill="none" stroke="#10b981" strokeWidth="1.5" />
                            <circle cx="50" cy="22" r="10" className="opacity-40" fill="rgba(16,185,129,0.1)" />
                            
                            {/* Neck */}
                            <line x1="50" y1="36" x2="50" y2="42" stroke="#10b981" strokeWidth="2" />
                            
                            {/* Chest Outline (scales with chest measurement) */}
                            <ellipse 
                              cx="50" 
                              cy="58" 
                              rx={Math.max(12, Math.min(28, (activeProfile.chest || 95) * 0.2))} 
                              ry="15" 
                              fill="rgba(16,185,129,0.15)" 
                              stroke="#10b981" 
                              strokeWidth="1.5" 
                              className="transition-all duration-300"
                            />
                            
                            {/* Waist Outline (scales with waist measurement) */}
                            <ellipse 
                              cx="50" 
                              cy="85" 
                              rx={Math.max(10, Math.min(26, (activeProfile.waist || 80) * 0.2))} 
                              ry="11" 
                              fill="rgba(16,185,129,0.2)" 
                              stroke="#10b981" 
                              strokeWidth="1.5" 
                              className="transition-all duration-300"
                            />
                            
                            {/* Hips Outline (scales with hips measurement) */}
                            <ellipse 
                              cx="50" 
                              cy="110" 
                              rx={Math.max(12, Math.min(28, (activeProfile.hips || 95) * 0.25))} 
                              ry="14" 
                              fill="rgba(16,185,129,0.15)" 
                              stroke="#10b981" 
                              strokeWidth="1.5" 
                              className="transition-all duration-300"
                            />

                            {/* Spine center line */}
                            <line x1="50" y1="42" x2="50" y2="124" stroke="rgba(16,185,129,0.25)" strokeWidth="1" strokeDasharray="2 2" />

                            {/* Shoulders & Arms */}
                            <path d="M 32 46 Q 24 60 22 88" fill="none" stroke="#10b981" strokeWidth="1" />
                            <path d="M 68 46 Q 76 60 78 88" fill="none" stroke="#10b981" strokeWidth="1" />
                            
                            {/* Legs */}
                            <path d="M 38 124 L 34 170" fill="none" stroke="#10b981" strokeWidth="1.5" />
                            <path d="M 62 124 L 66 170" fill="none" stroke="#10b981" strokeWidth="1.5" />

                            {/* Pulsing Target Hotspots */}
                            {/* Chest Hotspot */}
                            <g className="cursor-pointer group">
                              <circle cx="50" cy="58" r="4" fill="#ef4444" className="animate-ping opacity-75" />
                              <circle cx="50" cy="58" r="3" fill="#ef4444" />
                            </g>
                            
                            {/* Waist Hotspot */}
                            <g className="cursor-pointer group">
                              <circle cx="50" cy="85" r="4" fill="#3b82f6" className="animate-ping opacity-75" />
                              <circle cx="50" cy="85" r="3" fill="#3b82f6" />
                            </g>

                            {/* Hips Hotspot */}
                            <g className="cursor-pointer group">
                              <circle cx="50" cy="110" r="4" fill="#f59e0b" className="animate-ping opacity-75" />
                              <circle cx="50" cy="110" r="3" fill="#f59e0b" />
                            </g>
                          </svg>

                          {/* Float visual tags */}
                          <div className="absolute top-[85px] left-[-30px] bg-slate-900/90 border border-slate-800 text-[10px] text-emerald-400 font-mono px-1.5 py-0.5 rounded shadow">
                            CHEST: {activeProfile.chest || 95}cm
                          </div>
                          <div className="absolute top-[140px] right-[-30px] bg-slate-900/90 border border-slate-800 text-[10px] text-blue-400 font-mono px-1.5 py-0.5 rounded shadow">
                            WAIST: {activeProfile.waist || 80}cm
                          </div>
                          <div className="absolute top-[185px] left-[-30px] bg-slate-900/90 border border-slate-800 text-[10px] text-amber-400 font-mono px-1.5 py-0.5 rounded shadow">
                            HIPS: {activeProfile.hips || 95}cm
                          </div>
                        </div>

                        {/* Scanner feedback footer */}
                        <div className="mt-4 text-center">
                          <span className="text-[10px] font-mono text-slate-500 uppercase">Estimated body classification:</span>
                          <div className="text-sm font-bold text-slate-200 mt-0.5">{activeProfile.bodyType || 'Mesomorph'} Proportions</div>
                        </div>
                      </div>

                      {/* Right Side: Proportions Tuner controls */}
                      <div className="lg:col-span-7 space-y-5">
                        <div>
                          <div className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider mb-0.5 font-mono">Biometric Diagnostics</div>
                          <h3 className="text-lg font-bold text-white tracking-tight">Interactive Proportions Tuner</h3>
                          <p className="text-xs text-slate-400 mt-1">
                            Adjust measurements below to watch your scanning outline adapt. This details how skeleton ratios affect metabolic pacing.
                          </p>
                        </div>

                        {/* Sliders Grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-950/40 p-4 rounded-2xl border border-slate-850">
                          {/* Chest Slider */}
                          <div className="space-y-1.5">
                            <div className="flex justify-between items-center">
                              <label className="text-[10px] font-bold text-slate-400 uppercase font-mono">Chest Circumference</label>
                              <span className="text-xs font-mono font-bold text-emerald-400">{activeProfile.chest || 95} cm</span>
                            </div>
                            <input 
                              type="range"
                              min="60"
                              max="140"
                              value={activeProfile.chest || 95}
                              onChange={(e) => updateProfileMeasurement('chest', Number(e.target.value))}
                              className="w-full accent-emerald-500 h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer"
                            />
                          </div>

                          {/* Waist Slider */}
                          <div className="space-y-1.5">
                            <div className="flex justify-between items-center">
                              <label className="text-[10px] font-bold text-slate-400 uppercase font-mono">Waist Circumference</label>
                              <span className="text-xs font-mono font-bold text-blue-400">{activeProfile.waist || 80} cm</span>
                            </div>
                            <input 
                              type="range"
                              min="40"
                              max="130"
                              value={activeProfile.waist || 80}
                              onChange={(e) => updateProfileMeasurement('waist', Number(e.target.value))}
                              className="w-full accent-blue-500 h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer"
                            />
                          </div>

                          {/* Hips Slider */}
                          <div className="space-y-1.5">
                            <div className="flex justify-between items-center">
                              <label className="text-[10px] font-bold text-slate-400 uppercase font-mono">Hips Circumference</label>
                              <span className="text-xs font-mono font-bold text-amber-400">{activeProfile.hips || 95} cm</span>
                            </div>
                            <input 
                              type="range"
                              min="60"
                              max="140"
                              value={activeProfile.hips || 95}
                              onChange={(e) => updateProfileMeasurement('hips', Number(e.target.value))}
                              className="w-full accent-amber-500 h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer"
                            />
                          </div>

                          {/* Body Fat Slider */}
                          <div className="space-y-1.5">
                            <div className="flex justify-between items-center">
                              <label className="text-[10px] font-bold text-slate-400 uppercase font-mono">Body Fat Percentage</label>
                              <span className="text-xs font-mono font-bold text-pink-400">{activeProfile.bodyFat || 18}%</span>
                            </div>
                            <input 
                              type="range"
                              min="4"
                              max="45"
                              value={activeProfile.bodyFat || 18}
                              onChange={(e) => updateProfileMeasurement('bodyFat', Number(e.target.value))}
                              className="w-full accent-pink-500 h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer"
                            />
                          </div>
                        </div>

                        {/* Interactive Calculators and Indicators */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                          
                          {/* Waist to Hip Ratio Indicator */}
                          <div className="bg-slate-950/65 p-3 rounded-xl border border-slate-850 flex flex-col justify-between">
                            <div>
                              <div className="text-[9px] font-bold text-slate-500 uppercase font-mono">Waist-to-Hip Ratio</div>
                              <div className="text-base font-extrabold text-slate-200 mt-1">
                                {(activeProfile.waist && activeProfile.hips) ? (activeProfile.waist / activeProfile.hips).toFixed(2) : '0.84'}
                              </div>
                            </div>
                            <div className="mt-2 pt-1 border-t border-slate-800/60">
                              <span className="text-[9px] font-mono text-emerald-400 font-semibold bg-emerald-950/40 px-1.5 py-0.5 rounded">
                                {(activeProfile.waist && activeProfile.hips && (activeProfile.waist / activeProfile.hips) <= (activeProfile.gender === 'Female' ? 0.85 : 0.90)) ? 'Low Cardiovascular Risk' : 'Moderate/High Risk'}
                              </span>
                            </div>
                          </div>

                          {/* Body Mass Index Panel */}
                          <div className="bg-slate-950/65 p-3 rounded-xl border border-slate-850 flex flex-col justify-between">
                            <div>
                              <div className="text-[9px] font-bold text-slate-500 uppercase font-mono">Body Mass Index (BMI)</div>
                              <div className="text-base font-extrabold text-slate-200 mt-1">{bmiDetails.bmi}</div>
                            </div>
                            <div className="mt-2 pt-1 border-t border-slate-800/60">
                              <span className={`text-[9px] font-mono font-semibold px-1.5 py-0.5 rounded ${
                                bmiDetails.category === 'Normal' ? 'bg-emerald-950/40 text-emerald-400' :
                                bmiDetails.category === 'Underweight' ? 'bg-blue-950/40 text-blue-400' :
                                'bg-rose-950/40 text-rose-400'
                              }`}>
                                {bmiDetails.category} Classification
                              </span>
                            </div>
                          </div>

                          {/* Body Type Selection & Tuning */}
                          <div className="bg-slate-950/65 p-3 rounded-xl border border-slate-850 flex flex-col justify-between">
                            <div>
                              <div className="text-[9px] font-bold text-slate-500 uppercase font-mono">Calibrated Body Type</div>
                              <select
                                value={activeProfile.bodyType || 'Mesomorph'}
                                onChange={(e) => updateProfileMeasurement('bodyType', e.target.value as any)}
                                className="bg-transparent text-xs font-bold text-slate-200 focus:outline-none border-b border-slate-800 py-0.5 mt-1 cursor-pointer w-full"
                              >
                                <option value="Ectomorph" className="bg-slate-900">Ectomorph (Lean)</option>
                                <option value="Mesomorph" className="bg-slate-900">Mesomorph (Athletic)</option>
                                <option value="Endomorph" className="bg-slate-900">Endomorph (Slow Burn)</option>
                                <option value="Not Specified" className="bg-slate-900">Not Specified</option>
                              </select>
                            </div>
                            <div className="mt-1">
                              <span className="text-[9px] text-slate-500 block leading-tight font-mono">
                                Determines exercise and calorie pacing.
                              </span>
                            </div>
                          </div>

                        </div>

                        {/* Summary of Body Type Training Alignment */}
                        <div className="bg-slate-950/40 border border-slate-850 p-4 rounded-2xl">
                          <div className="flex gap-2">
                            <Dumbbell className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                            <div>
                              <span className="text-xs font-bold text-slate-200 uppercase font-mono block">
                                {activeProfile.bodyType || 'Mesomorph'} Training Protocols:
                              </span>
                              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                                {activeProfile.bodyType === 'Ectomorph' && "Fast metabolism. Needs heavy, low-rep resistance training (e.g., deadlifts, overhead presses) with long rest intervals (2+ mins) to trigger muscle development. Restrict excessive cardio."}
                                {activeProfile.bodyType === 'Mesomorph' && "Balanced, responsive genetics. Thrives on varied hypertrophy schedules, bodyweight agility drills, and high-intensity interval training (HIIT) to sustain maximum athletic form."}
                                {activeProfile.bodyType === 'Endomorph' && "Slower fat mobilization. Requires high-volume circuit routines (15+ reps per set), short rest intervals (30-45s), and regular steady-state morning cardio to accelerate calorie output."}
                                {(activeProfile.bodyType === 'Not Specified' || !activeProfile.bodyType) && "Focus on a balanced compound weights program 3x weekly paired with 150 minutes of moderate aerobic activity (cycling, swimming) for longevity."}
                              </p>
                            </div>
                          </div>
                        </div>

                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    
                    {/* Log custom fitness workout */}
                    <div className="bg-white border border-slate-200/80 p-6 rounded-3xl shadow-sm space-y-4 h-fit">
                      <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2">Record Today's Exercise</h3>
                      
                      <div className="space-y-3">
                        <div>
                          <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Workout Duration (minutes)</label>
                          <input 
                            type="number" 
                            value={inputExercise}
                            onChange={e => setInputExercise(e.target.value)}
                            className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none"
                          />
                        </div>

                        <div>
                          <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Estimated Calories Burned</label>
                          <input 
                            type="number" 
                            value={inputCalBurned}
                            onChange={e => setInputCalBurned(e.target.value)}
                            className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none"
                          />
                        </div>

                        <button 
                          onClick={() => {
                            saveTodayTrackerItem('exerciseDuration', Number(inputExercise));
                            saveTodayTrackerItem('caloriesBurned', Number(inputCalBurned));
                            triggerToast("Saved workout log!");
                          }}
                          className="w-full bg-slate-950 text-white font-bold py-2.5 rounded-xl text-xs hover:bg-slate-800 transition cursor-pointer"
                        >
                          Log Daily Activity
                        </button>
                      </div>

                      <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/60 mt-4">
                        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Streaks</div>
                        <p className="text-xs text-slate-600">
                          Complete at least **30 minutes** of physical movement to fuel your daily physical streak. Keep active!
                        </p>
                      </div>
                    </div>

                    {/* Safe Physical Activity Library */}
                    <div className="lg:col-span-2 space-y-6">
                      
                      <div className="bg-white border border-slate-200/80 p-6 rounded-3xl shadow-sm">
                        <div className="flex justify-between items-center mb-4">
                          <div>
                            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Target Workout Library</h3>
                            <p className="text-[11px] text-slate-500">Clinically vetted safe guidelines for your age cohort (**{activeAgeCategory}**).</p>
                          </div>
                          <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200/50">
                            Age: {activeProfile.age} yrs
                          </span>
                        </div>

                        <div className="space-y-3">
                          {(EXERCISE_LIBRARY[activeAgeCategory as keyof typeof EXERCISE_LIBRARY] || EXERCISE_LIBRARY['Young Adults']).map((ex, idx) => {
                            const bestFor: string[] = (ex as any).bestForBodyType || ['Not Specified'];
                            const currentBodyType = activeProfile.bodyType || 'Not Specified';
                            
                            let score = 85;
                            let label = 'General Alignment';
                            let scoreColor = 'text-amber-600 bg-amber-50/50 border border-amber-200/50';
                            let explanation = 'Suitable for generic body development.';
                            
                            if (currentBodyType !== 'Not Specified') {
                              if (bestFor.includes(currentBodyType)) {
                                score = 98;
                                label = 'Optimal Match';
                                scoreColor = 'text-emerald-700 bg-emerald-50/70 border border-emerald-200/60';
                                explanation = `Highly matched with your ${currentBodyType} skeletal and muscle structure!`;
                              } else if (bestFor.includes('All') || bestFor.length === 0 || (bestFor.length === 1 && bestFor[0] === 'Not Specified')) {
                                score = 92;
                                label = 'Excellent Match';
                                scoreColor = 'text-emerald-700 bg-emerald-50/70 border border-emerald-200/60';
                                explanation = 'Great for all somatic structures.';
                              } else {
                                score = 75;
                                label = 'Standard Alignment';
                                scoreColor = 'text-slate-600 bg-slate-50 border border-slate-200';
                                explanation = `Complementary exercise for your ${currentBodyType} frame.`;
                              }
                            } else {
                              score = 88;
                              label = 'Standard Fit';
                              scoreColor = 'text-slate-600 bg-slate-50 border border-slate-200';
                              explanation = 'Provide your body type in Profile to compute exact alignment scores.';
                            }

                            const isExpanded = expandedExerciseId === ex.id;

                            return (
                              <div key={ex.id} className="p-4 bg-white border border-slate-200/80 rounded-2xl shadow-sm hover:shadow-md transition-all space-y-4">
                                <div className="flex flex-col sm:flex-row justify-between sm:items-start gap-4">
                                  <div className="space-y-1.5 flex-1">
                                    <div className="flex flex-wrap items-center gap-2">
                                      <span className="w-5 h-5 rounded-full bg-slate-100 flex items-center justify-center text-slate-700 text-[10px] font-bold shrink-0">
                                        {idx + 1}
                                      </span>
                                      <h4 className="text-xs font-bold text-slate-800">{ex.name}</h4>
                                      <span className={`text-[9px] font-bold px-1.5 rounded ${
                                        ex.intensity === 'High' ? 'bg-rose-50 text-rose-700 border border-rose-100' :
                                        ex.intensity === 'Medium' ? 'bg-amber-50 text-amber-700 border border-amber-100' :
                                        'bg-emerald-50 text-emerald-700 border border-emerald-100'
                                      }`}>
                                        {ex.intensity}
                                      </span>
                                      
                                      {/* Best for body type tags */}
                                      <div className="flex flex-wrap gap-1 items-center">
                                        {bestFor.map(type => (
                                          <span key={type} className="text-[8px] font-semibold bg-blue-50 text-blue-600 border border-blue-100/60 px-1.5 py-0.5 rounded">
                                            {type}
                                          </span>
                                        ))}
                                      </div>
                                    </div>
                                    <p className="text-[11px] text-slate-500 leading-relaxed font-normal">
                                      {ex.description}
                                    </p>
                                    
                                    {/* Score Indicator */}
                                    <div className="flex flex-wrap items-center gap-2 mt-2 pt-1 border-t border-slate-50">
                                      <div className={`flex items-center gap-1.5 px-2 py-0.5 rounded-lg text-[9px] font-bold ${scoreColor}`}>
                                        <Sparkles className="w-3 h-3 text-current" />
                                        <span>{score}% Alignment ({label})</span>
                                      </div>
                                      <span className="text-[9px] text-slate-400 font-medium font-mono">{explanation}</span>
                                    </div>
                                  </div>
                                  
                                  <div className="flex sm:flex-col items-baseline sm:items-end justify-between sm:justify-center shrink-0 gap-2">
                                    <span className="text-xs font-extrabold text-slate-700 font-mono">{ex.duration}</span>
                                    
                                    <div className="flex items-center gap-2 mt-1">
                                      <button
                                        onClick={() => setExpandedExerciseId(isExpanded ? null : ex.id)}
                                        className="text-[10px] font-bold text-slate-600 hover:bg-slate-100 hover:text-slate-900 px-2.5 py-1 rounded border border-slate-200/60 cursor-pointer flex items-center gap-1 transition"
                                      >
                                        <span>Instructions</span>
                                        {isExpanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                                      </button>
                                      
                                      <button 
                                        onClick={() => {
                                          const parsedCals = ex.intensity === 'High' ? 250 : ex.intensity === 'Medium' ? 150 : 80;
                                          const parsedMinutes = Number(ex.duration.replace(/[^0-9]/g, '')) || 15;
                                          saveTodayTrackerItem('exerciseDuration', getTodayTracker().exerciseDuration + parsedMinutes);
                                          saveTodayTrackerItem('caloriesBurned', getTodayTracker().caloriesBurned + parsedCals);
                                          triggerToast(`Logged ${ex.name} completed!`);
                                        }}
                                        className="text-[10px] font-bold text-white bg-emerald-600 hover:bg-emerald-700 px-2.5 py-1 rounded border border-emerald-700/30 cursor-pointer flex items-center gap-1 transition shadow-sm"
                                      >
                                        <CheckCircle2 className="w-3 h-3" />
                                        <span>Complete</span>
                                      </button>
                                    </div>
                                  </div>
                                </div>

                                {/* Step-by-Step Instructions Panel */}
                                {isExpanded && (ex as any).instructions && (
                                  <div className="bg-slate-50 border border-slate-200/50 p-3.5 rounded-xl text-left space-y-2 mt-2 animate-in fade-in slide-in-from-top-1 duration-150">
                                    <h5 className="text-[10px] font-bold text-slate-700 uppercase tracking-wider font-mono">Step-by-Step Instructions</h5>
                                    <ol className="space-y-1.5 pl-4 list-decimal text-[11px] text-slate-600 font-normal">
                                      {(ex as any).instructions.map((step: string, sIdx: number) => (
                                        <li key={sIdx} className="leading-relaxed pl-1">
                                          {step}
                                        </li>
                                      ))}
                                    </ol>
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      </div>

                    </div>

                  </div>

                </div>
              )}

              {/* --- TAB 5: WELLNESS LOG & HISTORIC CHARTS --- */}
              {activeTab === 'tracker' && (
                <div className="space-y-6">
                  
                  <div className="bg-white border border-slate-200/80 p-6 rounded-3xl shadow-sm">
                    <h2 className="text-xl font-bold text-slate-900 tracking-tight">Daily Biometrics & Progress Tracking</h2>
                    <p className="text-xs text-slate-500 mt-1">
                      Update your parameters for today, or review historic trend lines for water, sleep, calories, and steps taken.
                    </p>
                  </div>

                  {/* Manual input workspace */}
                  <div className="bg-white border border-slate-200/80 p-6 rounded-3xl shadow-sm">
                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">Update Today's Biometrics ({getTodayDateString()})</h3>
                    
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                      
                      <div>
                        <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Water Intake (ml)</label>
                        <div className="flex gap-1.5">
                          <input 
                            type="number" 
                            value={getTodayTracker().waterIntake}
                            onChange={e => saveTodayTrackerItem('waterIntake', Number(e.target.value))}
                            className="w-full px-2 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Steps taken</label>
                        <input 
                          type="number" 
                          value={inputSteps}
                          onChange={e => {
                            setInputSteps(e.target.value);
                            saveTodayTrackerItem('steps', Number(e.target.value));
                          }}
                          className="w-full px-2 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Sleep (hours)</label>
                        <input 
                          type="number" 
                          step="0.5"
                          value={inputSleep}
                          onChange={e => {
                            setInputSleep(e.target.value);
                            saveTodayTrackerItem('sleep', Number(e.target.value));
                          }}
                          className="w-full px-2 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Exercise (mins)</label>
                        <input 
                          type="number" 
                          value={inputExercise}
                          onChange={e => {
                            setInputExercise(e.target.value);
                            saveTodayTrackerItem('exerciseDuration', Number(e.target.value));
                          }}
                          className="w-full px-2 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none"
                        />
                      </div>

                      <div className="col-span-2 md:col-span-1">
                        <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Cal burned (kcal)</label>
                        <input 
                          type="number" 
                          value={inputCalBurned}
                          onChange={e => {
                            setInputCalBurned(e.target.value);
                            saveTodayTrackerItem('caloriesBurned', Number(e.target.value));
                          }}
                          className="w-full px-2 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none"
                        />
                      </div>

                    </div>
                  </div>

                  {/* Historic Analytics Charts Block */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    
                    {/* Steps taken SVG bar chart */}
                    <div className="bg-white border border-slate-200/80 p-6 rounded-3xl shadow-sm">
                      <div className="flex justify-between items-center mb-4">
                        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Steps Walked (Past Days)</h4>
                        <Footprints className="w-4 h-4 text-emerald-600" />
                      </div>
                      
                      {/* Custom SVG Bar Chart */}
                      <div className="h-48 w-full flex items-end justify-between gap-2 pt-6">
                        {(trackerHistory[activeProfile.id] || []).slice(0, 5).reverse().map((t, i) => {
                          const maxSteps = 12000;
                          const percent = Math.min(100, (t.steps / maxSteps) * 100);
                          return (
                            <div key={i} className="flex-1 flex flex-col items-center gap-2">
                              <span className="text-[9px] font-mono font-bold text-slate-500">{t.steps}</span>
                              <div className="w-full bg-slate-100 rounded-t-md relative h-32 overflow-hidden">
                                <div 
                                  style={{ height: `${percent}%` }}
                                  className="w-full bg-emerald-600 rounded-t-md absolute bottom-0"
                                ></div>
                              </div>
                              <span className="text-[9px] font-mono text-slate-400">{t.date.slice(5)}</span>
                            </div>
                          );
                        })}
                        {(!trackerHistory[activeProfile.id] || trackerHistory[activeProfile.id].length === 0) && (
                          <div className="w-full text-center py-20 text-xs italic text-slate-400">No logs saved.</div>
                        )}
                      </div>
                    </div>

                    {/* Water intake Area gradient Chart */}
                    <div className="bg-white border border-slate-200/80 p-6 rounded-3xl shadow-sm">
                      <div className="flex justify-between items-center mb-4">
                        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Water Intake (Past Days)</h4>
                        <Droplet className="w-4 h-4 text-blue-500" />
                      </div>
                      
                      {/* Custom SVG Area Line Chart */}
                      <div className="h-48 w-full flex items-end justify-between gap-2 pt-6">
                        {(trackerHistory[activeProfile.id] || []).slice(0, 5).reverse().map((t, i) => {
                          const maxWater = 3000;
                          const percent = Math.min(100, (t.waterIntake / maxWater) * 100);
                          return (
                            <div key={i} className="flex-1 flex flex-col items-center gap-2">
                              <span className="text-[9px] font-mono font-bold text-slate-500">{t.waterIntake}ml</span>
                              <div className="w-full bg-slate-100 rounded-t-md relative h-32 overflow-hidden">
                                <div 
                                  style={{ height: `${percent}%` }}
                                  className="w-full bg-blue-500 rounded-t-md absolute bottom-0"
                                ></div>
                              </div>
                              <span className="text-[9px] font-mono text-slate-400">{t.date.slice(5)}</span>
                            </div>
                          );
                        })}
                        {(!trackerHistory[activeProfile.id] || trackerHistory[activeProfile.id].length === 0) && (
                          <div className="w-full text-center py-20 text-xs italic text-slate-400">No logs saved.</div>
                        )}
                      </div>
                    </div>

                  </div>

                </div>
              )}

              {/* --- TAB 6: FAMILY PROFILES SWAPPER --- */}
              {activeTab === 'family' && (
                <div className="space-y-6">
                  
                  <div className="bg-white border border-slate-200/80 p-6 rounded-3xl shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                      <h2 className="text-xl font-bold text-slate-900 tracking-tight">Unified Family Workspace</h2>
                      <p className="text-xs text-slate-500 mt-1">
                        Track children, parents, and grandparents under one account. Transition instantly between active patients.
                      </p>
                    </div>
                    <button 
                      onClick={() => setShowAddProfileModal(true)}
                      className="bg-slate-950 text-white font-semibold px-4 py-2.5 rounded-xl text-xs transition cursor-pointer flex items-center gap-2"
                    >
                      <PlusCircle className="w-4 h-4" />
                      <span>Onboard Family Profile</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                    {profiles.map((p) => {
                      const ageCategory = getAgeCategory(p.age);
                      const bmi = calculateBMI(p.height, p.weight);
                      const isSelected = activeProfileId === p.id;
                      const hasAsm = !!assessments[p.id];

                      return (
                        <div 
                          key={p.id}
                          onClick={() => {
                            setActiveProfileId(p.id);
                            triggerToast(`Switched active profile to ${p.name}!`);
                          }}
                          className={`p-6 rounded-3xl border transition text-left relative overflow-hidden flex flex-col justify-between h-72 cursor-pointer ${
                            isSelected 
                              ? 'bg-white border-slate-900 shadow-lg ring-1 ring-slate-900' 
                              : 'bg-white border-slate-200 hover:border-slate-300'
                          }`}
                        >
                          <div className="space-y-3 relative z-10">
                            <div className="flex items-center justify-between">
                              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                                {p.relation}
                              </span>
                              {isSelected && (
                                <span className="text-[10px] bg-emerald-600 text-white font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                                  <UserCheck className="w-2.5 h-2.5" />
                                  <span>Active</span>
                                </span>
                              )}
                            </div>

                            <div>
                              <h3 className="text-base font-bold text-slate-900 leading-tight">{p.name}</h3>
                              <span className={`text-[10px] font-bold border px-2 py-0.2 rounded-full inline-block mt-1 ${getAgeBadgeStyle(p.age)}`}>
                                {ageCategory} ({p.age} yrs)
                              </span>
                            </div>

                            <div className="space-y-1.5 text-xs text-slate-600 border-t border-slate-100 pt-3">
                              <div className="flex justify-between">
                                <span>Height:</span> <span className="font-semibold text-slate-800">{p.height} cm</span>
                              </div>
                              <div className="flex justify-between">
                                <span>Weight:</span> <span className="font-semibold text-slate-800">{p.weight} kg</span>
                              </div>
                              <div className="flex justify-between">
                                <span>BMI:</span> <span className="font-semibold text-slate-800">{bmi.bmi} ({bmi.category})</span>
                              </div>
                            </div>
                          </div>

                          <div className="border-t border-slate-100 pt-4 mt-4 flex items-center justify-between relative z-10">
                            <span className="text-[10px] text-slate-400">
                              {hasAsm ? "Assessment compiled ✓" : "Assessment raw"}
                            </span>
                            <div className="flex gap-1">
                              <button 
                                onClick={(e) => handleDeleteProfile(p.id, e)}
                                className="p-1.5 text-rose-500 hover:bg-rose-50 border border-transparent rounded-lg hover:border-rose-200 transition cursor-pointer"
                                title="Delete Profile"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>

                          {/* Decorative blur blob */}
                          {isSelected && (
                            <div className="absolute right-0 bottom-0 translate-x-12 translate-y-12 w-24 h-24 bg-emerald-50 rounded-full blur-xl opacity-80 pointer-events-none"></div>
                          )}
                        </div>
                      );
                    })}
                  </div>

                </div>
              )}

              {/* --- TAB 7: AI HEALTH CHAT --- */}
              {activeTab === 'chat' && (
                <div className="space-y-4 flex-1 flex flex-col h-[calc(100vh-140px)]">
                  
                  <div className="bg-white border border-slate-200/80 p-4 rounded-3xl shadow-sm flex items-center justify-between gap-4 shrink-0">
                    <div>
                      <h2 className="text-base font-bold text-slate-900 tracking-tight flex items-center gap-2">
                        <Brain className="w-5 h-5 text-emerald-600" />
                        <span>Clinical Wellness Chat Assistant</span>
                      </h2>
                      <p className="text-[11px] text-slate-500 mt-0.5">
                        Consulting specifically for active patient: <strong className="font-semibold text-slate-800">{activeProfile.name}</strong> ({activeAgeCategory}, goals of {activeProfile.goals}).
                      </p>
                    </div>
                    <button 
                      onClick={clearChatHistory}
                      className="text-xs text-rose-600 hover:bg-rose-50 px-3 py-1.5 rounded-xl border border-rose-200/50 cursor-pointer"
                    >
                      Clear Chats
                    </button>
                  </div>

                  {/* Chat logs box */}
                  <div className="flex-1 bg-white border border-slate-200/80 rounded-3xl shadow-sm p-4 overflow-y-auto flex flex-col space-y-4">
                    
                    {/* Welcome message if blank */}
                    {(!chatHistories[activeProfile.id] || chatHistories[activeProfile.id].length === 0) && (
                      <div className="m-auto text-center max-w-md space-y-3 py-10">
                        <div className="w-12 h-12 rounded-full bg-emerald-50 border border-emerald-100 flex items-center justify-center mx-auto text-emerald-600">
                          <MessageSquare className="w-6 h-6" />
                        </div>
                        <h3 className="text-sm font-bold text-slate-800">24/7 Clinical Nutrition & Physical Training Chat</h3>
                        <p className="text-xs text-slate-500 leading-relaxed font-normal">
                          Ask target question logs such as pediatric allergy management, joint-safe stretches, or regional vegetarian diets tailored for your exact parameters.
                        </p>
                        
                        {/* Interactive prompt chips */}
                        <div className="flex flex-wrap gap-1.5 justify-center pt-2">
                          <button 
                            onClick={() => sendChatMessage("What is a high protein recipe suitable for my goals?")}
                            className="text-[10px] font-semibold text-slate-600 bg-slate-50 hover:bg-slate-100 border border-slate-200 px-3 py-1.5 rounded-full cursor-pointer"
                          >
                            "High protein recipe"
                          </button>
                          <button 
                            onClick={() => sendChatMessage("What exercises should I prioritize at my current lifestage?")}
                            className="text-[10px] font-semibold text-slate-600 bg-slate-50 hover:bg-slate-100 border border-slate-200 px-3 py-1.5 rounded-full cursor-pointer"
                          >
                            "Safe exercises"
                          </button>
                          <button 
                            onClick={() => sendChatMessage("Explain some age-specific preventive screenings I need.")}
                            className="text-[10px] font-semibold text-slate-600 bg-slate-50 hover:bg-slate-100 border border-slate-200 px-3 py-1.5 rounded-full cursor-pointer"
                          >
                            "Preventive screening checklist"
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Chat Messages */}
                    {chatHistories[activeProfile.id]?.map((msg) => (
                      <div 
                        key={msg.id}
                        className={`flex gap-3 max-w-3xl ${
                          msg.role === 'user' ? 'ml-auto flex-row-reverse' : 'mr-auto'
                        }`}
                      >
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 border ${
                          msg.role === 'user' ? 'bg-slate-900 border-slate-800 text-white' : 'bg-emerald-50 border-emerald-200 text-emerald-700'
                        }`}>
                          {msg.role === 'user' ? <User className="w-4 h-4" /> : <Brain className="w-4 h-4" />}
                        </div>

                        <div className={`p-4 rounded-2xl text-xs leading-relaxed space-y-2 whitespace-pre-line ${
                          msg.role === 'user' 
                            ? 'bg-slate-100 text-slate-900 border border-slate-200/60 rounded-tr-none' 
                            : 'bg-emerald-50/20 text-slate-800 border border-emerald-100/40 rounded-tl-none font-normal'
                        }`}>
                          <div className="markdown-body">
                            {msg.content}
                          </div>
                          <span className="block text-[9px] text-slate-400 text-right mt-1.5 font-mono">
                            {msg.timestamp}
                          </span>
                        </div>
                      </div>
                    ))}

                    {/* Chat message loading spinner */}
                    {isChatLoading && (
                      <div className="flex gap-3 mr-auto">
                        <div className="w-8 h-8 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 flex items-center justify-center shrink-0">
                          <Brain className="w-4 h-4 animate-spin" />
                        </div>
                        <div className="p-3 bg-emerald-50/10 border border-emerald-100/30 rounded-2xl rounded-tl-none text-xs text-slate-500 italic">
                          Formulating clinical longevity insights...
                        </div>
                      </div>
                    )}

                  </div>

                  {/* Message submit field */}
                  <div className="flex gap-2 shrink-0">
                    <input 
                      type="text"
                      placeholder={`Ask me anything about ${activeProfile.name}'s fitness or diet...`}
                      value={chatMessageInput}
                      onChange={e => setChatMessageInput(e.target.value)}
                      onKeyDown={e => e.key === 'Enter' && sendChatMessage()}
                      className="flex-1 px-4 py-3 rounded-2xl border border-slate-200 text-xs focus:outline-none focus:ring-1 focus:ring-emerald-500"
                    />
                    <button 
                      onClick={() => sendChatMessage()}
                      disabled={isChatLoading || !chatMessageInput.trim()}
                      className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-5 py-3 rounded-2xl text-xs transition disabled:opacity-50 cursor-pointer"
                    >
                      Ask AI
                    </button>
                  </div>

                </div>
              )}

            </main>
          </div>
        </>
      )}

      {/* --- ADD PROFILE DIALOG MODAL --- */}
      <AnimatePresence>
        {showAddProfileModal && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="w-full max-w-lg bg-white rounded-3xl border border-slate-200 shadow-2xl p-6 overflow-y-auto max-h-[90vh]"
            >
              <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
                <h3 className="font-bold text-slate-900 text-base">Onboard Family Profile</h3>
                <button 
                  onClick={() => setShowAddProfileModal(false)}
                  className="p-1 hover:bg-slate-50 rounded-lg text-slate-400 hover:text-slate-600 cursor-pointer"
                >
                  <X className="w-4.5 h-4.5" />
                </button>
              </div>

              <form onSubmit={handleAddProfile} className="space-y-4">
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Full Name</label>
                    <input 
                      type="text"
                      required
                      placeholder="e.g. Aarav Manoj"
                      value={newProfileName}
                      onChange={e => setNewProfileName(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Relationship</label>
                    <select 
                      value={newProfileRelation}
                      onChange={e => setNewProfileRelation(e.target.value as any)}
                      className="w-full px-3 py-2 bg-white rounded-xl border border-slate-200 text-xs focus:outline-none cursor-pointer"
                    >
                      <option value="Self">Self</option>
                      <option value="Child">Child (Pediatric Focus)</option>
                      <option value="Parent">Parent</option>
                      <option value="Grandparent">Grandparent (Geriatric Focus)</option>
                      <option value="Partner">Partner</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Age (Years)</label>
                    <input 
                      type="number"
                      required
                      min="0"
                      max="120"
                      value={newProfileAge}
                      onChange={e => setNewProfileAge(Number(e.target.value))}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Gender</label>
                    <select 
                      value={newProfileGender}
                      onChange={e => setNewProfileGender(e.target.value as any)}
                      className="w-full px-3 py-2 bg-white rounded-xl border border-slate-200 text-xs focus:outline-none"
                    >
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Diet Preference</label>
                    <select 
                      value={newProfileDiet}
                      onChange={e => setNewProfileDiet(e.target.value as any)}
                      className="w-full px-3 py-2 bg-white rounded-xl border border-slate-200 text-xs focus:outline-none"
                    >
                      <option value="Vegetarian">Vegetarian</option>
                      <option value="Vegan">Vegan</option>
                      <option value="Non-Vegetarian">Non-Vegetarian</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Height (cm)</label>
                    <input 
                      type="number"
                      required
                      value={newProfileHeight}
                      onChange={e => setNewProfileHeight(Number(e.target.value))}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Weight (kg)</label>
                    <input 
                      type="number"
                      required
                      value={newProfileWeight}
                      onChange={e => setNewProfileWeight(Number(e.target.value))}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none"
                    />
                  </div>
                </div>

                {/* Body Measurements Section */}
                <div className="border-t border-slate-100 pt-3">
                  <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-wider block mb-2">Body Measurements & Type</span>
                  
                  <div className="grid grid-cols-3 gap-3 mb-3">
                    <div>
                      <label className="block text-[9px] font-bold text-slate-500 uppercase mb-1">Chest (cm)</label>
                      <input 
                        type="number"
                        value={newProfileChest}
                        onChange={e => setNewProfileChest(Number(e.target.value))}
                        className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[9px] font-bold text-slate-500 uppercase mb-1">Waist (cm)</label>
                      <input 
                        type="number"
                        value={newProfileWaist}
                        onChange={e => setNewProfileWaist(Number(e.target.value))}
                        className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[9px] font-bold text-slate-500 uppercase mb-1">Hips (cm)</label>
                      <input 
                        type="number"
                        value={newProfileHips}
                        onChange={e => setNewProfileHips(Number(e.target.value))}
                        className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[9px] font-bold text-slate-500 uppercase mb-1">Body Fat (%)</label>
                      <input 
                        type="number"
                        value={newProfileBodyFat}
                        onChange={e => setNewProfileBodyFat(Number(e.target.value))}
                        className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[9px] font-bold text-slate-500 uppercase mb-1">Body Type</label>
                      <select 
                        value={newProfileBodyType}
                        onChange={e => setNewProfileBodyType(e.target.value as any)}
                        className="w-full px-3 py-2 bg-white rounded-xl border border-slate-200 text-xs focus:outline-none"
                      >
                        <option value="Ectomorph">Ectomorph (Lean/Fast)</option>
                        <option value="Mesomorph">Mesomorph (Athletic)</option>
                        <option value="Endomorph">Endomorph (Slower Burn)</option>
                        <option value="Not Specified">Not Specified</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Activity Level</label>
                    <select 
                      value={newProfileActivity}
                      onChange={e => setNewProfileActivity(e.target.value as any)}
                      className="w-full px-3 py-2 bg-white rounded-xl border border-slate-200 text-xs focus:outline-none"
                    >
                      <option value="Sedentary">Sedentary</option>
                      <option value="Lightly Active">Lightly Active</option>
                      <option value="Moderately Active">Moderately Active</option>
                      <option value="Very Active">Very Active</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Wellness Goals</label>
                    <select 
                      value={newProfileGoal}
                      onChange={e => setNewProfileGoal(e.target.value as any)}
                      className="w-full px-3 py-2 bg-white rounded-xl border border-slate-200 text-xs focus:outline-none"
                    >
                      <option value="Healthy Lifestyle">Healthy Lifestyle</option>
                      <option value="Weight Loss">Weight Loss</option>
                      <option value="Weight Gain">Weight Gain</option>
                      <option value="Child Development">Child Development</option>
                      <option value="Senior Fitness">Senior Fitness</option>
                      <option value="Muscle Building">Muscle Building</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Medical Conditions (Comma separated)</label>
                  <input 
                    type="text"
                    placeholder="e.g. Hypertension, None, Asthma"
                    value={newProfileConditions}
                    onChange={e => setNewProfileConditions(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none"
                  />
                </div>

                <button 
                  type="submit"
                  className="w-full bg-slate-950 text-white font-bold py-3 rounded-xl text-xs mt-4 hover:bg-slate-800 transition cursor-pointer"
                >
                  Onboard Patient Profile
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* FOOTER */}
      <footer className="bg-white border-t border-slate-200 py-4 px-6 text-center text-[10px] text-slate-400 shrink-0">
        <div>© 2026 LifeSpanFit AI. Clinical-grade wellness tracking powered by Google Gemini AI.</div>
        <div className="font-semibold text-emerald-600 mt-0.5">VisionaryTraffic.in • Lifetime Longevity Roadmap</div>
      </footer>

    </div>
  );
}
