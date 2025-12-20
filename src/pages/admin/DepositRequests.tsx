import { useState, useEffect } from 'react';
import { AppLayout } from '@/components/layouts/AppLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
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
import { supabase } from '@/integrations/supabase/client';

interface DepositRequest {
  id: string;
  user_id: string;
  username: string;
  email: string;
  amount: number;
  tx_hash: string;
  status: 'pending' | 'approved' | 'rejected';
  admin_note: string | null;
  created_at: string;
}

const DepositRequests = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDeposit, setSelectedDeposit] = useState<DepositRequest | null>(null);
  const [showDetailDialog, setShowDetailDialog] = useState(false);
  const [deposits, setDeposits] = useState<DepositRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [note, setNote] = useState('');
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    fetchDeposits();
  }, []);

  const fetchDeposits = async () => {
    try {
      const { data: depositsData, error } = await supabase
        .from('deposits')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Get user profiles
      const userIds = depositsData?.map(d => d.user_id) || [];
      const { data: profiles } = await supabase
        .from('profiles')
        .select('id, username, email')
        .in('id', userIds);

      const profileMap = new Map(profiles?.map(p => [p.id, { username: p.username, email: p.email }]) || []);

      const enrichedDeposits = depositsData?.map(d => ({
        ...d,
        username: profileMap.get(d.user_id)?.username || 'Unknown',
        email: profileMap.get(d.user_id)?.email || 'Unknown',
      })) || [];

      setDeposits(enrichedDeposits);
    } catch (error) {
      console.error('Error fetching deposits:', error);
      toast.error('Gagal memuat data deposit');
    } finally {
      setLoading(false);
    }
  };

  const filteredDeposits = deposits.filter(
    deposit =>
      deposit.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
      deposit.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      deposit.tx_hash.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleApprove = async (id: string, noteText?: string) => {
    setProcessing(true);
    try {
      const { error } = await supabase.rpc('approve_deposit', {
        _deposit_id: id,
        _note: noteText || null
      });

      if (error) throw error;
      
      toast.success('Deposit berhasil disetujui!');
      fetchDeposits();
      setShowDetailDialog(false);
    } catch (error: any) {
      toast.error(error.message || 'Gagal approve deposit');
    } finally {
      setProcessing(false);
    }
  };

  const handleReject = async (id: string, noteText?: string) => {
    setProcessing(true);
    try {
      const { error } = await supabase.rpc('reject_deposit', {
        _deposit_id: id,
        _note: noteText || null
      });

      if (error) throw error;

      toast.error('Deposit ditolak!');
      fetchDeposits();
      setShowDetailDialog(false);
    } catch (error: any) {
      toast.error(error.message || 'Gagal reject deposit');
    } finally {
      setProcessing(false);
    }
  };

  const handleViewDetail = (deposit: DepositRequest) => {
    setSelectedDeposit(deposit);
    setNote('');
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
            {loading ? (
              <div className="text-center py-8 text-muted-foreground">Loading...</div>
            ) : (
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
                          {deposit.tx_hash.slice(0, 15)}...
                        </span>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {new Date(deposit.created_at).toLocaleString('id-ID')}
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
                                disabled={processing}
                                className="border-green-500/20 hover:bg-green-500/10 text-green-400"
                              >
                                <Check className="w-4 h-4" />
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleReject(deposit.id)}
                                disabled={processing}
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
            )}
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
                  <code className="text-xs flex-1 break-all">{selectedDeposit.tx_hash}</code>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => window.open(`https://tonscan.org/tx/${selectedDeposit.tx_hash}`, '_blank')}
                  >
                    <ExternalLink className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Date</p>
                  <p className="font-medium">{new Date(selectedDeposit.created_at).toLocaleString('id-ID')}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Status</p>
                  <Badge variant="secondary" className={getStatusColor(selectedDeposit.status)}>
                    {selectedDeposit.status}
                  </Badge>
                </div>
              </div>

              {selectedDeposit.status === 'pending' && (
                <div>
                  <Label htmlFor="note">Admin Note (optional)</Label>
                  <Textarea
                    id="note"
                    placeholder="Add note..."
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    className="bg-background/50 border-primary/20"
                  />
                </div>
              )}
            </div>
          )}
          <DialogFooter>
            {selectedDeposit?.status === 'pending' && (
              <>
                <Button
                  variant="outline"
                  onClick={() => handleReject(selectedDeposit.id, note)}
                  disabled={processing}
                  className="border-red-500/20 hover:bg-red-500/10 text-red-400"
                >
                  <X className="w-4 h-4 mr-2" />
                  Reject
                </Button>
                <Button
                  onClick={() => handleApprove(selectedDeposit.id, note)}
                  disabled={processing}
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
