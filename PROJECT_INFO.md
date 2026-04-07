# SmartFlow — AI-Powered Smart Factory Dashboard

## 📋 Project Overview

**SmartFlow** is a premium, futuristic web-based Smart Factory Dashboard that simulates complex industrial workflows, task optimization, predictive analytics, and bottleneck detection. It features a dark futuristic UI, glassmorphism, advanced animations, and a compelling demo flow.

---

## 🛠 Tech Stack

| Technology | Purpose |
|---|---|
| **React 19** | UI framework (JSX components) |
| **Vite** | Build tool / dev server |
| **Tailwind CSS 3** | Utility-first CSS framework |
| **Framer Motion** | Page transitions & micro-animations |
| **GSAP** | Advanced timeline animations (landing page) |
| **Three.js + React Three Fiber** | 3D scene on landing page |
| **Recharts** | Charts (Pie, Bar, Area, Line) |
| **AOS** | Animate-on-scroll effects |
| **React Router v7** | SPA routing with protected routes |

---

## 📁 Project Structure

```
smart-factory/
├── index.html              # Entry point (loads fonts, AOS, app)
├── package.json            # Dependencies & scripts
├── tailwind.config.js      # Tailwind configuration
├── postcss.config.js       # PostCSS (Tailwind plugin)
├── src/
│   ├── main.jsx            # React root render (AuthProvider → ThemeProvider → App)
│   ├── App.jsx             # Router, AnimatedRoutes, ProtectedRoute
│   ├── index.css           # Full design system (CSS variables, glass, bento-grid, etc.)
│   ├── context/
│   │   ├── AuthContext.jsx     # Login/logout state (hardcoded demo credentials)
│   │   ├── ThemeContext.jsx    # Dark/light theme toggle (localStorage)
│   │   └── AppContext.jsx      # Main app state: tasks, workers, machines (useReducer)
│   ├── data/
│   │   ├── tasks.json          # 16 dummy factory tasks
│   │   ├── workers.json        # 8 dummy workers with skills, points, efficiency
│   │   └── machines.json       # 6 dummy machines with status & utilization
│   ├── components/
│   │   ├── Navbar.jsx          # Top nav with links, theme toggle, profile dropdown
│   │   ├── GlassCard.jsx       # Reusable glassmorphism card wrapper
│   │   ├── KPICard.jsx         # Animated KPI stat card (with trend indicator)
│   │   ├── AnimatedCounter.jsx # Smooth number counter animation
│   │   ├── SmartInsights.jsx   # AI insight typewriter with rotating messages
│   │   ├── BottleneckHeatmap.jsx # Worker load heatmap (normal/warning/critical)
│   │   ├── ThreeScene.jsx      # 3D animated sphere + orbits + particles
│   │   └── CustomCursor.jsx    # Custom cursor (currently unused)
│   └── pages/
│       ├── LoginPage.jsx       # Login form (ID: semicolon, Password: 1212)
│       ├── LandingPage.jsx     # Hero section with 3D scene + features + CTA
│       ├── Dashboard.jsx       # Main dashboard: KPIs, charts, heatmap, alerts
│       ├── TaskManagement.jsx  # Task CRUD, auto-assign with AI animation
│       ├── WorkersMachines.jsx # Worker leaderboard, all workers grid, add worker
│       ├── Resources.jsx       # Worker task transfer, machine management
│       ├── SimulationPanel.jsx # What-if simulation (remove worker, increase load)
│       ├── Reports.jsx         # Analytics: efficiency trends, charts, worker table
│       └── ProfilePage.jsx    # Admin profile page with certifications
```

---

## 🔐 Authentication (Dummy)

- **User ID:** `semicolon`
- **Password:** `1212`
- Uses `localStorage` for session persistence
- `ProtectedRoute` component redirects unauthenticated users to `/login`

---

## 🎨 Design System

### Theme Variables (CSS Custom Properties)
- **Dark Theme (default):** Deep blacks (`#111113`), glass effects, neon accents
- **Light Theme:** Clean whites/grays with muted accents
- Toggled via `data-theme` attribute on `<html>`

### Key CSS Classes
| Class | Description |
|---|---|
| `.glass` | Glassmorphism with blur(20px) and subtle border |
| `.glass-strong` | Stronger glass effect with blur(30px) |
| `.gradient-text` | Text with gradient fill (indigo → purple) |
| `.gradient-btn` | Button with gradient background + hover glow |
| `.bento-grid` | 4-column CSS grid for dashboard layout |
| `.pulse-dot` | Animated pulsing status indicator |
| `.neon-glow-*` | Soft box-shadow glow effects |

---

## 📊 Data Architecture (All Dummy — No Backend)

### Tasks (16 items)
Each task has: `id`, `name`, `priority` (high/medium/low), `deadline`, `skill`, `status` (pending/in-progress/completed/delayed), `assignedTo` (worker ID), `progress` (0-100), `estimatedHours`

