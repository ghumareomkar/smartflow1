<p align="center">
  <img src="https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=white" />
  <img src="https://img.shields.io/badge/Vite-8-646CFF?style=for-the-badge&logo=vite&logoColor=white" />
  <img src="https://img.shields.io/badge/Three.js-0.183-000000?style=for-the-badge&logo=threedotjs&logoColor=white" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-3.4-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white" />
  <img src="https://img.shields.io/badge/Framer_Motion-12-FF0055?style=for-the-badge&logo=framer&logoColor=white" />
</p>

<h1 align="center">⚡ SmartFlow</h1>
<h3 align="center">AI-Powered Workflow Optimization for Smart Factory Shopfloor</h3>

<p align="center">
  A premium, futuristic web dashboard that simulates intelligent industrial workflows — featuring real-time task management, predictive analytics, bottleneck detection, what-if simulations, and a stunning dark-mode UI with glassmorphism & 3D visuals.
</p>

<p align="center">
  <a href="#-features">Features</a> •
  <a href="#-tech-stack">Tech Stack</a> •
  <a href="#-getting-started">Getting Started</a> •
  <a href="#-project-structure">Structure</a> •
  <a href="#-pages-overview">Pages</a> •
  <a href="#-demo-credentials">Demo</a>
</p>

---

## 🎯 Features

| Category | Features |
|----------|----------|
| **🧠 AI Scheduling** | Auto-assign tasks to workers based on skills, availability & priority |
| **🔥 Bottleneck Detection** | Real-time heatmap of overloaded workers with severity levels |
| **🔮 Predictive Alerts** | Early warning system for tasks approaching deadlines |
| **🎮 What-If Simulation** | Remove workers, increase workload — see predicted factory impact |
| **📊 Live Analytics** | KPI cards, pie charts, bar charts, area charts, line charts |
| **🏆 Gamification** | Worker leaderboard with points system and rankings |
| **🔄 Resource Transfer** | Reassign tasks between workers on the fly |
| **🌓 Dark/Light Theme** | Full theme toggle with smooth transitions |
| **🎨 Glassmorphism UI** | Frosted glass cards, gradient buttons, neon glows |
| **🌐 3D Landing Page** | Interactive Three.js scene with orbiting particles |

---

## 🛠 Tech Stack

```
Frontend Framework  →  React 19 (JSX)
Build Tool          →  Vite 8
Styling             →  Tailwind CSS 3 + Custom CSS Variables
Animations          →  Framer Motion + GSAP
3D Graphics         →  Three.js + React Three Fiber + Drei
Charts              →  Recharts
Routing             →  React Router v7
Scroll Animations   →  AOS (Animate On Scroll)
State Management    →  React Context + useReducer
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** (v18 or higher)
- **npm** (v9 or higher)

### Installation

```bash
# Clone the repository
git clone https://github.com/ghumareomkar/smartflow1.git

# Navigate to the project
cd smartflow1

# Install dependencies
npm install

