import { useLocation } from 'react-router-dom';
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
import { NavLink } from '@/components/NavLink';
import belincongLogo from '@/assets/belincong-logo.png';
import { cn } from '@/lib/utils';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
  SidebarHeader,
  useSidebar,
} from '@/components/ui/sidebar';

export function AppSidebar() {
  const { profile, isAdmin, logout } = useAuth();
  const { state } = useSidebar();
  const location = useLocation();
  const collapsed = state === 'collapsed';

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
    { icon: Shield, label: 'Branding', path: '/admin/branding' },
    { icon: Settings, label: 'Email Settings', path: '/admin/email-settings' },
    { icon: DollarSign, label: 'Deposit Mgmt', path: '/admin/deposit-management' },
    { icon: DollarSign, label: 'Withdraw Mgmt', path: '/admin/withdraw-management' },
    { icon: ArrowDownToLine, label: 'Deposits', path: '/admin/deposits' },
    { icon: ArrowUpFromLine, label: 'Withdrawals', path: '/admin/withdrawals' },
    { icon: Users, label: 'Users', path: '/admin/users' },
    { icon: Activity, label: 'Profit Settings', path: '/admin/profit-settings' },
    { icon: Users, label: 'Referral Settings', path: '/admin/referral-settings' },
    { icon: Repeat, label: 'Swap Mgmt', path: '/admin/swap-management' },
    { icon: Settings, label: 'Mining Control', path: '/admin/mining-control' },
  ];

  const menuItems = isAdmin ? adminMenuItems : userMenuItems;
  const currentPath = location.pathname;

  return (
    <Sidebar collapsible="icon">
      {/* Logo Header */}
      <SidebarHeader className="border-b border-border/50 p-4">
        <div className="flex items-center gap-3">
          <img 
            src={belincongLogo} 
            alt="TON Mining" 
            className="w-10 h-10 object-contain drop-shadow-[0_0_15px_hsl(var(--primary)/0.6)] transition-all duration-300"
          />
          <div className={cn(
            "overflow-hidden transition-all duration-300 ease-in-out",
            collapsed ? "w-0 opacity-0" : "w-auto opacity-100"
          )}>
            <h1 className="text-lg font-bold neon-text whitespace-nowrap">TON MINING</h1>
            <p className="text-xs text-muted-foreground whitespace-nowrap">
              {isAdmin ? 'Admin Panel' : 'Dashboard'}
            </p>
          </div>
        </div>
      </SidebarHeader>

      {/* Navigation Menu */}
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Menu</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => {
                const isActive = currentPath === item.path;
                return (
                  <SidebarMenuItem key={item.path}>
                    <SidebarMenuButton asChild isActive={isActive}>
                      <NavLink 
                        to={item.path}
                        className="hover:bg-muted/50 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 origin-left"
                        activeClassName="bg-primary/10 text-primary border-l-2 border-primary"
                      >
                        <item.icon className="w-4 h-4 transition-transform duration-200 group-hover:scale-110" />
                        <span className={cn(
                          "transition-all duration-300 ease-in-out",
                          collapsed ? "w-0 opacity-0" : "opacity-100"
                        )}>{item.label}</span>
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      {/* Footer with User Info */}
      <SidebarFooter className="border-t border-border/50 p-4">
        <div className={cn(
          "mb-3 px-3 py-2 bg-secondary/30 rounded-lg overflow-hidden transition-all duration-300 ease-in-out",
          collapsed ? "max-h-0 opacity-0 mb-0 py-0" : "max-h-20 opacity-100"
        )}>
          <div className="text-xs text-muted-foreground whitespace-nowrap">Logged in as</div>
          <div className="text-sm font-semibold text-foreground truncate">
            {profile?.username}
          </div>
        </div>
        <SidebarMenuButton onClick={logout} className="text-destructive hover:bg-destructive/10 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 origin-left">
          <LogOut className="w-4 h-4 transition-transform duration-200 group-hover:scale-110" />
          <span className={cn(
            "transition-all duration-300 ease-in-out",
            collapsed ? "w-0 opacity-0" : "opacity-100"
          )}>Logout</span>
        </SidebarMenuButton>
      </SidebarFooter>
    </Sidebar>
  );
}
