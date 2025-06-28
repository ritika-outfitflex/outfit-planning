import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import MobileLayout from "./components/Layout/MobileLayout";
import Index from "./pages/Index";
import Wardrobe from "./pages/Wardrobe";
import Outfits from "./pages/Outfits";
import Profile from "./pages/Profile";
import NotFound from "./pages/NotFound";
import AddItem from "./pages/AddItem";
import ItemDetail from "./pages/ItemDetail";
import CreateOutfit from "./pages/CreateOutfit";
import OutfitDetail from "./pages/OutfitDetail";
import OutfitSuggestions from "./pages/OutfitSuggestions";
import Auth from "./pages/Auth";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/auth" element={<Auth />} />
            <Route path="/" element={
              <ProtectedRoute>
                <MobileLayout />
              </ProtectedRoute>
            }>
              <Route index element={<Index />} />
              <Route path="wardrobe" element={<Wardrobe />} />
              <Route path="wardrobe/add" element={<AddItem />} />
              <Route path="wardrobe/item/:id" element={<ItemDetail />} />
              <Route path="outfits" element={<Outfits />} />
              <Route path="outfits/create" element={<CreateOutfit />} />
              <Route path="outfits/detail/:id" element={<OutfitDetail />} />
              <Route path="outfits/suggestions" element={<OutfitSuggestions />} />
              <Route path="profile" element={<Profile />} />
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
