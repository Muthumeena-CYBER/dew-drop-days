import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/hooks/use-auth";
import { useHydrationSupabase } from "@/hooks/use-hydration-supabase";
import { Bell, LogOut, Volume2 } from "lucide-react";

const Settings = () => {
  const { signOut } = useAuth();
  const { settings, updateSettings } = useHydrationSupabase();

  const requestNotificationPermission = async () => {
    if ("Notification" in window) {
      const permission = await Notification.requestPermission();
      if (permission === "granted") {
        updateSettings({ reminder_enabled: true });
      } else {
        updateSettings({ reminder_enabled: false });
      }
    }
  };

  const handleSignOut = async () => {
    await signOut();
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
                checked={settings.reminder_enabled}
                onCheckedChange={(checked) => {
                  if (checked) {
                    requestNotificationPermission();
                  } else {
                    updateSettings({ reminder_enabled: false });
                  }
                }}
              />
            </div>

            {settings.reminder_enabled && (
              <div className="ml-8 space-y-2">
                <Label className="text-sm">Reminder Interval (minutes)</Label>
                <div className="flex gap-2">
                  {[2, 30, 45, 60, 90].map((interval) => (
                    <Button
                      key={interval}
                      variant={settings.reminder_interval === interval ? "default" : "outline"}
                      size="sm"
                      onClick={() => updateSettings({ reminder_interval: interval })}
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
              checked={settings.sounds_enabled}
              onCheckedChange={(checked) => updateSettings({ sounds_enabled: checked })}
            />
          </div>
        </div>

        <div className="border-t pt-6">
          <h2 className="text-xl font-bold mb-4">Account</h2>
          
          <Button
            variant="destructive"
            onClick={handleSignOut}
            className="w-full"
          >
            <LogOut className="h-5 w-5 mr-2" />
            Sign Out
          </Button>
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
