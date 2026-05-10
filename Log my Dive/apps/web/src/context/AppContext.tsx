import { createContext, useContext, useState } from 'react';
import type { DiveLogRepository } from '@log-my-dive/core';
import { IndexedDBRepository } from '../db/IndexedDBRepository';

export const DEFAULT_USER_ID = 'local-user';

interface AppContextValue {
  repo: DiveLogRepository & { clearAll: (userId: string) => Promise<void> };
  userId: string;
  isMetric: boolean;
  setIsMetric: (v: boolean) => void;
}

const AppContext = createContext<AppContextValue | null>(null);

// Singleton repository — one instance for the app lifetime
const repo = new IndexedDBRepository();

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [isMetric, setIsMetricState] = useState<boolean>(() => {
    return localStorage.getItem('units') !== 'imperial';
  });

  const setIsMetric = (v: boolean) => {
    setIsMetricState(v);
    localStorage.setItem('units', v ? 'metric' : 'imperial');
  };

  return (
    <AppContext.Provider value={{ repo, userId: DEFAULT_USER_ID, isMetric, setIsMetric }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
