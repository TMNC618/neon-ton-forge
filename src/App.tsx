import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
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
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/deposit" element={<Deposit />} />
            <Route path="/withdraw" element={<Withdraw />} />
            <Route path="/swap" element={<SwapCoin />} />
            <Route path="/wallet" element={<Wallet />} />
            <Route path="/referral" element={<Referral />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/admin/website-settings" element={<WebsiteSettings />} />
            <Route path="/admin/branding" element={<Branding />} />
            <Route path="/admin/email-settings" element={<EmailSettings />} />
            <Route path="/admin/deposit-management" element={<DepositManagement />} />
            <Route path="/admin/withdraw-management" element={<WithdrawManagement />} />
            <Route path="/admin/deposits" element={<DepositRequests />} />
            <Route path="/admin/withdrawals" element={<WithdrawRequests />} />
            <Route path="/admin/users" element={<UserManagement />} />
            <Route path="/admin/profit-settings" element={<ProfitSettings />} />
            <Route path="/admin/referral-settings" element={<ReferralSettings />} />
            <Route path="/admin/swap-management" element={<SwapManagement />} />
            <Route path="/admin/mining-control" element={<MiningControl />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
