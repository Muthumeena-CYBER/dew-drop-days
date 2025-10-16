import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { useHydrationSupabase } from "@/hooks/use-hydration-supabase";
import { toast } from "sonner";
import { Target, Save } from "lucide-react";
import { useState } from "react";

const Goals = () => {
  const { settings, updateSettings } = useHydrationSupabase();
  const [goal, setGoal] = useState(settings.daily_goal);

  const handleSave = () => {
    updateSettings({ daily_goal: goal });
  };

  const presetGoals = [
    { label: "Light", amount: 2000, desc: "For lighter activities" },
    { label: "Standard", amount: 2500, desc: "Recommended daily intake" },
    { label: "Active", amount: 3000, desc: "For active lifestyles" },
    { label: "Athletic", amount: 4000, desc: "For intense workouts" },
  ];

  return (
    <div className="container mx-auto p-6 space-y-6 max-w-2xl">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-2">Hydration Goals</h1>
        <p className="text-muted-foreground">Set your daily water intake target</p>
      </div>

      <Card className="p-8 shadow-lg space-y-8">
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold">Daily Goal</h2>
            <div className="text-3xl font-bold text-accent">{goal}ml</div>
          </div>
          
          <Slider
            value={[goal]}
            onValueChange={(values) => setGoal(values[0])}
            min={1000}
            max={5000}
            step={100}
            className="mb-6"
          />

          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <span>1L</span>
            <span>5L</span>
          </div>
        </div>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-card px-2 text-muted-foreground">Quick Presets</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {presetGoals.map((preset) => (
            <Button
              key={preset.amount}
              variant={goal === preset.amount ? "default" : "outline"}
              onClick={() => setGoal(preset.amount)}
              className="h-auto flex-col gap-2 p-4 hover:scale-105 transition-transform"
            >
              <div className="font-bold">{preset.label}</div>
              <div className="text-lg">{preset.amount}ml</div>
              <div className="text-xs text-muted-foreground">{preset.desc}</div>
            </Button>
          ))}
        </div>

        <Button
          onClick={handleSave}
          size="lg"
          className="w-full hydra-glow"
        >
          <Save className="h-5 w-5 mr-2" />
          Save Goal
        </Button>
      </Card>

      <Card className="p-6 bg-accent/5 border-accent/20">
        <div className="flex items-start gap-3">
          <Target className="h-5 w-5 text-accent mt-1 flex-shrink-0" />
          <div className="text-sm">
            <p className="font-semibold mb-1">Personalized Recommendations</p>
            <p className="text-muted-foreground mb-2">
              Your ideal water intake depends on factors like weight, activity level, and climate:
            </p>
            <ul className="text-muted-foreground space-y-1 list-disc list-inside">
              <li>Base: 30-35ml per kg of body weight</li>
              <li>Add 500-1000ml for moderate exercise</li>
              <li>Add extra in hot weather or high altitudes</li>
            </ul>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default Goals;
