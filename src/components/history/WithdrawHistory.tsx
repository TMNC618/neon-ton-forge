import { ArrowUpFromLine, CheckCircle, Clock, XCircle } from 'lucide-react';
import { WithdrawHistory as WithdrawHistoryType } from '@/hooks/useTransactionHistory';

interface WithdrawHistoryProps {
  withdrawals: WithdrawHistoryType[];
  loading: boolean;
}

export const WithdrawHistory = ({ withdrawals, loading }: WithdrawHistoryProps) => {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'rejected':
        return <XCircle className="w-4 h-4 text-red-500" />;
      default:
        return <Clock className="w-4 h-4 text-yellow-500" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'approved':
        return <span className="text-xs text-green-500">Approved</span>;
      case 'rejected':
        return <span className="text-xs text-red-500">Rejected</span>;
      default:
        return <span className="text-xs text-yellow-500">Pending</span>;
    }
  };

  return (
    <div className="bg-card border border-border/50 rounded-2xl p-8">
      <h2 className="text-xl font-semibold text-foreground mb-6">Withdrawal History</h2>
      
      {loading ? (
        <div className="text-center py-8 text-muted-foreground">Loading...</div>
      ) : withdrawals.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">No withdrawals yet</div>
      ) : (
        <div className="space-y-4">
          {withdrawals.map((withdrawal) => (
            <div
              key={withdrawal.id}
              className="flex items-center justify-between p-4 bg-secondary/30 rounded-lg hover:bg-secondary/50 transition-colors"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-destructive/20 flex items-center justify-center">
                  <ArrowUpFromLine className="w-6 h-6 text-destructive" />
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">
                    {new Date(withdrawal.created_at).toLocaleDateString('id-ID')}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    To: {withdrawal.wallet_address.slice(0, 10)}...{withdrawal.wallet_address.slice(-6)}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-semibold text-destructive">-{withdrawal.amount} TON</p>
                <p className="text-xs text-muted-foreground">Fee: {withdrawal.fee} TON</p>
                <div className="flex items-center gap-1 justify-end mt-1">
                  {getStatusIcon(withdrawal.status)}
                  {getStatusText(withdrawal.status)}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
