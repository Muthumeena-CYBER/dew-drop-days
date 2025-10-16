import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Bell, Trash2, Volume2 } from "lucide-react";

const Settings = () => {
  const [notifications, setNotifications] = useState(true);
  const [sounds, setSounds] = useState(true);
  const [reminderInterval, setReminderInterval] = useState(30);

  const handleClearData = () => {
    if (window.confirm("Are you sure you want to clear all your hydration data?")) {
      localStorage.removeItem("hydra-data");
      toast.success("All data cleared successfully");
      window.location.reload();
    }
  };

  const requestNotificationPermission = async () => {
    if ("Notification" in window) {
      const permission = await Notification.requestPermission();
      if (permission === "granted") {
        toast.success("Notifications enabled!");
        setNotifications(true);
      } else {
        toast.error("Notification permission denied");
        setNotifications(false);
      }
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6 max-w-2xl">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-2">Settings</h1>
        <p className="text-muted-foreground">Customize your HydraFlow experience</p>
      </div>

      <Card className="p-6 shadow-lg space-y-6">
        <div>
          <h2 className="text-xl font-bold mb-4">Notifications</h2>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Bell className="h-5 w-5 text-accent" />
                <Label htmlFor="notifications" className="cursor-pointer">
                  Enable Reminders
                </Label>
              </div>
              <Switch
                id="notifications"
                checked={notifications}
                onCheckedChange={(checked) => {
                  if (checked) {
                    requestNotificationPermission();
                  } else {
                    setNotifications(false);
                  }
                }}
              />
            </div>

            {notifications && (
              <div className="ml-8 space-y-2">
                <Label className="text-sm">Reminder Interval (minutes)</Label>
                <div className="flex gap-2">
                  {[30, 45, 60, 90].map((interval) => (
                    <Button
                      key={interval}
                      variant={reminderInterval === interval ? "default" : "outline"}
                      size="sm"
                      onClick={() => setReminderInterval(interval)}
                    >
                      {interval}
                    </Button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="border-t pt-6">
          <h2 className="text-xl font-bold mb-4">Audio</h2>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Volume2 className="h-5 w-5 text-accent" />
              <Label htmlFor="sounds" className="cursor-pointer">
                Sound Effects
              </Label>
            </div>
            <Switch
              id="sounds"
              checked={sounds}
              onCheckedChange={setSounds}
            />
          </div>
        </div>

        <div className="border-t pt-6">
          <h2 className="text-xl font-bold mb-4">Data</h2>
          
          <Button
            variant="destructive"
            onClick={handleClearData}
            className="w-full"
          >
            <Trash2 className="h-5 w-5 mr-2" />
            Clear All Data
          </Button>
          <p className="text-xs text-muted-foreground mt-2 text-center">
            This will delete all logs, streaks, and settings
          </p>
        </div>
      </Card>

      <Card className="p-6 bg-accent/5 border-accent/20">
        <h3 className="font-semibold mb-2">About HydraFlow</h3>
        <p className="text-sm text-muted-foreground">
          Version 1.0.0 - Your smart hydration companion for better health and productivity.
          Built with ❤️ for office and industry workers.
        </p>
      </Card>
    </div>
  );
};

export default Settings;
