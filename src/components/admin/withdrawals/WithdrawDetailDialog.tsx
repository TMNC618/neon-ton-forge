import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Copy, Check, X } from 'lucide-react';
import { WithdrawRequest } from '@/hooks/useWithdrawRequests';
import { toast } from 'sonner';

interface WithdrawDetailDialogProps {
  withdraw: WithdrawRequest | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  processing: boolean;
  onApprove: (id: string, note?: string) => Promise<boolean>;
  onReject: (id: string, note?: string) => Promise<boolean>;
}

const getStatusColor = (status: string) => {
  switch (status) {
    case 'pending': return 'bg-yellow-500/20 text-yellow-400';
    case 'approved': return 'bg-green-500/20 text-green-400';
    case 'rejected': return 'bg-red-500/20 text-red-400';
    default: return 'bg-gray-500/20 text-gray-400';
  }
};

const getTypeColor = (type: string) => type === 'profit' ? 'bg-blue-500/20 text-blue-400' : 'bg-purple-500/20 text-purple-400';

export function WithdrawDetailDialog({ withdraw, open, onOpenChange, processing, onApprove, onReject }: WithdrawDetailDialogProps) {
  const [note, setNote] = useState('');

  if (!withdraw) return null;

  const copyToClipboard = (text: string) => { navigator.clipboard.writeText(text); toast.success('Wallet address copied!'); };
  const handleApprove = async () => { const ok = await onApprove(withdraw.id, note); if (ok) onOpenChange(false); };
  const handleReject = async () => { const ok = await onReject(withdraw.id, note); if (ok) onOpenChange(false); };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-background border-primary/20">
        <DialogHeader>
          <DialogTitle className="neon-text">Detail Withdraw</DialogTitle>
          <DialogDescription>Informasi lengkap withdraw request</DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div><p className="text-sm text-muted-foreground">Username</p><p className="font-medium">{withdraw.username}</p></div>
            <div><p className="text-sm text-muted-foreground">Email</p><p className="font-medium text-sm">{withdraw.email}</p></div>
          </div>
          <div><p className="text-sm text-muted-foreground">Type</p><Badge variant="secondary" className={getTypeColor(withdraw.withdraw_type || 'profit')}>{withdraw.withdraw_type || 'profit'}</Badge></div>
          <div className="grid grid-cols-3 gap-4">
            <div><p className="text-sm text-muted-foreground">Amount</p><p className="text-lg font-bold text-primary">{withdraw.amount} TON</p></div>
            <div><p className="text-sm text-muted-foreground">Fee</p><p className="text-lg font-bold text-orange-400">{withdraw.fee} TON</p></div>
            <div><p className="text-sm text-muted-foreground">Final Amount</p><p className="text-lg font-bold text-green-400">{withdraw.final_amount} TON</p></div>
          </div>
          <div>
            <p className="text-sm text-muted-foreground mb-1">Wallet Address</p>
            <div className="flex items-center gap-2 p-2 bg-secondary/30 rounded border border-primary/10">
              <code className="text-xs flex-1 break-all">{withdraw.wallet_address}</code>
              <Button size="sm" variant="ghost" onClick={() => copyToClipboard(withdraw.wallet_address)}><Copy className="w-4 h-4" /></Button>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div><p className="text-sm text-muted-foreground">Date</p><p className="font-medium">{new Date(withdraw.created_at).toLocaleString('id-ID')}</p></div>
            <div><p className="text-sm text-muted-foreground">Status</p><Badge variant="secondary" className={getStatusColor(withdraw.status)}>{withdraw.status}</Badge></div>
          </div>
          {withdraw.status === 'pending' && (
            <div><Label htmlFor="note">Admin Note (optional)</Label><Textarea id="note" placeholder="Add note..." value={note} onChange={(e) => setNote(e.target.value)} className="bg-background/50 border-primary/20" /></div>
          )}
        </div>
        <DialogFooter>
          {withdraw.status === 'pending' && (
            <>
              <Button variant="outline" onClick={handleReject} disabled={processing} className="border-red-500/20 hover:bg-red-500/10 text-red-400"><X className="w-4 h-4 mr-2" />Reject</Button>
              <Button onClick={handleApprove} disabled={processing} className="bg-green-500 hover:bg-green-600"><Check className="w-4 h-4 mr-2" />Approve</Button>
            </>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
