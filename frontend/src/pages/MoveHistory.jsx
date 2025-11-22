import { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { PageHeader } from "@/components/layout/PageHeader";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Search, ArrowDown, ArrowUp } from "lucide-react";

const MoveHistory = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortDir, setSortDir] = useState("desc");

  const moves = [
    {
      reference: "WH/IN/0001",
      date: "2024-03-12",
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
      date: "2023-12-01",
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

  const filteredAndSortedMoves = (() => {
    const q = searchTerm.trim().toLowerCase();
    const filtered = moves.filter((m) => {
      if (!q) return true;
      return (
        (m.reference || "").toLowerCase().includes(q) ||
        (m.contact || "").toLowerCase().includes(q)
      );
    });

    const sorted = filtered.slice().sort((a, b) => {
      const ta = new Date(a.date).getTime();
      const tb = new Date(b.date).getTime();
      return sortDir === "asc" ? ta - tb : tb - ta;
    });

    return sorted;
  })();

  return (
    <DashboardLayout>
      <div className="p-8">
        <PageHeader title="Move History" />

        <div className="space-y-6">
          <div className="flex items-center gap-2">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search by reference or contact..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={() => setSortDir((d) => (d === "desc" ? "asc" : "desc"))}
              aria-label={`Sort by date ${sortDir === "desc" ? "descending" : "ascending"}`}
              title={`Sort by date: ${sortDir === "desc" ? "Newest first" : "Oldest first"}`}
            >
              {sortDir === "desc" ? (
                <>
                  <ArrowDown className="h-4 w-4" />
                  Date
                </>
              ) : (
                <>
                  <ArrowUp className="h-4 w-4" />
                  Date
                </>
              )}
            </Button>
            <span className="text-sm text-muted-foreground">{sortDir === "desc" ? "Newest first" : "Oldest first"}</span>
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
                {filteredAndSortedMoves.map((move, index) => (
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

