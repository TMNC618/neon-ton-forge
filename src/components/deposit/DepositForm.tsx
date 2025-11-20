import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArrowDownToLine, RefreshCw } from 'lucide-react';

interface DepositFormProps {
  amount: string;
  txId: string;
  loading: boolean;
  minDeposit: number;
  onAmountChange: (value: string) => void;
  onTxIdChange: (value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
}

export const DepositForm = ({
  amount,
  txId,
  loading,
  minDeposit,
  onAmountChange,
  onTxIdChange,
  onSubmit
}: DepositFormProps) => {
  return (
    <div className="bg-card border neon-border rounded-2xl p-8">
      <h2 className="text-xl font-semibold text-foreground mb-6">Submit Deposit</h2>
      
      <form onSubmit={onSubmit} className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="amount" className="text-foreground">
            Deposit Amount (TON)
          </Label>
          <Input
            id="amount"
            type="number"
            step="0.01"
            min={minDeposit}
            placeholder={`Minimum ${minDeposit} TON`}
            value={amount}
            onChange={(e) => onAmountChange(e.target.value)}
            required
            className="bg-secondary/30 border-border/50 focus:border-primary"
          />
          <p className="text-xs text-muted-foreground">
            Minimum deposit amount is {minDeposit} TON
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="txId" className="text-foreground">
            Transaction ID
          </Label>
          <Input
            id="txId"
            type="text"
            placeholder="Enter transaction hash"
            value={txId}
            onChange={(e) => onTxIdChange(e.target.value)}
            required
            className="bg-secondary/30 border-border/50 focus:border-primary font-mono text-sm"
          />
          <p className="text-xs text-muted-foreground">
            Copy the transaction ID from your wallet
          </p>
        </div>

        {amount && parseFloat(amount) >= minDeposit && (
          <div className="p-4 bg-primary/5 border border-primary/20 rounded-lg">
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Amount to be credited:</span>
              <span className="text-lg font-bold text-primary">{parseFloat(amount).toFixed(2)} TON</span>
            </div>
          </div>
        )}

        <Button
          type="submit"
          disabled={loading}
          className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
        >
          {loading ? (
            <>
              <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
              Submitting...
            </>
          ) : (
            <>
              <ArrowDownToLine className="mr-2 h-4 w-4" />
              Submit Deposit Request
            </>
          )}
        </Button>
      </form>
    </div>
  );
};
