import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Mail, Phone, Wallet } from 'lucide-react';
import { User } from '@/hooks/useUserManagement';

interface UserDetailDialogProps {
  user: User | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function UserDetailDialog({ user, open, onOpenChange }: UserDetailDialogProps) {
  if (!user) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-background border-primary/20">
        <DialogHeader>
          <DialogTitle className="neon-text">Detail User</DialogTitle>
          <DialogDescription>Informasi lengkap pengguna</DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-muted-foreground">Username</Label>
              <p className="font-medium">{user.username}</p>
            </div>
            <div>
              <Label className="text-muted-foreground">Status</Label>
              <Badge className={user.is_active ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}>
                {user.is_active ? 'Active' : 'Blocked'}
              </Badge>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-primary" />
              <span className="text-sm">{user.email}</span>
            </div>
            <div className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-primary" />
              <span className="text-sm">{user.phone_number || '-'}</span>
            </div>
            <div className="flex items-center gap-2">
              <Wallet className="w-4 h-4 text-primary" />
              <span className="text-sm">{user.wallet_address || '-'}</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 pt-4 border-t border-primary/20">
            <div>
              <Label className="text-muted-foreground">TON Balance</Label>
              <p className="text-xl font-bold text-primary">{user.balance} TON</p>
            </div>
            <div>
              <Label className="text-muted-foreground">TERA Balance</Label>
              <p className="text-xl font-bold text-cyan-400">{user.tera_balance} TERA</p>
            </div>
            <div>
              <Label className="text-muted-foreground">Mining Balance</Label>
              <p className="text-xl font-bold text-purple-400">{user.mining_balance} TON</p>
            </div>
            <div>
              <Label className="text-muted-foreground">Earning Profit</Label>
              <p className="text-xl font-bold text-green-400">{user.earning_profit} TON</p>
            </div>
          </div>

          <div className="pt-4 border-t border-primary/20">
            <Label className="text-muted-foreground">Join Date</Label>
            <p className="text-sm">{new Date(user.created_at).toLocaleDateString('id-ID')}</p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
