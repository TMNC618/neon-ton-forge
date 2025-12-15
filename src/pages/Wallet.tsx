import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppLayout } from '@/components/layouts/AppLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { Wallet as WalletIcon, Copy, Save, CheckCircle, Loader2 } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

const Wallet = () => {
  const { user, profile, loading, refreshProfile } = useAuth();
  const navigate = useNavigate();
  const [walletAddress, setWalletAddress] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      navigate('/login');
    }
  }, [user, loading, navigate]);

  useEffect(() => {
    if (profile) {
      setWalletAddress(profile.wallet_address || '');
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

  const handleCopyAddress = () => {
    if (walletAddress) {
      navigator.clipboard.writeText(walletAddress);
      toast.success('Wallet address copied!');
    }
  };

  const handleSaveWallet = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!walletAddress || walletAddress.length < 10) {
      toast.error('Please enter a valid wallet address');
      return;
    }

    setSaving(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ wallet_address: walletAddress })
        .eq('id', user.id);

      if (error) throw error;

      await refreshProfile();
      toast.success('Wallet address saved successfully!');
    } catch (error: any) {
      toast.error(error.message || 'Failed to save wallet address');
    } finally {
      setSaving(false);
    }
  };

  return (
    <AppLayout>
      <div className="p-4 md:p-8">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Header */}
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">
              <span className="neon-text">My Wallet</span>
            </h1>
            <p className="text-muted-foreground">Manage your TON wallet address</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Wallet Form */}
            <div className="bg-card border neon-border rounded-2xl p-8">
              <h2 className="text-xl font-semibold text-foreground mb-6">Wallet Address</h2>
              
              <form onSubmit={handleSaveWallet} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="walletAddress" className="text-foreground">
                    TON Wallet Address
                  </Label>
                  <div className="relative">
                    <Input
                      id="walletAddress"
                      type="text"
                      placeholder="Enter your TON wallet address"
                      value={walletAddress}
                      onChange={(e) => setWalletAddress(e.target.value)}
                      required
                      className="pr-12 bg-secondary/30 border-border/50 focus:border-primary font-mono text-sm"
                    />
                    {walletAddress && (
                      <Button
                        type="button"
                        size="icon"
                        variant="ghost"
                        onClick={handleCopyAddress}
                        className="absolute right-2 top-1/2 -translate-y-1/2 hover:bg-primary/10"
                      >
                        <Copy className="w-4 h-4 text-primary" />
                      </Button>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    This address will be used for all withdrawals
                  </p>
                </div>

                {profile.wallet_address && (
                  <div className="p-4 bg-green-500/10 border border-green-500/30 rounded-lg flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-green-500">Wallet Address Saved</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Your wallet address is securely stored
                      </p>
                    </div>
                  </div>
                )}

                <Button
                  type="submit"
                  disabled={saving}
                  className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-6 shadow-[0_0_20px_hsl(var(--primary)/0.3)] hover:shadow-[0_0_30px_hsl(var(--primary)/0.5)]"
                >
                  {saving ? <Loader2 className="w-5 h-5 mr-2 animate-spin" /> : <Save className="w-5 h-5 mr-2" />}
                  {saving ? 'Saving...' : 'Save Wallet Address'}
                </Button>
              </form>

              {/* Security Notice */}
              <div className="mt-8 p-4 bg-destructive/10 border border-destructive/30 rounded-lg">
                <p className="text-sm text-foreground">
                  <strong>Security Notice:</strong> Double-check your wallet address before saving. 
                  Incorrect addresses may result in loss of funds.
                </p>
              </div>
            </div>

            {/* Wallet Info */}
            <div className="space-y-6">
              {/* Current Wallet */}
              <div className="bg-card border border-border/50 rounded-2xl p-8">
                <h2 className="text-xl font-semibold text-foreground mb-6">Current Wallet</h2>
                
                {profile.wallet_address ? (
                  <div className="space-y-4">
                    <div className="p-6 bg-primary/10 rounded-xl border border-primary/30">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                          <WalletIcon className="w-6 h-6 text-primary" />
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">Active Wallet</p>
                          <p className="text-sm font-semibold text-primary">TON Wallet</p>
                        </div>
                      </div>
                      <div className="break-all font-mono text-sm text-foreground">
                        {profile.wallet_address}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-4 bg-secondary/30 rounded-lg">
                        <p className="text-xs text-muted-foreground mb-1">TON Balance</p>
                        <p className="text-lg font-bold text-primary">{profile.balance.toFixed(2)}</p>
                      </div>
                      <div className="p-4 bg-secondary/30 rounded-lg">
                        <p className="text-xs text-muted-foreground mb-1">TERA Balance</p>
                        <p className="text-lg font-bold text-foreground">{profile.tera_balance.toFixed(2)}</p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <WalletIcon className="w-16 h-16 mx-auto mb-4 text-muted-foreground opacity-50" />
                    <p className="text-muted-foreground">No wallet address saved yet</p>
                    <p className="text-sm text-muted-foreground mt-2">
                      Add your TON wallet address to start withdrawing
                    </p>
                  </div>
                )}
              </div>

              {/* How to Find Wallet */}
              <div className="bg-card border border-border/50 rounded-2xl p-8">
                <h2 className="text-xl font-semibold text-foreground mb-6">How to Find Your Wallet Address</h2>
                
                <div className="space-y-4">
                  <div className="flex gap-3">
                    <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 text-primary font-bold text-sm">
                      1
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground mb-1">Open TON Wallet App</p>
                      <p className="text-xs text-muted-foreground">
                        Launch your TON wallet application (Tonkeeper, TON Wallet, etc.)
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 text-primary font-bold text-sm">
                      2
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground mb-1">Find Receive Option</p>
                      <p className="text-xs text-muted-foreground">
                        Look for "Receive" or "Deposit" button in your wallet
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 text-primary font-bold text-sm">
                      3
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground mb-1">Copy Address</p>
                      <p className="text-xs text-muted-foreground">
                        Copy your wallet address and paste it here
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default Wallet;
