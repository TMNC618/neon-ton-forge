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
import { ArrowUpFromLine, Search, Check, X, Eye, Copy } from 'lucide-react';

interface WithdrawRequest {
  id: string;
  username: string;
  email: string;
  amount: number;
  fee: number;
  finalAmount: number;
  walletAddress: string;
  type: 'profit' | 'referral';
  status: 'pending' | 'approved' | 'rejected';
  date: string;
}

const WithdrawRequests = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedWithdraw, setSelectedWithdraw] = useState<WithdrawRequest | null>(null);
  const [showDetailDialog, setShowDetailDialog] = useState(false);

  const [withdrawals, setWithdrawals] = useState<WithdrawRequest[]>([
    {
      id: '1',
      username: 'DemoUser',
      email: 'user@example.com',
      amount: 50,
      fee: 1,
      finalAmount: 49,
      walletAddress: 'EQD...abc123xyz',
      type: 'profit',
      status: 'pending',
      date: '2024-03-15 14:30',
    },
    {
      id: '2',
      username: 'JohnDoe',
      email: 'john@example.com',
      amount: 25,
      fee: 0.5,
      finalAmount: 24.5,
      walletAddress: 'EQD...def456uvw',
      type: 'referral',
      status: 'pending',
      date: '2024-03-15 15:45',
    },
    {
      id: '3',
      username: 'JaneSmith',
      email: 'jane@example.com',
      amount: 15,
      fee: 0.3,
      finalAmount: 14.7,
      walletAddress: 'EQD...ghi789rst',
      type: 'profit',
      status: 'approved',
      date: '2024-03-14 10:20',
    },
  ]);

  const filteredWithdrawals = withdrawals.filter(
    withdraw =>
      withdraw.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
      withdraw.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      withdraw.walletAddress.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleApprove = (id: string) => {
    setWithdrawals(prev =>
      prev.map(withdraw =>
        withdraw.id === id ? { ...withdraw, status: 'approved' as const } : withdraw
      )
    );
    toast.success('Withdraw berhasil disetujui!');
  };

  const handleReject = (id: string) => {
    setWithdrawals(prev =>
      prev.map(withdraw =>
        withdraw.id === id ? { ...withdraw, status: 'rejected' as const } : withdraw
      )
    );
    toast.error('Withdraw ditolak!');
  };

  const handleViewDetail = (withdraw: WithdrawRequest) => {
    setSelectedWithdraw(withdraw);
    setShowDetailDialog(true);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Wallet address copied!');
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

  const getTypeColor = (type: string) => {
    return type === 'profit' ? 'bg-blue-500/20 text-blue-400' : 'bg-purple-500/20 text-purple-400';
  };

  return (
    <AppLayout>
      <div className="p-4 md:p-8">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Header */}
          <div className="flex items-center gap-3 mb-8">
            <div className="p-3 rounded-lg bg-primary/10 neon-border">
              <ArrowUpFromLine className="w-8 h-8 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl font-bold neon-text">Withdraw Requests</h1>
              <p className="text-muted-foreground">Review dan approve withdraw dari user</p>
            </div>
          </div>

          {/* Search */}
          <Card className="p-4 bg-card/50 border-primary/20 backdrop-blur-sm">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Cari username, email, atau wallet address..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-background/50 border-primary/20 focus:border-primary"
              />
            </div>
          </Card>

          {/* Withdrawals Table */}
          <Card className="bg-card/50 border-primary/20 backdrop-blur-sm overflow-hidden">
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
                {filteredWithdrawals.map((withdraw) => (
                  <TableRow key={withdraw.id} className="border-primary/10 hover:bg-primary/5">
                    <TableCell>
                      <div>
                        <p className="font-medium">{withdraw.username}</p>
                        <p className="text-xs text-muted-foreground">{withdraw.email}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary" className={getTypeColor(withdraw.type)}>
                        {withdraw.type}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <span className="text-primary font-semibold">{withdraw.amount} TON</span>
                    </TableCell>
                    <TableCell>
                      <span className="text-orange-400">{withdraw.fee} TON</span>
                    </TableCell>
                    <TableCell>
                      <span className="text-green-400 font-semibold">{withdraw.finalAmount} TON</span>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {withdraw.date}
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary" className={getStatusColor(withdraw.status)}>
                        {withdraw.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleViewDetail(withdraw)}
                          className="border-primary/20 hover:bg-primary/10"
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        {withdraw.status === 'pending' && (
                          <>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleApprove(withdraw.id)}
                              className="border-green-500/20 hover:bg-green-500/10 text-green-400"
                            >
                              <Check className="w-4 h-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleReject(withdraw.id)}
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
            <DialogTitle className="neon-text">Detail Withdraw</DialogTitle>
            <DialogDescription>Informasi lengkap withdraw request</DialogDescription>
          </DialogHeader>
          {selectedWithdraw && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Username</p>
                  <p className="font-medium">{selectedWithdraw.username}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Email</p>
                  <p className="font-medium text-sm">{selectedWithdraw.email}</p>
                </div>
              </div>

              <div>
                <p className="text-sm text-muted-foreground">Type</p>
                <Badge variant="secondary" className={getTypeColor(selectedWithdraw.type)}>
                  {selectedWithdraw.type}
                </Badge>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Amount</p>
                  <p className="text-lg font-bold text-primary">{selectedWithdraw.amount} TON</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Fee</p>
                  <p className="text-lg font-bold text-orange-400">{selectedWithdraw.fee} TON</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Final Amount</p>
                  <p className="text-lg font-bold text-green-400">{selectedWithdraw.finalAmount} TON</p>
                </div>
              </div>

              <div>
                <p className="text-sm text-muted-foreground mb-1">Wallet Address</p>
                <div className="flex items-center gap-2 p-2 bg-secondary/30 rounded border border-primary/10">
                  <code className="text-xs flex-1 break-all">{selectedWithdraw.walletAddress}</code>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => copyToClipboard(selectedWithdraw.walletAddress)}
                  >
                    <Copy className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Date</p>
                  <p className="font-medium">{selectedWithdraw.date}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Status</p>
                  <Badge variant="secondary" className={getStatusColor(selectedWithdraw.status)}>
                    {selectedWithdraw.status}
                  </Badge>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            {selectedWithdraw?.status === 'pending' && (
              <>
                <Button
                  variant="outline"
                  onClick={() => {
                    handleReject(selectedWithdraw.id);
                    setShowDetailDialog(false);
                  }}
                  className="border-red-500/20 hover:bg-red-500/10 text-red-400"
                >
                  <X className="w-4 h-4 mr-2" />
                  Reject
                </Button>
                <Button
                  onClick={() => {
                    handleApprove(selectedWithdraw.id);
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

export default WithdrawRequests;
