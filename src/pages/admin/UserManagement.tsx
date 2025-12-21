import { useState } from 'react';
import { AppLayout } from '@/components/layouts/AppLayout';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Users, Search } from 'lucide-react';
import { useUserManagement, User } from '@/hooks/useUserManagement';
import { UsersTable } from '@/components/admin/users/UsersTable';
import { UserDetailDialog } from '@/components/admin/users/UserDetailDialog';
import { BalanceDialog } from '@/components/admin/users/BalanceDialog';

const UserManagement = () => {
  const { users, loading, searchQuery, setSearchQuery, toggleUserStatus, updateBalance } = useUserManagement();
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [showDetailDialog, setShowDetailDialog] = useState(false);
  const [showBalanceDialog, setShowBalanceDialog] = useState(false);
  const [balanceAction, setBalanceAction] = useState<'add' | 'reduce'>('add');

  const handleViewDetail = (user: User) => { setSelectedUser(user); setShowDetailDialog(true); };
  const handleAddBalance = (user: User) => { setSelectedUser(user); setBalanceAction('add'); setShowBalanceDialog(true); };
  const handleReduceBalance = (user: User) => { setSelectedUser(user); setBalanceAction('reduce'); setShowBalanceDialog(true); };

  return (
    <AppLayout>
      <div className="p-4 md:p-8">
        <div className="max-w-7xl mx-auto space-y-6">
          <div className="flex items-center gap-3 mb-8">
            <div className="p-3 rounded-lg bg-primary/10 neon-border">
              <Users className="w-8 h-8 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl font-bold neon-text">User Management</h1>
              <p className="text-muted-foreground">Kelola pengguna, saldo, dan status akun</p>
            </div>
          </div>

          <Card className="p-4 bg-card/50 border-primary/20 backdrop-blur-sm">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Cari username atau email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-background/50 border-primary/20 focus:border-primary"
              />
            </div>
          </Card>

          <Card className="bg-card/50 border-primary/20 backdrop-blur-sm overflow-hidden">
            <UsersTable
              users={users}
              loading={loading}
              onViewDetail={handleViewDetail}
              onAddBalance={handleAddBalance}
              onReduceBalance={handleReduceBalance}
              onToggleStatus={toggleUserStatus}
            />
          </Card>
        </div>
      </div>

      <UserDetailDialog user={selectedUser} open={showDetailDialog} onOpenChange={setShowDetailDialog} />
      <BalanceDialog user={selectedUser} action={balanceAction} open={showBalanceDialog} onOpenChange={setShowBalanceDialog} onSubmit={updateBalance} />
    </AppLayout>
  );
};

export default UserManagement;
