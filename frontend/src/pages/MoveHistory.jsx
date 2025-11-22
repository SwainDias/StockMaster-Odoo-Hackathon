import { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { PageHeader } from "@/components/layout/PageHeader";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Search, ArrowDown, ArrowUp } from "lucide-react";

const MoveHistory = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const moves = [
    {
      reference: "WH/IN/0001",
      date: "2024-01-12",
      contact: "Azure Interior",
      from: "Vendor",
      to: "WH/Stock1",
      quantity: 10,
      status: "Ready",
      type: "in",
    },
    {
      reference: "WH/OUT/0002",
      date: "2024-01-12",
      contact: "Azure Interior",
      from: "WH/Stock1",
      to: "Vendor",
      quantity: 5,
      status: "Ready",
      type: "out",
    },
    {
      reference: "WH/OUT/0003",
      date: "2024-01-12",
      contact: "Azure Interior",
      from: "WH/Stock2",
      to: "Vendor",
      quantity: 8,
      status: "Ready",
      type: "out",
    },
  ];

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case "ready":
        return "bg-primary text-primary-foreground";
      case "done":
        return "bg-success text-success-foreground";
      default:
        return "bg-secondary text-secondary-foreground";
    }
  };

  return (
    <DashboardLayout>
      <div className="p-8">
        <PageHeader title="Move History" />

        <div className="space-y-6">
          <div className="relative max-w-sm">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search by reference or contact..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9"
            />
          </div>

          <Card>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Type</TableHead>
                  <TableHead>Reference</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>From</TableHead>
                  <TableHead>To</TableHead>
                  <TableHead>Quantity</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {moves.map((move, index) => (
                  <TableRow key={index} className="hover:bg-muted/50">
                    <TableCell>
                      {move.type === "in" ? (
                        <ArrowDown className="h-5 w-5 text-success" />
                      ) : (
                        <ArrowUp className="h-5 w-5 text-destructive" />
                      )}
                    </TableCell>
                    <TableCell className="font-medium">{move.reference}</TableCell>
                    <TableCell>{move.date}</TableCell>
                    <TableCell>{move.contact}</TableCell>
                    <TableCell>{move.from}</TableCell>
                    <TableCell>{move.to}</TableCell>
                    <TableCell>{move.quantity}</TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(move.status)}>{move.status}</Badge>
                    </TableCell>
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

export default MoveHistory;

