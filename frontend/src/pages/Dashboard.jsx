import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Package, TruckIcon, AlertCircle, Clock } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const navigate = useNavigate();

  const kpiCards = [
    {
      title: "Receipts",
      items: [
        { label: "4 to receive", icon: Package, color: "text-primary" },
        { label: "6 operations", icon: Clock, color: "text-muted-foreground" },
      ],
      onClick: () => navigate("/operations?tab=receipts"),
    },
    {
      title: "Delivery",
      items: [
        { label: "4 to Deliver", icon: TruckIcon, color: "text-primary" },
        { label: "2 waiting", icon: AlertCircle, color: "text-warning" },
      ],
      onClick: () => navigate("/operations?tab=delivery"),
    },
  ];

  return (
    <DashboardLayout>
      <div className="p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Dashboard</h1>
          <p className="text-muted-foreground">Current statistics and operations overview</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {kpiCards.map((card, index) => (
            <Card
              key={index}
              className="cursor-pointer hover:shadow-lg transition-shadow"
              onClick={card.onClick}
            >
              <CardHeader>
                <CardTitle className="text-xl">{card.title}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {card.items.map((item, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <item.icon className={`h-5 w-5 ${item.color}`} />
                    <span className="text-base font-medium">{item.label}</span>
                  </div>
                ))}
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate("/warehouse")}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5" />
                Warehouse
              </CardTitle>
              <CardDescription>Manage warehouse locations and inventory</CardDescription>
            </CardHeader>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate("/location")}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5" />
                Locations
              </CardTitle>
              <CardDescription>Manage storage locations within warehouses</CardDescription>
            </CardHeader>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;

