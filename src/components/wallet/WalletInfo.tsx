import { Shield, AlertTriangle, CheckCircle2 } from 'lucide-react';

export const WalletInfo = () => {
  return (
    <div className="bg-card border border-border/50 rounded-2xl p-8 space-y-6">
      <h2 className="text-xl font-semibold text-foreground">Wallet Information</h2>
      
      {/* Security Notice */}
      <div className="p-4 bg-primary/5 border border-primary/20 rounded-lg">
        <div className="flex items-start gap-3">
          <Shield className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
          <div>
            <h3 className="font-semibold text-foreground mb-2">Secure Storage</h3>
            <p className="text-sm text-muted-foreground">
              Your wallet address is encrypted and stored securely. We never have access to your private keys.
            </p>
          </div>
        </div>
      </div>

      {/* Important Tips */}
      <div className="p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
        <div className="flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-yellow-500 mt-0.5 flex-shrink-0" />
          <div>
            <h3 className="font-semibold text-yellow-500 mb-2">Important</h3>
            <ul className="space-y-1 text-sm text-muted-foreground">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-yellow-500 mt-0.5 flex-shrink-0" />
                <span>Double-check your wallet address before saving</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-yellow-500 mt-0.5 flex-shrink-0" />
                <span>Ensure you have access to this wallet</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-yellow-500 mt-0.5 flex-shrink-0" />
                <span>All withdrawals will be sent to this address</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Support Info */}
      <div className="p-4 bg-secondary/30 rounded-lg border border-border/50">
        <h3 className="font-semibold text-foreground mb-2">Need Help?</h3>
        <p className="text-sm text-muted-foreground">
          If you need to update your wallet address or have any questions, contact our support team.
        </p>
      </div>
    </div>
  );
};
