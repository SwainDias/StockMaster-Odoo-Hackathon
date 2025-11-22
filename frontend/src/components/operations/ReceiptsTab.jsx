import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Search } from "lucide-react";
import { useNavigate } from "react-router-dom";

export const ReceiptsTab = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");

  const receipts = [
    {
      reference: "WH/IN/0001",
      from: "Vendor",
      to: "WH/Stock1",
      contact: "Azure Interior",
      scheduleDate: "2024-01-15",
      status: "Ready",
    },
    {
      reference: "WH/IN/0002",
      from: "Vendor",
      to: "WH/Stock1",
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
        <Button onClick={() => navigate("/receipt/new")} className="gap-2">
          <Plus className="h-4 w-4" />
          New Receipt
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
            {receipts.map((receipt) => (
              <TableRow
                key={receipt.reference}
                className="cursor-pointer hover:bg-muted/50"
                onClick={() => navigate(`/receipt/${receipt.reference}`)}
              >
                <TableCell className="font-medium">{receipt.reference}</TableCell>
                <TableCell>{receipt.from}</TableCell>
                <TableCell>{receipt.to}</TableCell>
                <TableCell>{receipt.contact}</TableCell>
                <TableCell>{receipt.scheduleDate}</TableCell>
                <TableCell>
                  <Badge className={getStatusColor(receipt.status)}>{receipt.status}</Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
};

