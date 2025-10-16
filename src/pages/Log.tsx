import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useHydrationSupabase } from "@/hooks/use-hydration-supabase";
import { toast } from "sonner";
import { Droplet, Plus } from "lucide-react";

const Log = () => {
  const { addLog, logActivityBreak } = useHydrationSupabase();
  const [customAmount, setCustomAmount] = useState("");

  const quickAmounts = [
    { label: "Glass", amount: 250, icon: "🥛" },
    { label: "Bottle", amount: 500, icon: "🍶" },
    { label: "Large", amount: 750, icon: "💧" },
    { label: "XL", amount: 1000, icon: "🚰" },
  ];

  const handleQuickLog = async (amount: number) => {
    await addLog(amount);
    await logActivityBreak();
    toast.success(`Added ${amount}ml to your intake!`, {
      description: "Keep up the great work! 💪",
    });
  };

  const handleCustomLog = async () => {
    const amount = parseInt(customAmount);
    if (isNaN(amount) || amount <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }
    await addLog(amount);
    await logActivityBreak();
    toast.success(`Added ${amount}ml to your intake!`);
    setCustomAmount("");
  };

  return (
    <div className="container mx-auto p-6 space-y-6 max-w-2xl">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-2">Log Water Intake</h1>
        <p className="text-muted-foreground">Track your hydration throughout the day</p>
      </div>

      <Card className="p-8 shadow-lg space-y-6">
        <div>
          <h2 className="text-xl font-bold mb-4">Quick Add</h2>
          <div className="grid grid-cols-2 gap-4">
            {quickAmounts.map((option) => (
              <Button
                key={option.amount}
                variant="outline"
                size="lg"
                onClick={() => handleQuickLog(option.amount)}
                className="h-24 flex-col gap-2 hover:scale-105 transition-transform hydra-glow"
              >
                <span className="text-3xl">{option.icon}</span>
                <div className="text-center">
                  <div className="font-bold">{option.label}</div>
                  <div className="text-sm text-muted-foreground">{option.amount}ml</div>
                </div>
              </Button>
            ))}
          </div>
        </div>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-card px-2 text-muted-foreground">Or</span>
          </div>
        </div>

        <div>
          <h2 className="text-xl font-bold mb-4">Custom Amount</h2>
          <div className="flex gap-2">
            <Input
              type="number"
              placeholder="Enter amount in ml"
              value={customAmount}
              onChange={(e) => setCustomAmount(e.target.value)}
              className="text-lg"
              onKeyPress={(e) => e.key === "Enter" && handleCustomLog()}
            />
            <Button
              onClick={handleCustomLog}
              size="lg"
              className="hydra-glow"
            >
              <Plus className="h-5 w-5 mr-2" />
              Add
            </Button>
          </div>
        </div>
      </Card>

      <Card className="p-6 bg-accent/5 border-accent/20">
        <div className="flex items-start gap-3">
          <Droplet className="h-5 w-5 text-accent mt-1 flex-shrink-0" />
          <div className="text-sm">
            <p className="font-semibold mb-1">Pro Tip</p>
            <p className="text-muted-foreground">
              Try to drink water regularly throughout the day rather than all at once. 
              Your body absorbs water better when consumed in smaller amounts over time.
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default Log;
