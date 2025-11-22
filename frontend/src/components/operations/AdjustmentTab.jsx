import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export const AdjustmentTab = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Adjustments</CardTitle>
        <CardDescription>Manage inventory adjustments</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground">No adjustments available yet.</p>
      </CardContent>
    </Card>
  );
};

