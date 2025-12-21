import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AppLayout } from '@/components/layouts/AppLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { ArrowUpFromLine, Wallet, Loader2, ArrowRightLeft, AlertCircle } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { validateTonWalletAddress } from '@/lib/validation';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { WithdrawHistory } from '@/components/history/WithdrawHistory';
import { useWithdrawHistory } from '@/hooks/useTransactionHistory';

const Withdraw = () => {
  const { user, profile, loading, refreshProfile } = useAuth();
  const navigate = useNavigate();
  const [amount, setAmount] = useState('');
  const [walletAddress, setWalletAddress] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const { withdrawals, loading: loadingHistory, refetch } = useWithdrawHistory();

  useEffect(() => {
    if (!loading && !user) {
      navigate('/login');
    }
  }, [user, loading, navigate]);

  useEffect(() => {
    if (profile?.wallet_address) {
      setWalletAddress(profile.wallet_address);
    }
  }, [profile]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user || !profile) return null;

  const handleWithdraw = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!amount || parseFloat(amount) < 5) {
      toast.error('Minimum withdrawal is 5 TON');
      return;
    }

    if (parseFloat(amount) > profile.balance) {
      toast.error('Insufficient TON balance');
      return;
    }

    const walletValidation = validateTonWalletAddress(walletAddress);
    if (!walletValidation.valid) {
      toast.error(walletValidation.error || 'Invalid wallet address');
      return;
    }

    setSubmitting(true);
    try {
      const { error } = await supabase.rpc('create_withdrawal', {
        _amount: parseFloat(amount),
        _wallet_address: walletAddress,
        _currency: 'TON',
        _withdraw_type: 'balance'
      });

      if (error) throw error;

      toast.success('Withdrawal request submitted successfully!');
      setAmount('');
      await refreshProfile();
      refetch();
    } catch (error: any) {
      toast.error(error.message || 'Failed to submit withdrawal');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AppLayout>
      <div className="p-4 md:p-8">
        <div className="max-w-2xl mx-auto space-y-8">
          {/* Header */}
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">
              <span className="neon-text">Withdraw</span>
            </h1>
            <p className="text-muted-foreground">Withdraw your TON balance to your wallet</p>
          </div>

          {/* TON Balance Card */}
          <div className="bg-card border border-primary/30 rounded-2xl p-6 neon-border">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-lg bg-primary/20 flex items-center justify-center">
                <Wallet className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Available TON Balance</p>
                <p className="text-2xl font-bold neon-text">{profile.balance.toFixed(2)} TON</p>
              </div>
            </div>
          </div>

          {/* Info Alert */}
          <Alert className="border-primary/30 bg-primary/5">
            <AlertCircle className="h-4 w-4 text-primary" />
            <AlertDescription className="text-muted-foreground">
              Withdrawal only available from TON Balance. If you have TERA balance, please{' '}
              <Link to="/swap" className="text-primary hover:underline font-medium">
                swap TERA to TON
              </Link>{' '}
              first.
            </AlertDescription>
          </Alert>

          {/* TERA Balance Info */}
          {profile.tera_balance > 0 && (
            <div className="bg-secondary/30 border border-border/50 rounded-xl p-4 flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">TERA Balance (needs swap)</p>
                <p className="text-lg font-semibold text-foreground">{profile.tera_balance.toFixed(2)} TERA</p>
              </div>
              <Button variant="outline" size="sm" asChild>
                <Link to="/swap">
                  <ArrowRightLeft className="w-4 h-4 mr-2" />
                  Swap to TON
                </Link>
              </Button>
            </div>
          )}

          {/* Withdraw Form */}
          <div className="bg-card border border-border/50 rounded-2xl p-8">
            <form onSubmit={handleWithdraw} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="amount" className="text-foreground">
                  Withdrawal Amount (TON)
                </Label>
                <Input
                  id="amount"
                  type="number"
                  step="0.01"
                  min="5"
                  max={profile.balance}
                  placeholder="Enter amount (min: 5 TON)"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  required
                  className="bg-secondary/30 border-border/50 focus:border-primary"
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Minimum: 5 TON</span>
                  <span>Available: {profile.balance.toFixed(2)} TON</span>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="wallet" className="text-foreground">
                  TON Wallet Address
                </Label>
                <Input
                  id="wallet"
                  type="text"
                  placeholder="Enter your TON wallet address"
                  value={walletAddress}
                  onChange={(e) => setWalletAddress(e.target.value)}
                  required
                  className="bg-secondary/30 border-border/50 focus:border-primary font-mono text-sm"
                />
              </div>

              <div className="p-4 bg-secondary/30 rounded-lg space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Withdrawal Amount:</span>
                  <span className="font-semibold text-foreground">
                    {amount || '0'} TON
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Withdrawal Fee (2%):</span>
                  <span className="font-semibold text-foreground">
                    {amount ? (parseFloat(amount) * 0.02).toFixed(4) : '0'} TON
                  </span>
                </div>
                <div className="h-px bg-border my-2"></div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">You will receive:</span>
                  <span className="font-semibold text-primary">
                    {amount ? (parseFloat(amount) * 0.98).toFixed(4) : '0'} TON
                  </span>
                </div>
              </div>

              <Button
                type="submit"
                disabled={submitting || profile.balance < 5}
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-6 shadow-[0_0_20px_hsl(var(--primary)/0.3)] hover:shadow-[0_0_30px_hsl(var(--primary)/0.5)]"
              >
                {submitting ? <Loader2 className="w-5 h-5 mr-2 animate-spin" /> : <ArrowUpFromLine className="w-5 h-5 mr-2" />}
                {submitting ? 'Processing...' : 'Confirm Withdrawal'}
              </Button>
            </form>
          </div>

          {/* Withdrawal History */}
          <WithdrawHistory withdrawals={withdrawals} loading={loadingHistory} />
        </div>
      </div>
    </AppLayout>
  );
};

export default Withdraw;
