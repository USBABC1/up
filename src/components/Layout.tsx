import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import ThemeToggle from "./ThemeToggle";
import { CalendarClock } from "lucide-react";

const Layout = () => {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex flex-col flex-1">
        <header className="h-16 border-b flex items-center justify-between px-6 bg-card">
          <div className="flex items-center gap-2">
            <CalendarClock className="h-6 w-6 text-primary" />

            <h1 className="text-xl font-semibold">Launch Master</h1>
          </div>
          <ThemeToggle />
        </header>
        <main className="flex-1 p-6 overflow-auto">
          <Outlet />
        </main>
        <footer className="h-12 border-t flex items-center justify-center px-6 text-sm text-muted-foreground bg-card">
          Launch Master &copy; {new Date().getFullYear()} - All rights reserved
        </footer>
      </div>
    </div>
  );
};

export default Layout;
