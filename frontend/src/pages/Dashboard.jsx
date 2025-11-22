import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Package, TruckIcon, AlertCircle, Clock } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const navigate = useNavigate();

  const kpiCards = [
    {
      title: "Receipts",
      items: [
        { label: "4 to receive", icon: Package, color: "text-primary" },
        { label: "1 Late", icon: AlertCircle, color: "text-warning" },
        { label: "6 operations", icon: Clock, color: "text-muted-foreground" },
      ],
      onClick: () => navigate("/operations?tab=receipts"),
    },
    {
      title: "Delivery",
      items: [
        { label: "4 to Deliver", icon: TruckIcon, color: "text-primary" },
        { label: "1 Late", icon: AlertCircle, color: "text-warning" },
        { label: "2 waiting", icon: AlertCircle, color: "text-primary" },
        { label: "6 operations", icon: Clock, color: "text-muted-foreground" },
      ],
      onClick: () => navigate("/operations?tab=delivery"),
    },
  ];

  return (
    <DashboardLayout>
      <div className="p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Dashboard</h1>
          <p className="text-muted-foreground">
            Current statistics and operations overview
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {kpiCards.map((card, index) => (
            <Card
              key={index}
              className="cursor-pointer hover:shadow-lg transition-shadow rounded-2xl"
              onClick={card.onClick}
            >
              <CardHeader>
                <CardTitle className="text-2xl font-semibold text-gray-800">
                  {card.title === "Receipts" ? "Receipt" : "Delivery"}
                </CardTitle>
              </CardHeader>

              <CardContent>
                <div className="flex justify-between items-start">

                  {/* Left side → rounded button */}
                  <div>
                    <div className="border border-gray-400 rounded-xl px-4 py-2 inline-flex items-center gap-2 text-gray-700 font-medium shadow-sm hover:bg-gray-50 transition">
                      {card.items[0].label}
                    </div>
                  </div>

                  {/* Right-side text list */}
                  <div className="text-right text-gray-700 text-lg space-y-1 leading-tight">
                    {card.items.slice(1).map((item, i) => (
                      <p key={i} className={`font-medium ${item.color}`}>
                        {item.label}
                      </p>
                    ))}
                  </div>

                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;