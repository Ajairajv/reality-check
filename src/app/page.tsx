"use client";

import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
// Removed levelingSystem import - functions now in realityCheckStats.js
import { apiService } from '../services/api';
import DebugPanel from '../components/DebugPanel';
import RealityCheckDashboard from '../components/RealityCheckDashboard';
import { 
  defaultRealityStats, 
  getTaskStatBoosts, 
  getTitleByLevel,
  calculateLevel,
  getXpToNextLevel as calculateXpToNextLevel,
  getLevelColor,
  getTaskXpReward,
  getLevelRewards,
  getPrestigeTitle,
  getAchievements,
  achievements as realityAchievements
} from '../models/realityCheckStats';

// Type Definitions
interface Task {
  id: number;
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high';
  complexity: 'simple' | 'normal' | 'complex' | 'epic';
  dueDate: string;
  category: string;
  tags: string[];
  completed: boolean;
  createdAt: string;
  updatedAt: string;
  userId: number | null;
  completedAt: string | null;
  estimatedHours?: number;
}

interface StatBoosts {
  strength?: number;
  agility?: number;
  discipline?: number;
  intelligence?: number;
  focusPoints?: number;
  mentalResilience?: number;
  physicalEndurance?: number;
  creativity?: number;
}

interface User {
  id: number;
  name: string;
  email: string;
  role: 'user' | 'manager' | 'admin';
  avatar: string;
  department: string;
  createdAt: string;
  xp: number;
  level: number;
  tasksCompleted: number;
  longestStreak: number;
  currentStreak: number;
  lastActive: string;
  // Reality Check Stats
  realityStats?: {
    strength: number;
    agility: number;
    discipline: number;
    intelligence: number;
    focusPoints: number;
    mentalResilience: number;
    physicalEndurance: number;
    creativity: number;
    completedTasks: number;
    totalTasks: number;
    currentLevel: number;
    xp: number;
    streak: number;
    longestStreak: number;
    lastActiveDate: string | null;
    achievements: any[];
    titles: string[];
    currentTitle: string;
    healthScore: number;
    productivityScore: number;
    mindfulnessScore: number;
    socialScore: number;
  };
}

interface Notification {
  id: number;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  timestamp: string;
  read: boolean;
}

interface NewTask {
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high';
  complexity: 'simple' | 'normal' | 'complex' | 'epic';
  dueDate: string;
  category: string;
  tags: string[];
  estimatedHours?: number;
}

