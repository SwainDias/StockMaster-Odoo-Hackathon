import { NavLink } from "@/components/NavLink";
import { LayoutDashboard, Package, ClipboardList, History, Warehouse, MapPin, Settings, TruckIcon } from "lucide-react";

export const Sidebar = () => {
  const navItems = [
    { to: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
    { to: "/operations", icon: ClipboardList, label: "Operations" },
    { to: "/products", icon: Package, label: "Products" },
    { to: "/move-history", icon: History, label: "Move History" },
    { to: "/warehouse", icon: Warehouse, label: "Warehouse" },
    { to: "/location", icon: MapPin, label: "Location" },
    { to: "/settings", icon: Settings, label: "Settings" },
  ];

  return (
    <aside className="w-64 bg-sidebar border-r border-sidebar-border">
      <div className="p-6">
        <div className="flex items-center gap-2 mb-8">
          <TruckIcon className="h-8 w-8 text-sidebar-primary" />
          <h1 className="text-xl font-bold text-sidebar-foreground">StockMaster</h1>
        </div>
        <nav className="space-y-1">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className="flex items-center gap-3 px-3 py-2 rounded-lg text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground transition-colors"
              activeClassName="bg-sidebar-accent text-sidebar-primary font-medium"
            >
              <item.icon className="h-5 w-5" />
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>
      </div>
    </aside>
  );
};

