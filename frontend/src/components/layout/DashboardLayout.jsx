import { Navbar } from "./Sidebar";

export const DashboardLayout = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen w-full bg-background">
      <Navbar />
      <main className="flex-1">
        {children}
      </main>
    </div>
  );
};

