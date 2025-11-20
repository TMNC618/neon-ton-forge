import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArrowDownUp, RefreshCw } from 'lucide-react';

interface SwapFormProps {
  fromCoin: 'TON' | 'TERA';
  amount: string;
  userBalance: number;
  teraBalance: number;
  loading: boolean;
  swapFee: number;
  onAmountChange: (value: string) => void;
  onSwapDirection: () => void;
  onSubmit: (e: React.FormEvent) => void;
  calculateSwapAmount: () => number;
}

export const SwapForm = ({
  fromCoin,
  amount,
  userBalance,
  teraBalance,
  loading,
  swapFee,
  onAmountChange,
  onSwapDirection,
  onSubmit,
  calculateSwapAmount
}: SwapFormProps) => {
  const toCoin = fromCoin === 'TON' ? 'TERA' : 'TON';
  const fromBalance = fromCoin === 'TON' ? userBalance : teraBalance;

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      {/* From Section */}
      <div className="space-y-2">
        <Label className="text-foreground">From</Label>
        <div className="p-4 bg-secondary/30 rounded-xl border border-border/50">
          <div className="flex items-center justify-between mb-3">
            <span className="text-2xl font-bold text-primary">{fromCoin}</span>
            <span className="text-sm text-muted-foreground">
              Balance: {fromBalance.toFixed(2)}
            </span>
          </div>
          <Input
            type="number"
            step="0.01"
            min="0"
            placeholder="0.00"
            value={amount}
            onChange={(e) => onAmountChange(e.target.value)}
            required
            className="text-2xl font-semibold bg-transparent border-none focus-visible:ring-0 p-0"
          />
        </div>
      </div>

      {/* Swap Direction Button */}
      <div className="flex justify-center">
        <Button
          type="button"
          size="icon"
          variant="outline"
          onClick={onSwapDirection}
          className="rounded-full h-12 w-12 border-primary/30 hover:bg-primary/10"
        >
          <ArrowDownUp className="w-5 h-5 text-primary" />
        </Button>
      </div>

      {/* To Section */}
      <div className="space-y-2">
        <Label className="text-foreground">To</Label>
        <div className="p-4 bg-secondary/30 rounded-xl border border-border/50">
          <div className="flex items-center justify-between mb-3">
            <span className="text-2xl font-bold text-foreground">{toCoin}</span>
          </div>
          <div className="text-2xl font-semibold text-foreground">
            {amount ? calculateSwapAmount().toFixed(fromCoin === 'TON' ? 2 : 4) : '0.00'}
          </div>
        </div>
      </div>

      {/* Swap Details */}
      {amount && parseFloat(amount) > 0 && (
        <div className="space-y-2 p-4 bg-primary/5 rounded-lg border border-primary/20">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Exchange Rate:</span>
            <span className="font-medium text-foreground">
              1 {fromCoin} = {fromCoin === 'TON' ? '10' : '0.084'} {toCoin}
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Fee ({swapFee}%):</span>
            <span className="font-medium text-foreground">
              {(parseFloat(amount) * (swapFee / 100)).toFixed(4)} {fromCoin}
            </span>
          </div>
          <div className="flex justify-between text-sm pt-2 border-t border-border/50">
            <span className="text-muted-foreground">You will receive:</span>
            <span className="font-semibold text-primary">
              {fromCoin === 'TON' 
                ? ((parseFloat(amount) - (parseFloat(amount) * swapFee / 100)) * 10).toFixed(2)
                : ((parseFloat(amount) - (parseFloat(amount) * swapFee / 100)) * 0.084).toFixed(4)
              } {toCoin}
            </span>
          </div>
        </div>
      )}

      {/* Submit Button */}
      <Button
        type="submit"
        disabled={loading}
        className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
      >
        {loading ? (
          <>
            <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
            Processing...
          </>
        ) : (
          'Swap Now'
        )}
      </Button>
    </form>
  );
};
