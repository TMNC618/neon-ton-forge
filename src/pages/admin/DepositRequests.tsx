import { useState } from 'react';
import { AppLayout } from '@/components/layouts/AppLayout';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { ArrowDownToLine, Search } from 'lucide-react';
import { useDepositRequests, DepositRequest } from '@/hooks/useDepositRequests';
import { DepositsTable } from '@/components/admin/deposits/DepositsTable';
import { DepositDetailDialog } from '@/components/admin/deposits/DepositDetailDialog';

const DepositRequests = () => {
  const { deposits, loading, searchQuery, setSearchQuery, processing, approve, reject } = useDepositRequests();
  const [selectedDeposit, setSelectedDeposit] = useState<DepositRequest | null>(null);
  const [showDetailDialog, setShowDetailDialog] = useState(false);

  const handleViewDetail = (deposit: DepositRequest) => { setSelectedDeposit(deposit); setShowDetailDialog(true); };

  return (
    <AppLayout>
      <div className="p-4 md:p-8">
        <div className="max-w-7xl mx-auto space-y-6">
          <div className="flex items-center gap-3 mb-8">
            <div className="p-3 rounded-lg bg-primary/10 neon-border">
              <ArrowDownToLine className="w-8 h-8 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl font-bold neon-text">Deposit Requests</h1>
              <p className="text-muted-foreground">Review dan approve deposit dari user</p>
            </div>
          </div>

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

          <Card className="bg-card/50 border-primary/20 backdrop-blur-sm overflow-hidden">
            <DepositsTable
              deposits={deposits}
              loading={loading}
              processing={processing}
              onViewDetail={handleViewDetail}
              onApprove={approve}
              onReject={reject}
            />
          </Card>
        </div>
      </div>

      <DepositDetailDialog
        deposit={selectedDeposit}
        open={showDetailDialog}
        onOpenChange={setShowDetailDialog}
        processing={processing}
        onApprove={approve}
        onReject={reject}
      />
    </AppLayout>
  );
};

export default DepositRequests;
