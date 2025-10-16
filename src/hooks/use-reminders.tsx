import { useEffect, useRef } from "react";
import { useHydrationSupabase } from "@/hooks/use-hydration-supabase";

export function useReminders() {
  const { settings } = useHydrationSupabase();
  const intervalRef = useRef<number | null>(null);

  useEffect(() => {
    if (intervalRef.current) {
      window.clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    if (!settings.reminder_enabled) return;

    // Fixed 1-minute alerts, no Notification API, no sound
    intervalRef.current = window.setInterval(() => {
      try {
        window.alert("Time to hydrate! Take a sip of water 💧");
      } catch {}
    }, 60 * 1000);

    return () => {
      if (intervalRef.current) {
        window.clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [settings.reminder_enabled]);
}


