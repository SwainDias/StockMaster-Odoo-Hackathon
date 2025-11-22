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

            {/* The form is laid out to match the sketch:
                - Left aligned labels with a trailing colon
                - Inputs are visually simple (underline only) like the hand-drawn lines
                - Address uses a slightly longer underline / textarea feel
            */}
            <CardContent className="space-y-6">
              <div className="space-y-1">
                <Label htmlFor="name" className="text-base">
                  Name:
                </Label>
                {/* underline-only style to resemble the drawn line */}
                <Input
                  id="name"
                  placeholder="__________________________"
                  className="border-0 border-b-2 rounded-none focus:ring-0 focus:border-b-2"
                />
              </div>

              <div className="space-y-1">
                <Label htmlFor="shortCode" className="text-base">
                  Short Code:
                </Label>
                <Input
                  id="shortCode"
                  placeholder="________"
                  className="w-40 border-0 border-b-2 rounded-none focus:ring-0 focus:border-b-2"
                />
              </div>

              <div className="space-y-1">
                <Label htmlFor="address" className="text-base">
                  Address:
                </Label>
                {/* make address appear longer — use an input but wider so it looks like the long line in the sketch */}
                <Input
                  id="address"
                  placeholder="______________________________________________"
                  className="border-0 border-b-2 rounded-none focus:ring-0 focus:border-b-2"
                />
              </div>

              <div>
                <Button className="w-full">Save Warehouse</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Warehouse;
