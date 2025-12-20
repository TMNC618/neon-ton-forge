import { useState, useEffect } from 'react';
import { AppLayout } from '@/components/layouts/AppLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from 'sonner';
import { Users, Search, Eye, Lock, Unlock, Plus, Minus, Mail, Phone, Wallet } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface User {
  id: string;
  username: string;
  email: string;
  phone_number: string;
  balance: number;
  tera_balance: number;
  mining_balance: number;
  earning_profit: number;
  earning_referral: number;
  wallet_address: string;
  is_active: boolean;
  created_at: string;
}

const UserManagement = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [showDetailDialog, setShowDetailDialog] = useState(false);
  const [showBalanceDialog, setShowBalanceDialog] = useState(false);
  const [balanceAction, setBalanceAction] = useState<'add' | 'reduce'>('add');
  const [balanceType, setBalanceType] = useState<string>('balance');
  const [balanceAmount, setBalanceAmount] = useState('');
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setUsers(data || []);
    } catch (error) {
      console.error('Error fetching users:', error);
      toast.error('Gagal memuat data user');
    } finally {
      setLoading(false);
    }
  };

  const filteredUsers = users.filter(user =>
    user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const toggleUserStatus = async (userId: string) => {
    try {
      const { data, error } = await supabase.rpc('toggle_user_status', {
        _user_id: userId
      });

      if (error) throw error;

      const user = users.find(u => u.id === userId);
      toast.success(`User ${user?.username} berhasil ${user?.is_active ? 'diblokir' : 'diaktifkan'}!`);
      fetchUsers();
    } catch (error: any) {
      toast.error(error.message || 'Gagal mengubah status user');
    }
  };

  const handleViewDetail = (user: User) => {
    setSelectedUser(user);
    setShowDetailDialog(true);
  };

  const handleBalanceAction = (user: User, action: 'add' | 'reduce') => {
    setSelectedUser(user);
    setBalanceAction(action);
    setBalanceAmount('');
    setBalanceType('balance');
    setShowBalanceDialog(true);
  };

  const handleBalanceSubmit = async () => {
    if (!selectedUser || !balanceAmount) return;

    const amount = parseFloat(balanceAmount);
    if (isNaN(amount) || amount <= 0) {
      toast.error('Jumlah tidak valid!');
      return;
    }

    try {
      const rpcName = balanceAction === 'add' ? 'add_user_balance' : 'reduce_user_balance';
      const { error } = await supabase.rpc(rpcName, {
        _user_id: selectedUser.id,
        _amount: amount,
        _balance_type: balanceType
      });

      if (error) throw error;

      toast.success(
        `Berhasil ${balanceAction === 'add' ? 'menambah' : 'mengurangi'} ${amount} TON untuk ${selectedUser.username}!`
      );
      setShowBalanceDialog(false);
      fetchUsers();
    } catch (error: any) {
      toast.error(error.message || 'Gagal mengubah saldo');
    }
  };

  return (
    <AppLayout>
      <div className="p-4 md:p-8">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Header */}
          <div className="flex items-center gap-3 mb-8">
            <div className="p-3 rounded-lg bg-primary/10 neon-border">
              <Users className="w-8 h-8 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl font-bold neon-text">User Management</h1>
              <p className="text-muted-foreground">Kelola pengguna, saldo, dan status akun</p>
            </div>
          </div>

          {/* Search */}
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

          {/* Users Table */}
          <Card className="bg-card/50 border-primary/20 backdrop-blur-sm overflow-hidden">
            {loading ? (
              <div className="text-center py-8 text-muted-foreground">Loading...</div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow className="border-primary/20 hover:bg-primary/5">
                    <TableHead>Username</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Balance</TableHead>
                    <TableHead>Mining</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsers.map((user) => (
                    <TableRow key={user.id} className="border-primary/10 hover:bg-primary/5">
                      <TableCell className="font-medium">{user.username}</TableCell>
                      <TableCell className="text-muted-foreground">{user.email}</TableCell>
                      <TableCell>
                        <span className="text-primary font-semibold">{user.balance} TON</span>
                      </TableCell>
                      <TableCell>
                        <span className="text-cyan-400">{user.mining_balance} TON</span>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={user.is_active ? 'default' : 'secondary'}
                          className={user.is_active ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}
                        >
                          {user.is_active ? 'Active' : 'Blocked'}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleViewDetail(user)}
                            className="border-primary/20 hover:bg-primary/10"
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleBalanceAction(user, 'add')}
                            className="border-green-500/20 hover:bg-green-500/10 text-green-400"
                          >
                            <Plus className="w-4 h-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleBalanceAction(user, 'reduce')}
                            className="border-orange-500/20 hover:bg-orange-500/10 text-orange-400"
                          >
                            <Minus className="w-4 h-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => toggleUserStatus(user.id)}
                            className={
                              user.is_active
                                ? 'border-red-500/20 hover:bg-red-500/10 text-red-400'
                                : 'border-green-500/20 hover:bg-green-500/10 text-green-400'
                            }
                          >
                            {user.is_active ? <Lock className="w-4 h-4" /> : <Unlock className="w-4 h-4" />}
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </Card>
        </div>
      </div>

      {/* Detail Dialog */}
      <Dialog open={showDetailDialog} onOpenChange={setShowDetailDialog}>
        <DialogContent className="bg-background border-primary/20">
          <DialogHeader>
            <DialogTitle className="neon-text">Detail User</DialogTitle>
            <DialogDescription>Informasi lengkap pengguna</DialogDescription>
          </DialogHeader>
          {selectedUser && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-muted-foreground">Username</Label>
                  <p className="font-medium">{selectedUser.username}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Status</Label>
                  <Badge
                    variant={selectedUser.is_active ? 'default' : 'secondary'}
                    className={selectedUser.is_active ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}
                  >
                    {selectedUser.is_active ? 'Active' : 'Blocked'}
                  </Badge>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-primary" />
                  <span className="text-sm">{selectedUser.email}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-primary" />
                  <span className="text-sm">{selectedUser.phone_number || '-'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Wallet className="w-4 h-4 text-primary" />
                  <span className="text-sm">{selectedUser.wallet_address || '-'}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-primary/20">
                <div>
                  <Label className="text-muted-foreground">TON Balance</Label>
                  <p className="text-xl font-bold text-primary">{selectedUser.balance} TON</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">TERA Balance</Label>
                  <p className="text-xl font-bold text-cyan-400">{selectedUser.tera_balance} TERA</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Mining Balance</Label>
                  <p className="text-xl font-bold text-purple-400">{selectedUser.mining_balance} TON</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Earning Profit</Label>
                  <p className="text-xl font-bold text-green-400">{selectedUser.earning_profit} TON</p>
                </div>
              </div>

              <div className="pt-4 border-t border-primary/20">
                <Label className="text-muted-foreground">Join Date</Label>
                <p className="text-sm">{new Date(selectedUser.created_at).toLocaleDateString('id-ID')}</p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Balance Dialog */}
      <Dialog open={showBalanceDialog} onOpenChange={setShowBalanceDialog}>
        <DialogContent className="bg-background border-primary/20">
          <DialogHeader>
            <DialogTitle className="neon-text">
              {balanceAction === 'add' ? 'Tambah' : 'Kurangi'} Saldo
            </DialogTitle>
            <DialogDescription>
              {balanceAction === 'add' ? 'Tambahkan' : 'Kurangi'} saldo untuk {selectedUser?.username}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Tipe Saldo</Label>
              <Select value={balanceType} onValueChange={setBalanceType}>
                <SelectTrigger className="bg-background/50 border-primary/20">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="balance">TON Balance</SelectItem>
                  <SelectItem value="tera_balance">TERA Balance</SelectItem>
                  <SelectItem value="mining_balance">Mining Balance</SelectItem>
                  <SelectItem value="earning_profit">Earning Profit</SelectItem>
                  <SelectItem value="earning_referral">Earning Referral</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="amount">Jumlah</Label>
              <Input
                id="amount"
                type="number"
                placeholder="0.00"
                value={balanceAmount}
                onChange={(e) => setBalanceAmount(e.target.value)}
                className="bg-background/50 border-primary/20 focus:border-primary"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowBalanceDialog(false)}>
              Batal
            </Button>
            <Button
              onClick={handleBalanceSubmit}
              className={
                balanceAction === 'add'
                  ? 'bg-green-500 hover:bg-green-600'
                  : 'bg-orange-500 hover:bg-orange-600'
              }
            >
              {balanceAction === 'add' ? <Plus className="w-4 h-4 mr-2" /> : <Minus className="w-4 h-4 mr-2" />}
              {balanceAction === 'add' ? 'Tambah' : 'Kurangi'} Saldo
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AppLayout>
  );
};

export default UserManagement;
