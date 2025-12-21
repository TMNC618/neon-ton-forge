import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Eye, Plus, Minus, Lock, Unlock } from 'lucide-react';
import { User } from '@/hooks/useUserManagement';

interface UsersTableProps {
  users: User[];
  loading: boolean;
  onViewDetail: (user: User) => void;
  onAddBalance: (user: User) => void;
  onReduceBalance: (user: User) => void;
  onToggleStatus: (userId: string) => void;
}

export function UsersTable({ 
  users, loading, onViewDetail, onAddBalance, onReduceBalance, onToggleStatus 
}: UsersTableProps) {
  if (loading) {
    return <div className="text-center py-8 text-muted-foreground">Loading...</div>;
  }

  return (
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
        {users.map((user) => (
          <TableRow key={user.id} className="border-primary/10 hover:bg-primary/5">
            <TableCell className="font-medium">{user.username}</TableCell>
            <TableCell className="text-muted-foreground">{user.email}</TableCell>
            <TableCell><span className="text-primary font-semibold">{user.balance} TON</span></TableCell>
            <TableCell><span className="text-cyan-400">{user.mining_balance} TON</span></TableCell>
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
                <Button size="sm" variant="outline" onClick={() => onViewDetail(user)} className="border-primary/20 hover:bg-primary/10">
                  <Eye className="w-4 h-4" />
                </Button>
                <Button size="sm" variant="outline" onClick={() => onAddBalance(user)} className="border-green-500/20 hover:bg-green-500/10 text-green-400">
                  <Plus className="w-4 h-4" />
                </Button>
                <Button size="sm" variant="outline" onClick={() => onReduceBalance(user)} className="border-orange-500/20 hover:bg-orange-500/10 text-orange-400">
                  <Minus className="w-4 h-4" />
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => onToggleStatus(user.id)}
                  className={user.is_active ? 'border-red-500/20 hover:bg-red-500/10 text-red-400' : 'border-green-500/20 hover:bg-green-500/10 text-green-400'}
                >
                  {user.is_active ? <Lock className="w-4 h-4" /> : <Unlock className="w-4 h-4" />}
                </Button>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
