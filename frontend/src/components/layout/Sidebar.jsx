import { NavLink } from "@/components/NavLink";
import { LayoutDashboard, Package, ClipboardList, History, Warehouse, MapPin, Settings, TruckIcon } from "lucide-react";

export const Navbar = () => {
  const navItems = [
    { to: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
    { to: "/operations", icon: ClipboardList, label: "Operations" },
    { to: "/products", icon: Package, label: "Products" },
    { to: "/move-history", icon: History, label: "Move History" },
    { to: "/settings", icon: Settings, label: "Settings" },
  ];

  return (
    <nav className="w-full bg-sidebar border-b border-sidebar-border">
      <div className="px-6 py-4 flex items-center justify-between">
        {/* Navigation Items */}
        <div className="flex items-center gap-1 ">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className="flex items-center gap-2 px-4 py-2 rounded-md text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground transition-colors text-sm"
              activeClassName="bg-sidebar-accent text-sidebar-primary font-medium"
            >
              <item.icon className="h-4 w-4" />
              <span>{item.label}</span>
            </NavLink>
          ))}
        </div>

        {/* Logo Section */}
        <div className="flex items-center gap-2">
          <TruckIcon className="h-8 w-8 text-sidebar-primary" />
          <h1 className="text-xl font-bold text-sidebar-foreground">StockMaster</h1>
        </div>
      </div>
    </nav>
  );
};

// Keep Sidebar export for backwards compatibility (if needed)
export const Sidebar = Navbar;

