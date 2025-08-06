// Enhanced Reality Check Stats System
export const defaultRealityStats = {
  // Original RPG Stats
  strength: 0,
  agility: 0,
  discipline: 0,
  intelligence: 0,
  
  // Progress Tracking
  completedTasks: 0,
  totalTasks: 0,
  currentLevel: 1,
  xp: 0,
  streak: 0,
  longestStreak: 0,
  lastActiveDate: null,
  
  // New Reality Check Stats
  focusPoints: 0,
  mentalResilience: 0,
  physicalEndurance: 0,
  creativity: 0,
  
  // Achievement Tracking
  achievements: [],
  titles: ["Reality Shifter"],
  currentTitle: "Reality Shifter",
  
  // Lifestyle Tracking
  healthScore: 50,
  productivityScore: 50,
  mindfulnessScore: 50,
  socialScore: 50,
};

// Stat Names and Descriptions
export const statNames = {
  strength: "Strength",
  agility: "Agility", 
  discipline: "Discipline",
  intelligence: "Intelligence",
  focusPoints: "Focus Points",
  mentalResilience: "Mental Resilience",
  physicalEndurance: "Physical Endurance",
  creativity: "Creativity"
};

export const statDescriptions = {
  strength: "Physical power and determination",
  agility: "Mental quickness and adaptability",
  discipline: "Self-control and consistency", 
  intelligence: "Problem-solving and learning ability",
  focusPoints: "Concentration and attention span",
  mentalResilience: "Stress resistance and recovery",
  physicalEndurance: "Stamina and energy levels",
  creativity: "Innovation and creative thinking"
};

// XP and Leveling Constants
export const BASE_XP = 100;
export const XP_MULTIPLIER = 1.5;

// Advanced level calculation with different scaling for different level ranges
export const calculateLevel = (xp) => {
  if (xp < 100) return 1;
  
  let level = 1;
  let requiredXp = 0;
  
  // Levels 1-100: Exponential scaling
  while (level <= 100) {
    const nextLevelXp = Math.floor(BASE_XP * Math.pow(XP_MULTIPLIER, level - 1));
    if (requiredXp + nextLevelXp > xp) break;
    requiredXp += nextLevelXp;
    level++;
  }
  
  // Levels 100+: Logarithmic scaling for infinite progression
  if (level > 100 && xp > requiredXp) {
    const remainingXp = xp - requiredXp;
    const logLevels = Math.floor(Math.log10(remainingXp / 10000 + 1) * 50);
    level += logLevels;
  }
  
  return level;
};

export const getXpToNextLevel = (currentXp) => {
  const currentLevel = calculateLevel(currentXp);
  let nextLevelXp;
  
  if (currentLevel === 1) nextLevelXp = 100;
  else if (currentLevel === 2) nextLevelXp = 300;
  else if (currentLevel === 3) nextLevelXp = 600;
  else if (currentLevel === 4) nextLevelXp = 1000;
  else if (currentLevel === 5) nextLevelXp = 1500;
  else nextLevelXp = 1500 + (currentLevel - 5) * 200;
  
  return nextLevelXp - currentXp;
};

// Task XP Calculation
export function getTaskXpReward(priority, complexity) {
  const basePriorities = {
    'low': 25,
    'medium': 50,
    'high': 100
  };
  
  const complexityMultipliers = {
    'simple': 1,
    'normal': 1.5,
    'complex': 2,
    'epic': 3
  };
  
  const baseXp = basePriorities[priority] || 25;
  const multiplier = complexityMultipliers[complexity] || 1;
  
  return Math.round(baseXp * multiplier);
}

// Task-based Stat Rewards
export const getTaskStatBoosts = (taskType, priority, complexity) => {
  const baseBoosts = {
    // Task Categories
    "work": { intelligence: 2, discipline: 1, focusPoints: 1 },
    "personal": { discipline: 2, mentalResilience: 1 },
    "health": { strength: 2, physicalEndurance: 2, agility: 1 },
    "learning": { intelligence: 3, creativity: 1, focusPoints: 1 },
    "creative": { creativity: 3, intelligence: 1 },
    "fitness": { strength: 3, physicalEndurance: 2, agility: 2 },
    "mindfulness": { discipline: 2, mentalResilience: 2, focusPoints: 1 },
    "social": { agility: 1, mentalResilience: 1 }
  };

  let boosts = baseBoosts[taskType] || { discipline: 1, intelligence: 1 };
  
  // Priority multipliers
  const priorityMultiplier = {
    "low": 1,
    "medium": 1.2,
    "high": 1.5
  };
  
  // Complexity multipliers
  const complexityMultiplier = {
    "simple": 1,
    "normal": 1.2,
    "complex": 1.5,
    "epic": 2
  };
  
  const totalMultiplier = (priorityMultiplier[priority] || 1) * (complexityMultiplier[complexity] || 1);
  
  // Apply multipliers
  const finalBoosts = {};
  Object.entries(boosts).forEach(([stat, value]) => {
    finalBoosts[stat] = Math.round(value * totalMultiplier);
  });
  
  return finalBoosts;
};

