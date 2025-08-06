import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const ExerciseTracker = ({ user, onStatBoost, onAddNotification }) => {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [showExerciseModal, setShowExerciseModal] = useState(false);
  const [selectedExercise, setSelectedExercise] = useState(null);
  const [exerciseData, setExerciseData] = useState({
    sets: '',
    reps: '',
    weight: '',
    duration: '',
    pages: '',
    minutes: '',
    difficulty: 'normal'
  });

  // Helper function for difficulty multiplier
  const getDifficultyMultiplier = (difficulty) => {
    const multipliers = {
      'easy': 0.8,
      'normal': 1.0,
      'hard': 1.3,
      'extreme': 1.5
    };
    return multipliers[difficulty] || 1.0;
  };

  // Exercise categories and their stat benefits
  const exerciseCategories = [
    {
      id: 'chest_biceps',
      name: 'Chest & Biceps',
      icon: '💪',
      color: 'from-red-500 to-red-600',
      primaryStat: 'strength',
      exercises: [
        { name: 'Push-ups', type: 'reps', baseReward: { strength: 2, physicalEndurance: 1 } },
        { name: 'Bench Press', type: 'weight', baseReward: { strength: 3, physicalEndurance: 1 } },
        { name: 'Bicep Curls', type: 'weight', baseReward: { strength: 2 } },
        { name: 'Chest Flyes', type: 'weight', baseReward: { strength: 2, physicalEndurance: 1 } },
        { name: 'Diamond Push-ups', type: 'reps', baseReward: { strength: 3 } }
      ]
    },
    {
      id: 'shoulders_back',
      name: 'Shoulders & Back',
      icon: '🏋️',
      color: 'from-orange-500 to-red-500',
      primaryStat: 'strength',
      exercises: [
        { name: 'Pull-ups', type: 'reps', baseReward: { strength: 3, physicalEndurance: 2 } },
        { name: 'Shoulder Press', type: 'weight', baseReward: { strength: 2, physicalEndurance: 1 } },
        { name: 'Rows', type: 'weight', baseReward: { strength: 2, physicalEndurance: 1 } },
        { name: 'Lateral Raises', type: 'weight', baseReward: { strength: 2 } },
        { name: 'Deadlifts', type: 'weight', baseReward: { strength: 4, physicalEndurance: 2 } }
      ]
    },
    {
      id: 'legs',
      name: 'Leg Day',
      icon: '🦵',
      color: 'from-yellow-500 to-orange-500',
      primaryStat: 'strength',
      exercises: [
        { name: 'Squats', type: 'reps', baseReward: { strength: 3, physicalEndurance: 2 } },
        { name: 'Lunges', type: 'reps', baseReward: { strength: 2, agility: 1, physicalEndurance: 1 } },
        { name: 'Leg Press', type: 'weight', baseReward: { strength: 3, physicalEndurance: 1 } },
        { name: 'Calf Raises', type: 'reps', baseReward: { strength: 1, agility: 1 } },
        { name: 'Bulgarian Split Squats', type: 'reps', baseReward: { strength: 3, agility: 2 } }
      ]
    },
    {
      id: 'cardio',
      name: 'Cardio & Endurance',
      icon: '🏃',
      color: 'from-green-500 to-blue-500',
      primaryStat: 'physicalEndurance',
      exercises: [
        { name: 'Running', type: 'duration', baseReward: { physicalEndurance: 3, agility: 2, discipline: 1 } },
        { name: 'Cycling', type: 'duration', baseReward: { physicalEndurance: 2, agility: 1 } },
        { name: 'Swimming', type: 'duration', baseReward: { physicalEndurance: 3, strength: 1, agility: 1 } },
        { name: 'HIIT Workout', type: 'duration', baseReward: { physicalEndurance: 4, agility: 2, discipline: 2 } },
        { name: 'Jump Rope', type: 'duration', baseReward: { physicalEndurance: 2, agility: 3 } }
      ]
    },
    {
      id: 'mindfulness',
      name: 'Mindfulness & Mental',
      icon: '🧘',
      color: 'from-purple-500 to-purple-600',
      primaryStat: 'discipline',
      exercises: [
        { name: 'Meditation', type: 'duration', baseReward: { discipline: 3, mentalResilience: 2, focusPoints: 1 } },
        { name: 'Yoga', type: 'duration', baseReward: { discipline: 2, physicalEndurance: 1, mentalResilience: 1, agility: 1 } },
        { name: 'Breathing Exercises', type: 'duration', baseReward: { discipline: 2, mentalResilience: 2 } },
        { name: 'Cold Shower', type: 'duration', baseReward: { discipline: 3, mentalResilience: 3 } },
        { name: 'Journaling', type: 'duration', baseReward: { discipline: 1, intelligence: 1, creativity: 1 } }
      ]
    },
    {
      id: 'learning',
      name: 'Learning & Reading',
      icon: '📚',
      color: 'from-blue-500 to-blue-600',
      primaryStat: 'intelligence',
      exercises: [
        { name: 'Reading Books', type: 'pages', baseReward: { intelligence: 3, focusPoints: 2, creativity: 1 } },
        { name: 'Online Course', type: 'duration', baseReward: { intelligence: 4, focusPoints: 2 } },
        { name: 'Language Learning', type: 'duration', baseReward: { intelligence: 2, focusPoints: 1, discipline: 1 } },
        { name: 'Podcasts', type: 'duration', baseReward: { intelligence: 2, focusPoints: 1 } },
        { name: 'Research', type: 'duration', baseReward: { intelligence: 3, focusPoints: 2 } }
      ]
    },
    {
      id: 'creative',
      name: 'Creative & Arts',
      icon: '🎨',
      color: 'from-pink-500 to-purple-500',
      primaryStat: 'creativity',
      exercises: [
        { name: 'Drawing/Painting', type: 'duration', baseReward: { creativity: 3, focusPoints: 1 } },
        { name: 'Music Practice', type: 'duration', baseReward: { creativity: 3, focusPoints: 2, discipline: 1 } },
        { name: 'Writing', type: 'duration', baseReward: { creativity: 2, intelligence: 1, focusPoints: 1 } },
        { name: 'Photography', type: 'duration', baseReward: { creativity: 2, focusPoints: 1 } },
        { name: 'Crafting/DIY', type: 'duration', baseReward: { creativity: 2, focusPoints: 1 } }
      ]
    },
    {
      id: 'social',
      name: 'Social & Communication',
      icon: '👥',
      color: 'from-cyan-500 to-blue-500',
      primaryStat: 'agility',
      exercises: [
        { name: 'Public Speaking', type: 'duration', baseReward: { agility: 3, mentalResilience: 2, intelligence: 1 } },
        { name: 'Social Events', type: 'duration', baseReward: { agility: 2, mentalResilience: 1 } },
        { name: 'Team Sports', type: 'duration', baseReward: { agility: 2, physicalEndurance: 2, strength: 1 } },
        { name: 'Networking', type: 'duration', baseReward: { agility: 2, intelligence: 1 } },
        { name: 'Presentations', type: 'duration', baseReward: { agility: 2, intelligence: 2, mentalResilience: 1 } }
      ]
    }
  ];

  const logExercise = () => {
    if (!selectedExercise || !user) return;

    const category = exerciseCategories.find(cat => 
      cat.exercises.some(ex => ex.name === selectedExercise.name)
    );

    // Calculate stat rewards based on performance
    let multiplier = 1;
    let performanceText = '';

    if (selectedExercise.type === 'reps' && exerciseData.reps) {
      const reps = parseInt(exerciseData.reps);
      if (reps >= 50) multiplier = 2;
      else if (reps >= 30) multiplier = 1.5;
      else if (reps >= 20) multiplier = 1.2;
      performanceText = `${reps} reps`;
    } else if (selectedExercise.type === 'duration' && exerciseData.duration) {
      const duration = parseInt(exerciseData.duration);
      if (duration >= 60) multiplier = 2;
      else if (duration >= 30) multiplier = 1.5;
      else if (duration >= 15) multiplier = 1.2;
      performanceText = `${duration} minutes`;
    } else if (selectedExercise.type === 'weight' && exerciseData.weight) {
      const weight = parseInt(exerciseData.weight);
      if (weight >= 100) multiplier = 2;
      else if (weight >= 50) multiplier = 1.5;
      else if (weight >= 25) multiplier = 1.2;
      performanceText = `${weight} lbs`;
    } else if (selectedExercise.type === 'pages' && exerciseData.pages) {
      const pages = parseInt(exerciseData.pages);
      if (pages >= 50) multiplier = 2;
      else if (pages >= 25) multiplier = 1.5;
      else if (pages >= 10) multiplier = 1.2;
      performanceText = `${pages} pages`;
    }

    // Difficulty multiplier
    const difficultyMultiplier = {
      'easy': 0.8,
      'normal': 1,
      'hard': 1.3,
      'extreme': 1.5
    };

    const finalMultiplier = multiplier * (difficultyMultiplier[exerciseData.difficulty] || 1);

    // Calculate final stat rewards
    const statRewards = {};
    Object.entries(selectedExercise.baseReward).forEach(([stat, value]) => {
      statRewards[stat] = Math.round(value * finalMultiplier);
    });

    // Apply stat boosts
    onStatBoost(statRewards);

    // Show notification
    const statGains = Object.entries(statRewards)
      .map(([stat, value]) => `+${value} ${stat}`)
      .join(', ');
    
    onAddNotification(
      `💪 ${selectedExercise.name} completed! ${performanceText} - ${statGains}`, 
      'success'
    );

    // Reset form
    setExerciseData({
      sets: '',
      reps: '',
      weight: '',
      duration: '',
      pages: '',
      minutes: '',
      difficulty: 'normal'
    });
    setShowExerciseModal(false);
    setSelectedExercise(null);
  };

  const openExerciseModal = (exercise, category) => {
    setSelectedExercise(exercise);
    setSelectedCategory(category);
    setShowExerciseModal(true);
  };

  return (
    <div className="space-y-6">
      {/* Exercise Categories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {exerciseCategories.map((category, index) => (
          <motion.div
            key={category.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="card bg-base-200 shadow-xl card-hover cursor-pointer"
            onClick={() => setSelectedCategory(selectedCategory === category ? null : category)}
          >
            <div className="card-body p-4">
              <div className="text-center">
                <div className={`w-16 h-16 mx-auto mb-3 rounded-full bg-gradient-to-r ${category.color} flex items-center justify-center text-2xl`}>
                  {category.icon}
                </div>
                <h3 className="font-bold text-sm">{category.name}</h3>
                <p className="text-xs text-base-content/70 capitalize">
                  Primary: {category.primaryStat}
                </p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Selected Category Exercises */}
      <AnimatePresence>
        {selectedCategory && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="card bg-base-200 shadow-xl"
          >
            <div className="card-body">
              <h3 className="card-title">
                <span className="text-2xl">{selectedCategory.icon}</span>
                {selectedCategory.name} Exercises
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
                {selectedCategory.exercises.map((exercise, index) => (
                  <motion.div
                    key={exercise.name}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.1 }}
                    className="card bg-base-300 shadow-md card-hover cursor-pointer"
                    onClick={() => openExerciseModal(exercise, selectedCategory)}
                  >
                    <div className="card-body p-4">
                      <h4 className="font-semibold text-sm">{exercise.name}</h4>
                      <p className="text-xs text-base-content/70 capitalize">
                        Type: {exercise.type}
                      </p>
                      <div className="flex flex-wrap gap-1 mt-2">
                        {Object.entries(exercise.baseReward).map(([stat, value]) => (
                          <div key={stat} className="badge badge-sm badge-primary">
                            +{value} {stat}
                          </div>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Exercise Logging Modal - Properly Centered */}
      <AnimatePresence>
        {showExerciseModal && selectedExercise && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ backdropFilter: 'blur(8px)', backgroundColor: 'rgba(0, 0, 0, 0.7)' }}
            onClick={() => setShowExerciseModal(false)}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0, y: 50 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.8, opacity: 0, y: 50 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="bg-gray-900 border border-purple-500/30 rounded-2xl p-8 max-w-md w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <button 
                className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2 text-white hover:bg-gray-700"
                onClick={() => setShowExerciseModal(false)}
              >
                ✕
              </button>
              
              <div className="text-center mb-6">
                <div className="text-4xl mb-2">{selectedExercise.category?.icon || '🏋️'}</div>
                <h3 className="text-2xl font-bold text-white mb-2">{selectedExercise.name}</h3>
                <p className="text-gray-300 capitalize">Type: {selectedExercise.type}</p>
              </div>

              <div className="space-y-4">
                {/* Exercise Type Specific Inputs */}
                {selectedExercise.type === 'reps' && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="form-control">
                        <label className="label">
                          <span className="label-text text-gray-300 font-bold">🔢 Reps</span>
                        </label>
                        <div className="relative">
                          <input
                            type="number"
                            placeholder="15"
                            value={exerciseData.reps}
                            onChange={(e) => setExerciseData({...exerciseData, reps: e.target.value})}
                            className="input input-bordered bg-gray-800 border-gray-600 text-white pr-12 text-lg font-bold"
                          />
                          <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-green-400 font-bold text-sm">
                            reps
                          </span>
                        </div>
                      </div>
                      <div className="form-control">
                        <label className="label">
                          <span className="label-text text-gray-300 font-bold">📊 Sets</span>
                        </label>
                        <div className="relative">
                          <input
                            type="number"
                            placeholder="3"
                            value={exerciseData.sets}
                            onChange={(e) => setExerciseData({...exerciseData, sets: e.target.value})}
                            className="input input-bordered bg-gray-800 border-gray-600 text-white pr-12 text-lg font-bold"
                          />
                          <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-blue-400 font-bold text-sm">
                            sets
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {selectedExercise.type === 'duration' && (
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text text-gray-300 font-bold">⏱️ Duration</span>
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        placeholder="30"
                        value={exerciseData.duration}
                        onChange={(e) => setExerciseData({...exerciseData, duration: e.target.value})}
                        className="input input-bordered bg-gray-800 border-gray-600 text-white pr-16 text-lg font-bold"
                      />
                      <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-orange-400 font-bold text-sm">
                        minutes
                      </span>
                    </div>
                  </div>
                )}

                {selectedExercise.type === 'weight' && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="form-control">
                        <label className="label">
                          <span className="label-text text-gray-300 font-bold">⚖️ Weight</span>
                        </label>
                        <div className="relative">
                          <input
                            type="number"
                            step="0.5"
                            placeholder="60"
                            value={exerciseData.weight}
                            onChange={(e) => setExerciseData({...exerciseData, weight: e.target.value})}
                            className="input input-bordered bg-gray-800 border-gray-600 text-white pr-12 text-lg font-bold"
                          />
                          <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-purple-400 font-bold text-sm">
                            kg
                          </span>
                        </div>
                      </div>
                      <div className="form-control">
                        <label className="label">
                          <span className="label-text text-gray-300 font-bold">🔢 Reps</span>
                        </label>
                        <div className="relative">
                          <input
                            type="number"
                            placeholder="10"
                            value={exerciseData.reps}
                            onChange={(e) => setExerciseData({...exerciseData, reps: e.target.value})}
                            className="input input-bordered bg-gray-800 border-gray-600 text-white pr-12 text-lg font-bold"
                          />
                          <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-green-400 font-bold text-sm">
                            reps
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="form-control">
                      <label className="label">
                        <span className="label-text text-gray-300 font-bold">📊 Sets</span>
                      </label>
                      <div className="relative">
                        <input
                          type="number"
                          placeholder="3"
                          value={exerciseData.sets}
                          onChange={(e) => setExerciseData({...exerciseData, sets: e.target.value})}
                          className="input input-bordered bg-gray-800 border-gray-600 text-white pr-12 text-lg font-bold"
                        />
                        <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-blue-400 font-bold text-sm">
                          sets
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                {selectedExercise.type === 'pages' && (
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text text-gray-300 font-bold">📖 Pages</span>
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        placeholder="25"
                        value={exerciseData.pages}
                        onChange={(e) => setExerciseData({...exerciseData, pages: e.target.value})}
                        className="input input-bordered bg-gray-800 border-gray-600 text-white pr-12 text-lg font-bold"
                      />
                      <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-cyan-400 font-bold text-sm">
                        pages
                      </span>
                    </div>
                  </div>
                )}

                {/* Difficulty Level */}
                <div className="form-control">
                  <label className="label">
                    <span className="label-text text-gray-300">Difficulty Level</span>
                  </label>
                  <select
                    value={exerciseData.difficulty}
                    onChange={(e) => setExerciseData({...exerciseData, difficulty: e.target.value})}
                    className="select select-bordered bg-gray-800 border-gray-600 text-white"
                  >
                    <option value="easy">Easy (0.8x rewards)</option>
                    <option value="normal">Normal (1.0x rewards)</option>
                    <option value="hard">Hard (1.3x rewards)</option>
                    <option value="extreme">Extreme (1.5x rewards)</option>
                  </select>
                </div>

                {/* Expected Rewards Preview */}
                <div className="bg-gray-800/50 border border-gray-600/50 rounded-lg p-4">
                  <h4 className="font-bold text-white mb-3">💪 Expected Rewards:</h4>
                  <div className="space-y-2">
                    <div className="flex flex-wrap gap-2">
                      {Object.entries(selectedExercise.baseReward || {}).map(([stat, value]) => (
                        <div key={stat} className="badge bg-purple-600 text-white border-0">
                          +{Math.round(value * getDifficultyMultiplier(exerciseData.difficulty))} {stat}
                        </div>
                      ))}
                    </div>
                    <div className="text-center">
                      <div className="badge bg-gradient-to-r from-yellow-500 to-orange-500 text-white border-0 font-bold">
                        ⚡ +{Math.round(50 * getDifficultyMultiplier(exerciseData.difficulty))} XP
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex justify-center gap-4 pt-4">
                  <button
                    onClick={() => setShowExerciseModal(false)}
                    className="btn bg-gray-700 text-white border-gray-600 hover:bg-gray-600"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={logExercise}
                    className="btn bg-gradient-to-r from-purple-600 to-indigo-600 text-white border-0 font-bold hover:shadow-lg"
                  >
                    ⚡ Log Exercise
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ExerciseTracker; 