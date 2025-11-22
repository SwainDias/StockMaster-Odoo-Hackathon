import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Search } from "lucide-react";
import { useNavigate } from "react-router-dom";

export const DeliveryTab = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");

  const deliveries = [
    {
      reference: "WH/OUT/0001",
      from: "WH/Stock1",
      to: "Vendor",
      contact: "Azure Interior",
      scheduleDate: "2024-01-15",
      status: "Ready",
    },
    {
      reference: "WH/OUT/0002",
      from: "WH/Stock1",
      to: "Vendor",
      contact: "Azure Interior",
      scheduleDate: "2024-01-16",
      status: "Ready",
    },
  ];

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case "ready":
        return "bg-primary text-primary-foreground";
      case "draft":
        return "bg-muted text-muted-foreground";
      case "waiting":
        return "bg-warning text-warning-foreground";
      case "done":
        return "bg-success text-success-foreground";
      default:
        return "bg-secondary text-secondary-foreground";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search by reference or contact..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9"
          />
        </div>
        <Button onClick={() => navigate("/delivery/new")} className="gap-2">
          <Plus className="h-4 w-4" />
          New Delivery
        </Button>
      </div>

      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Reference</TableHead>
              <TableHead>From</TableHead>
              <TableHead>To</TableHead>
              <TableHead>Contact</TableHead>
              <TableHead>Schedule Date</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {deliveries.map((delivery) => (
              <TableRow
                key={delivery.reference}
                className="cursor-pointer hover:bg-muted/50"
                onClick={() => navigate(`/delivery/${delivery.reference}`)}
              >
                <TableCell className="font-medium">{delivery.reference}</TableCell>
                <TableCell>{delivery.from}</TableCell>
                <TableCell>{delivery.to}</TableCell>
                <TableCell>{delivery.contact}</TableCell>
                <TableCell>{delivery.scheduleDate}</TableCell>
                <TableCell>
                  <Badge className={getStatusColor(delivery.status)}>{delivery.status}</Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
};

