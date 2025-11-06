import { useState } from 'react';
import { Sidebar } from '@/components/Sidebar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import { ArrowUpFromLine, Wallet, TrendingUp, Users } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

const Withdraw = () => {
  const { user } = useAuth();
  const [profitAmount, setProfitAmount] = useState('');
  const [profitWallet, setProfitWallet] = useState('');
  const [referralAmount, setReferralAmount] = useState('');
  const [referralWallet, setReferralWallet] = useState('');
  const [loading, setLoading] = useState(false);

  const handleProfitWithdraw = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!profitAmount || parseFloat(profitAmount) < 5) {
      toast.error('Minimum withdrawal is 5 TON');
      return;
    }

    if (parseFloat(profitAmount) > (user?.earningProfit || 0)) {
      toast.error('Insufficient profit balance');
      return;
    }

    if (!profitWallet) {
      toast.error('Please enter wallet address');
      return;
    }

    setLoading(true);
    setTimeout(() => {
      toast.success('Withdrawal request submitted successfully!');
      setProfitAmount('');
      setProfitWallet('');
      setLoading(false);
    }, 1500);
  };

  const handleReferralWithdraw = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!referralAmount || parseFloat(referralAmount) < 5) {
      toast.error('Minimum withdrawal is 5 TON');
      return;
    }

    if (parseFloat(referralAmount) > (user?.earningReferral || 0)) {
      toast.error('Insufficient referral balance');
      return;
    }

    if (!referralWallet) {
      toast.error('Please enter wallet address');
      return;
    }

    setLoading(true);
    setTimeout(() => {
      toast.success('Withdrawal request submitted successfully!');
      setReferralAmount('');
      setReferralWallet('');
      setLoading(false);
    }, 1500);
  };

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      
      <main className="flex-1 p-8 overflow-auto">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Header */}
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">
              <span className="neon-text">Withdraw</span>
            </h1>
            <p className="text-muted-foreground">Withdraw your earnings to your wallet</p>
          </div>

          {/* Balance Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-card border border-primary/30 rounded-2xl p-6 neon-border">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-lg bg-primary/20 flex items-center justify-center">
                    <TrendingUp className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Available Profit</p>
                    <p className="text-2xl font-bold neon-text">{user?.earningProfit.toFixed(2)} TON</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-card border border-border/50 rounded-2xl p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-lg bg-secondary/50 flex items-center justify-center">
                    <Users className="w-6 h-6 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Referral Earnings</p>
                    <p className="text-2xl font-bold text-foreground">{user?.earningReferral.toFixed(2)} TON</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Withdraw Forms */}
          <Tabs defaultValue="profit" className="w-full">
            <TabsList className="grid w-full grid-cols-2 bg-secondary/30">
              <TabsTrigger value="profit" className="data-[state=active]:bg-primary/20 data-[state=active]:text-primary">
                Withdraw Profit
              </TabsTrigger>
              <TabsTrigger value="referral" className="data-[state=active]:bg-primary/20 data-[state=active]:text-primary">
                Withdraw Referral
              </TabsTrigger>
            </TabsList>

            <TabsContent value="profit" className="mt-6">
              <div className="bg-card border border-border/50 rounded-2xl p-8">
                <form onSubmit={handleProfitWithdraw} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="profitAmount" className="text-foreground">
                      Withdrawal Amount (TON)
                    </Label>
                    <Input
                      id="profitAmount"
                      type="number"
                      step="0.01"
                      min="5"
                      max={user?.earningProfit}
                      placeholder="Enter amount (min: 5 TON)"
                      value={profitAmount}
                      onChange={(e) => setProfitAmount(e.target.value)}
                      required
                      className="bg-secondary/30 border-border/50 focus:border-primary"
                    />
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>Minimum: 5 TON</span>
                      <span>Available: {user?.earningProfit.toFixed(2)} TON</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="profitWallet" className="text-foreground">
                      TON Wallet Address
                    </Label>
                    <Input
                      id="profitWallet"
                      type="text"
                      placeholder="Enter your TON wallet address"
                      value={profitWallet}
                      onChange={(e) => setProfitWallet(e.target.value)}
                      required
                      className="bg-secondary/30 border-border/50 focus:border-primary font-mono text-sm"
                    />
                  </div>

                  <div className="p-4 bg-secondary/30 rounded-lg space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Withdrawal Amount:</span>
                      <span className="font-semibold text-foreground">
                        {profitAmount || '0'} TON
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Withdrawal Fee (2%):</span>
                      <span className="font-semibold text-foreground">
                        {profitAmount ? (parseFloat(profitAmount) * 0.02).toFixed(4) : '0'} TON
                      </span>
                    </div>
                    <div className="h-px bg-border my-2"></div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">You will receive:</span>
                      <span className="font-semibold text-primary">
                        {profitAmount ? (parseFloat(profitAmount) * 0.98).toFixed(4) : '0'} TON
                      </span>
                    </div>
                  </div>

                  <Button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-6 shadow-[0_0_20px_hsl(var(--primary)/0.3)] hover:shadow-[0_0_30px_hsl(var(--primary)/0.5)]"
                  >
                    <ArrowUpFromLine className="w-5 h-5 mr-2" />
                    {loading ? 'Processing...' : 'Confirm Withdrawal'}
                  </Button>
                </form>
              </div>
            </TabsContent>

            <TabsContent value="referral" className="mt-6">
              <div className="bg-card border border-border/50 rounded-2xl p-8">
                <form onSubmit={handleReferralWithdraw} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="referralAmount" className="text-foreground">
                      Withdrawal Amount (TON)
                    </Label>
                    <Input
                      id="referralAmount"
                      type="number"
                      step="0.01"
                      min="5"
                      max={user?.earningReferral}
                      placeholder="Enter amount (min: 5 TON)"
                      value={referralAmount}
                      onChange={(e) => setReferralAmount(e.target.value)}
                      required
                      className="bg-secondary/30 border-border/50 focus:border-primary"
                    />
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>Minimum: 5 TON</span>
                      <span>Available: {user?.earningReferral.toFixed(2)} TON</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="referralWallet" className="text-foreground">
                      TON Wallet Address
                    </Label>
                    <Input
                      id="referralWallet"
                      type="text"
                      placeholder="Enter your TON wallet address"
                      value={referralWallet}
                      onChange={(e) => setReferralWallet(e.target.value)}
                      required
                      className="bg-secondary/30 border-border/50 focus:border-primary font-mono text-sm"
                    />
                  </div>

                  <div className="p-4 bg-secondary/30 rounded-lg space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Withdrawal Amount:</span>
                      <span className="font-semibold text-foreground">
                        {referralAmount || '0'} TON
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Withdrawal Fee (2%):</span>
                      <span className="font-semibold text-foreground">
                        {referralAmount ? (parseFloat(referralAmount) * 0.02).toFixed(4) : '0'} TON
                      </span>
                    </div>
                    <div className="h-px bg-border my-2"></div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">You will receive:</span>
                      <span className="font-semibold text-primary">
                        {referralAmount ? (parseFloat(referralAmount) * 0.98).toFixed(4) : '0'} TON
                      </span>
                    </div>
                  </div>

                  <Button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-6 shadow-[0_0_20px_hsl(var(--primary)/0.3)] hover:shadow-[0_0_30px_hsl(var(--primary)/0.5)]"
                  >
                    <ArrowUpFromLine className="w-5 h-5 mr-2" />
                    {loading ? 'Processing...' : 'Confirm Withdrawal'}
                  </Button>
                </form>
              </div>
            </TabsContent>
          </Tabs>

          {/* Recent Withdrawals */}
          <div className="bg-card border border-border/50 rounded-2xl p-8">
            <h2 className="text-xl font-semibold text-foreground mb-6">Recent Withdrawals</h2>
            
            <div className="space-y-4">
              {[
                { date: '2024-01-19', amount: 25.5, type: 'Profit', status: 'approved' },
                { date: '2024-01-17', amount: 10.2, type: 'Referral', status: 'pending' },
                { date: '2024-01-15', amount: 15.8, type: 'Profit', status: 'approved' },
              ].map((withdrawal, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-4 bg-secondary/30 rounded-lg hover:bg-secondary/50 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                      <ArrowUpFromLine className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground">{withdrawal.date}</p>
                      <p className="text-xs text-muted-foreground">{withdrawal.type} Withdrawal</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-primary">-{withdrawal.amount} TON</p>
                    <p className={`text-xs ${withdrawal.status === 'approved' ? 'text-green-500' : 'text-yellow-500'}`}>
                      {withdrawal.status === 'approved' ? 'Approved' : 'Pending'}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Withdraw;
