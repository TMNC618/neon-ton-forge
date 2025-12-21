import { ArrowRightLeft } from 'lucide-react';
import { SwapHistory as SwapHistoryType } from '@/hooks/useTransactionHistory';

interface SwapHistoryProps {
  swaps: SwapHistoryType[];
  loading: boolean;
}

export const SwapHistory = ({ swaps, loading }: SwapHistoryProps) => {
  return (
    <div className="bg-card border border-border/50 rounded-2xl p-8">
      <h2 className="text-xl font-semibold text-foreground mb-6">Swap History</h2>
      
      {loading ? (
        <div className="text-center py-8 text-muted-foreground">Loading...</div>
      ) : swaps.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">No swaps yet</div>
      ) : (
        <div className="space-y-4">
          {swaps.map((swap) => (
            <div
              key={swap.id}
              className="flex items-center justify-between p-4 bg-secondary/30 rounded-lg hover:bg-secondary/50 transition-colors"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                  <ArrowRightLeft className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">
                    {new Date(swap.created_at).toLocaleDateString('id-ID')}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {swap.from_currency} → {swap.to_currency}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-semibold text-foreground">
                  {swap.amount} {swap.from_currency}
                </p>
                <p className="text-xs text-muted-foreground">Fee: {swap.fee || 0}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
