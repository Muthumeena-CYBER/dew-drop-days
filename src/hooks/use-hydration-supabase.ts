import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./use-auth";
import { toast } from "sonner";

export interface WaterLog {
  id: string;
  amount: number;
  logged_at: string;
}

export interface UserSettings {
  daily_goal: number;
  reminder_enabled: boolean;
  reminder_interval: number;
  sounds_enabled: boolean;
}

export function useHydrationSupabase() {
  const { user } = useAuth();
  const [logs, setLogs] = useState<WaterLog[]>([]);
  const [settings, setSettings] = useState<UserSettings>({
    daily_goal: 2500,
    reminder_enabled: true,
    reminder_interval: 30,
    sounds_enabled: true,
  });
  const [loading, setLoading] = useState(true);

  // Fetch logs and settings
  useEffect(() => {
    if (!user) return;

    const fetchData = async () => {
      try {
        // Fetch logs
        const { data: logsData } = await supabase
          .from("water_logs")
          .select("*")
          .eq("user_id", user.id)
          .order("logged_at", { ascending: false })
          .limit(50);

        if (logsData) {
          setLogs(logsData);
        }

        // Fetch settings
        const { data: settingsData } = await supabase
          .from("user_settings")
          .select("*")
          .eq("user_id", user.id)
          .single();

        if (settingsData) {
          setSettings(settingsData);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);

  const addLog = async (amount: number) => {
    if (!user) return;

    const { error } = await supabase.from("water_logs").insert({
      user_id: user.id,
      amount,
    });

    if (error) {
      toast.error("Failed to log water intake");
      return;
    }

    // Refresh logs
    const { data } = await supabase
      .from("water_logs")
      .select("*")
      .eq("user_id", user.id)
      .order("logged_at", { ascending: false })
      .limit(50);

    if (data) {
      setLogs(data);
    }
  };

  const removeLog = async (id: string) => {
    if (!user) return;
    const { error } = await supabase
      .from("water_logs")
      .delete()
      .eq("id", id)
      .eq("user_id", user.id);
    if (error) {
      toast.error("Failed to remove log");
      return;
    }
    const { data } = await supabase
      .from("water_logs")
      .select("*")
      .eq("user_id", user.id)
      .order("logged_at", { ascending: false })
      .limit(50);
    if (data) setLogs(data);
    toast.success("Log removed");
  };

  const getTodayTotal = () => {
    const today = new Date().setHours(0, 0, 0, 0);
    return logs
      .filter((log) => new Date(log.logged_at).getTime() >= today)
      .reduce((sum, log) => sum + log.amount, 0);
  };

  const getHydrationPercent = () => {
    const total = getTodayTotal();
    return Math.min(Math.round((total / settings.daily_goal) * 100), 100);
  };

  const updateSettings = async (newSettings: Partial<UserSettings>) => {
    if (!user) return;

    const { error } = await supabase
      .from("user_settings")
      .update(newSettings)
      .eq("user_id", user.id);

    if (error) {
      toast.error("Failed to update settings");
      return;
    }

    setSettings((prev) => ({ ...prev, ...newSettings }));
    toast.success("Settings updated!");
  };

  const getActivityBreaks = async (days: number = 7) => {
    if (!user) return 0;

    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const { data } = await supabase
      .from("activity_breaks")
      .select("*")
      .eq("user_id", user.id)
      .gte("break_at", startDate.toISOString());

    return data?.length || 0;
  };

  const logActivityBreak = async () => {
    if (!user) return;

    await supabase.from("activity_breaks").insert({
      user_id: user.id,
    });
  };

  return {
    logs,
    settings,
    loading,
    addLog,
    removeLog,
    getTodayTotal,
    getHydrationPercent,
    updateSettings,
    getActivityBreaks,
    logActivityBreak,
  };
}
