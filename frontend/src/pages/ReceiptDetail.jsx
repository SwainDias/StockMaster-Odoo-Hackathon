import { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useParams, useNavigate } from "react-router-dom";
import { Check, X, AlertCircle, Printer, Plus } from "lucide-react";

const ReceiptDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState("Draft");

  const products = [
    { code: "DESK001", name: "Desk", quantity: 6, inStock: true },
  ];

  const hasOutOfStock = products.some(p => !p.inStock);

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
        <PageHeader title="Receipt" />
        
        {/* Action Buttons Row */}
        <div className="mb-6 flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Plus className="h-4 w-4 mr-2" />
            New
          </Button>
          <Button variant="outline" size="sm" onClick={() => setStatus("Done")}>
            Validate
          </Button>
          <Button variant="outline" size="sm">
            <Printer className="h-4 w-4 mr-2" />
            Print
          </Button>
          <Button variant="outline" size="sm" onClick={() => navigate("/operations?tab=Receipt")}>
            Cancel
          </Button>
          
          {/* Status Flow Indicator */}
          <div className="ml-auto flex items-center gap-2 px-4 py-2 border border-input rounded-md bg-background">
            <span className={`text-sm font-medium ${status === "Draft" ? "text-primary" : "text-muted-foreground"}`}>
              Draft
            </span>
            <span className="text-muted-foreground">&gt;</span>
            <span className={`text-sm font-medium ${status === "Waiting" ? "text-primary" : "text-muted-foreground"}`}>
              Waiting
            </span>
            <span className="text-muted-foreground">&gt;</span>
            <span className={`text-sm font-medium ${status === "Ready" ? "text-primary" : "text-muted-foreground"}`}>
              Ready
            </span>
            <span className="text-muted-foreground">&gt;</span>
            <span className={`text-sm font-medium ${status === "Done" ? "text-primary" : "text-muted-foreground"}`}>
              Done
            </span>
          </div>
        </div>

        {/* Reference Number */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-foreground">{id || "WH/OUT/0001"}</h2>
        </div>

        <div className="grid gap-6">
          {/* Receipt Information Form */}
          <Card>
            <CardContent className="pt-6">
              <div className="grid grid-cols-2 gap-x-8 gap-y-4">
                <div className="space-y-2">
                  <Label>Receive From</Label>
                  <Input placeholder="Enter Receipt address" className="border-b border-t-0 border-x-0 rounded-none px-0" />
                </div>
                <div className="space-y-2">
                  <Label>Schedule Date</Label>
                  <Input type="date" defaultValue="2024-01-15" className="border-b border-t-0 border-x-0 rounded-none px-0" />
                </div>
                <div className="space-y-2">
                  <Label>Responsible</Label>
                  <Input placeholder="Responsible person" className="border-b border-t-0 border-x-0 rounded-none px-0" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Products Section */}
          <Card>
            <CardHeader>
              <CardTitle>Products</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Product</TableHead>
                    <TableHead>Quantity</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {products.map((product) => (
                    <TableRow
                      key={product.code}
                      className={!product.inStock ? "bg-destructive/10 border-l-4 border-l-destructive" : ""}
                    >
                      <TableCell className={!product.inStock ? "text-destructive font-medium" : ""}>
                        [{product.code}] {product.name}
                      </TableCell>
                      <TableCell className={!product.inStock ? "text-destructive font-medium" : ""}>
                        {product.quantity}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              
              <div className="mt-4 space-y-4">
                <Button variant="link" className="text-destructive p-0 h-auto">
                  New Product
                </Button>
                
                {hasOutOfStock && (
                  <Alert variant="destructive" className="bg-destructive/10 border-destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                      Alert the notification & mark the line red if product is not in stock.
                    </AlertDescription>
                  </Alert>
                )}
                
                <Button variant="outline" className="w-full">
                  Add New product
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ReceiptDetail;

