import { useState, useEffect } from "react";

export interface WaterLog {
  id: string;
  amount: number;
  timestamp: number;
}

export interface HydrationData {
  logs: WaterLog[];
  dailyGoal: number;
  streak: number;
  badges: string[];
}

const STORAGE_KEY = "hydra-data";

export function useHydration() {
  const [data, setData] = useState<HydrationData>(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
    return {
      logs: [],
      dailyGoal: 2500,
      streak: 0,
      badges: [],
    };
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }, [data]);

  const addLog = (amount: number) => {
    const newLog: WaterLog = {
      id: Date.now().toString(),
      amount,
      timestamp: Date.now(),
    };
    setData((prev) => ({
      ...prev,
      logs: [newLog, ...prev.logs],
    }));
  };

  const getTodayTotal = () => {
    const today = new Date().setHours(0, 0, 0, 0);
    return data.logs
      .filter((log) => log.timestamp >= today)
      .reduce((sum, log) => sum + log.amount, 0);
  };

  const getHydrationPercent = () => {
    const total = getTodayTotal();
    return Math.min(Math.round((total / data.dailyGoal) * 100), 100);
  };

  const setDailyGoal = (goal: number) => {
    setData((prev) => ({ ...prev, dailyGoal: goal }));
  };

  const updateStreak = () => {
    // Simple streak logic - check if yesterday was completed
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    yesterday.setHours(0, 0, 0, 0);
    const yesterdayStart = yesterday.getTime();
    
    const todayStart = new Date().setHours(0, 0, 0, 0);
    
    const yesterdayTotal = data.logs
      .filter((log) => {
        return log.timestamp >= yesterdayStart && log.timestamp < todayStart;
      })
      .reduce((sum, log) => sum + log.amount, 0);

    if (yesterdayTotal >= data.dailyGoal) {
      setData((prev) => ({ ...prev, streak: prev.streak + 1 }));
    }
  };

  return {
    data,
    addLog,
    getTodayTotal,
    getHydrationPercent,
    setDailyGoal,
    updateStreak,
  };
}
