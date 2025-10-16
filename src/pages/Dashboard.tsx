import { useEffect, useState } from "react";
import HydraPet from "@/components/HydraPet";
import { HydrationRadar } from "@/components/HydrationRadar";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useHydrationSupabase } from "@/hooks/use-hydration-supabase";
import { Droplet, Target, TrendingUp, Award } from "lucide-react";

const Dashboard = () => {
  const { getTodayTotal, settings, getHydrationPercent, loading } = useHydrationSupabase();
  const [streak, setStreak] = useState(0);
  
  const todayTotal = getTodayTotal();
  const percent = getHydrationPercent();

  useEffect(() => {
    // Request notification permission on mount
    if ("Notification" in window && Notification.permission === "default") {
      Notification.requestPermission();
    }
  }, []);

  if (loading) {
    return (
      <div className="container mx-auto p-6 flex items-center justify-center min-h-[50vh]">
        <div className="text-center">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-accent border-t-transparent mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading your data...</p>
        </div>
      </div>
    );
  }

  const stats = [
    {
      icon: Droplet,
      label: "Today's Intake",
      value: `${todayTotal}ml`,
      color: "text-accent",
    },
    {
      icon: Target,
      label: "Daily Goal",
      value: `${settings.daily_goal}ml`,
      color: "text-primary",
    },
    {
      icon: TrendingUp,
      label: "Progress",
      value: `${percent}%`,
      color: "text-accent",
    },
    {
      icon: Award,
      label: "Streak",
      value: `${streak} days`,
      color: "text-primary",
    },
  ];

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-2">Stay Hydrated 💧</h1>
        <p className="text-muted-foreground">Your daily hydration companion</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-6 shadow-lg hover:shadow-xl transition-shadow">
          <HydraPet hydrationPercent={percent} streak={streak} />
        </Card>

        <Card className="p-6 shadow-lg space-y-6">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-semibold">Today's Progress</span>
              <span className="text-sm font-mono">{percent}%</span>
            </div>
            <Progress value={percent} className="h-4" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            {stats.map((stat) => (
              <div
                key={stat.label}
                className="p-4 rounded-2xl bg-secondary/20 hover:bg-secondary/30 transition-colors"
              >
                <stat.icon className={`h-5 w-5 ${stat.color} mb-2`} />
                <div className="text-2xl font-bold">{stat.value}</div>
                <div className="text-xs text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <HydrationRadar todayTotal={todayTotal} dailyGoal={settings.daily_goal} activityBreaks={5} />
    </div>
  );
};

export default Dashboard;
