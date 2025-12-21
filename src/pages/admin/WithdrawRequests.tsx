import { useState } from 'react';
import { AppLayout } from '@/components/layouts/AppLayout';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { ArrowUpFromLine, Search } from 'lucide-react';
import { useWithdrawRequests, WithdrawRequest } from '@/hooks/useWithdrawRequests';
import { WithdrawalsTable } from '@/components/admin/withdrawals/WithdrawalsTable';
import { WithdrawDetailDialog } from '@/components/admin/withdrawals/WithdrawDetailDialog';

const WithdrawRequests = () => {
  const { withdrawals, loading, searchQuery, setSearchQuery, processing, approve, reject } = useWithdrawRequests();
  const [selectedWithdraw, setSelectedWithdraw] = useState<WithdrawRequest | null>(null);
  const [showDetailDialog, setShowDetailDialog] = useState(false);

  const handleViewDetail = (w: WithdrawRequest) => { setSelectedWithdraw(w); setShowDetailDialog(true); };

  return (
    <AppLayout>
      <div className="p-4 md:p-8">
        <div className="max-w-7xl mx-auto space-y-6">
          <div className="flex items-center gap-3 mb-8">
            <div className="p-3 rounded-lg bg-primary/10 neon-border">
              <ArrowUpFromLine className="w-8 h-8 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl font-bold neon-text">Withdraw Requests</h1>
              <p className="text-muted-foreground">Review dan approve withdraw dari user</p>
            </div>
          </div>

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

          <Card className="bg-card/50 border-primary/20 backdrop-blur-sm overflow-hidden">
            <WithdrawalsTable
              withdrawals={withdrawals}
              loading={loading}
              processing={processing}
              onViewDetail={handleViewDetail}
              onApprove={approve}
              onReject={reject}
            />
          </Card>
        </div>
      </div>

      <WithdrawDetailDialog
        withdraw={selectedWithdraw}
        open={showDetailDialog}
        onOpenChange={setShowDetailDialog}
        processing={processing}
        onApprove={approve}
        onReject={reject}
      />
    </AppLayout>
  );
};

export default WithdrawRequests;
