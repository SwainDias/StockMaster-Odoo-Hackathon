import { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const NewProduct = () => {
  const [productCode, setProductCode] = useState("");
  const [productName, setProductName] = useState("");
  const [unitCost, setUnitCost] = useState("");
  const [onHand, setOnHand] = useState("");
  const [unit, setUnit] = useState("");

  const handleSave = () => {
    // Basic validation (ensure required fields are present)
    if (!productCode || !productName || !unitCost || !onHand || !unit) {
      alert("Please fill all fields before saving.");
      return;
    }

    // Build product object exactly with required fields
    const newProduct = {
      productCode: productCode.trim(),
      product: productName.trim(),
      perUnitCost: parseFloat(unitCost),
      onHand: parseFloat(onHand),
      unit,
    };

    // Replace this with actual API / state update logic used in your frontend
    console.log("Saving product:", newProduct);
    alert("Product saved (check console).");
  };

  return (
    <DashboardLayout>
      <div className="p-8">
        <PageHeader title="New Product" />

        <div className="max-w-4xl mx-auto">
          <Card className="rounded-2xl shadow-md overflow-hidden">
            <CardHeader className="p-6">
              <CardTitle className="text-2xl">Create New Product</CardTitle>
            </CardHeader>

            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                {/* Product Code */}
                <div className="space-y-2">
                  <Label htmlFor="productCode">Product Code</Label>
                  <Input
                    id="productCode"
                    value={productCode}
                    onChange={(e) => setProductCode(e.target.value)}
                    placeholder="e.g. DESK001"
                  />
                </div>

                {/* Product Name */}
                <div className="space-y-2">
                  <Label htmlFor="productName">Product</Label>
                  <Input
                    id="productName"
                    value={productName}
                    onChange={(e) => setProductName(e.target.value)}
                    placeholder="e.g. Desk"
                  />
                </div>

                {/* Per unit cost */}
                <div className="space-y-2">
                  <Label htmlFor="unitCost">Per Unit Cost</Label>
                  <Input
                    id="unitCost"
                    type="number"
                    min="0"
                    step="0.01"
                    value={unitCost}
                    onChange={(e) => setUnitCost(e.target.value)}
                    placeholder="0.00"
                  />
                </div>

                {/* On Hand */}
                <div className="space-y-2">
                  <Label htmlFor="onHand">On Hand</Label>
                  <Input
                    id="onHand"
                    type="number"
                    min="0"
                    step="1"
                    value={onHand}
                    onChange={(e) => setOnHand(e.target.value)}
                    placeholder="0"
                  />
                </div>

                {/* Unit (select) */}
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="unit">Unit</Label>
                  <Select onValueChange={(v) => setUnit(v)}>
                    <SelectTrigger id="unit" className="w-48">
                      <SelectValue placeholder="Select unit" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pcs">pcs</SelectItem>
                      <SelectItem value="kg">kg</SelectItem>
                      <SelectItem value="m">m</SelectItem>
                      <SelectItem value="litre">litre</SelectItem>
                      <SelectItem value="box">box</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

              </div>

              {/* Actions */}
              <div className="mt-6 flex items-center gap-3">
                <Button onClick={handleSave} className="bg-blue-600 hover:bg-blue-700">
                  Save Product
                </Button>
                <Button variant="outline" onClick={() => {
                  // Reset form
                  setProductCode("");
                  setProductName("");
                  setUnitCost("");
                  setOnHand("");
                  setUnit("");
                }}>
                  Reset
                </Button>

                {/* Decorative / reference image included from uploaded file path */}
                <div className="ml-auto hidden sm:block">
                  <img
                    src="/mnt/data/6f9e5d6e-f5a2-48e8-8159-fd0318251684.png"
                    alt="product-decor"
                    className="h-12 w-auto opacity-40"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default NewProduct;
