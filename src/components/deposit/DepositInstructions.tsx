import { Copy, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface DepositInstructionsProps {
  walletAddress: string;
  minDeposit: number;
}

export const DepositInstructions = ({ walletAddress, minDeposit }: DepositInstructionsProps) => {
  const handleCopyAddress = () => {
    navigator.clipboard.writeText(walletAddress);
    toast.success('Wallet address copied!');
  };

  const steps = [
    {
      number: 1,
      title: 'Copy Wallet Address',
      description: 'Copy our TON wallet address below'
    },
    {
      number: 2,
      title: 'Send TON',
      description: 'Send the desired amount to our wallet address'
    },
    {
      number: 3,
      title: 'Submit Details',
      description: 'Enter amount and transaction ID in the form'
    },
    {
      number: 4,
      title: 'Wait for Approval',
      description: 'Admin will verify and credit your balance'
    }
  ];

  return (
    <div className="bg-card border border-border/50 rounded-2xl p-8 space-y-6">
      <h2 className="text-xl font-semibold text-foreground">How to Deposit</h2>
      
      <div className="space-y-4">
        {steps.map((step) => (
          <div key={step.number} className="flex gap-4">
            <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 text-primary font-bold">
              {step.number}
            </div>
            <div>
              <h3 className="font-semibold text-foreground mb-1">{step.title}</h3>
              <p className="text-sm text-muted-foreground">{step.description}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Wallet Address */}
      <div className="p-4 bg-primary/5 border border-primary/20 rounded-lg">
        <Label className="text-foreground text-sm mb-2 block">Our TON Wallet Address</Label>
        <div className="flex items-center gap-2">
          <code className="flex-1 px-3 py-2 bg-secondary/30 rounded text-sm font-mono text-foreground break-all">
            {walletAddress}
          </code>
          <Button
            type="button"
            size="icon"
            variant="ghost"
            onClick={handleCopyAddress}
            className="flex-shrink-0 hover:bg-primary/10"
          >
            <Copy className="w-4 h-4 text-primary" />
          </Button>
        </div>
      </div>

      {/* Important Notice */}
      <div className="p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-lg flex items-start gap-3">
        <AlertTriangle className="w-5 h-5 text-yellow-500 mt-0.5 flex-shrink-0" />
        <div className="text-sm">
          <p className="font-medium text-yellow-500 mb-1">Important</p>
          <ul className="list-disc list-inside space-y-1 text-muted-foreground">
            <li>Minimum deposit: {minDeposit} TON</li>
            <li>Send only TON to this address</li>
            <li>Deposits are processed within 24 hours</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

const Label = ({ children, className }: { children: React.ReactNode; className?: string }) => (
  <label className={className}>{children}</label>
);
