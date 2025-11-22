import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import Operations from "./pages/Operations";
import Products from "./pages/Products";
import MoveHistory from "./pages/MoveHistory";
import Warehouse from "./pages/Warehouse";
import Location from "./pages/Location";
import Settings from "./pages/Settings";
import ReceiptDetail from "./pages/ReceiptDetail";
import DeliveryDetail from "./pages/DeliveryDetail";
import NotFound from "./pages/NotFound";
import NewProduct from "./pages/NewProduct";
import Profile from "./pages/Profile"


const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/operations" element={<Operations />} />
          <Route path="/products" element={<Products />} />
          <Route path="/move-history" element={<MoveHistory />} />
          <Route path="/warehouse" element={<Warehouse />} />
          <Route path="/location" element={<Location />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/newproduct" element={<NewProduct />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/receipt/:id" element={<ReceiptDetail />} />
          <Route path="/receipt/new" element={<ReceiptDetail />} />
          <Route path="/delivery/:id" element={<DeliveryDetail />} />
          <Route path="/delivery/new" element={<DeliveryDetail />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