### Workers (8 items)
Each worker has: `id`, `name`, `avatar`, `skills[]`, `availability` (available/busy), `shift`, `points`, `tasksCompleted`, `efficiency` (%)

### Machines (6 items)
Each machine has: `id`, `name`, `type`, `status` (running/idle/maintenance), `utilization` (%), `assignedWorker`, `uptime` (%), `temperature` (°C)

---

## 🧠 State Management (React Context + useReducer)

### AppContext Actions:
| Action | Description |
|---|---|
| `ADD_TASK` | Create a new task |
| `UPDATE_TASK` | Update an existing task |
| `DELETE_TASK` | Remove a task |
| `ADD_WORKER` | Add a new worker |
| `ADD_MACHINE` | Add a new machine |
| `AUTO_ASSIGN` | AI auto-assign pending tasks to available workers |
| `UPDATE_WORKER` | Update worker info |
| `ADD_NOTIFICATION` | Push a notification |
| `CLEAR_NOTIFICATIONS` | Clear all notifications |
| `RUN_SIMULATION` | Run what-if scenario simulation |
| `RESET_SIMULATION` | Clear simulation results |
| `RESET_ALL` | Reset to initial state |

### Computed Values:
- `getDelayedTasks()` — Filters tasks with 'delayed' status
- `getBottlenecks()` — Maps workers to load levels (normal/warning/critical)
- `getWorkerById(id)` — Finds worker by ID

---

## 📄 Pages Detail

### 1. Login Page (`/login`)
- Animated form with glassmorphism
- Show/hide password toggle
- Error animation for wrong credentials
- Demo credential hint at bottom

### 2. Landing Page (`/`)
- Full-screen hero with 3D Three.js scene (orbiting sphere + particles)
- GSAP-animated gradient orbs
- Parallax scroll effects
- Feature cards grid (6 features)
- CTA section + footer

### 3. Dashboard (`/dashboard`)
- 4 KPI cards (Total, Completed, Pending, Delayed) with animated counters
- Bento grid layout with:
  - Pie chart (task distribution by status)
  - AI Insights (typewriter effect, rotating messages)
  - Machine status cards with utilization bars
  - Bar chart (worker efficiency)
  - Bottleneck heatmap (worker load visualization)
  - Area chart (today's activity timeline)
  - Quick summary stats
  - Active alerts (delayed + at-risk tasks)

### 4. Task Management (`/tasks`)
- Task cards with status, priority, progress bars
- Filter by status (all/pending/in-progress/completed/delayed)
- Add Task modal form
- AI Auto-Assign with animated assignment sequence
- Predictive delay alerts

### 5. Workers (`/workers`)
- Leaderboard (top 3 with medals + ranking)
- All workers grid with skills, shift, efficiency, active tasks
- Add Worker modal with avatar picker, skill selector

### 6. Resources (`/resources`)
- Worker task transfer system (reassign tasks between workers)
- Machine management with utilization bars, temperature, uptime
- Add Machine modal
- Transfer confirmation modal

### 7. Simulation (`/simulation`)
- What-if scenario panel:
  - Remove a worker dropdown
  - Workload increase slider (0-100%)
- Animated loading spinner during simulation
- Results: efficiency drop, delay increase, bottleneck risk
- Before/After efficiency bar chart
- Detailed impact analysis table
- AI recommendation text

### 8. Reports (`/reports`)
- Top stats (completion rate, avg efficiency, avg completion time, total points)
- Efficiency trend area chart (weekly)
- Avg completion time by skill (bar chart)
- Weekly output vs target (line chart)
- Task distribution by skill (pie chart)
- Worker performance table with efficiency bars

### 9. Profile (`/profile`)
- Admin profile card with avatar, role, online status
- Personal information list (9 fields)
- Certifications badges
- Activity summary stats
- Sign out button

---

## 🚀 How to Run

```bash
cd smart-factory
npm install
npm run dev
```

Opens at `http://localhost:5173`

---

## 📦 Key Dependencies

```json
{
  "@react-three/drei": "^10.7.7",
  "@react-three/fiber": "^9.5.0",
  "aos": "^2.3.4",
  "framer-motion": "^12.38.0",
  "gsap": "^3.14.2",
  "react-router-dom": "^7.14.0",
  "recharts": "^3.8.1",
  "three": "^0.183.2"
}
```

Dev dependencies: `tailwindcss`, `postcss`, `autoprefixer`, `vite`, `typescript`

---

## ⚠️ Notes

- **No backend / no database** — Everything uses local dummy JSON data
- **No API calls** — All state is managed client-side via React Context
- Auth is hardcoded (demo-only)
- Three.js may show deprecation warnings (`THREE.Clock → THREE.Timer`)
- AOS loaded via CDN in `index.html`
