import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppLayout } from '@/components/layouts/AppLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { ArrowDownUp, RefreshCw, Loader2 } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { SwapHistory } from '@/components/history/SwapHistory';
import { useSwapHistory } from '@/hooks/useTransactionHistory';

const SwapCoin = () => {
  const { user, profile, loading, refreshProfile } = useAuth();
  const navigate = useNavigate();
  const [fromCoin, setFromCoin] = useState<'TON' | 'TERA'>('TON');
  const [amount, setAmount] = useState('');
  const [swapping, setSwapping] = useState(false);
  const { swaps, loading: loadingHistory, refetch } = useSwapHistory();

  useEffect(() => {
    if (!loading && !user) {
      navigate('/login');
    }
  }, [user, loading, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user || !profile) return null;

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

  const handleSwap = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!amount || parseFloat(amount) <= 0) {
      toast.error('Please enter valid amount');
      return;
    }

    const amountNum = parseFloat(amount);
    const maxBalance = fromCoin === 'TON' ? profile.balance : profile.tera_balance;

    if (amountNum > maxBalance) {
      toast.error(`Insufficient ${fromCoin} balance`);
      return;
    }

    setSwapping(true);

    try {
      const functionName = fromCoin === 'TON' ? 'swap_ton_to_tera' : 'swap_tera_to_ton';
      const { data, error } = await supabase.rpc(functionName, { _amount: amountNum });
      
      if (error) throw error;

      const resultAmount = Number(data);
      toast.success(`Swapped ${amountNum} ${fromCoin} to ${resultAmount.toFixed(fromCoin === 'TON' ? 2 : 4)} ${fromCoin === 'TON' ? 'TERA' : 'TON'}`);
      
      setAmount('');
      await refreshProfile();
      refetch();
    } catch (error: any) {
      toast.error(error.message || 'Swap failed');
    } finally {
      setSwapping(false);
    }
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
                        Balance: {fromCoin === 'TON' ? profile.balance.toFixed(2) : profile.tera_balance.toFixed(2)}
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
                        Balance: {fromCoin === 'TON' ? profile.tera_balance.toFixed(2) : profile.balance.toFixed(2)}
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
                  disabled={swapping}
                  className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-6 shadow-[0_0_20px_hsl(var(--primary)/0.3)] hover:shadow-[0_0_30px_hsl(var(--primary)/0.5)]"
                >
                  <RefreshCw className={`w-5 h-5 mr-2 ${swapping ? 'animate-spin' : ''}`} />
                  {swapping ? 'Swapping...' : 'Swap Now'}
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
                    <span className="text-xl font-bold text-primary">{profile.balance.toFixed(2)}</span>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-secondary/30 rounded-lg">
                    <span className="font-medium text-foreground">TERA Balance</span>
                    <span className="text-xl font-bold text-foreground">{profile.tera_balance.toFixed(2)}</span>
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

          {/* Swap History */}
          <SwapHistory swaps={swaps} loading={loadingHistory} />
        </div>
      </div>
    </AppLayout>
  );
};

export default SwapCoin;
