import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Eye, Check, X } from 'lucide-react';
import { WithdrawRequest } from '@/hooks/useWithdrawRequests';

interface WithdrawalsTableProps {
  withdrawals: WithdrawRequest[];
  loading: boolean;
  processing: boolean;
  onViewDetail: (w: WithdrawRequest) => void;
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
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

export function WithdrawalsTable({ withdrawals, loading, processing, onViewDetail, onApprove, onReject }: WithdrawalsTableProps) {
  if (loading) return <div className="text-center py-8 text-muted-foreground">Loading...</div>;

  return (
    <Table>
      <TableHeader>
        <TableRow className="border-primary/20 hover:bg-primary/5">
          <TableHead>User</TableHead>
          <TableHead>Type</TableHead>
          <TableHead>Amount</TableHead>
          <TableHead>Fee</TableHead>
          <TableHead>Final</TableHead>
          <TableHead>Date</TableHead>
          <TableHead>Status</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {withdrawals.map((w) => (
          <TableRow key={w.id} className="border-primary/10 hover:bg-primary/5">
            <TableCell><div><p className="font-medium">{w.username}</p><p className="text-xs text-muted-foreground">{w.email}</p></div></TableCell>
            <TableCell><Badge variant="secondary" className={getTypeColor(w.withdraw_type || 'profit')}>{w.withdraw_type || 'profit'}</Badge></TableCell>
            <TableCell><span className="text-primary font-semibold">{w.amount} TON</span></TableCell>
            <TableCell><span className="text-orange-400">{w.fee} TON</span></TableCell>
            <TableCell><span className="text-green-400 font-semibold">{w.final_amount} TON</span></TableCell>
            <TableCell className="text-sm text-muted-foreground">{new Date(w.created_at).toLocaleString('id-ID')}</TableCell>
            <TableCell><Badge variant="secondary" className={getStatusColor(w.status)}>{w.status}</Badge></TableCell>
            <TableCell className="text-right">
              <div className="flex justify-end gap-2">
                <Button size="sm" variant="outline" onClick={() => onViewDetail(w)} className="border-primary/20 hover:bg-primary/10"><Eye className="w-4 h-4" /></Button>
                {w.status === 'pending' && (
                  <>
                    <Button size="sm" variant="outline" onClick={() => onApprove(w.id)} disabled={processing} className="border-green-500/20 hover:bg-green-500/10 text-green-400"><Check className="w-4 h-4" /></Button>
                    <Button size="sm" variant="outline" onClick={() => onReject(w.id)} disabled={processing} className="border-red-500/20 hover:bg-red-500/10 text-red-400"><X className="w-4 h-4" /></Button>
                  </>
                )}
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
