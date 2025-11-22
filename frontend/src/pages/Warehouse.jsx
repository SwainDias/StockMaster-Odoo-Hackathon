import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

const Warehouse = () => {
  return (
    <DashboardLayout>
      <div className="p-8">
        <PageHeader
          title="Warehouse"
          action={{
            label: "Add Warehouse",
            onClick: () => {},
            icon: <Plus className="h-4 w-4" />,
          }}
        />

        <div className="max-w-2xl">
          <Card>
            <CardHeader>
              <CardTitle>Warehouse Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input id="name" placeholder="Enter warehouse name" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="shortCode">Short Code</Label>
                <Input id="shortCode" placeholder="Enter short code" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="address">Address</Label>
                <Input id="address" placeholder="Enter address" />
              </div>
              <Button className="w-full">Save Warehouse</Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Warehouse;

