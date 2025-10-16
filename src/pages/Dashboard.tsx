import { useEffect } from "react";
import HydraPet from "@/components/HydraPet";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useHydration } from "@/hooks/use-hydration";
import { Droplet, Target, TrendingUp, Award } from "lucide-react";

const Dashboard = () => {
  const { data, getTodayTotal, getHydrationPercent } = useHydration();
  const todayTotal = getTodayTotal();
  const percent = getHydrationPercent();

  useEffect(() => {
    // Request notification permission on mount
    if ("Notification" in window && Notification.permission === "default") {
      Notification.requestPermission();
    }
  }, []);

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
      value: `${data.dailyGoal}ml`,
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
      value: `${data.streak} days`,
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
          <HydraPet hydrationPercent={percent} streak={data.streak} />
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

      <Card className="p-6 shadow-lg">
        <h2 className="text-xl font-bold mb-4">Recent Activity</h2>
        <div className="space-y-2">
          {data.logs.slice(0, 5).map((log) => (
            <div
              key={log.id}
              className="flex items-center justify-between p-3 rounded-xl bg-secondary/20 hover:bg-secondary/30 transition-colors"
            >
              <div className="flex items-center gap-3">
                <Droplet className="h-4 w-4 text-accent" />
                <span className="font-semibold">{log.amount}ml</span>
              </div>
              <span className="text-sm text-muted-foreground">
                {new Date(log.timestamp).toLocaleTimeString()}
              </span>
            </div>
          ))}
          {data.logs.length === 0 && (
            <p className="text-center text-muted-foreground py-8">
              No logs yet. Start tracking your hydration!
            </p>
          )}
        </div>
      </Card>
    </div>
  );
};

export default Dashboard;
