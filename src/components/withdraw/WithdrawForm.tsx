import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArrowUpFromLine, RefreshCw, Wallet, AlertCircle } from 'lucide-react';

interface WithdrawFormProps {
  type: 'profit' | 'referral';
  amount: string;
  walletAddress: string;
  loading: boolean;
  balance: number;
  minWithdraw: number;
  withdrawFee: number;
  onAmountChange: (value: string) => void;
  onWalletChange: (value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
}

export const WithdrawForm = ({
  type,
  amount,
  walletAddress,
  loading,
  balance,
  minWithdraw,
  withdrawFee,
  onAmountChange,
  onWalletChange,
  onSubmit
}: WithdrawFormProps) => {
  const finalAmount = amount ? parseFloat(amount) * (1 - withdrawFee / 100) : 0;

  return (
    <div className="bg-card border neon-border rounded-2xl p-8">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 rounded-lg bg-primary/10">
          {type === 'profit' ? (
            <ArrowUpFromLine className="w-6 h-6 text-primary" />
          ) : (
            <Wallet className="w-6 h-6 text-primary" />
          )}
        </div>
        <h2 className="text-xl font-semibold text-foreground">
          Withdraw {type === 'profit' ? 'Profit' : 'Referral'}
        </h2>
      </div>

      <form onSubmit={onSubmit} className="space-y-6">
        <div className="p-4 bg-secondary/30 rounded-lg border border-border/50">
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Available Balance:</span>
            <span className="text-lg font-bold text-primary">{balance.toFixed(2)} TON</span>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor={`amount-${type}`} className="text-foreground">
            Withdraw Amount (TON)
          </Label>
          <Input
            id={`amount-${type}`}
            type="number"
            step="0.01"
            min={minWithdraw}
            max={balance}
            placeholder={`Minimum ${minWithdraw} TON`}
            value={amount}
            onChange={(e) => onAmountChange(e.target.value)}
            required
            className="bg-secondary/30 border-border/50 focus:border-primary"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor={`wallet-${type}`} className="text-foreground">
            TON Wallet Address
          </Label>
          <Input
            id={`wallet-${type}`}
            type="text"
            placeholder="Enter your TON wallet address"
            value={walletAddress}
            onChange={(e) => onWalletChange(e.target.value)}
            required
            className="bg-secondary/30 border-border/50 focus:border-primary font-mono text-sm"
          />
        </div>

        {amount && parseFloat(amount) >= minWithdraw && (
          <div className="space-y-2 p-4 bg-primary/5 border border-primary/20 rounded-lg">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Withdraw Amount:</span>
              <span className="font-medium text-foreground">{parseFloat(amount).toFixed(2)} TON</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Fee ({withdrawFee}%):</span>
              <span className="font-medium text-foreground">
                {(parseFloat(amount) * (withdrawFee / 100)).toFixed(2)} TON
              </span>
            </div>
            <div className="flex justify-between text-sm pt-2 border-t border-border/50">
              <span className="text-muted-foreground">You will receive:</span>
              <span className="font-semibold text-primary">{finalAmount.toFixed(2)} TON</span>
            </div>
          </div>
        )}

        <div className="p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-lg flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-yellow-500 mt-0.5 flex-shrink-0" />
          <div className="text-sm">
            <p className="font-medium text-yellow-500 mb-1">Important</p>
            <p className="text-muted-foreground">
              Minimum withdrawal: {minWithdraw} TON. Requests are processed within 24-48 hours.
            </p>
          </div>
        </div>

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
            <>
              <ArrowUpFromLine className="mr-2 h-4 w-4" />
              Submit Withdrawal Request
            </>
          )}
        </Button>
      </form>
    </div>
  );
};
