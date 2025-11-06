import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Wallet,
  ArrowDownToLine,
  ArrowUpFromLine,
  Repeat,
  Users,
  User,
  LogOut,
  Settings,
  Shield,
  DollarSign,
  Activity,
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

export const Sidebar = () => {
  const { user, logout } = useAuth();
  const isAdmin = user?.role === 'admin';

  const userMenuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
    { icon: ArrowDownToLine, label: 'Deposit', path: '/deposit' },
    { icon: ArrowUpFromLine, label: 'Withdraw', path: '/withdraw' },
    { icon: Repeat, label: 'Swap Coin', path: '/swap' },
    { icon: Wallet, label: 'My Wallet', path: '/wallet' },
    { icon: Users, label: 'Referral', path: '/referral' },
    { icon: User, label: 'Profile', path: '/profile' },
  ];

  const adminMenuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/admin/dashboard' },
    { icon: Settings, label: 'Website Settings', path: '/admin/website-settings' },
    { icon: Shield, label: 'Branding & Logo', path: '/admin/branding' },
    { icon: Settings, label: 'Email Settings', path: '/admin/email-settings' },
    { icon: DollarSign, label: 'Deposit Management', path: '/admin/deposit-management' },
    { icon: DollarSign, label: 'Withdraw Management', path: '/admin/withdraw-management' },
    { icon: ArrowDownToLine, label: 'Deposit Requests', path: '/admin/deposits' },
    { icon: ArrowUpFromLine, label: 'Withdraw Requests', path: '/admin/withdrawals' },
    { icon: Users, label: 'User Management', path: '/admin/users' },
    { icon: Activity, label: 'Profit Settings', path: '/admin/profit-settings' },
    { icon: Users, label: 'Referral Settings', path: '/admin/referral-settings' },
    { icon: Repeat, label: 'Swap Management', path: '/admin/swap-management' },
    { icon: Settings, label: 'Mining Control', path: '/admin/mining-control' },
  ];

  const menuItems = isAdmin ? adminMenuItems : userMenuItems;

  return (
    <div className="w-64 min-h-screen bg-card border-r border-border/50 flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-border/50">
        <h1 className="text-2xl font-bold neon-text">TON MINING</h1>
        <p className="text-xs text-muted-foreground mt-1">
          {isAdmin ? 'Admin Panel' : 'Mining Dashboard'}
        </p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1">
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                isActive
                  ? 'bg-primary/10 text-primary border border-primary/30 shadow-[0_0_10px_hsl(var(--primary)/0.3)]'
                  : 'text-muted-foreground hover:bg-secondary/50 hover:text-foreground'
              }`
            }
          >
            <item.icon className="w-5 h-5" />
            <span className="text-sm font-medium">{item.label}</span>
          </NavLink>
        ))}
      </nav>

      {/* User Info & Logout */}
      <div className="p-4 border-t border-border/50">
        <div className="mb-3 px-4 py-2 bg-secondary/30 rounded-lg">
          <div className="text-xs text-muted-foreground">Logged in as</div>
          <div className="text-sm font-semibold text-foreground truncate">
            {user?.username}
          </div>
        </div>
        <button
          onClick={logout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-destructive hover:bg-destructive/10 transition-all"
        >
          <LogOut className="w-5 h-5" />
          <span className="text-sm font-medium">Logout</span>
        </button>
      </div>
    </div>
  );
};
