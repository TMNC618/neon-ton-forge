import { useState } from 'react';
import { AppLayout } from '@/components/layouts/AppLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { ArrowDownToLine, Copy, CheckCircle } from 'lucide-react';

const Deposit = () => {
  const [amount, setAmount] = useState('');
  const [txId, setTxId] = useState('');
  const [loading, setLoading] = useState(false);

  const walletAddress = 'UQD7X...abc123xyz789'; // Mock TON wallet

  const handleCopyAddress = () => {
    navigator.clipboard.writeText(walletAddress);
    toast.success('Wallet address copied!');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!amount || parseFloat(amount) < 10) {
      toast.error('Minimum deposit is 10 TON');
      return;
    }

    if (!txId) {
      toast.error('Please enter transaction ID');
      return;
    }

    setLoading(true);
    
    setTimeout(() => {
      toast.success('Deposit request submitted successfully!');
      setAmount('');
      setTxId('');
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
              <span className="neon-text">TON Deposit</span>
            </h1>
            <p className="text-muted-foreground">Add funds to your mining balance</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Deposit Instructions */}
            <div className="bg-card border border-border/50 rounded-2xl p-8 space-y-6">
              <h2 className="text-xl font-semibold text-foreground">How to Deposit</h2>
              
              <div className="space-y-4">
                <div className="flex gap-4">
                  <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 text-primary font-bold">
                    1
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground mb-1">Copy Wallet Address</h3>
                    <p className="text-sm text-muted-foreground">
                      Copy our TON wallet address below
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 text-primary font-bold">
                    2
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground mb-1">Send TON</h3>
                    <p className="text-sm text-muted-foreground">
                      Send the desired amount to our wallet address
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 text-primary font-bold">
                    3
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground mb-1">Submit Details</h3>
                    <p className="text-sm text-muted-foreground">
                      Enter amount and transaction ID in the form
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 text-primary font-bold">
                    4
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground mb-1">Wait for Approval</h3>
                    <p className="text-sm text-muted-foreground">
                      Your deposit will be processed within 24 hours
                    </p>
                  </div>
                </div>
              </div>

              {/* Wallet Address Card */}
              <div className="mt-8 p-6 bg-secondary/30 rounded-xl neon-border">
                <Label className="text-sm text-muted-foreground mb-2 block">
                  Platform Wallet Address
                </Label>
                <div className="flex items-center gap-2">
                  <code className="flex-1 text-sm font-mono text-primary break-all">
                    {walletAddress}
                  </code>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={handleCopyAddress}
                    className="border-primary/30 hover:bg-primary/10"
                  >
                    <Copy className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {/* Info Box */}
              <div className="p-4 bg-primary/10 border border-primary/30 rounded-lg">
                <p className="text-sm text-foreground">
                  <strong>Note:</strong> Minimum deposit is 10 TON. Deposits below this amount will not be processed.
                </p>
              </div>
            </div>

            {/* Deposit Form */}
            <div className="bg-card border border-border/50 rounded-2xl p-8">
              <h2 className="text-xl font-semibold text-foreground mb-6">Submit Deposit</h2>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="amount" className="text-foreground">
                    Deposit Amount (TON)
                  </Label>
                  <Input
                    id="amount"
                    type="number"
                    step="0.01"
                    min="10"
                    placeholder="Enter amount (min: 10 TON)"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    required
                    className="bg-secondary/30 border-border/50 focus:border-primary"
                  />
                  <p className="text-xs text-muted-foreground">
                    Minimum: 10 TON | Maximum: 10,000 TON
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
                    onChange={(e) => setTxId(e.target.value)}
                    required
                    className="bg-secondary/30 border-border/50 focus:border-primary font-mono text-sm"
                  />
                  <p className="text-xs text-muted-foreground">
                    Copy the transaction ID from your wallet
                  </p>
                </div>

                <div className="p-4 bg-secondary/30 rounded-lg space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Deposit Amount:</span>
                    <span className="font-semibold text-foreground">
                      {amount || '0'} TON
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Deposit Fee:</span>
                    <span className="font-semibold text-foreground">0%</span>
                  </div>
                  <div className="h-px bg-border my-2"></div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">You will receive:</span>
                    <span className="font-semibold text-primary">
                      {amount || '0'} TON
                    </span>
                  </div>
                </div>

                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-6 shadow-[0_0_20px_hsl(var(--primary)/0.3)] hover:shadow-[0_0_30px_hsl(var(--primary)/0.5)]"
                >
                  <ArrowDownToLine className="w-5 h-5 mr-2" />
                  {loading ? 'Processing...' : 'Confirm Deposit'}
                </Button>
              </form>
            </div>
          </div>

          {/* Recent Deposits */}
          <div className="bg-card border border-border/50 rounded-2xl p-8">
            <h2 className="text-xl font-semibold text-foreground mb-6">Recent Deposits</h2>
            
            <div className="space-y-4">
              {[
                { date: '2024-01-20', amount: 100, status: 'approved', txId: 'abc123...' },
                { date: '2024-01-18', amount: 50, status: 'pending', txId: 'def456...' },
                { date: '2024-01-15', amount: 200, status: 'approved', txId: 'ghi789...' },
              ].map((deposit, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-4 bg-secondary/30 rounded-lg hover:bg-secondary/50 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                      <ArrowDownToLine className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground">{deposit.date}</p>
                      <p className="text-xs text-muted-foreground">TX: {deposit.txId}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-primary">+{deposit.amount} TON</p>
                    <div className="flex items-center gap-1 justify-end">
                      {deposit.status === 'approved' ? (
                        <>
                          <CheckCircle className="w-3 h-3 text-green-500" />
                          <p className="text-xs text-green-500">Approved</p>
                        </>
                      ) : (
                        <p className="text-xs text-yellow-500">Pending</p>
                      )}
                    </div>
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

export default Deposit;