// Level-based Rewards
export const getLevelRewards = (level) => {
  const rewards = {
    statPoints: Math.floor(level / 5),
    title: getTitleByLevel(level),
    achievements: []
  };
  
  // Milestone rewards
  if (level % 10 === 0) {
    rewards.achievements.push(`Level ${level} Master`);
  }
  
  return rewards;
};

export const getLevelColor = (level) => {
  if (level >= 100) return "text-rainbow-500 animate-pulse";
  if (level >= 75) return "text-red-500";
  if (level >= 50) return "text-orange-500";
  if (level >= 25) return "text-yellow-500";
  if (level >= 10) return "text-green-500";
  return "text-blue-500";
};

// Titles and Prestige
export const getTitleByLevel = (level) => {
  if (level >= 100) return "Infinity Walker";
  if (level >= 90) return "Reality Sovereign";
  if (level >= 80) return "Dimension Ruler";
  if (level >= 70) return "Universe Shaper";
  if (level >= 60) return "Cosmic Guardian";
  if (level >= 50) return "Shadow Monarch";
  if (level >= 40) return "Elite Hunter";
  if (level >= 30) return "Master Warrior";
  if (level >= 20) return "Skilled Fighter";
  if (level >= 15) return "Experienced Soldier";
  if (level >= 10) return "Battle Tested";
  if (level >= 5) return "Novice Hunter";
  return "Reality Shifter";
};

export const getPrestigeTitle = (level) => {
  return getTitleByLevel(level);
};

// Achievement System
export const getAchievements = (stats, tasks = []) => {
  const unlockedAchievements = [];
  
  // Level-based achievements
  if (stats.currentLevel >= 10) unlockedAchievements.push("First Milestone");
  if (stats.currentLevel >= 25) unlockedAchievements.push("Quarter Century");
  if (stats.currentLevel >= 50) unlockedAchievements.push("Halfway to Greatness");
  if (stats.currentLevel >= 100) unlockedAchievements.push("Centennial Master");
  
  // Task-based achievements
  const completedTasks = tasks.filter(task => task.completed).length;
  if (completedTasks >= 10) unlockedAchievements.push("Task Master");
  if (completedTasks >= 50) unlockedAchievements.push("Productivity Guru");
  if (completedTasks >= 100) unlockedAchievements.push("Quest Legend");
  
  return unlockedAchievements;
};

// Lifestyle Score Calculations
export const calculateLifestyleScores = (stats, tasks) => {
  const recentTasks = tasks.filter(task => {
    const taskDate = new Date(task.createdAt);
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    return taskDate >= weekAgo && task.completed;
  });

  const healthTasks = recentTasks.filter(task => task.category === 'health').length;
  const workTasks = recentTasks.filter(task => task.category === 'work').length;
  const personalTasks = recentTasks.filter(task => task.category === 'personal').length;
  
  return {
    health: Math.min(100, 50 + (healthTasks * 10) + ((stats.strength || 0) + (stats.physicalEndurance || 0)) / 4),
    productivity: Math.min(100, 50 + (workTasks * 8) + ((stats.discipline || 0) + (stats.focusPoints || 0)) / 4),
    mindfulness: Math.min(100, 50 + (personalTasks * 6) + ((stats.mentalResilience || 0) + (stats.discipline || 0)) / 4),
    social: Math.min(100, 50 + ((stats.agility || 0) + (stats.creativity || 0)) / 4)
  };
};

// Export achievements for compatibility
export const achievements = [
  { name: "First Steps", description: "Complete your first task", unlockCondition: (stats) => stats.completedTasks >= 1 },
  { name: "Task Master", description: "Complete 10 tasks", unlockCondition: (stats) => stats.completedTasks >= 10 },
  { name: "Productivity Guru", description: "Complete 50 tasks", unlockCondition: (stats) => stats.completedTasks >= 50 },
  { name: "Quest Legend", description: "Complete 100 tasks", unlockCondition: (stats) => stats.completedTasks >= 100 },
  { name: "Level Up", description: "Reach level 5", unlockCondition: (stats) => stats.currentLevel >= 5 },
  { name: "Rising Star", description: "Reach level 10", unlockCondition: (stats) => stats.currentLevel >= 10 },
  { name: "Elite Hunter", description: "Reach level 25", unlockCondition: (stats) => stats.currentLevel >= 25 },
  { name: "Shadow Monarch", description: "Reach level 50", unlockCondition: (stats) => stats.currentLevel >= 50 },
  { name: "Infinity Walker", description: "Reach level 100", unlockCondition: (stats) => stats.currentLevel >= 100 }
]; 