import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Minus } from 'lucide-react';
import { User } from '@/hooks/useUserManagement';
import { toast } from 'sonner';

interface BalanceDialogProps {
  user: User | null;
  action: 'add' | 'reduce';
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (userId: string, action: 'add' | 'reduce', amount: number, balanceType: string) => Promise<boolean>;
}

export function BalanceDialog({ user, action, open, onOpenChange, onSubmit }: BalanceDialogProps) {
  const [balanceType, setBalanceType] = useState('balance');
  const [amount, setAmount] = useState('');

  const handleSubmit = async () => {
    if (!user || !amount) return;
    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount <= 0) {
      toast.error('Jumlah tidak valid!');
      return;
    }
    const success = await onSubmit(user.id, action, numAmount, balanceType);
    if (success) {
      onOpenChange(false);
      setAmount('');
    }
  };

  if (!user) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-background border-primary/20">
        <DialogHeader>
          <DialogTitle className="neon-text">{action === 'add' ? 'Tambah' : 'Kurangi'} Saldo</DialogTitle>
          <DialogDescription>{action === 'add' ? 'Tambahkan' : 'Kurangi'} saldo untuk {user.username}</DialogDescription>
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
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="bg-background/50 border-primary/20 focus:border-primary"
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Batal</Button>
          <Button
            onClick={handleSubmit}
            className={action === 'add' ? 'bg-green-500 hover:bg-green-600' : 'bg-orange-500 hover:bg-orange-600'}
          >
            {action === 'add' ? <Plus className="w-4 h-4 mr-2" /> : <Minus className="w-4 h-4 mr-2" />}
            {action === 'add' ? 'Tambah' : 'Kurangi'} Saldo
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
