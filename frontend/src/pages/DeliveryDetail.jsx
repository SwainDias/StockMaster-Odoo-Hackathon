import { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useParams, useNavigate } from "react-router-dom";
import { Check, X, AlertCircle } from "lucide-react";

const DeliveryDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState("Draft");

  const products = [
    { code: "DESK001", name: "Desk", onhand: 3, inStock: true },
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case "Ready":
        return "bg-primary text-primary-foreground";
      case "Draft":
        return "bg-muted text-muted-foreground";
      case "Waiting":
        return "bg-warning text-warning-foreground";
      case "Done":
        return "bg-success text-success-foreground";
      default:
        return "bg-secondary text-secondary-foreground";
    }
  };

  return (
    <DashboardLayout>
      <div className="p-8">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-foreground">{id || "New Delivery"}</h2>
            <Badge className={`mt-2 ${getStatusColor(status)}`}>{status}</Badge>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => navigate("/operations?tab=delivery")}>
              <X className="h-4 w-4 mr-2" />
              Cancel
            </Button>
            <Button onClick={() => setStatus("Done")}>
              <Check className="h-4 w-4 mr-2" />
              Validate
            </Button>
          </div>
        </div>

        <div className="grid gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Delivery Information</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Schedule Date</Label>
                <Input type="date" defaultValue="2024-01-15" />
              </div>
              <div className="space-y-2">
                <Label>Delivery Address</Label>
                <Input placeholder="Enter delivery address" />
              </div>
              <div className="space-y-2">
                <Label>Responsible</Label>
                <Input defaultValue="Current User" disabled />
              </div>
              <div className="space-y-2">
                <Label>Operation Type</Label>
                <Input defaultValue="Delivery" disabled />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Products</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Product</TableHead>
                    <TableHead>on hand</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {products.map((product) => (
                    <TableRow
                      key={product.code}
                      className={!product.inStock ? "bg-destructive/10" : ""}
                    >
                      <TableCell>
                        [{product.code}] {product.name}
                      </TableCell>
                      <TableCell>{product.onhand}</TableCell>
                      <TableCell>
                        {product.inStock ? (
                          <Badge className="bg-success text-success-foreground">In Stock</Badge>
                        ) : (
                          <div className="flex items-center gap-2 text-destructive">
                            <AlertCircle className="h-4 w-4" />
                            <span className="text-sm">Out of Stock</span>
                          </div>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <Button variant="outline" className="mt-4">
                Add New Product
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default DeliveryDetail;

