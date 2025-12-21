import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import Dashboard from "./pages/Dashboard";
import Deposit from "./pages/Deposit";
import Withdraw from "./pages/Withdraw";
import SwapCoin from "./pages/SwapCoin";
import Wallet from "./pages/Wallet";
import Referral from "./pages/Referral";
import Profile from "./pages/Profile";
import AdminDashboard from "./pages/AdminDashboard";
import WebsiteSettings from "./pages/admin/WebsiteSettings";
import UserManagement from "./pages/admin/UserManagement";
import Branding from "./pages/admin/Branding";
import EmailSettings from "./pages/admin/EmailSettings";
import DepositManagement from "./pages/admin/DepositManagement";
import WithdrawManagement from "./pages/admin/WithdrawManagement";
import DepositRequests from "./pages/admin/DepositRequests";
import WithdrawRequests from "./pages/admin/WithdrawRequests";
import ProfitSettings from "./pages/admin/ProfitSettings";
import ReferralSettings from "./pages/admin/ReferralSettings";
import SwapManagement from "./pages/admin/SwapManagement";
import MiningControl from "./pages/admin/MiningControl";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Navigate to="/login" replace />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            
            {/* Protected User Routes */}
            <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/deposit" element={<ProtectedRoute><Deposit /></ProtectedRoute>} />
            <Route path="/withdraw" element={<ProtectedRoute><Withdraw /></ProtectedRoute>} />
            <Route path="/swap" element={<ProtectedRoute><SwapCoin /></ProtectedRoute>} />
            <Route path="/wallet" element={<ProtectedRoute><Wallet /></ProtectedRoute>} />
            <Route path="/referral" element={<ProtectedRoute><Referral /></ProtectedRoute>} />
            <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
            
            {/* Protected Admin Routes */}
            <Route path="/admin/dashboard" element={<ProtectedRoute requireAdmin><AdminDashboard /></ProtectedRoute>} />
            <Route path="/admin/website-settings" element={<ProtectedRoute requireAdmin><WebsiteSettings /></ProtectedRoute>} />
            <Route path="/admin/branding" element={<ProtectedRoute requireAdmin><Branding /></ProtectedRoute>} />
            <Route path="/admin/email-settings" element={<ProtectedRoute requireAdmin><EmailSettings /></ProtectedRoute>} />
            <Route path="/admin/deposit-management" element={<ProtectedRoute requireAdmin><DepositManagement /></ProtectedRoute>} />
            <Route path="/admin/withdraw-management" element={<ProtectedRoute requireAdmin><WithdrawManagement /></ProtectedRoute>} />
            <Route path="/admin/deposits" element={<ProtectedRoute requireAdmin><DepositRequests /></ProtectedRoute>} />
            <Route path="/admin/withdrawals" element={<ProtectedRoute requireAdmin><WithdrawRequests /></ProtectedRoute>} />
            <Route path="/admin/users" element={<ProtectedRoute requireAdmin><UserManagement /></ProtectedRoute>} />
            <Route path="/admin/profit-settings" element={<ProtectedRoute requireAdmin><ProfitSettings /></ProtectedRoute>} />
            <Route path="/admin/referral-settings" element={<ProtectedRoute requireAdmin><ReferralSettings /></ProtectedRoute>} />
            <Route path="/admin/swap-management" element={<ProtectedRoute requireAdmin><SwapManagement /></ProtectedRoute>} />
            <Route path="/admin/mining-control" element={<ProtectedRoute requireAdmin><MiningControl /></ProtectedRoute>} />
            
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
