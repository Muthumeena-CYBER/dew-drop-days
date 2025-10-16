import { Droplet, Home, ClipboardList, Target, Settings } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useTheme } from "@/hooks/use-theme";
import { useAuth } from "@/hooks/use-auth";

const Navbar = () => {
  const location = useLocation();
  const { theme, toggleTheme } = useTheme();
  const { user } = useAuth();

  const navItems = [
    { icon: Home, label: "Dashboard", path: "/" },
    { icon: ClipboardList, label: "Log", path: "/log" },
    { icon: Target, label: "Goals", path: "/goals" },
    { icon: Settings, label: "Settings", path: "/settings" },
  ];

  if (!user) return null;

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link to="/" className="flex items-center gap-2 text-xl font-bold">
          <Droplet className="h-6 w-6 text-accent animate-hydra-pulse" />
          <span>HydraFlow</span>
        </Link>

        <div className="flex items-center gap-2">
          {navItems.map((item) => (
            <Button
              key={item.path}
              variant={location.pathname === item.path ? "default" : "ghost"}
              size="sm"
              asChild
              className={cn(
                "transition-all",
                location.pathname === item.path && "hydra-glow"
              )}
            >
              <Link to={item.path}>
                <item.icon className="h-4 w-4 mr-2" />
                <span className="hidden sm:inline">{item.label}</span>
              </Link>
            </Button>
          ))}

          <Button
            variant="outline"
            size="sm"
            onClick={toggleTheme}
            className="ml-2"
          >
            <span className="text-xs font-mono">
              {theme === "primary" ? "🌊" : "💧"}
            </span>
          </Button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
