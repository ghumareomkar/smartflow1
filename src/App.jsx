import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { AppProvider } from './context/AppContext';
import { useAuth } from './context/AuthContext';

import Navbar from './components/Navbar';
import LoginPage from './pages/LoginPage';
import LandingPage from './pages/LandingPage';
import Dashboard from './pages/Dashboard';
import TaskManagement from './pages/TaskManagement';
import WorkersMachines from './pages/WorkersMachines';
import Resources from './pages/Resources';
import SimulationPanel from './pages/SimulationPanel';
import Reports from './pages/Reports';
import ProfilePage from './pages/ProfilePage';

const pageVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } },
  exit: { opacity: 0, y: -20, transition: { duration: 0.3, ease: 'easeIn' } },
};

function ProtectedRoute({ children }) {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return children;
}

function AnimatedRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/login" element={
          <motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit">
            <LoginPage />
          </motion.div>
        } />
        <Route path="/" element={
          <ProtectedRoute>
            <motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit">
              <LandingPage />
            </motion.div>
          </ProtectedRoute>
        } />
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit">
              <Dashboard />
            </motion.div>
          </ProtectedRoute>
        } />
        <Route path="/tasks" element={
          <ProtectedRoute>
            <motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit">
              <TaskManagement />
            </motion.div>
          </ProtectedRoute>
        } />
        <Route path="/workers" element={
          <ProtectedRoute>
            <motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit">
              <WorkersMachines />
            </motion.div>
          </ProtectedRoute>
        } />
        <Route path="/resources" element={
          <ProtectedRoute>
            <motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit">
              <Resources />
            </motion.div>
          </ProtectedRoute>
        } />
        <Route path="/simulation" element={
          <ProtectedRoute>
            <motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit">
              <SimulationPanel />
            </motion.div>
          </ProtectedRoute>
        } />
        <Route path="/reports" element={
          <ProtectedRoute>
            <motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit">
              <Reports />
            </motion.div>
          </ProtectedRoute>
        } />
        <Route path="/profile" element={
          <ProtectedRoute>
            <motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit">
              <ProfilePage />
            </motion.div>
          </ProtectedRoute>
        } />
      </Routes>
    </AnimatePresence>
  );
}

export default function App() {
  return (
    <AppProvider>
      <Router>
        <div className="min-h-screen" style={{ background: 'var(--bg-primary)', transition: 'background 0.3s ease' }}>
          <Navbar />
          <AnimatedRoutes />
        </div>
      </Router>
    </AppProvider>
  );
}
