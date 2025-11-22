import { Sidebar } from "./Sidebar";

export const DashboardLayout = ({ children }) => {
  return (
    <div className="flex min-h-screen w-full bg-background">
      <Sidebar />
      <main className="flex-1">
        {children}
      </main>
    </div>
  );
};

