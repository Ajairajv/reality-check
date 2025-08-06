# ⚔️ Reality Check - Gamified Task Manager

> Transform your productivity into an epic RPG adventure! Level up your real-life skills through quest completion and strategic training.

[![Next.js](https://img.shields.io/badge/Next.js-15.4.5-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.1.0-blue?style=for-the-badge&logo=react)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.1.11-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
[![DaisyUI](https://img.shields.io/badge/DaisyUI-5.0.50-5A0EF8?style=for-the-badge&logo=daisyui)](https://daisyui.com/)

## 🎮 What is Reality Check?

Reality Check is a **gamified task management system** that transforms your daily productivity into an immersive RPG experience. Complete quests (tasks), train your character through real-world activities, and watch your stats grow as you level up in life!

### ✨ Key Features

- 🎯 **Quest System**: Transform tasks into RPG quests with XP rewards
- ⚔️ **Character Progression**: 8 core stats that grow through real activities  
- 🏋️ **Training Arsenal**: 8 activity categories for direct stat boosts
- 📊 **Analytics Dashboard**: Track your lifestyle balance and achievements
- 🌙 **Dark Theme**: Batman/Solo Leveling inspired UI design
- 📱 **Responsive**: Perfect on mobile, tablet, and desktop
- 💾 **Data Persistence**: Local storage + optional JSON Server backend

---

## 🚀 Quick Setup Guide

### 📋 Prerequisites

Before you begin, make sure you have these installed:

- **Node.js** (version 18.0.0 or higher) - [Download here](https://nodejs.org/)
- **npm** (version 8.0.0 or higher) - comes with Node.js
- **Git** - [Download here](https://git-scm.com/)

### 💻 Installation Steps

1. **📂 Clone the Repository**
   ```bash
   git clone https://github.com/your-username/reality-check.git
   cd reality-check
   ```

2. **📦 Install Dependencies**
   ```bash
   npm install
   ```

3. **🚀 Start the Application**

   **Option A: Frontend Only (Recommended for first run)**
   ```bash
   npm run dev
   ```

   **Option B: Frontend + Backend (Full Features)**
   ```bash
   npm run dev:full
   ```

4. **🌐 Open Your Browser**
   
   Go to: **http://localhost:3000**

   🎉 **You're ready to start your RPG journey!**

---

## 🛠️ Available Commands

| Command | Description | When to Use |
|---------|-------------|-------------|
| `npm run dev` | Start development server (frontend only) | ✅ **Best for beginners** - Uses localStorage |
| `npm run dev:full` | Start frontend + JSON Server backend | ⚡ **Full features** - Persistent data |
| `npm run build` | Build for production | 🚀 For deployment |
| `npm run start` | Start production server | 🌐 After build |
| `npm run lint` | Check code quality | 🔍 Find issues |
| `npm run backend` | Start JSON Server only | 🗄️ Backend testing |
| `npm run clean` | Clean build files | 🧹 Troubleshooting |

---

## 📖 First-Time User Guide

### 🎯 Getting Started

1. **📋 Dashboard**: Your command center showing level, stats, and progress
2. **🗡️ Quests**: Create and manage your tasks with RPG-style rewards
3. **📊 Stats**: View your character progression and achievements
4. **⚔️ Arsenal**: Complete training activities for instant stat boosts

### ✨ Quick Actions

**Create Your First Quest:**
1. Click the **floating ➕ button** (bottom-right)
2. Add title, description, priority, and due date
3. Complete it to earn XP and level up!

**Train Your Character:**
1. Go to **Stats** tab
2. Scroll to **Training Arsenal**
3. Click any activity (💪 Chest & Biceps, 🧘 Mindfulness, etc.)
4. Choose exercises or complete full workout

---

## 🎮 RPG System Guide

### 🏆 Character Stats

| Stat | Description | How to Improve |
|------|-------------|----------------|
| 💪 **Strength** | Physical power and determination | Gym workouts, physical tasks |
| ⚡ **Agility** | Mental quickness and adaptability | Cardio, social activities |
| 🧘 **Discipline** | Self-control and consistency | Meditation, completing tasks |
| 🧠 **Intelligence** | Problem-solving and learning | Reading, courses, study |
| 🎯 **Focus Points** | Concentration and attention | Study sessions, meditation |
| 🛡️ **Mental Resilience** | Stress resistance | Mindfulness, social interaction |
| 🏃 **Physical Endurance** | Stamina and energy | Cardio, physical training |
| 🎨 **Creativity** | Innovation and expression | Art, music, creative projects |

### 📈 Leveling System

- **Levels 1-100**: Exponential XP scaling for balanced progression
- **Levels 100+**: ♾️ **Infinite progression** with logarithmic scaling
- **XP Sources**: Quest completion, training activities, achievements
- **Titles**: Unlock prestigious titles as you advance

### ⚔️ Training Arsenal

| Activity | Primary Stat | XP Reward | Stat Boosts |
|----------|--------------|-----------|-------------|
| 💪 Chest & Biceps | Strength | 100 XP | +5 Strength, +2 Physical Endurance |
| 🏋️ Shoulders & Back | Strength | 100 XP | +5 Strength, +2 Agility |
| 🦵 Leg Day | Strength | 120 XP | +6 Strength, +3 Physical Endurance |
| 🏃 Cardio & Endurance | Physical Endurance | 100 XP | +6 Physical Endurance, +3 Agility |
| 🧘 Mindfulness & Mental | Discipline | 80 XP | +5 Discipline, +4 Mental Resilience, +3 Focus |
| 📚 Learning & Reading | Intelligence | 90 XP | +6 Intelligence, +3 Focus, +2 Creativity |
| 🎨 Creative & Arts | Creativity | 85 XP | +6 Creativity, +2 Intelligence, +2 Focus |
| 👥 Social & Communication | Agility | 75 XP | +4 Agility, +3 Mental Resilience, +2 Intelligence |

---

## ⚙️ Configuration Options

### 🎨 Customizing the Experience

**Change Theme:**
- Edit `tailwind.config.js` 
- Modify the `themes` array in DaisyUI config

**Add New Activities:**
1. Open `src/components/ExerciseTracker.jsx`
2. Add to `activityCategories` array:
   ```javascript
   {
     id: 'newActivity',
     name: 'Activity Name',
     icon: '🎯',
     primaryStat: 'strength',
     statBoosts: { strength: 5 },
     xpReward: 100
   }
   ```

**Adjust XP/Stat Rewards:**
- Edit `src/models/realityCheckStats.js`
- Modify `getTaskXpReward()` and `getTaskStatBoosts()` functions

---

## 🚨 Troubleshooting

### Common Issues & Solutions

**❌ "Cannot find file" errors:**
```bash
# Make sure you're in the correct directory
cd reality-check
npm install
```

**❌ Port 3000 already in use:**
```bash
# Kill the process or use different port
npx kill-port 3000
# OR
npm run dev -- --port 3001
```

**❌ Build errors:**
```bash
# Clean and rebuild
npm run clean
npm install
npm run build
```

**❌ JSON Server not working:**
```bash
# Install globally if needed
npm install -g json-server@1.0.0-beta.3
npm run backend
```

### 🐛 Still Having Issues?

1. **Check Node.js version**: `node --version` (should be 18+)
2. **Clear npm cache**: `npm cache clean --force`
3. **Delete node_modules**: Remove folder and run `npm install`
4. **Check firewall**: Ensure ports 3000/3001 aren't blocked

---

## 🚀 Deployment Options

### 🌐 Vercel (Recommended - FREE)

1. **Push to GitHub**
2. **Go to [Vercel](https://vercel.com)**
3. **Import your repository**
4. **Deploy automatically!**

### 🏠 Self-Hosting

```bash
# Build the project
npm run build

# Start production server
npm run start

# Or use PM2 for production
npm install -g pm2
pm2 start npm --name "reality-check" -- start
```

### 📦 Static Export

```bash
# For static hosting (GitHub Pages, Netlify)
npm run build
npm run export
```

---

## 🤝 Contributing

Want to make Reality Check even better? Here's how:

1. **Fork the repository**
2. **Create feature branch**: `git checkout -b feature/amazing-feature`
3. **Commit changes**: `git commit -m 'Add amazing feature'`
4. **Push to branch**: `git push origin feature/amazing-feature`
5. **Open Pull Request**

### 🎯 Feature Requests

- 🔐 User Authentication & Profiles
- 👥 Social Features & Leaderboards  
- 📱 Mobile App (React Native)
- 📊 Advanced Analytics & Charts
- 🏆 More Achievement Types
- 📤 Data Import/Export Features

---

## 📄 Project Structure

```
reality-check/
├── 📁 src/
│   ├── 📁 app/                 # Next.js app directory
│   │   ├── 📄 page.tsx        # Main application
│   │   ├── 📄 layout.tsx      # Root layout
│   │   └── 🎨 globals.css     # Global styles
│   ├── 📁 components/         # React components
│   │   ├── 📊 RealityCheckDashboard.jsx  # Stats & progression
│   │   ├── 🏋️ ExerciseTracker.jsx        # Training system
│   │   └── 🐛 DebugPanel.jsx             # Development tools
│   ├── 📁 models/             # Game logic & data models
│   │   └── ⚔️ realityCheckStats.js       # RPG system
│   └── 📁 services/           # API & data services
│       └── 🔌 api.js          # Backend communication
├── 📁 public/                 # Static assets
├── 🗄️ db.json                # JSON Server database
├── ⚙️ package.json           # Dependencies & scripts
└── 📖 README.md              # This file!
```

---

## 💎 Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript
- **Styling**: Tailwind CSS 4, DaisyUI 
- **Animations**: Framer Motion
- **Data**: Local Storage + JSON Server (optional)
- **Build Tools**: ESLint, PostCSS, Autoprefixer

---

## 📞 Support & Community

- 🐛 **Bug Reports**: [GitHub Issues](https://github.com/your-username/reality-check/issues)
- 💬 **Discord**: [Join our community](https://discord.gg/realitycheck)
- 📧 **Email**: support@realitycheck.dev
- 📖 **Documentation**: [Wiki](https://github.com/your-username/reality-check/wiki)

---

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

---

<div align="center">

## ⚔️ Ready to Level Up Your Life? ⚔️

**Start your epic productivity journey today!**

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/your-username/reality-check)

[⭐ Star this repo](https://github.com/your-username/reality-check) • [🚀 Try the demo](https://reality-check-demo.vercel.app) • [📝 Read the docs](https://docs.realitycheck.dev)

**Made with 💜 by the Reality Check Team**

</div>
