import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

const ADMIN_USER = {
  id: 'semicolon',
  name: 'Rajesh Kumar',
  role: 'Supervisor / Admin',
  email: 'rajesh.kumar@smartflow.io',
  phone: '+91 98765 43210',
  department: 'Production & Operations',
  employeeId: 'SF-ADM-001',
  shift: 'Day Shift (6AM - 2PM)',
  joinDate: 'March 15, 2024',
  avatar: '👤',
  certifications: ['ISO 9001 Lead Auditor', 'Six Sigma Green Belt', 'PLC Programming'],
  teamSize: 8,
  factoryZone: 'Zone A — Main Assembly',
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('sf-auth');
    return saved ? JSON.parse(saved) : null;
  });

  useEffect(() => {
    if (user) {
      localStorage.setItem('sf-auth', JSON.stringify(user));
    } else {
      localStorage.removeItem('sf-auth');
    }
  }, [user]);

  const login = (id, password) => {
    if (id === 'semicolon' && password === '1212') {
      setUser(ADMIN_USER);
      return { success: true };
    }
    return { success: false, message: 'Invalid credentials' };
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
}
