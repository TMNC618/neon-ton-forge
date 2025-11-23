import { useState } from 'react';
import { AppLayout } from '@/components/layouts/AppLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
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
import { toast } from 'sonner';
import { ArrowDownToLine, Search, Check, X, Eye, ExternalLink } from 'lucide-react';

interface DepositRequest {
  id: string;
  username: string;
  email: string;
  amount: number;
  txId: string;
  status: 'pending' | 'approved' | 'rejected';
  date: string;
}

const DepositRequests = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDeposit, setSelectedDeposit] = useState<DepositRequest | null>(null);
  const [showDetailDialog, setShowDetailDialog] = useState(false);

  const [deposits, setDeposits] = useState<DepositRequest[]>([
    {
      id: '1',
      username: 'DemoUser',
      email: 'user@example.com',
      amount: 100,
      txId: 'EQA...abc123xyz',
      status: 'pending',
      date: '2024-03-15 14:30',
    },
    {
      id: '2',
      username: 'JohnDoe',
      email: 'john@example.com',
      amount: 250,
      txId: 'EQA...def456uvw',
      status: 'pending',
      date: '2024-03-15 15:45',
    },
    {
      id: '3',
      username: 'JaneSmith',
      email: 'jane@example.com',
      amount: 50,
      txId: 'EQA...ghi789rst',
      status: 'approved',
      date: '2024-03-14 10:20',
    },
  ]);

  const filteredDeposits = deposits.filter(
    deposit =>
      deposit.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
      deposit.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      deposit.txId.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleApprove = (id: string) => {
    setDeposits(prev =>
      prev.map(deposit =>
        deposit.id === id ? { ...deposit, status: 'approved' as const } : deposit
      )
    );
    toast.success('Deposit berhasil disetujui!');
  };

  const handleReject = (id: string) => {
    setDeposits(prev =>
      prev.map(deposit =>
        deposit.id === id ? { ...deposit, status: 'rejected' as const } : deposit
      )
    );
    toast.error('Deposit ditolak!');
  };

  const handleViewDetail = (deposit: DepositRequest) => {
    setSelectedDeposit(deposit);
    setShowDetailDialog(true);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-500/20 text-yellow-400';
      case 'approved':
        return 'bg-green-500/20 text-green-400';
      case 'rejected':
        return 'bg-red-500/20 text-red-400';
      default:
        return 'bg-gray-500/20 text-gray-400';
    }
  };

  return (
    <AppLayout>
      <div className="p-4 md:p-8">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Header */}
          <div className="flex items-center gap-3 mb-8">
            <div className="p-3 rounded-lg bg-primary/10 neon-border">
              <ArrowDownToLine className="w-8 h-8 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl font-bold neon-text">Deposit Requests</h1>
              <p className="text-muted-foreground">Review dan approve deposit dari user</p>
            </div>
          </div>

          {/* Search */}
          <Card className="p-4 bg-card/50 border-primary/20 backdrop-blur-sm">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Cari username, email, atau TX ID..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-background/50 border-primary/20 focus:border-primary"
              />
            </div>
          </Card>

          {/* Deposits Table */}
          <Card className="bg-card/50 border-primary/20 backdrop-blur-sm overflow-hidden">
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
                {filteredDeposits.map((deposit) => (
                  <TableRow key={deposit.id} className="border-primary/10 hover:bg-primary/5">
                    <TableCell>
                      <div>
                        <p className="font-medium">{deposit.username}</p>
                        <p className="text-xs text-muted-foreground">{deposit.email}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="text-primary font-semibold">{deposit.amount} TON</span>
                    </TableCell>
                    <TableCell>
                      <span className="text-xs font-mono text-muted-foreground">
                        {deposit.txId.slice(0, 15)}...
                      </span>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {deposit.date}
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary" className={getStatusColor(deposit.status)}>
                        {deposit.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleViewDetail(deposit)}
                          className="border-primary/20 hover:bg-primary/10"
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        {deposit.status === 'pending' && (
                          <>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleApprove(deposit.id)}
                              className="border-green-500/20 hover:bg-green-500/10 text-green-400"
                            >
                              <Check className="w-4 h-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleReject(deposit.id)}
                              className="border-red-500/20 hover:bg-red-500/10 text-red-400"
                            >
                              <X className="w-4 h-4" />
                            </Button>
                          </>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        </div>
      </div>

      {/* Detail Dialog */}
      <Dialog open={showDetailDialog} onOpenChange={setShowDetailDialog}>
        <DialogContent className="bg-background border-primary/20">
          <DialogHeader>
            <DialogTitle className="neon-text">Detail Deposit</DialogTitle>
            <DialogDescription>Informasi lengkap deposit request</DialogDescription>
          </DialogHeader>
          {selectedDeposit && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Username</p>
                  <p className="font-medium">{selectedDeposit.username}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Email</p>
                  <p className="font-medium text-sm">{selectedDeposit.email}</p>
                </div>
              </div>

              <div>
                <p className="text-sm text-muted-foreground">Amount</p>
                <p className="text-2xl font-bold text-primary">{selectedDeposit.amount} TON</p>
              </div>

              <div>
                <p className="text-sm text-muted-foreground mb-1">Transaction ID</p>
                <div className="flex items-center gap-2 p-2 bg-secondary/30 rounded border border-primary/10">
                  <code className="text-xs flex-1 break-all">{selectedDeposit.txId}</code>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => window.open(`https://tonscan.org/tx/${selectedDeposit.txId}`, '_blank')}
                  >
                    <ExternalLink className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Date</p>
                  <p className="font-medium">{selectedDeposit.date}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Status</p>
                  <Badge variant="secondary" className={getStatusColor(selectedDeposit.status)}>
                    {selectedDeposit.status}
                  </Badge>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            {selectedDeposit?.status === 'pending' && (
              <>
                <Button
                  variant="outline"
                  onClick={() => {
                    handleReject(selectedDeposit.id);
                    setShowDetailDialog(false);
                  }}
                  className="border-red-500/20 hover:bg-red-500/10 text-red-400"
                >
                  <X className="w-4 h-4 mr-2" />
                  Reject
                </Button>
                <Button
                  onClick={() => {
                    handleApprove(selectedDeposit.id);
                    setShowDetailDialog(false);
                  }}
                  className="bg-green-500 hover:bg-green-600"
                >
                  <Check className="w-4 h-4 mr-2" />
                  Approve
                </Button>
              </>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AppLayout>
  );
};

export default DepositRequests;
