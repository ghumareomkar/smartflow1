import { createContext, useContext, useReducer, useCallback } from 'react';
import tasksData from '../data/tasks.json';
import workersData from '../data/workers.json';
import machinesData from '../data/machines.json';

const AppContext = createContext();

const initialState = {
  tasks: tasksData.tasks,
  workers: workersData.workers,
  machines: machinesData.machines,
  notifications: [],
  simulationActive: false,
  simulationResults: null,
  nextTaskId: 17,
  nextWorkerId: (workersData.workers?.length || 0) + 1,
  nextMachineId: (machinesData.machines?.length || 0) + 1,
};

function appReducer(state, action) {
  switch (action.type) {
    case 'ADD_TASK':
      return {
        ...state,
        tasks: [...state.tasks, { ...action.payload, id: state.nextTaskId, progress: 0, assignedTo: null, status: 'pending' }],
        nextTaskId: state.nextTaskId + 1,
      };
    case 'UPDATE_TASK':
      return {
        ...state,
        tasks: state.tasks.map(t => t.id === action.payload.id ? { ...t, ...action.payload } : t),
      };
    case 'DELETE_TASK':
      return {
        ...state,
        tasks: state.tasks.filter(t => t.id !== action.payload),
      };
    case 'ADD_WORKER':
      return {
        ...state,
        workers: [...state.workers, { ...action.payload, id: state.nextWorkerId }],
        nextWorkerId: state.nextWorkerId + 1,
      };
    case 'ADD_MACHINE':
      return {
        ...state,
        machines: [...state.machines, { ...action.payload, id: state.nextMachineId }],
        nextMachineId: state.nextMachineId + 1,
      };
    case 'AUTO_ASSIGN': {
      const newTasks = [...state.tasks];
      const newWorkers = [...state.workers];
      const pendingTasks = newTasks.filter(t => t.status === 'pending' && !t.assignedTo);

      pendingTasks.forEach(task => {
        const matchingWorker = newWorkers.find(w =>
          w.skills.includes(task.skill) && w.availability === 'available'
        );
        if (matchingWorker) {
          task.assignedTo = matchingWorker.id;
          task.status = 'in-progress';
          task.progress = 5;
          const wIdx = newWorkers.findIndex(w => w.id === matchingWorker.id);
          newWorkers[wIdx] = { ...newWorkers[wIdx], availability: 'busy' };
        } else {
          const leastBusy = newWorkers
            .filter(w => w.skills.includes(task.skill))
            .sort((a, b) => {
              const aCount = newTasks.filter(t => t.assignedTo === a.id && t.status !== 'completed').length;
              const bCount = newTasks.filter(t => t.assignedTo === b.id && t.status !== 'completed').length;
              return aCount - bCount;
            })[0];
          if (leastBusy) {
            task.assignedTo = leastBusy.id;
            task.status = 'in-progress';
            task.progress = 5;
          }
        }
      });

      return { ...state, tasks: newTasks, workers: newWorkers };
    }
    case 'UPDATE_WORKER':
      return {
        ...state,
        workers: state.workers.map(w => w.id === action.payload.id ? { ...w, ...action.payload } : w),
      };
    case 'ADD_NOTIFICATION':
      return {
        ...state,
        notifications: [action.payload, ...state.notifications].slice(0, 10),
      };
    case 'CLEAR_NOTIFICATIONS':
      return { ...state, notifications: [] };
    case 'RUN_SIMULATION': {
      const { removedWorkerId, workloadIncrease } = action.payload;
      const activeWorkers = state.workers.filter(w => w.id !== removedWorkerId);
      const totalTasks = state.tasks.length;
      const originalCapacity = state.workers.length * 3;
      const newCapacity = activeWorkers.length * 3;
      const adjustedLoad = totalTasks * (1 + (workloadIncrease || 0) / 100);
      const originalEfficiency = Math.min(95, (originalCapacity / totalTasks) * 60);
      const newEfficiency = Math.min(95, (newCapacity / adjustedLoad) * 60);
      const efficiencyDrop = Math.max(0, originalEfficiency - newEfficiency);
      const originalDelay = 2;
      const delayIncrease = (efficiencyDrop / 100) * 8 + (workloadIncrease || 0) / 10;
      const overloadedWorkers = activeWorkers.filter(w => {
        const assigned = state.tasks.filter(t => t.assignedTo === w.id && t.status !== 'completed').length;
        return assigned >= 3;
      });

      return {
        ...state,
        simulationActive: true,
        simulationResults: {
          originalEfficiency: Math.round(originalEfficiency),
          newEfficiency: Math.round(newEfficiency),
          efficiencyDrop: Math.round(efficiencyDrop * 10) / 10,
          originalDelay,
          newDelay: Math.round((originalDelay + delayIncrease) * 10) / 10,
          delayIncrease: Math.round(delayIncrease * 10) / 10,
          overloadedWorkers: overloadedWorkers.length,
          activeWorkers: activeWorkers.length,
          removedWorker: state.workers.find(w => w.id === removedWorkerId)?.name || 'None',
          workloadIncrease: workloadIncrease || 0,
          bottleneckRisk: efficiencyDrop > 15 ? 'Critical' : efficiencyDrop > 8 ? 'High' : 'Low',
        },
      };
    }
    case 'RESET_SIMULATION':
      return { ...state, simulationActive: false, simulationResults: null };
    case 'RESET_ALL':
      return { ...initialState };
    default:
      return state;
  }
}

export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  const getDelayedTasks = useCallback(() => {
    return state.tasks.filter(t => t.status === 'delayed');
  }, [state.tasks]);

  const getBottlenecks = useCallback(() => {
    return state.workers.map(w => {
      const assignedTasks = state.tasks.filter(t => t.assignedTo === w.id && t.status !== 'completed');
      const load = assignedTasks.length;
      return {
        ...w,
        load,
        level: load >= 3 ? 'critical' : load >= 2 ? 'warning' : 'normal',
      };
    });
  }, [state.workers, state.tasks]);

  const getWorkerById = useCallback((id) => {
    return state.workers.find(w => w.id === id);
  }, [state.workers]);

  const value = {
    ...state,
    dispatch,
    getDelayedTasks,
    getBottlenecks,
    getWorkerById,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used inside AppProvider');
  return ctx;
}
