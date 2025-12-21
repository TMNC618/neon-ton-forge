import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Eye, Check, X } from 'lucide-react';
import { DepositRequest } from '@/hooks/useDepositRequests';

interface DepositsTableProps {
  deposits: DepositRequest[];
  loading: boolean;
  processing: boolean;
  onViewDetail: (deposit: DepositRequest) => void;
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

export function DepositsTable({ deposits, loading, processing, onViewDetail, onApprove, onReject }: DepositsTableProps) {
  if (loading) return <div className="text-center py-8 text-muted-foreground">Loading...</div>;

  return (
    <Table>
      <TableHeader>
        <TableRow className="border-primary/20 hover:bg-primary/5">
          <TableHead>User</TableHead>
          <TableHead>Amount</TableHead>
          <TableHead>TX ID</TableHead>
          <TableHead>Date</TableHead>
          <TableHead>Status</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {deposits.map((d) => (
          <TableRow key={d.id} className="border-primary/10 hover:bg-primary/5">
            <TableCell>
              <div>
                <p className="font-medium">{d.username}</p>
                <p className="text-xs text-muted-foreground">{d.email}</p>
              </div>
            </TableCell>
            <TableCell><span className="text-primary font-semibold">{d.amount} TON</span></TableCell>
            <TableCell><span className="text-xs font-mono text-muted-foreground">{d.tx_hash.slice(0, 15)}...</span></TableCell>
            <TableCell className="text-sm text-muted-foreground">{new Date(d.created_at).toLocaleString('id-ID')}</TableCell>
            <TableCell><Badge variant="secondary" className={getStatusColor(d.status)}>{d.status}</Badge></TableCell>
            <TableCell className="text-right">
              <div className="flex justify-end gap-2">
                <Button size="sm" variant="outline" onClick={() => onViewDetail(d)} className="border-primary/20 hover:bg-primary/10"><Eye className="w-4 h-4" /></Button>
                {d.status === 'pending' && (
                  <>
                    <Button size="sm" variant="outline" onClick={() => onApprove(d.id)} disabled={processing} className="border-green-500/20 hover:bg-green-500/10 text-green-400"><Check className="w-4 h-4" /></Button>
                    <Button size="sm" variant="outline" onClick={() => onReject(d.id)} disabled={processing} className="border-red-500/20 hover:bg-red-500/10 text-red-400"><X className="w-4 h-4" /></Button>
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
