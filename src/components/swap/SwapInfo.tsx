import { ArrowDownUp, Shield, Zap } from 'lucide-react';

interface SwapInfoProps {
  swapFee: number;
}

export const SwapInfo = ({ swapFee }: SwapInfoProps) => {
  return (
    <div className="bg-card border border-border/50 rounded-2xl p-8">
      <h2 className="text-xl font-semibold text-foreground mb-6">Exchange Information</h2>
      
      <div className="space-y-6">
        {/* Exchange Rates */}
        <div className="p-4 bg-secondary/30 rounded-xl border border-border/50">
          <div className="flex items-center gap-2 mb-4">
            <ArrowDownUp className="w-5 h-5 text-primary" />
            <h3 className="font-semibold text-foreground">Current Rates</h3>
          </div>
          <div className="space-y-2">
            <div>
              <h3 className="font-semibold text-foreground mb-2">TON to TERA</h3>
              <p className="text-sm text-muted-foreground">
                1 TON = 10 TERA
              </p>
            </div>
            <div className="pt-4 border-t border-border/50">
              <h3 className="font-semibold text-foreground mb-2">TERA to TON</h3>
              <p className="text-sm text-muted-foreground">
                1 TERA = 0.084 TON
              </p>
            </div>
          </div>
        </div>

        {/* Fee Info */}
        <div className="p-4 bg-secondary/30 rounded-xl border border-border/50">
          <div className="flex items-center gap-2 mb-4">
            <Shield className="w-5 h-5 text-primary" />
            <h3 className="font-semibold text-foreground">Swap Fee</h3>
          </div>
          <p className="text-sm text-muted-foreground">
            A {swapFee}% fee is charged on each swap transaction
          </p>
        </div>

        {/* Processing Time */}
        <div className="p-4 bg-secondary/30 rounded-xl border border-border/50">
          <div className="flex items-center gap-2 mb-4">
            <Zap className="w-5 h-5 text-primary" />
            <h3 className="font-semibold text-foreground">Instant Processing</h3>
          </div>
          <p className="text-sm text-muted-foreground">
            Swaps are processed instantly and reflected in your balance immediately
          </p>
        </div>

        {/* Notice */}
        <div className="p-4 bg-primary/5 border border-primary/20 rounded-lg">
          <p className="text-sm text-muted-foreground">
            <span className="font-semibold text-foreground">Note:</span> Exchange rates are fixed. 
            Please ensure you have sufficient balance before initiating a swap.
          </p>
        </div>
      </div>
    </div>
  );
};
