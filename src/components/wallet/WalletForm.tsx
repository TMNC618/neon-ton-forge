import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { Copy, Save, CheckCircle } from 'lucide-react';

interface WalletFormProps {
  initialWalletAddress: string;
  onSave: (address: string) => void;
  hasSavedAddress: boolean;
}

export const WalletForm = ({ initialWalletAddress, onSave, hasSavedAddress }: WalletFormProps) => {
  const [walletAddress, setWalletAddress] = useState(initialWalletAddress);
  const [loading, setLoading] = useState(false);

  const handleCopyAddress = () => {
    if (walletAddress) {
      navigator.clipboard.writeText(walletAddress);
      toast.success('Wallet address copied!');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!walletAddress || walletAddress.length < 10) {
      toast.error('Please enter a valid wallet address');
      return;
    }

    setLoading(true);
    setTimeout(() => {
      onSave(walletAddress);
      toast.success('Wallet address saved successfully!');
      setLoading(false);
    }, 1000);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
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

      {hasSavedAddress && (
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
        disabled={loading}
        className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
      >
        {loading ? (
          <>
            <Save className="mr-2 h-4 w-4 animate-spin" />
            Saving...
          </>
        ) : (
          <>
            <Save className="mr-2 h-4 w-4" />
            Save Wallet Address
          </>
        )}
      </Button>
    </form>
  );
};