# Start development server
npm run dev
```

The app will open at **http://localhost:5173**

### Build for Production

```bash
npm run build
npm run preview
```

---

## 🔐 Demo Credentials

| Field | Value |
|-------|-------|
| **User ID** | `semicolon` |
| **Password** | `1212` |

> 💡 These are hardcoded demo credentials. No backend or database is required.

---

## 📁 Project Structure

```
smart-factory/
│
├── index.html                  # Entry point (Google Fonts, AOS CDN)
├── package.json                # Dependencies & scripts
├── tailwind.config.js          # Tailwind configuration
├── postcss.config.js           # PostCSS plugins
│
├── src/
│   ├── main.jsx                # React root (AuthProvider → ThemeProvider → App)
│   ├── App.jsx                 # Router setup, ProtectedRoute, AnimatedRoutes
│   ├── index.css               # Complete design system (variables, glass, grid)
│   │
│   ├── context/
│   │   ├── AuthContext.jsx     # Authentication state (login/logout)
│   │   ├── ThemeContext.jsx    # Dark/light theme toggle
│   │   └── AppContext.jsx      # App state: tasks, workers, machines (useReducer)
│   │
│   ├── data/
│   │   ├── tasks.json          # 16 factory tasks (CNC, welding, quality, etc.)
│   │   ├── workers.json        # 8 workers with skills & performance data
│   │   └── machines.json       # 6 machines with utilization & status
│   │
│   ├── components/
│   │   ├── Navbar.jsx          # Navigation bar + theme toggle + profile dropdown
│   │   ├── GlassCard.jsx       # Reusable glassmorphism card component
│   │   ├── KPICard.jsx         # Animated stat card with trend indicators
│   │   ├── AnimatedCounter.jsx # Smooth number animation (easeOutCubic)
│   │   ├── SmartInsights.jsx   # AI insights with typewriter effect
│   │   ├── BottleneckHeatmap.jsx # Worker load heatmap visualization
│   │   └── ThreeScene.jsx      # 3D scene (sphere + orbits + particles)
│   │
│   └── pages/
│       ├── LoginPage.jsx       # Animated login form
│       ├── LandingPage.jsx     # Hero + 3D scene + features + CTA
│       ├── Dashboard.jsx       # Main dashboard with bento grid layout
│       ├── TaskManagement.jsx  # Task CRUD + AI auto-assign
│       ├── WorkersMachines.jsx # Leaderboard + worker management
│       ├── Resources.jsx       # Task transfer + machine management
│       ├── SimulationPanel.jsx # What-if scenario simulator
│       ├── Reports.jsx         # Analytics charts & worker table
│       └── ProfilePage.jsx    # Admin profile & certifications
```

---

## 📄 Pages Overview

### 🔑 Login
Glassmorphism login form with animated error states, show/hide password toggle, and demo credential hint.

### 🏠 Landing Page
Full-screen hero section with an interactive **Three.js 3D scene** (distorted sphere, orbital rings, floating cubes, 200 particles), GSAP-animated gradient orbs, parallax scroll, feature cards, and call-to-action.

### 📊 Dashboard
Bento grid layout featuring:
- **4 KPI Cards** — Total, Completed, Pending, Delayed (animated counters + trends)
- **Pie Chart** — Task distribution by status
- **AI Insights** — Rotating typewriter messages with live indicator
- **Machine Status** — Cards with utilization progress bars
- **Bar Chart** — Worker efficiency comparison
- **Bottleneck Heatmap** — Worker load (normal → warning → critical)
- **Area Chart** — Today's activity timeline
- **Active Alerts** — Delayed and at-risk task warnings

### 📋 Task Management
- Task cards with status badges, priority indicators, progress bars
- **Filter by status** (All / Pending / In-Progress / Completed / Delayed)
- **Add Task** modal (name, priority, skill, deadline, estimated hours)
- **AI Auto-Assign** — Animates through pending tasks and assigns them to best-fit workers
- **Predictive Delay Alerts** — Highlights tasks approaching deadlines with low progress

### 👥 Workers
- **Leaderboard** — Top 3 workers with gold/silver/bronze medals + points
- **Worker Grid** — All workers with skills, shift, efficiency, active tasks
- **Add Worker** modal — Avatar picker, multi-skill selector, shift, efficiency

### 🔧 Resources
- **Task Transfer** — Reassign all active tasks from one worker to another
- **Machine Management** — View status, utilization, temperature, uptime, operator
- **Add Machine** modal — Name, type, status, utilization, uptime, temperature

### 🔬 Simulation
- **What-If Controls** — Remove a worker + adjust workload (0-100% slider)
- **Animated Loading** — Spinning indicator during calculation
- **Results Dashboard** — Efficiency drop, delay increase, bottleneck risk, active workers
- **Before/After Chart** — Side-by-side efficiency comparison
- **Impact Analysis Table** — Detailed breakdown of scenario effects
- **AI Recommendation** — Context-aware suggestion based on risk level

### 📈 Reports
- **Top Stats** — Completion rate, avg efficiency, avg completion time, total points
- **Efficiency Trend** — Weekly area chart
- **Completion Time by Skill** — Actual vs target bar chart
- **Weekly Output** — Output vs target line chart
- **Skill Distribution** — Pie chart of task types
- **Worker Performance Table** — Sortable table with efficiency bars

### 👤 Profile
- Admin profile card with gradient header, avatar, online status
- Personal information (9 fields with icons)
- Certification badges
- Activity summary stats (tasks reviewed, issues resolved, reports filed)

---

## 🎨 Design System

### Theme Variables
The app uses **CSS custom properties** for full theming:

| Variable | Dark | Light |
|----------|------|-------|
| `--bg-primary` | `#111113` | `#fafafa` |
| `--accent` | `#6366f1` | `#4f46e5` |
| `--success` | `#34d399` | `#059669` |
| `--danger` | `#f87171` | `#dc2626` |
| `--glass-bg` | `rgba(255,255,255,0.03)` | `rgba(255,255,255,0.6)` |

### Key UI Classes
| Class | Effect |
|-------|--------|
| `.glass` | Frosted glass with `blur(20px)` |
| `.glass-strong` | Stronger glass with `blur(30px)` |
| `.gradient-text` | Indigo → purple gradient text |
| `.gradient-btn` | Gradient button with hover glow |
| `.bento-grid` | 4-column responsive CSS grid |
| `.neon-glow-*` | Soft colored box shadows |
| `.pulse-dot` | Animated status pulse indicator |

---

## 🧠 State Management

All app state is managed via **React Context + useReducer** with the following actions:

| Action | Description |
|--------|-------------|
| `ADD_TASK` | Create a new factory task |
| `UPDATE_TASK` | Modify task properties |
| `DELETE_TASK` | Remove a task |
| `ADD_WORKER` | Register a new worker |
| `ADD_MACHINE` | Add a new machine |
| `AUTO_ASSIGN` | AI-assign pending tasks to available workers |
| `RUN_SIMULATION` | Execute what-if scenario |
| `RESET_SIMULATION` | Clear simulation results |
| `RESET_ALL` | Reset entire app to initial state |

---

## 📊 Data (All Dummy — No Backend)

| Data | Count | Key Fields |
|------|-------|------------|
| **Tasks** | 16 | name, priority, deadline, skill, status, progress |
| **Workers** | 8 | name, skills[], availability, efficiency, points |
| **Machines** | 6 | name, type, status, utilization, temperature |

> ⚠️ **No API calls, no database, no backend.** Everything runs client-side with local JSON data and React state.

---

## 📝 License

This project is for educational and demonstration purposes.

---

<p align="center">
  Built with ❤️ by <a href="https://github.com/ghumareomkar">Semicolon squad</a>
</p>
