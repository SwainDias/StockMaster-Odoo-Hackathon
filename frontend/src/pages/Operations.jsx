import { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { PageHeader } from "@/components/layout/PageHeader";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ReceiptsTab } from "@/components/operations/ReceiptsTab";
import { DeliveryTab } from "@/components/operations/DeliveryTab";
import { AdjustmentTab } from "@/components/operations/AdjustmentTab";
import { useSearchParams } from "react-router-dom";

const Operations = () => {
  const [searchParams] = useSearchParams();
  const defaultTab = searchParams.get("tab") || "receipts";

  return (
    <DashboardLayout>
      <div className="p-8">
        <PageHeader title="Operations" />
        
        <Tabs defaultValue={defaultTab} className="space-y-6">
          <TabsList className="grid w-full max-w-md grid-cols-3">
            <TabsTrigger value="receipts">Receipt</TabsTrigger>
            <TabsTrigger value="delivery">Delivery</TabsTrigger>
            <TabsTrigger value="adjustment">Adjustment</TabsTrigger>
          </TabsList>

          <TabsContent value="receipts">
            <ReceiptsTab />
          </TabsContent>

          <TabsContent value="delivery">
            <DeliveryTab />
          </TabsContent>

          <TabsContent value="adjustment">
            <AdjustmentTab />
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default Operations;

