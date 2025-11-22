import { useState } from 'react';
import { AppLayout } from '@/components/layouts/AppLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { ArrowDownUp, RefreshCw } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

const SwapCoin = () => {
  const { user, updateUser } = useAuth();
  const [fromCoin, setFromCoin] = useState<'TON' | 'TERA'>('TON');
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);

  // Swap rates: 1 TON = 10 TERA, 1 TERA = 0.084 TON
  const calculateSwapAmount = () => {
    if (!amount) return 0;
    const amountNum = parseFloat(amount);
    return fromCoin === 'TON' ? amountNum * 10 : amountNum * 0.084;
  };

  const swapFee = 0.5; // 0.5% swap fee

  const handleSwapDirection = () => {
    setFromCoin(fromCoin === 'TON' ? 'TERA' : 'TON');
    setAmount('');
  };

  const handleSwap = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!amount || parseFloat(amount) <= 0) {
      toast.error('Please enter valid amount');
      return;
    }

    const amountNum = parseFloat(amount);
    const maxBalance = fromCoin === 'TON' ? (user?.balance || 0) : (user?.teraBalance || 0);

    if (amountNum > maxBalance) {
      toast.error(`Insufficient ${fromCoin} balance`);
      return;
    }

    setLoading(true);

    setTimeout(() => {
      const swapAmount = calculateSwapAmount();
      const fee = amountNum * (swapFee / 100);
      const netSwapAmount = fromCoin === 'TON' 
        ? (amountNum - fee) * 10 
        : (amountNum - fee) * 0.084;

      if (fromCoin === 'TON' && user) {
        updateUser({
          balance: user.balance - amountNum,
          teraBalance: user.teraBalance + netSwapAmount,
        });
        toast.success(`Swapped ${amountNum} TON to ${netSwapAmount.toFixed(2)} TERA`);
      } else if (fromCoin === 'TERA' && user) {
        updateUser({
          balance: user.balance + netSwapAmount,
          teraBalance: user.teraBalance - amountNum,
        });
        toast.success(`Swapped ${amountNum} TERA to ${netSwapAmount.toFixed(4)} TON`);
      }

      setAmount('');
      setLoading(false);
    }, 1500);
  };

  return (
    <AppLayout>
      <div className="p-4 md:p-8">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Header */}
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">
              <span className="neon-text">Swap Coin</span>
            </h1>
            <p className="text-muted-foreground">Exchange between TON and TERA tokens</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Swap Form */}
            <div className="bg-card border neon-border rounded-2xl p-8">
              <h2 className="text-xl font-semibold text-foreground mb-6">Exchange Tokens</h2>
              
              <form onSubmit={handleSwap} className="space-y-6">
                {/* From Section */}
                <div className="space-y-2">
                  <Label className="text-foreground">From</Label>
                  <div className="p-4 bg-secondary/30 rounded-xl border border-border/50">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-2xl font-bold text-primary">{fromCoin}</span>
                      <span className="text-sm text-muted-foreground">
                        Balance: {fromCoin === 'TON' ? user?.balance.toFixed(2) : user?.teraBalance.toFixed(2)}
                      </span>
                    </div>
                    <Input
                      type="number"
                      step="0.01"
                      min="0"
                      placeholder="0.00"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      required
                      className="text-2xl font-semibold bg-transparent border-0 p-0 h-auto focus-visible:ring-0"
                    />
                  </div>
                </div>

                {/* Swap Direction Button */}
                <div className="flex justify-center">
                  <Button
                    type="button"
                    size="icon"
                    variant="outline"
                    onClick={handleSwapDirection}
                    className="w-12 h-12 rounded-full border-primary/30 hover:bg-primary/10 hover:rotate-180 transition-all duration-300"
                  >
                    <ArrowDownUp className="w-5 h-5 text-primary" />
                  </Button>
                </div>

                {/* To Section */}
                <div className="space-y-2">
                  <Label className="text-foreground">To</Label>
                  <div className="p-4 bg-secondary/30 rounded-xl border border-border/50">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-2xl font-bold text-foreground">
                        {fromCoin === 'TON' ? 'TERA' : 'TON'}
                      </span>
                      <span className="text-sm text-muted-foreground">
                        Balance: {fromCoin === 'TON' ? user?.teraBalance.toFixed(2) : user?.balance.toFixed(2)}
                      </span>
                    </div>
                    <div className="text-2xl font-semibold text-primary">
                      {calculateSwapAmount().toFixed(fromCoin === 'TON' ? 2 : 4)}
                    </div>
                  </div>
                </div>

                {/* Exchange Rate Info */}
                <div className="p-4 bg-primary/10 border border-primary/30 rounded-lg space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Exchange Rate:</span>
                    <span className="font-semibold text-foreground">
                      1 TON = 10 TERA
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Swap Fee:</span>
                    <span className="font-semibold text-foreground">{swapFee}%</span>
                  </div>
                  {amount && (
                    <>
                      <div className="h-px bg-border my-2"></div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">You will receive:</span>
                        <span className="font-semibold text-primary">
                          {fromCoin === 'TON' 
                            ? ((parseFloat(amount) - (parseFloat(amount) * swapFee / 100)) * 10).toFixed(2)
                            : ((parseFloat(amount) - (parseFloat(amount) * swapFee / 100)) * 0.084).toFixed(4)
                          } {fromCoin === 'TON' ? 'TERA' : 'TON'}
                        </span>
                      </div>
                    </>
                  )}
                </div>

                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-6 shadow-[0_0_20px_hsl(var(--primary)/0.3)] hover:shadow-[0_0_30px_hsl(var(--primary)/0.5)]"
                >
                  <RefreshCw className={`w-5 h-5 mr-2 ${loading ? 'animate-spin' : ''}`} />
                  {loading ? 'Swapping...' : 'Swap Now'}
                </Button>
              </form>
            </div>

            {/* Info & Rates */}
            <div className="space-y-6">
              {/* Current Balances */}
              <div className="bg-card border border-border/50 rounded-2xl p-8">
                <h2 className="text-xl font-semibold text-foreground mb-6">Your Balances</h2>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-primary/10 rounded-lg">
                    <span className="font-medium text-foreground">TON Balance</span>
                    <span className="text-xl font-bold text-primary">{user?.balance.toFixed(2)}</span>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-secondary/30 rounded-lg">
                    <span className="font-medium text-foreground">TERA Balance</span>
                    <span className="text-xl font-bold text-foreground">{user?.teraBalance.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              {/* Exchange Info */}
              <div className="bg-card border border-border/50 rounded-2xl p-8">
                <h2 className="text-xl font-semibold text-foreground mb-6">Exchange Information</h2>
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold text-foreground mb-2">TON to TERA</h3>
                    <p className="text-sm text-muted-foreground">
                      1 TON = 10 TERA
                    </p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground mb-2">TERA to TON</h3>
                    <p className="text-sm text-muted-foreground">
                      1 TERA = 0.084 TON
                    </p>
                  </div>
                  <div className="pt-4 border-t border-border/50">
                    <p className="text-xs text-muted-foreground">
                      All swaps include a {swapFee}% platform fee. Exchanges are processed instantly.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Swaps */}
          <div className="bg-card border border-border/50 rounded-2xl p-8">
            <h2 className="text-xl font-semibold text-foreground mb-6">Recent Swaps</h2>
            
            <div className="space-y-4">
              {[
                { date: '2024-01-20', from: '50 TON', to: '500 TERA' },
                { date: '2024-01-18', from: '200 TERA', to: '20 TON' },
                { date: '2024-01-15', from: '100 TON', to: '1000 TERA' },
              ].map((swap, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-4 bg-secondary/30 rounded-lg hover:bg-secondary/50 transition-colors"
                >
                  <div>
                    <p className="text-sm font-medium text-foreground">{swap.date}</p>
                    <p className="text-xs text-muted-foreground">Completed</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-foreground">
                      {swap.from} → {swap.to}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default SwapCoin;
