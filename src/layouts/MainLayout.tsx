import { Outlet } from "react-router-dom";
import Navbar from "@/components/Navbar";
import HydraChat from "@/components/HydraChat";
import { useReminders } from "@/hooks/use-reminders";

const MainLayout = () => {
  useReminders();
  return (
    <div className="min-h-screen w-full flex flex-col">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <HydraChat />
    </div>
  );
};

export default MainLayout;
