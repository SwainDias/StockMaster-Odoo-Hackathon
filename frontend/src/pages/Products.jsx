import { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { PageHeader } from "@/components/layout/PageHeader";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Search } from "lucide-react";

const Products = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const products = [
    { code: "DESK001", name: "Office Desk", perunitcost: "Furniture", onhand: 45, unit: "pcs" },
    { code: "CHAIR001", name: "Office Chair", perunitcost: "Furniture", onhand: 120, unit: "pcs" },
    { code: "LAMP001", name: "Desk Lamp", perunitcost: "Lighting", onhand: 78, unit: "pcs" },
  ];

  return (
    <DashboardLayout>
      <div className="p-8">
        <PageHeader 
          title="Stock"
          action={{
            label: "New Product",
            onClick: () => {},
            icon: <Plus className="h-4 w-4 " />,
          }}
        />

        <div className="space-y-6 ">
          <div className="relative max-w-sm ml-auto">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9"
            />
          </div>

          <Card>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Product Code</TableHead>
                  <TableHead>Product</TableHead>
                  <TableHead>per unit cost</TableHead>
                  <TableHead>On Hand</TableHead>
                  <TableHead>Unit</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {products.map((product) => (
                  <TableRow key={product.code} className="cursor-pointer hover:bg-muted/50">
                    <TableCell className="font-medium">{product.code}</TableCell>
                    <TableCell>{product.name}</TableCell>
                    <TableCell>{product.perunitcost}</TableCell>
                    <TableCell>{product.onhand}</TableCell>
                    <TableCell>{product.unit}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Products;