// Production-level Task Manager with DaisyUI Dark Theme
export default function TaskManager() {
  // Core State Management
  const [tasks, setTasks] = useState<Task[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  
  // Form States
  const [newTask, setNewTask] = useState<NewTask>({ 
    title: '', 
    description: '', 
    priority: 'medium', 
    complexity: 'normal',
    dueDate: '',
    category: 'general',
    tags: []
  });
  
  // UI States
  const [showNewTaskForm, setShowNewTaskForm] = useState<boolean>(false);
  const [showLevelUpModal, setShowLevelUpModal] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterPriority, setFilterPriority] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('created');
  
  // Advanced States
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [recentLevelUp, setRecentLevelUp] = useState<any>(null);

  // Initialize Application
  useEffect(() => {
    const initializeApp = async () => {
      try {
        // Load data from API service (with localStorage fallback)
        const savedTasks = await apiService.getTasks();
        const savedUsers = await apiService.getUsers();
        const savedCurrentUser = JSON.parse(localStorage.getItem('taskManager_currentUser') || 'null');
        const savedNotifications = JSON.parse(localStorage.getItem('taskManager_notifications') || '[]');

        console.log('Loaded tasks:', savedTasks); // Debug log
        console.log('Loaded users:', savedUsers); // Debug log

        setTasks(savedTasks);
        setUsers(savedUsers);
        
        // Create a default user if none exists
        if (savedUsers.length === 0 && !savedCurrentUser) {
          const defaultUser: User = {
            id: Date.now(),
            name: 'Default User',
            email: 'user@realitycheck.com',
            role: 'user',
            avatar: 'bg-primary',
            department: 'General',
            createdAt: new Date().toISOString(),
            xp: 0,
            level: 1,
            tasksCompleted: 0,
            longestStreak: 0,
            currentStreak: 0,
            lastActive: new Date().toISOString(),
            realityStats: {
              ...defaultRealityStats,
              lastActiveDate: new Date().toISOString()
            }
          };
          
          await apiService.createUser(defaultUser);
          setUsers([defaultUser]);
          setCurrentUser(defaultUser);
          console.log('Created default user:', defaultUser);
        } else {
          setCurrentUser(savedCurrentUser);
        }
        
        setNotifications(savedNotifications);
        
        // Set dark theme
        document.documentElement.setAttribute('data-theme', 'dark');
        
      } catch (error) {
        console.error('Error initializing app:', error);
        // Fallback to localStorage if API fails
        const savedTasks = JSON.parse(localStorage.getItem('taskManager_tasks') || '[]');
        const savedUsers = JSON.parse(localStorage.getItem('taskManager_users') || '[]');
        const savedCurrentUser = JSON.parse(localStorage.getItem('taskManager_currentUser') || 'null');
        const savedNotifications = JSON.parse(localStorage.getItem('taskManager_notifications') || '[]');

        setTasks(savedTasks);
        setUsers(savedUsers);
        setCurrentUser(savedCurrentUser);
        setNotifications(savedNotifications);
      }
      
      setTimeout(() => setIsLoading(false), 800);
    };

    initializeApp();
  }, []);

  // Auto-save to localStorage
  useEffect(() => {
    if (!isLoading) {
      localStorage.setItem('taskManager_tasks', JSON.stringify(tasks));
    }
  }, [tasks, isLoading]);

  useEffect(() => {
    if (!isLoading) {
      localStorage.setItem('taskManager_users', JSON.stringify(users));
    }
  }, [users, isLoading]);

  useEffect(() => {
    if (!isLoading) {
      localStorage.setItem('taskManager_currentUser', JSON.stringify(currentUser));
    }
  }, [currentUser, isLoading]);

  useEffect(() => {
    localStorage.setItem('taskManager_notifications', JSON.stringify(notifications));
  }, [notifications]);

  // Task Management Functions
  const addTask = async () => {
    console.log('Adding task with data:', newTask); // Debug log
    
    if (!newTask.title.trim()) {
      console.log('Task title is empty');
      addNotification('Please enter a task title', 'warning');
      return;
    }
    
    const task: Task = {
      id: Date.now(),
      ...newTask,
      completed: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      userId: currentUser?.id || null,
      completedAt: null,
      estimatedHours: newTask.estimatedHours || 1
    };
    
    console.log('Created task object:', task); // Debug log
    
    try {
      // Use API service to create task
      const createdTask = await apiService.createTask(task);
      console.log('Task created successfully:', createdTask); // Debug log
      
      // Update local state
      setTasks(prev => {
        const newTasks = [createdTask, ...prev];
        console.log('Updated tasks array:', newTasks); // Debug log
        return newTasks;
      });
      
      // Reset form
      setNewTask({ 
        title: '', 
        description: '', 
        priority: 'medium', 
        complexity: 'normal',
        dueDate: '',
        category: 'general',
        tags: []
      });
      
      setShowNewTaskForm(false);
      addNotification('Task created successfully!', 'success');
      
    } catch (error) {
      console.error('Error creating task:', error);
      addNotification('Failed to create task', 'error');
    }
  };

  const toggleTask = (id: number) => {
    setTasks(prev => prev.map(task => {
      if (task.id === id) {
        const wasCompleted = task.completed;
        const updatedTask = { 
          ...task, 
          completed: !task.completed,
          completedAt: !task.completed ? new Date().toISOString() : null,
          updatedAt: new Date().toISOString()
        };
        
        // Award XP and Reality Check stats when task is completed
        if (!wasCompleted && currentUser) {
          const xpReward = getTaskXpReward(task.priority, task.complexity);
          const oldLevel = calculateLevel(currentUser.xp || 0);
          const newXp = (currentUser.xp || 0) + xpReward;
          const newLevel = calculateLevel(newXp);
          
          // Get Reality Check stat boosts
          const statBoosts = getTaskStatBoosts(task.category, task.priority, task.complexity);
          
          // Update user XP, stats, and Reality Check progress
          setUsers(prevUsers => prevUsers.map(user => 
            user.id === currentUser.id 
              ? { 
                  ...user, 
                  xp: newXp,
                  level: newLevel,
                  tasksCompleted: (user.tasksCompleted || 0) + 1,
                  lastActive: new Date().toISOString(),
                  // Update Reality Check stats
                  realityStats: {
                    ...(user.realityStats || defaultRealityStats),
                    strength: (user.realityStats?.strength || 0) + (statBoosts.strength || 0),
                    agility: (user.realityStats?.agility || 0) + (statBoosts.agility || 0),
                    discipline: (user.realityStats?.discipline || 0) + (statBoosts.discipline || 0),
                    intelligence: (user.realityStats?.intelligence || 0) + (statBoosts.intelligence || 0),
                    focusPoints: (user.realityStats?.focusPoints || 0) + (statBoosts.focusPoints || 0),
                    mentalResilience: (user.realityStats?.mentalResilience || 0) + (statBoosts.mentalResilience || 0),
                    physicalEndurance: (user.realityStats?.physicalEndurance || 0) + (statBoosts.physicalEndurance || 0),
                    creativity: (user.realityStats?.creativity || 0) + (statBoosts.creativity || 0),
                    completedTasks: (user.realityStats?.completedTasks || 0) + 1,
                    xp: newXp,
                    currentLevel: newLevel,
                    currentTitle: getTitleByLevel(newLevel),
                    lastActiveDate: new Date().toISOString()
                  }
                }
              : user
          ));
          
          setCurrentUser(prev => prev ? ({
            ...prev,
            xp: newXp,
            level: newLevel,
            tasksCompleted: (prev.tasksCompleted || 0) + 1,
            realityStats: {
              ...(prev.realityStats || defaultRealityStats),
              strength: (prev.realityStats?.strength || 0) + (statBoosts.strength || 0),
              agility: (prev.realityStats?.agility || 0) + (statBoosts.agility || 0),
              discipline: (prev.realityStats?.discipline || 0) + (statBoosts.discipline || 0),
              intelligence: (prev.realityStats?.intelligence || 0) + (statBoosts.intelligence || 0),
              focusPoints: (prev.realityStats?.focusPoints || 0) + (statBoosts.focusPoints || 0),
              mentalResilience: (prev.realityStats?.mentalResilience || 0) + (statBoosts.mentalResilience || 0),
              physicalEndurance: (prev.realityStats?.physicalEndurance || 0) + (statBoosts.physicalEndurance || 0),
              creativity: (prev.realityStats?.creativity || 0) + (statBoosts.creativity || 0),
              completedTasks: (prev.realityStats?.completedTasks || 0) + 1,
              xp: newXp,
              currentLevel: newLevel,
              currentTitle: getTitleByLevel(newLevel),
              lastActiveDate: new Date().toISOString()
            }
          }) : null);
          
          // Check for level up
          if (newLevel > oldLevel) {
            setRecentLevelUp({ oldLevel, newLevel, rewards: getLevelRewards(newLevel) });
            setShowLevelUpModal(true);
            addNotification(`Level up! You are now level ${newLevel}`, 'success');
          }
          
          // Show stat gains
          const statGains = Object.entries(statBoosts)
            .filter(([_, value]: [string, any]) => value > 0)
            .map(([stat, value]: [string, any]) => `+${value} ${stat}`)
            .join(', ');
          
          if (statGains) {
            addNotification(`+${xpReward} XP, ${statGains}`, 'success');
          } else {
            addNotification(`+${xpReward} XP earned!`, 'success');
          }
        }
        
        return updatedTask;
      }
      return task;
    }));
  };

  const deleteTask = (id: number) => {
    setTasks(prev => prev.filter(task => task.id !== id));
    addNotification('Task deleted', 'info');
  };

  const addNotification = (message: string, type: 'info' | 'success' | 'warning' | 'error' = 'info') => {
    const notification: Notification = {
      id: Date.now() + Math.random(), // Ensure unique IDs
      message,
      type,
      timestamp: new Date().toISOString(),
      read: false
    };
    
    setNotifications(prev => [notification, ...prev.slice(0, 4)]); // Limit to 5 notifications
    
    // Auto-remove after 3 seconds (shorter time)
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== notification.id));
    }, 3000);
  };

  // Handle stat boosts from exercises/activities
  const handleStatBoost = (statBoosts: StatBoosts, xpGain: number = 0) => {
    if (!currentUser) return;

    const currentStats = currentUser.realityStats || defaultRealityStats;
    const newXp = (currentStats.xp || 0) + xpGain;
    const newLevel = calculateLevel(newXp);

    // Update current user's reality stats
    setCurrentUser(prev => prev ? ({
      ...prev,
      xp: newXp,
      realityStats: {
        ...(prev.realityStats || defaultRealityStats),
        xp: newXp,
        currentLevel: newLevel,
        strength: (prev.realityStats?.strength || 0) + (statBoosts.strength || 0),
        agility: (prev.realityStats?.agility || 0) + (statBoosts.agility || 0),
        discipline: (prev.realityStats?.discipline || 0) + (statBoosts.discipline || 0),
        intelligence: (prev.realityStats?.intelligence || 0) + (statBoosts.intelligence || 0),
        focusPoints: (prev.realityStats?.focusPoints || 0) + (statBoosts.focusPoints || 0),
        mentalResilience: (prev.realityStats?.mentalResilience || 0) + (statBoosts.mentalResilience || 0),
        physicalEndurance: (prev.realityStats?.physicalEndurance || 0) + (statBoosts.physicalEndurance || 0),
        creativity: (prev.realityStats?.creativity || 0) + (statBoosts.creativity || 0),
        lastActiveDate: new Date().toISOString()
      }
    }) : null);

    // Update users array
    setUsers(prevUsers => prevUsers.map(user => 
      user.id === currentUser.id 
        ? { 
            ...user,
            xp: newXp,
            realityStats: {
              ...(user.realityStats || defaultRealityStats),
              xp: newXp,
              currentLevel: newLevel,
              strength: (user.realityStats?.strength || 0) + (statBoosts.strength || 0),
              agility: (user.realityStats?.agility || 0) + (statBoosts.agility || 0),
              discipline: (user.realityStats?.discipline || 0) + (statBoosts.discipline || 0),
              intelligence: (user.realityStats?.intelligence || 0) + (statBoosts.intelligence || 0),
              focusPoints: (user.realityStats?.focusPoints || 0) + (statBoosts.focusPoints || 0),
              mentalResilience: (user.realityStats?.mentalResilience || 0) + (statBoosts.mentalResilience || 0),
              physicalEndurance: (user.realityStats?.physicalEndurance || 0) + (statBoosts.physicalEndurance || 0),
              creativity: (user.realityStats?.creativity || 0) + (statBoosts.creativity || 0),
              lastActiveDate: new Date().toISOString()
            }
          }
        : user
    ));
  };

  // Debug function to create test tasks
  const createTestTask = async (testTaskData: any) => {
    const task: Task = {
      id: Date.now(),
      ...testTaskData,
      completed: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      userId: currentUser?.id || null,
      completedAt: null,
      estimatedHours: 1
    };
    
    try {
      const createdTask = await apiService.createTask(task);
      setTasks(prev => [createdTask, ...prev]);
      addNotification('Test task created successfully!', 'success');
    } catch (error) {
      console.error('Error creating test task:', error);
      addNotification('Failed to create test task', 'error');
    }
  };

  // Computed Values
  const userTasks = useMemo(() => {
    // If no current user is selected, show all unassigned tasks (userId is null)
    // If a user is selected, show only their tasks
    if (!currentUser) {
      return tasks.filter(task => task.userId === null);
    }
    return tasks.filter(task => task.userId === currentUser.id);
  }, [tasks, currentUser]);

  const filteredTasks = useMemo(() => {
    let filtered = userTasks;

    if (searchQuery) {
      filtered = filtered.filter(task => 
        task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        task.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (filterStatus !== 'all') {
      filtered = filtered.filter(task => 
        filterStatus === 'completed' ? task.completed : !task.completed
      );
    }

    if (filterPriority !== 'all') {
      filtered = filtered.filter(task => task.priority === filterPriority);
    }

    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'title': return a.title.localeCompare(b.title);
        case 'priority': {
          const priorityOrder = { high: 3, medium: 2, low: 1 };
          return priorityOrder[b.priority] - priorityOrder[a.priority];
        }
        case 'dueDate': return new Date(a.dueDate || '9999').getTime() - new Date(b.dueDate || '9999').getTime();
        default: return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
    });

    return filtered;
  }, [userTasks, searchQuery, filterStatus, filterPriority, sortBy]);

  const stats = useMemo(() => {
    if (!currentUser) return {};
    
    const completedTasks = userTasks.filter(task => task.completed).length;
    const pendingTasks = userTasks.filter(task => !task.completed).length;
    
    // Calculate XP progress properly
    const currentXp = currentUser.xp || 0;
    const currentLevel = calculateLevel(currentXp);
    const xpToNext = calculateXpToNextLevel(currentXp);
    
    // Calculate current level's total XP requirement
    let currentLevelBaseXp = 0;
    let nextLevelTotalXp = 0;
    
    if (currentLevel === 1) {
      currentLevelBaseXp = 0;
      nextLevelTotalXp = 100;
    } else if (currentLevel === 2) {
      currentLevelBaseXp = 100;
      nextLevelTotalXp = 300;
    } else if (currentLevel === 3) {
      currentLevelBaseXp = 300;
      nextLevelTotalXp = 600;
    } else if (currentLevel === 4) {
      currentLevelBaseXp = 600;
      nextLevelTotalXp = 1000;
    } else if (currentLevel === 5) {
      currentLevelBaseXp = 1000;
      nextLevelTotalXp = 1500;
    } else {
      currentLevelBaseXp = 1500 + (currentLevel - 6) * 200;
      nextLevelTotalXp = 1500 + (currentLevel - 5) * 200;
    }
    
    const currentLevelProgress = currentXp - currentLevelBaseXp;
    const currentLevelRequirement = nextLevelTotalXp - currentLevelBaseXp;
    const percentage = currentLevelRequirement > 0 ? Math.min(100, Math.max(0, (currentLevelProgress / currentLevelRequirement) * 100)) : 0;
    
    const xpProgress = {
      current: currentLevelProgress,
      total: currentLevelRequirement,
      percentage: percentage,
      remaining: xpToNext
    };
    
    const achievements = getAchievements({
      level: currentUser.level || 1,
      tasksCompleted: currentUser.tasksCompleted || 0,
      longestStreak: currentUser.longestStreak || 0
    });

    return {
      totalTasks: userTasks.length,
      completedTasks,
      pendingTasks,
      completionRate: userTasks.length > 0 ? Math.round((completedTasks / userTasks.length) * 100) : 0,
      currentLevel: currentUser.level || 1,
      currentXp: currentUser.xp || 0,
      xpProgress,
      prestige: getPrestigeTitle(currentUser.level || 1),
      achievements
    };
  }, [currentUser, userTasks]);

  // Optimized versions of heavy animations
  const fastTransition = { duration: 0.2 };
  const mediumTransition = { duration: 0.3 };
  
  return (
    <div className="min-h-screen bg-gray-900 transition-all duration-300">
      {/* Optimized Toast Notifications */}
      <div className="toast toast-top toast-end z-50">
        <AnimatePresence>
          {notifications.slice(0, 3).map((notification) => (
            <motion.div
              key={notification.id}
              initial={{ opacity: 0, x: 300 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 300 }}
              transition={fastTransition}
              className={`alert shadow-xl border border-gray-600/50 ${
                notification.type === 'success' ? 'bg-emerald-900/90 text-emerald-100' :
                notification.type === 'error' ? 'bg-red-900/90 text-red-100' :
                notification.type === 'warning' ? 'bg-amber-900/90 text-amber-100' :
                'bg-blue-900/90 text-blue-100'
              } cursor-pointer`}
              onClick={() => setNotifications(prev => prev.filter(n => n.id !== notification.id))}
            >
              <span className="font-medium">{notification.message}</span>
              <button className="btn btn-sm btn-ghost hover:bg-white/20 text-current">✕</button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Optimized Level Up Modal */}
      <AnimatePresence>
        {showLevelUpModal && recentLevelUp && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={fastTransition}
            className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
            onClick={() => setShowLevelUpModal(false)}
          >
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
              transition={mediumTransition}
              className="card bg-gradient-to-br from-purple-900 to-black text-white w-full max-w-md mx-4 shadow-2xl border border-purple-500/30"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="card-body text-center p-8">
                <div className="text-8xl mb-6">👑</div>
                <h2 className="text-5xl font-black mb-4 text-yellow-400">LEVEL UP!</h2>
                <p className="text-2xl mb-8 font-semibold text-gray-200">
                  Level {recentLevelUp.oldLevel} → Level {recentLevelUp.newLevel}
                </p>
                <div className="space-y-3 mb-8">
                  {recentLevelUp.rewards.map((reward: any, index: number) => (
                    <div key={index} className="badge badge-lg bg-yellow-600/20 border-yellow-400/30 text-yellow-200 font-semibold px-4 py-3">
                      ⚡ {reward.name}
                    </div>
                  ))}
                </div>
                <button
                  onClick={() => setShowLevelUpModal(false)}
                  className="btn btn-lg bg-purple-600/30 hover:bg-purple-600/50 border-purple-400/30 text-purple-200 font-bold px-8"
                >
                  Epic! 👑
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Optimized Navbar */}
      <div className="sticky top-0 z-40 bg-gray-900/95 backdrop-blur-sm border-b border-gray-700/50 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between gap-6 h-16">
            {/* Logo - Fixed Width */}
            <div className="flex items-center space-x-4 min-w-[200px]">
              <div className="relative">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                  <span className="text-white font-black text-xl">RC</span>
                </div>
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-500 rounded-full"></div>
              </div>
              <div className="hidden sm:block">
                <h1 className="text-xl font-black text-purple-400 leading-tight">Reality Check</h1>
                <p className="text-sm text-gray-400 font-medium leading-tight">Shadow Hunter System</p>
              </div>
            </div>

            {/* Navigation - Fixed Width */}
            <div className="flex items-center justify-center gap-6 lg:gap-8 min-w-[400px]">
              {[
                { id: 'dashboard', label: 'Dashboard', icon: '⚔️' },
                { id: 'tasks', label: 'Quests', icon: '🗡️' },
                { id: 'realitycheck', label: 'Stats', icon: '🔮' },
                { id: 'analytics', label: 'Arsenal', icon: '📊' }
              ].map(item => (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`h-12 px-4 lg:px-6 rounded-xl transition-all duration-200 flex items-center justify-center space-x-3 font-bold min-w-[100px] ${
                    activeTab === item.id 
                      ? 'bg-purple-600 text-white shadow-lg' 
                      : 'bg-gray-800/50 hover:bg-gray-700/50 text-gray-300'
                  }`}
                >
                  <span className="text-lg leading-none">{item.icon}</span>
                  <span className="hidden md:block text-sm leading-none">{item.label}</span>
                </button>
              ))}
            </div>

            {/* Actions & User - Fixed Width */}
            <div className="flex items-center justify-end space-x-6 min-w-[200px]">
              {/* User Profile */}
              {currentUser && (
                <div className="bg-gray-800 px-4 py-3 rounded-xl flex items-center space-x-3 border border-gray-600/50 h-16 min-w-[140px]">
                  <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-indigo-600 rounded-full flex items-center justify-center">
                    <span className="text-sm font-bold text-white leading-none">
                      {currentUser.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div className="hidden lg:flex flex-col justify-center">
                    <div className="text-sm font-bold text-gray-200 leading-tight">{currentUser.name}</div>
                    <div className="text-xs text-purple-400 font-semibold leading-tight">
                      Level {currentUser.realityStats?.currentLevel || 1} • {(currentUser.xp || 0).toLocaleString()} XP
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Optimized Main Content */}
      <div className="flex-1">
        <main className="p-6 lg:p-10">
          <div className="max-w-7xl mx-auto space-y-10">
            <AnimatePresence mode="wait">
              {/* Optimized Dashboard */}
              {activeTab === 'dashboard' && (
                <motion.div
                  key="dashboard"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={fastTransition}
                  className="space-y-10"
                >
                  {/* Hero Section - Centered & Compact */}
                  <div className="flex justify-center">
                    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-purple-900 to-black border border-gray-700/50 max-w-4xl w-full">
                      <div className="px-6 lg:px-12 py-12 lg:py-16 text-center text-white">
                        <div className="max-w-2xl mx-auto">
                          <h1 className="text-3xl lg:text-5xl font-black mb-4 leading-tight">
                            Welcome, Hunter ⚔️
                          </h1>
                          <p className="text-lg lg:text-xl mb-6 text-gray-300 font-medium leading-relaxed">
                            {currentUser ? (
                              <>Level {stats.currentLevel} <span className="text-yellow-400 font-bold">{stats.prestige}</span> with {(stats.currentXp || 0).toLocaleString()} XP</>
                            ) : (
                              'Rise through the shadows and claim your destiny'
                            )}
                          </p>
                          {currentUser && stats.xpProgress && (
                            <div className="w-full max-w-md mx-auto">
                              <div className="flex justify-between text-base mb-2 text-gray-300 font-bold">
                                <span>Level {stats.currentLevel} Progress</span>
                                <span>{Math.round(stats.xpProgress.percentage)}%</span>
                              </div>
                              <div className="relative w-full h-5 bg-gray-800 rounded-full border border-gray-700 overflow-hidden">
                                <div 
                                  className="absolute inset-0 bg-gradient-to-r from-purple-500 to-cyan-500 rounded-full transition-all duration-1000 flex items-center justify-center"
                                  style={{ width: `${stats.xpProgress.percentage}%` }}
                                >
                                  <span className="text-white text-xs font-bold leading-none px-2 truncate">
                                    {Math.round(stats.xpProgress.percentage)}%
                                  </span>
                                </div>
                              </div>
                              <div className="mt-2 text-xs text-gray-400 text-center">
                                ∞ Infinite progression beyond Level 100
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Stats Cards - Compact 2x3 Grid */}
                  <div className="flex justify-center">
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 max-w-5xl">
                      {[
                        { label: 'Total Quests', value: stats.totalTasks || 0, icon: '⚔️', color: 'blue' },
                        { label: 'Completed', value: stats.completedTasks || 0, icon: '👑', color: 'green' },
                        { label: 'In Progress', value: stats.pendingTasks || 0, icon: '🔥', color: 'amber' },
                        { label: 'Win Rate', value: `${stats.completionRate || 0}%`, icon: '💎', color: 'purple' }
                      ].map((stat, index) => (
                        <div
                          key={stat.label}
                          className="bg-gray-900 border border-gray-700/50 rounded-xl p-4 hover:border-gray-600/50 transition-colors duration-200 min-h-[100px] flex flex-col justify-center items-center text-center"
                        >
                          <div className="flex flex-col items-center justify-center space-y-2">
                            <div className="text-2xl lg:text-3xl">{stat.icon}</div>
                            <div>
                              <p className="text-gray-400 text-xs font-bold leading-tight">{stat.label}</p>
                              <p className="text-xl lg:text-2xl font-black text-white leading-none mt-1">{stat.value}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Quick Actions - Compact 2x3 Grid */}
                  <div className="flex justify-center">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-6 max-w-4xl w-full">
                      {[
                        { title: 'Start New Quest', desc: 'Begin your next challenge', icon: '⚔️', action: () => setShowNewTaskForm(true) },
                        { title: 'View Stats', desc: 'Check your hunter abilities', icon: '🔮', action: () => setActiveTab('realitycheck') },
                        { title: 'Arsenal', desc: 'Review your achievements', icon: '💎', action: () => setActiveTab('analytics') }
                      ].map((action, index) => (
                        <div
                          key={action.title}
                          onClick={action.action}
                          className="cursor-pointer bg-gray-900 border border-gray-700/50 rounded-xl p-4 hover:border-gray-600/50 hover:bg-gray-800/50 transition-all duration-200 min-h-[80px] flex flex-col justify-center items-center text-center"
                        >
                          <div className="flex flex-col items-center space-y-2">
                            <div className="w-10 h-10 rounded-lg bg-purple-600 flex items-center justify-center text-white text-xl leading-none">
                              {action.icon}
                            </div>
                            <div>
                              <h3 className="font-black text-base text-white leading-tight">{action.title}</h3>
                              <p className="text-gray-400 text-xs leading-tight mt-1">{action.desc}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Optimized Tasks Tab - Dashboard Style */}
              {activeTab === 'tasks' && (
                <motion.div
                  key="tasks"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={fastTransition}
                  className="space-y-8 relative"
                >
                  {/* Floating Action Button */}
                  <div className="fixed bottom-8 right-8 z-50">
                    <button
                      onClick={() => setShowNewTaskForm(true)}
                      className="btn btn-circle btn-lg bg-purple-600 hover:bg-purple-700 text-white font-bold border-0 shadow-2xl hover:shadow-purple-500/25 transition-all duration-300 hover:scale-110"
                    >
                      <span className="text-2xl leading-none">+</span>
                    </button>
                  </div>

                  {/* Filters & Search - Centered & Compact */}
                  <div className="flex justify-center">
                    <div className="bg-gray-900 border border-gray-700/50 rounded-2xl p-6 max-w-4xl w-full">
                      <div className="flex flex-col gap-6">
                        {/* Search Bar */}
                        <div className="flex justify-center">
                          <input
                            type="text"
                            placeholder="Search your quests..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="input input-bordered bg-gray-800 border-gray-600 w-full max-w-md placeholder-gray-400 text-gray-200 h-12 text-base"
                          />
                        </div>
                        
                        {/* Status Filters - Horizontal Buttons */}
                        <div className="space-y-4">
                          <div className="text-center">
                            <h4 className="text-sm font-bold text-gray-300 mb-3">Quest Status</h4>
                            <div className="flex justify-center gap-3 flex-wrap">
                              {[
                                { value: 'all', label: 'All Quests', icon: '📋' },
                                { value: 'pending', label: 'Active', icon: '🔥' },
                                { value: 'completed', label: 'Completed', icon: '✅' }
                              ].map(status => (
                                <button
                                  key={status.value}
                                  onClick={() => setFilterStatus(status.value)}
                                  className={`px-6 py-3 rounded-xl font-bold transition-all duration-200 flex items-center space-x-2 min-w-[120px] justify-center ${
                                    filterStatus === status.value
                                      ? 'bg-purple-600 text-white shadow-lg border-2 border-purple-400'
                                      : 'bg-gray-800 text-gray-300 hover:bg-gray-700 border-2 border-gray-600 hover:border-gray-500'
                                  }`}
                                >
                                  <span className="text-lg">{status.icon}</span>
                                  <span className="text-sm">{status.label}</span>
                                </button>
                              ))}
                            </div>
                          </div>

                          {/* Priority Filters - Horizontal Buttons */}
                          <div className="text-center">
                            <h4 className="text-sm font-bold text-gray-300 mb-3">Priority Level</h4>
                            <div className="flex justify-center gap-3 flex-wrap">
                              {[
                                { value: 'all', label: 'All Priorities', icon: '🎯' },
                                { value: 'high', label: 'High', icon: '🔴' },
                                { value: 'medium', label: 'Medium', icon: '🟡' },
                                { value: 'low', label: 'Low', icon: '🟢' }
                              ].map(priority => (
                                <button
                                  key={priority.value}
                                  onClick={() => setFilterPriority(priority.value)}
                                  className={`px-6 py-3 rounded-xl font-bold transition-all duration-200 flex items-center space-x-2 min-w-[110px] justify-center ${
                                    filterPriority === priority.value
                                      ? 'bg-purple-600 text-white shadow-lg border-2 border-purple-400'
                                      : 'bg-gray-800 text-gray-300 hover:bg-gray-700 border-2 border-gray-600 hover:border-gray-500'
                                  }`}
                                >
                                  <span className="text-lg">{priority.icon}</span>
                                  <span className="text-sm">{priority.label}</span>
                                </button>
                              ))}
                            </div>
                          </div>

                          {/* Sort Options - Horizontal Buttons */}
                          <div className="text-center">
                            <h4 className="text-sm font-bold text-gray-300 mb-3">Sort By</h4>
                            <div className="flex justify-center gap-3 flex-wrap">
                              {[
                                { value: 'created', label: 'Recent', icon: '🕒' },
                                { value: 'title', label: 'A-Z', icon: '🔤' },
                                { value: 'priority', label: 'Priority', icon: '⚡' },
                                { value: 'dueDate', label: 'Due Date', icon: '📅' }
                              ].map(sort => (
                                <button
                                  key={sort.value}
                                  onClick={() => setSortBy(sort.value)}
                                  className={`px-6 py-3 rounded-xl font-bold transition-all duration-200 flex items-center space-x-2 min-w-[100px] justify-center ${
                                    sortBy === sort.value
                                      ? 'bg-purple-600 text-white shadow-lg border-2 border-purple-400'
                                      : 'bg-gray-800 text-gray-300 hover:bg-gray-700 border-2 border-gray-600 hover:border-gray-500'
                                  }`}
                                >
                                  <span className="text-lg">{sort.icon}</span>
                                  <span className="text-sm">{sort.label}</span>
                                </button>
                              ))}
                            </div>
                          </div>
                        </div>

                        {/* Quest Count */}
                        <div className="flex justify-center">
                          <div className="flex items-center space-x-2 text-base text-gray-400 bg-gray-800/50 px-6 py-3 rounded-xl border border-gray-600/30">
                            <span className="font-bold text-purple-400 text-lg">{filteredTasks.length}</span>
                            <span className="font-medium">quests found</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Task List - Centered & Compact Grid */}
                  <div className="flex justify-center">
                    <div className="w-full max-w-4xl">
                      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 lg:gap-6">
                        {filteredTasks.map((task) => (
                          <div
                            key={task.id}
                            className={`bg-gray-900 border hover:border-gray-600/50 transition-colors duration-200 rounded-xl p-4 min-h-[140px] flex flex-col ${
                              task.priority === 'high' ? 'border-red-500/30' :
                              task.priority === 'medium' ? 'border-amber-500/30' :
                              'border-green-500/30'
                            }`}
                          >
                            <div className="flex items-start justify-between mb-3">
                              <input
                                type="checkbox"
                                checked={task.completed}
                                onChange={() => toggleTask(task.id)}
                                className="checkbox checkbox-primary w-4 h-4 mt-1"
                              />
                              
                              <button
                                onClick={() => deleteTask(task.id)}
                                className="btn btn-ghost btn-xs text-red-400 hover:bg-red-900/30 transition-colors duration-200 w-8 h-8 flex items-center justify-center"
                              >
                                <span className="leading-none text-xs">🗑️</span>
                              </button>
                            </div>
                            
                            <div className="flex-1 flex flex-col justify-center">
                              <h3 className={`text-base font-black ${task.completed ? 'line-through opacity-60 text-gray-500' : 'text-white'} transition-all duration-200 mb-2 leading-tight`}>
                                {task.title}
                              </h3>
                              
                              {task.description && (
                                <p className="text-gray-400 text-xs mb-3 leading-relaxed line-clamp-2">
                                  {task.description}
                                </p>
                              )}
                              
                              <div className="flex flex-wrap items-center gap-2 mt-auto">
                                <div className={`badge font-bold px-2 py-1 text-xs h-6 flex items-center justify-center ${
                                  task.priority === 'high' ? 'bg-red-600 text-white' :
                                  task.priority === 'medium' ? 'bg-amber-600 text-white' :
                                  'bg-green-600 text-white'
                                }`}>
                                  <span className="leading-none">{task.priority === 'high' ? '🔴' : task.priority === 'medium' ? '🟡' : '🟢'} {task.priority}</span>
                                </div>
                                
                                <div className="badge border-gray-600/50 text-gray-300 bg-gray-800/50 font-medium px-2 py-1 h-6 flex items-center justify-center text-xs">
                                  <span className="leading-none">{task.complexity}</span>
                                </div>
                                
                                <div className="badge bg-purple-600 text-white font-bold px-2 py-1 h-6 flex items-center justify-center text-xs">
                                  <span className="leading-none">⚡ +{getTaskXpReward(task.priority, task.complexity)} XP</span>
                                </div>
                              </div>
                              
                              {task.dueDate && (
                                <div className="mt-2">
                                  <div className="badge bg-gray-800 text-gray-300 border-gray-600/50 font-medium px-2 py-1 h-6 flex items-center justify-center text-xs">
                                    <span className="leading-none">📅 {new Date(task.dueDate).toLocaleDateString()}</span>
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                      
                      {filteredTasks.length === 0 && (
                        <div className="bg-gray-900 border border-gray-700/50 rounded-2xl">
                          <div className="text-center py-16">
                            <div className="text-6xl mb-4">⚔️</div>
                            <h3 className="text-xl font-black mb-3 text-white">No Quests Found</h3>
                            <p className="text-gray-400 mb-6 text-sm max-w-md mx-auto">
                              {searchQuery || filterStatus !== 'all' || filterPriority !== 'all' 
                                ? 'Adjust your filters to find the quests you seek'
                                : 'Ready to start your journey? Create your first quest!'
                              }
                            </p>
                            {!searchQuery && filterStatus === 'all' && filterPriority === 'all' && (
                              <button
                                onClick={() => setShowNewTaskForm(true)}
                                className="btn btn-lg bg-purple-600 hover:bg-purple-700 text-white font-bold border-0"
                              >
                                ⚔️ Start Your First Quest
                              </button>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Reality Check Tab */}
              {activeTab === 'realitycheck' && (
                <motion.div
                  key="realitycheck"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={fastTransition}
                >
                  <RealityCheckDashboard
                    user={currentUser}
                    tasks={userTasks}
                    realityStats={currentUser?.realityStats}
                    onStatUpdate={handleStatBoost}
                    onAddNotification={addNotification}
                  />
                </motion.div>
              )}

              {/* Optimized Analytics Tab - Dashboard Style */}
              {activeTab === 'analytics' && (
                <motion.div
                  key="analytics"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={fastTransition}
                  className="space-y-8"
                >
                  {currentUser ? (
                    <>
                      {/* Analytics Cards - Centered Grid */}
                      <div className="flex justify-center">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 max-w-4xl w-full">
                          {/* Completion Rate Card */}
                          <div className="bg-gray-900 border border-green-500/30 rounded-xl p-6">
                            <h3 className="text-lg font-black mb-4 text-green-400 text-center">
                              Quest Completion Rate
                            </h3>
                            {userTasks.length > 0 ? (
                              <div className="space-y-4">
                                <div className="text-center">
                                  <div className="text-4xl font-black text-green-400 mb-2">
                                    {stats.completionRate}%
                                  </div>
                                  <p className="text-gray-300 font-bold text-sm">Overall Success Rate</p>
                                </div>
                                
                                <div className="flex justify-center">
                                  <div 
                                    className="radial-progress text-green-400 text-lg font-bold border-4 border-green-500/30" 
                                    style={{"--value": stats.completionRate, "--size": "6rem", "--thickness": "0.4rem"}}
                                  >
                                    {stats.completionRate}%
                                  </div>
                                </div>
                                
                                <div className="grid grid-cols-2 gap-4">
                                  <div className="bg-green-900/30 border border-green-500/30 rounded-lg p-3 text-center">
                                    <div className="text-green-400 text-xl font-black">{stats.completedTasks}</div>
                                    <div className="text-green-300 font-bold text-xs">Completed</div>
                                  </div>
                                  <div className="bg-amber-900/30 border border-amber-500/30 rounded-lg p-3 text-center">
                                    <div className="text-amber-400 text-xl font-black">{stats.pendingTasks}</div>
                                    <div className="text-amber-300 font-bold text-xs">In Progress</div>
                                  </div>
                                </div>
                              </div>
                            ) : (
                              <div className="text-center py-8">
                                <div className="text-4xl mb-4">📊</div>
                                <p className="text-gray-400 text-sm">No data available yet</p>
                              </div>
                            )}
                          </div>

                          {/* XP Progress Card */}
                          <div className="bg-gray-900 border border-purple-500/30 rounded-xl p-6">
                            <h3 className="text-lg font-black mb-4 text-purple-400 text-center">
                              Hunter Progress
                            </h3>
                            <div className="space-y-4">
                              <div className="bg-purple-900/30 border border-purple-500/30 rounded-lg p-4">
                                <div className="flex items-center justify-between">
                                  <div>
                                    <div className="text-purple-300 font-bold text-xs">Current Level</div>
                                    <div className="text-purple-400 text-2xl font-black">{stats.currentLevel}</div>
                                    <div className="text-purple-300 font-medium text-xs">{stats.prestige}</div>
                                  </div>
                                  <div className="text-3xl">👑</div>
                                </div>
                              </div>
                              
                              <div className="bg-blue-900/30 border border-blue-500/30 rounded-lg p-4">
                                <div className="flex items-center justify-between">
                                  <div>
                                    <div className="text-blue-300 font-bold text-xs">Total XP</div>
                                    <div className="text-blue-400 text-2xl font-black">{(stats.currentXp || 0).toLocaleString()}</div>
                                    <div className="text-blue-300 font-medium text-xs">Experience Points</div>
                                  </div>
                                  <div className="text-3xl">⚡</div>
                                </div>
                              </div>
                              
                              <div>
                                <div className="flex justify-between text-xs mb-2 font-bold text-gray-300">
                                  <span>Level {stats.currentLevel} Progress</span>
                                  <span>{Math.round(stats.xpProgress?.percentage || 0)}%</span>
                                </div>
                                <div className="w-full h-3 bg-gray-800 rounded-full border border-gray-700">
                                  <div 
                                    className="h-full bg-gradient-to-r from-purple-500 to-cyan-500 rounded-full transition-all duration-1000"
                                    style={{ width: `${stats.xpProgress?.percentage || 0}%` }}
                                  ></div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Achievements - Centered Grid */}
                      <div className="flex justify-center">
                        <div className="bg-gray-900 border border-yellow-500/30 rounded-xl p-6 max-w-4xl w-full">
                          <h3 className="text-xl font-black mb-6 text-yellow-400 text-center">
                            👑 Hall of Fame
                          </h3>
                          {stats.achievements && stats.achievements.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 lg:gap-6">
                              {stats.achievements.slice(0, 6).map((achievement: any, index: number) => (
                                <div
                                  key={achievement.name}
                                  className="bg-yellow-900/20 border border-yellow-500/30 rounded-lg p-4 hover:border-yellow-400/50 transition-colors duration-200"
                                >
                                  <div className="flex items-center space-x-3">
                                    <div className="text-2xl bg-yellow-600 rounded-lg p-2 flex items-center justify-center">👑</div>
                                    <div className="flex-1 min-w-0">
                                      <div className="font-black text-sm text-white mb-1">{achievement.name}</div>
                                      <div className="text-xs text-gray-400 leading-relaxed">{achievement.description}</div>
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <div className="text-center py-12">
                              <div className="text-6xl mb-4">🏆</div>
                              <h4 className="text-lg font-black mb-3 text-white">Legends Await!</h4>
                              <p className="text-gray-400 text-sm">Complete quests to unlock achievements!</p>
                            </div>
                          )}
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className="flex justify-center">
                      <div className="bg-gray-900 border border-gray-700/50 rounded-xl max-w-2xl w-full">
                        <div className="text-center py-16">
                          <div className="text-6xl mb-6">⚔️</div>
                          <h3 className="text-2xl font-black mb-4 text-white">Arsenal Dashboard</h3>
                          <p className="text-gray-400 mb-6 text-base">
                            Track your progress and achievements
                          </p>
                          <button
                            onClick={() => setActiveTab('tasks')}
                            className="btn btn-lg bg-purple-600 hover:bg-purple-700 text-white font-bold border-0"
                          >
                            Start Your Journey
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </main>
      </div>

      {/* Create New Quest Modal - Properly Centered with Blur */}
      <AnimatePresence>
        {showNewTaskForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ backdropFilter: 'blur(8px)', backgroundColor: 'rgba(0, 0, 0, 0.7)' }}
            onClick={() => setShowNewTaskForm(false)}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0, y: 50 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.8, opacity: 0, y: 50 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="bg-gray-900 border border-purple-500/30 rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-8">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-2xl font-black text-purple-400">
                ⚔️ Create New Quest
              </h3>
              <button
                onClick={() => setShowNewTaskForm(false)}
                className="btn btn-ghost btn-sm text-gray-400 hover:text-white p-2"
              >
                ✕
              </button>
            </div>
            
            <div className="space-y-6">
              <div className="form-control">
                <label className="label pb-2">
                  <span className="label-text font-bold text-white text-base">Quest Title *</span>
                </label>
                <input
                  type="text"
                  placeholder="Enter an epic quest title..."
                  value={newTask.title}
                  onChange={(e) => setNewTask({...newTask, title: e.target.value})}
                  className="input input-bordered bg-gray-800 border-gray-600 text-white placeholder-gray-400 h-12 text-lg px-4"
                />
              </div>
              
              <div className="form-control">
                <label className="label pb-2">
                  <span className="label-text font-bold text-white text-base">Quest Description</span>
                </label>
                <textarea
                  placeholder="Describe your quest..."
                  value={newTask.description}
                  onChange={(e) => setNewTask({...newTask, description: e.target.value})}
                  className="textarea textarea-bordered bg-gray-800 border-gray-600 text-white placeholder-gray-400 h-24 text-base px-4 py-3 leading-relaxed"
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="form-control">
                  <label className="label pb-2">
                    <span className="label-text font-bold text-white text-base">Threat Level</span>
                  </label>
                  <select
                    value={newTask.priority}
                    onChange={(e) => setNewTask({...newTask, priority: e.target.value as 'low' | 'medium' | 'high'})}
                    className="select select-bordered select-lg bg-gray-800 border-gray-600 text-white mt-2 h-10"
                  >
                    <option value="low">🟢 Low Threat (+50 XP)</option>
                    <option value="medium">🟡 Medium Threat (+100 XP)</option>
                    <option value="high">🔴 High Threat (+200 XP)</option>
                  </select>
                </div>
                
                <div className="form-control">
                  <label className="label pb-2">
                    <span className="label-text font-bold text-white text-base">Quest Rank</span>
                  </label>
                  <select
                    value={newTask.complexity}
                    onChange={(e) => setNewTask({...newTask, complexity: e.target.value as 'simple' | 'normal' | 'complex' | 'epic'})}
                    className="select select-bordered select-lg bg-gray-800 border-gray-600 text-white mt-2 h-10"
                  >
                    <option value="simple">⚡ E-Rank (0.8x XP)</option>
                    <option value="normal">⭐ D-Rank (1.0x XP)</option>
                    <option value="complex">🔥 B-Rank (1.5x XP)</option>
                    <option value="epic">💎 S-Rank (2.0x XP)</option>
                  </select>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                              <div className="form-control">
                <label className="label pb-2">
                  <span className="label-text font-bold text-white text-base">Deadline</span>
                </label>
                  <input
                    type="date"
                    value={newTask.dueDate}
                    onChange={(e) => setNewTask({...newTask, dueDate: e.target.value})}
                    className="input input-bordered input-lg bg-gray-800 border-gray-600 text-white mt-2 h-10"
                  />
                </div>
                
                <div className="form-control">
                  <label className="label pb-2">
                    <span className="label-text font-bold text-white text-base">Category</span>
                  </label>
                  <select
                    value={newTask.category}
                    onChange={(e) => setNewTask({...newTask, category: e.target.value})}
                    className="select select-bordered select-lg bg-gray-800 border-gray-600 text-white mt-2 h-10"
                  >
                    <option value="general">📝 General</option>
                    <option value="work">💼 Work</option>
                    <option value="personal">🏠 Personal</option>
                    <option value="health">💪 Health</option>
                    <option value="learning">📚 Learning</option>
                  </select>
                </div>
              </div>
              
              {/* XP Preview */}
              <div className="bg-purple-900/30 border border-purple-500/30 rounded-xl p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-14 h-14 bg-purple-600 rounded-xl flex items-center justify-center">
                      <span className="text-white font-bold text-xl">⚡</span>
                    </div>
                    <div>
                      <div className="font-black text-lg text-white">Quest Reward</div>
                      <div className="text-gray-400 text-sm mt-1">Complete this quest to earn XP</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-3xl font-black text-purple-400">
                      +{getTaskXpReward(newTask.priority, newTask.complexity)} XP
                    </div>
                    <div className="text-sm text-gray-400 mt-1">Experience Points</div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-end mt-10 pt-8 border-t border-gray-700/50">
              <button
                onClick={() => setShowNewTaskForm(false)}
                className="btn btn-lg bg-gray-800 hover:bg-gray-700 text-gray-300 border-gray-600 font-semibold px-8 py-3 flex items-center justify-center space-x-2"
              >
                <span>Cancel</span>
              </button>
              <button
                onClick={addTask}
                disabled={!newTask.title.trim()}
                className="btn btn-lg bg-purple-600 hover:bg-purple-700 text-white font-bold border-0 disabled:opacity-50 px-8 py-3 flex items-center justify-center space-x-3"
              >
                <span className="text-lg">⚔️</span>
                <span>Accept Quest & Earn XP</span>
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    )}
  </AnimatePresence>

      {/* Debug Panel */}
      <DebugPanel 
        tasks={tasks}
        users={users}
        currentUser={currentUser}
        onCreateTestTask={createTestTask}
      />
    </div>
  );
} 