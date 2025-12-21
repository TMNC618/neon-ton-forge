import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { ExternalLink, Check, X } from 'lucide-react';
import { DepositRequest } from '@/hooks/useDepositRequests';

interface DepositDetailDialogProps {
  deposit: DepositRequest | null;
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

export function DepositDetailDialog({ deposit, open, onOpenChange, processing, onApprove, onReject }: DepositDetailDialogProps) {
  const [note, setNote] = useState('');

  if (!deposit) return null;

  const handleApprove = async () => { const ok = await onApprove(deposit.id, note); if (ok) onOpenChange(false); };
  const handleReject = async () => { const ok = await onReject(deposit.id, note); if (ok) onOpenChange(false); };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-background border-primary/20">
        <DialogHeader>
          <DialogTitle className="neon-text">Detail Deposit</DialogTitle>
          <DialogDescription>Informasi lengkap deposit request</DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div><p className="text-sm text-muted-foreground">Username</p><p className="font-medium">{deposit.username}</p></div>
            <div><p className="text-sm text-muted-foreground">Email</p><p className="font-medium text-sm">{deposit.email}</p></div>
          </div>
          <div><p className="text-sm text-muted-foreground">Amount</p><p className="text-2xl font-bold text-primary">{deposit.amount} TON</p></div>
          <div>
            <p className="text-sm text-muted-foreground mb-1">Transaction ID</p>
            <div className="flex items-center gap-2 p-2 bg-secondary/30 rounded border border-primary/10">
              <code className="text-xs flex-1 break-all">{deposit.tx_hash}</code>
              <Button size="sm" variant="ghost" onClick={() => window.open(`https://tonscan.org/tx/${deposit.tx_hash}`, '_blank')}><ExternalLink className="w-4 h-4" /></Button>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div><p className="text-sm text-muted-foreground">Date</p><p className="font-medium">{new Date(deposit.created_at).toLocaleString('id-ID')}</p></div>
            <div><p className="text-sm text-muted-foreground">Status</p><Badge variant="secondary" className={getStatusColor(deposit.status)}>{deposit.status}</Badge></div>
          </div>
          {deposit.status === 'pending' && (
            <div><Label htmlFor="note">Admin Note (optional)</Label><Textarea id="note" placeholder="Add note..." value={note} onChange={(e) => setNote(e.target.value)} className="bg-background/50 border-primary/20" /></div>
          )}
        </div>
        <DialogFooter>
          {deposit.status === 'pending' && (
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
