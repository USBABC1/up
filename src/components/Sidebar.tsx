import { NavLink } from "react-router-dom";
import { LayoutDashboard, Calculator, Calendar, Settings } from "lucide-react";

const Sidebar = () => {
  const navItems = [
    {
      to: "/dashboard",
      icon: <LayoutDashboard size={20} />,
      label: "Dashboard",
    },
    {
      to: "/calculator",
      icon: <Calculator size={20} />,
      label: "Calculator",
    },
    {
      to: "/projects",
      icon: <Calendar size={20} />,
      label: "Projects",
    },
    {
      to: "/settings",
      icon: <Settings size={20} />,
      label: "Settings",
    },
  ];

  return (
    <aside className="w-64 bg-card border-r h-screen sticky top-0">
      <div className="flex flex-col h-full">
        <div className="p-6">
          <h2 className="font-bold text-lg text-primary">Launch Master</h2>
        </div>
        <nav className="flex-1 px-3">
          <ul className="space-y-1">
            {navItems.map((item) => (
              <li key={item.to}>
                <NavLink
                  to={item.to}
                  className={({ isActive }) =>
                    `flex items-center px-3 py-2 rounded-md transition-colors ${
                      isActive
                        ? "bg-primary text-primary-foreground"
                        : "hover:bg-muted"
                    }`
                  }
                >
                  {item.icon}
                  <span className="ml-3">{item.label}</span>
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
        <div className="p-6 border-t">
          <div className="flex items-center">
            <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground">
              U
            </div>
            <div className="ml-3">
              <p className="font-medium text-sm">User</p>
              <p className="text-xs text-muted-foreground">user@example.com</p>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
