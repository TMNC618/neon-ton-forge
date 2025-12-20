import { useState, useEffect } from 'react';
import { AppLayout } from '@/components/layouts/AppLayout';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { toast } from 'sonner';
import { Settings, Play, Pause, AlertCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface MiningUser {
  id: string;
  username: string;
  mining_balance: number;
  earning_profit: number;
  mining_active: boolean;
}

const MiningControl = () => {
  const [globalMining, setGlobalMining] = useState(true);
  const [users, setUsers] = useState<MiningUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      // Fetch global mining setting
      const { data: settingData } = await supabase
        .from('settings')
        .select('value')
        .eq('key', 'global_mining_enabled')
        .maybeSingle();

      if (settingData) {
        setGlobalMining(settingData.value as boolean);
      }

      // Fetch users with mining data
      const { data: usersData, error } = await supabase
        .from('profiles')
        .select('id, username, mining_balance, earning_profit, mining_active')
        .gt('mining_balance', 0)
        .order('mining_balance', { ascending: false });

      if (error) throw error;
      setUsers(usersData || []);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleGlobalToggle = async (enabled: boolean) => {
    setSaving(true);
    try {
      const { error } = await supabase.rpc('update_setting', {
        _key: 'global_mining_enabled',
        _value: enabled
      });

      if (error) throw error;

      setGlobalMining(enabled);
      if (enabled) {
        toast.success('Mining global diaktifkan!');
      } else {
        toast.error('Mining global dihentikan!');
      }
    } catch (error: any) {
      toast.error(error.message || 'Gagal mengubah status mining');
    } finally {
      setSaving(false);
    }
  };

  const toggleUserMining = async (userId: string) => {
    try {
      const user = users.find(u => u.id === userId);
      if (!user) return;

      const { error } = await supabase
        .from('profiles')
        .update({ mining_active: !user.mining_active })
        .eq('id', userId);

      if (error) throw error;

      setUsers(prev =>
        prev.map(u =>
          u.id === userId ? { ...u, mining_active: !u.mining_active } : u
        )
      );
      toast.success(`Mining ${user.username} ${user.mining_active ? 'dihentikan' : 'diaktifkan'}!`);
    } catch (error: any) {
      toast.error(error.message || 'Gagal mengubah status mining');
    }
  };

  const startAllMining = async () => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ mining_active: true })
        .gt('mining_balance', 0);

      if (error) throw error;

      setUsers(prev => prev.map(user => ({ ...user, mining_active: true })));
      toast.success('Mining semua user diaktifkan!');
    } catch (error: any) {
      toast.error(error.message || 'Gagal mengaktifkan mining');
    }
  };

  const stopAllMining = async () => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ mining_active: false })
        .gt('mining_balance', 0);

      if (error) throw error;

      setUsers(prev => prev.map(user => ({ ...user, mining_active: false })));
      toast.error('Mining semua user dihentikan!');
    } catch (error: any) {
      toast.error(error.message || 'Gagal menghentikan mining');
    }
  };

  return (
    <AppLayout>
      <div className="p-4 md:p-8">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Header */}
          <div className="flex items-center gap-3 mb-8">
            <div className="p-3 rounded-lg bg-primary/10 neon-border">
              <Settings className="w-8 h-8 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl font-bold neon-text">Mining Control</h1>
              <p className="text-muted-foreground">Kontrol mining secara global atau per user</p>
            </div>
          </div>

          {/* Global Mining Control */}
          <Card className="p-6 bg-card/50 border-primary/20 backdrop-blur-sm">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h2 className="text-xl font-semibold">Global Mining Control</h2>
                  <Badge
                    variant="secondary"
                    className={globalMining ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}
                  >
                    {globalMining ? 'Active' : 'Stopped'}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">
                  Kontrol mining untuk seluruh platform
                </p>
              </div>
              <Switch
                checked={globalMining}
                onCheckedChange={handleGlobalToggle}
                disabled={saving}
                className="scale-125"
              />
            </div>

            {!globalMining && (
              <div className="mt-4 p-4 bg-red-500/10 border border-red-500/20 rounded-lg flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-red-400 mt-0.5" />
                <div>
                  <p className="text-sm font-semibold text-red-400">Mining Global Dihentikan</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Semua aktivitas mining di platform saat ini tidak aktif
                  </p>
                </div>
              </div>
            )}
          </Card>

          {/* Bulk Actions */}
          <Card className="p-6 bg-card/50 border-primary/20 backdrop-blur-sm">
            <h2 className="text-xl font-semibold mb-4">Bulk Actions</h2>
            <div className="flex gap-3">
              <Button
                onClick={startAllMining}
                className="bg-green-500 hover:bg-green-600"
                disabled={!globalMining}
              >
                <Play className="w-4 h-4 mr-2" />
                Start All Mining
              </Button>
              <Button
                onClick={stopAllMining}
                variant="outline"
                className="border-red-500/20 hover:bg-red-500/10 text-red-400"
                disabled={!globalMining}
              >
                <Pause className="w-4 h-4 mr-2" />
                Stop All Mining
              </Button>
            </div>
          </Card>

          {/* User Mining Control */}
          <Card className="bg-card/50 border-primary/20 backdrop-blur-sm overflow-hidden">
            <div className="p-4 border-b border-primary/20">
              <h2 className="text-xl font-semibold">Individual User Control</h2>
              <p className="text-sm text-muted-foreground mt-1">
                Kelola status mining per user
              </p>
            </div>
            
            {loading ? (
              <div className="text-center py-8 text-muted-foreground">Loading...</div>
            ) : users.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">Belum ada user yang mining</div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow className="border-primary/20 hover:bg-primary/5">
                    <TableHead>Username</TableHead>
                    <TableHead>Mining Balance</TableHead>
                    <TableHead>Earning Profit</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.map((user) => (
                    <TableRow key={user.id} className="border-primary/10 hover:bg-primary/5">
                      <TableCell className="font-medium">{user.username}</TableCell>
                      <TableCell>
                        <span className="text-primary font-semibold">{user.mining_balance} TON</span>
                      </TableCell>
                      <TableCell>
                        <span className="text-green-400">{user.earning_profit} TON</span>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="secondary"
                          className={
                            user.mining_active && globalMining
                              ? 'bg-green-500/20 text-green-400'
                              : 'bg-red-500/20 text-red-400'
                          }
                        >
                          {user.mining_active && globalMining ? 'Mining' : 'Stopped'}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => toggleUserMining(user.id)}
                          disabled={!globalMining}
                          className={
                            user.mining_active
                              ? 'border-red-500/20 hover:bg-red-500/10 text-red-400'
                              : 'border-green-500/20 hover:bg-green-500/10 text-green-400'
                          }
                        >
                          {user.mining_active ? (
                            <>
                              <Pause className="w-4 h-4 mr-2" />
                              Stop
                            </>
                          ) : (
                            <>
                              <Play className="w-4 h-4 mr-2" />
                              Start
                            </>
                          )}
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </Card>
        </div>
      </div>
    </AppLayout>
  );
};

export default MiningControl;
