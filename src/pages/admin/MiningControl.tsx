import { useState } from 'react';
import { Sidebar } from '@/components/Sidebar';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
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

interface MiningUser {
  id: string;
  username: string;
  miningBalance: number;
  dailyProfit: number;
  isMining: boolean;
}

const MiningControl = () => {
  const [globalMining, setGlobalMining] = useState(true);
  const [users, setUsers] = useState<MiningUser[]>([
    {
      id: '1',
      username: 'DemoUser',
      miningBalance: 100,
      dailyProfit: 1,
      isMining: true,
    },
    {
      id: '2',
      username: 'JohnDoe',
      miningBalance: 250,
      dailyProfit: 2.5,
      isMining: true,
    },
    {
      id: '3',
      username: 'JaneSmith',
      miningBalance: 50,
      dailyProfit: 0.5,
      isMining: false,
    },
  ]);

  const handleGlobalToggle = (enabled: boolean) => {
    setGlobalMining(enabled);
    if (enabled) {
      toast.success('Mining global diaktifkan!');
    } else {
      toast.error('Mining global dihentikan!');
    }
  };

  const toggleUserMining = (userId: string) => {
    setUsers(prev =>
      prev.map(user =>
        user.id === userId ? { ...user, isMining: !user.isMining } : user
      )
    );
    const user = users.find(u => u.id === userId);
    toast.success(`Mining ${user?.username} ${user?.isMining ? 'dihentikan' : 'diaktifkan'}!`);
  };

  const startAllMining = () => {
    setUsers(prev => prev.map(user => ({ ...user, isMining: true })));
    toast.success('Mining semua user diaktifkan!');
  };

  const stopAllMining = () => {
    setUsers(prev => prev.map(user => ({ ...user, isMining: false })));
    toast.error('Mining semua user dihentikan!');
  };

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />

      <main className="flex-1 p-8">
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
            
            <Table>
              <TableHeader>
                <TableRow className="border-primary/20 hover:bg-primary/5">
                  <TableHead>Username</TableHead>
                  <TableHead>Mining Balance</TableHead>
                  <TableHead>Daily Profit</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((user) => (
                  <TableRow key={user.id} className="border-primary/10 hover:bg-primary/5">
                    <TableCell className="font-medium">{user.username}</TableCell>
                    <TableCell>
                      <span className="text-primary font-semibold">{user.miningBalance} TON</span>
                    </TableCell>
                    <TableCell>
                      <span className="text-green-400">{user.dailyProfit} TON/day</span>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="secondary"
                        className={
                          user.isMining && globalMining
                            ? 'bg-green-500/20 text-green-400'
                            : 'bg-red-500/20 text-red-400'
                        }
                      >
                        {user.isMining && globalMining ? 'Mining' : 'Stopped'}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => toggleUserMining(user.id)}
                        disabled={!globalMining}
                        className={
                          user.isMining
                            ? 'border-red-500/20 hover:bg-red-500/10 text-red-400'
                            : 'border-green-500/20 hover:bg-green-500/10 text-green-400'
                        }
                      >
                        {user.isMining ? (
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
          </Card>
        </div>
      </main>
    </div>
  );
};

export default MiningControl;
