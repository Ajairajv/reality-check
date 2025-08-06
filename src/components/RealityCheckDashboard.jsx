import { motion } from 'framer-motion';
import { 
  statNames, 
  statDescriptions, 
  getTitleByLevel, 
  getLevelColor,
  getXpToNextLevel,
  calculateLifestyleScores
} from '../models/realityCheckStats';
import ExerciseTracker from './ExerciseTracker';

const RealityCheckDashboard = ({ user, tasks, realityStats, onStatUpdate, onAddNotification }) => {
  if (!user || !realityStats) {
    return (
      <div className="flex justify-center">
        <div className="bg-gray-900 border border-gray-700/50 rounded-xl max-w-2xl w-full">
          <div className="text-center py-16">
            <h2 className="text-2xl font-black mb-4 text-white">🎯 Reality Check</h2>
            <p className="text-gray-400">Select a user to view Reality Check stats</p>
          </div>
        </div>
      </div>
    );
  }

  const lifestyleScores = calculateLifestyleScores(realityStats, tasks);
  const xpToNext = getXpToNextLevel(realityStats.xp);
  const currentTitle = getTitleByLevel(realityStats.currentLevel);
  const levelColor = getLevelColor(realityStats.currentLevel);

  // Core RPG Stats
  const coreStats = ['strength', 'agility', 'discipline', 'intelligence'];
  const advancedStats = ['focusPoints', 'mentalResilience', 'physicalEndurance', 'creativity'];

  const StatBar = ({ stat, value, max = 100, gradient }) => {
    const percentage = Math.min((value / max) * 100, 100);
    
    return (
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <span className="text-xs font-bold text-gray-300">{statNames[stat]}</span>
          <span className="text-xs font-black text-white">{value}</span>
        </div>
        <div className="w-full bg-gray-800 rounded-full h-2 border border-gray-700">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${percentage}%` }}
            transition={{ duration: 1, delay: 0.2 }}
            className={`h-full bg-gradient-to-r ${gradient} rounded-full`}
          />
        </div>
        <p className="text-xs text-gray-400 leading-tight">{statDescriptions[stat]}</p>
      </div>
    );
  };

  const LifestyleScore = ({ label, score, icon, color }) => (
    <div className="text-center">
      <div className={`radial-progress ${color} text-sm font-bold mb-2 border-2`} 
           style={{"--value": score, "--size": "3.5rem", "--thickness": "3px"}}>
        {Math.round(score)}
      </div>
      <div className="text-lg mb-1">{icon}</div>
      <div className="text-xs font-bold text-gray-300">{label}</div>
    </div>
  );

  return (
    <div className="space-y-10">
      {/* Hero Panel - Centered & Compact */}
      <div className="flex justify-center">
        <div className="bg-gray-900 border border-purple-500/30 rounded-xl p-6 max-w-4xl w-full">
          <div className="text-center">
            <motion.div
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 3, repeat: Infinity }}
              className="text-4xl font-black text-purple-400 mb-2"
            >
              Level {realityStats.currentLevel}
            </motion.div>
            <h2 className="text-xl font-bold mb-3 text-yellow-400">{currentTitle}</h2>
            <div className="badge bg-purple-600 text-white font-bold px-3 py-2">{user.name}</div>

            {/* XP Progress */}
            <div className="mt-6">
              <div className="flex justify-between text-sm mb-2 font-bold text-gray-300">
                <span>Experience Progress</span>
                <span>{realityStats.xp} XP</span>
              </div>
              <div className="w-full bg-gray-800 rounded-full h-3 border border-gray-700">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${((realityStats.xp % 100) / 100) * 100}%` }}
                  transition={{ duration: 2 }}
                  className="h-full bg-gradient-to-r from-purple-500 to-cyan-500 rounded-full"
                />
              </div>
              <div className="text-xs text-gray-400 mt-2 text-center">
                {xpToNext} XP to next level
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Core RPG Stats - Centered Grid */}
      <div className="flex justify-center mt-8">
        <div className="bg-gray-900 border border-blue-500/30 rounded-xl p-8 max-w-4xl w-full">
          <h3 className="text-lg font-black mb-6 text-blue-400 text-center">
            💪 Core Attributes
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {coreStats.map((stat) => (
              <StatBar
                key={stat}
                stat={stat}
                value={realityStats[stat] || 0}
                gradient="from-blue-500 to-cyan-500"
              />
            ))}
          </div>
        </div>
      </div>

      {/* Advanced Stats - Centered Grid */}
      <div className="flex justify-center mt-8">
        <div className="bg-gray-900 border border-green-500/30 rounded-xl p-8 max-w-4xl w-full">
          <h3 className="text-lg font-black mb-6 text-green-400 text-center">
            🧠 Advanced Abilities
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {advancedStats.map((stat) => (
              <StatBar
                key={stat}
                stat={stat}
                value={realityStats[stat] || 0}
                gradient="from-green-500 to-emerald-500"
              />
            ))}
          </div>
        </div>
      </div>

      {/* Lifestyle Scores - Centered Grid */}
      <div className="flex justify-center mt-8">
        <div className="bg-gray-900 border border-amber-500/30 rounded-xl p-8 max-w-4xl w-full">
          <h3 className="text-lg font-black mb-6 text-amber-400 text-center">
            🌟 Lifestyle Balance
          </h3>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            <LifestyleScore 
              label="Health" 
              score={lifestyleScores.health} 
              icon="💪" 
              color="text-red-400 border-red-500/30"
            />
            <LifestyleScore 
              label="Productivity" 
              score={lifestyleScores.productivity} 
              icon="🚀" 
              color="text-blue-400 border-blue-500/30"
            />
            <LifestyleScore 
              label="Mindfulness" 
              score={lifestyleScores.mindfulness} 
              icon="🧘" 
              color="text-green-400 border-green-500/30"
            />
            <LifestyleScore 
              label="Social" 
              score={lifestyleScores.social} 
              icon="👥" 
              color="text-purple-400 border-purple-500/30"
            />
          </div>
        </div>
      </div>

      {/* Exercise Tracker - Centered */}
      <div className="flex justify-center mt-8">
        <div className="max-w-4xl w-full">
          <ExerciseTracker
            onStatBoost={(statBoosts, xpGain) => {
              if (onStatUpdate) {
                // Apply stat boosts to the user's reality stats
                onStatUpdate(statBoosts, xpGain);
              }
            }}
            onAddNotification={onAddNotification}
          />
        </div>
      </div>

      {/* Achievement Showcase - Centered */}
      {realityStats.achievements && realityStats.achievements.length > 0 && (
        <div className="flex justify-center">
          <div className="bg-gray-900 border border-yellow-500/30 rounded-xl p-6 max-w-4xl w-full">
            <h3 className="text-lg font-black mb-6 text-yellow-400 text-center">
              🏆 Recent Achievements
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {realityStats.achievements.slice(-6).map((achievement, index) => (
                <motion.div
                  key={achievement.name + index}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-yellow-900/20 border border-yellow-500/30 rounded-lg p-4"
                >
                  <div className="flex items-center space-x-3">
                    <div className="text-2xl">🏆</div>
                    <div>
                      <div className="font-black text-sm text-white">{achievement.name}</div>
                      <div className="text-xs text-gray-400">{achievement.description}</div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RealityCheckDashboard; 