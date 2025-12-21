import { Button } from '@/components/ui/button';
import { Copy, Share2 } from 'lucide-react';
import { toast } from 'sonner';

interface ReferralLinkCardProps {
  referralCode: string;
  referralLink: string;
}

export function ReferralLinkCard({ referralCode, referralLink }: ReferralLinkCardProps) {
  const handleCopyLink = () => {
    navigator.clipboard.writeText(referralLink);
    toast.success('Referral link copied!');
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(referralCode);
    toast.success('Referral code copied!');
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Join TON Mining',
          text: 'Start mining TON with me!',
          url: referralLink,
        });
      } catch (error) {
        handleCopyLink();
      }
    } else {
      handleCopyLink();
    }
  };

  return (
    <div className="bg-card border neon-border rounded-2xl p-8">
      <h2 className="text-xl font-semibold text-foreground mb-6">Your Referral Link & Code</h2>
      
      <div className="space-y-4">
        <div>
          <p className="text-sm text-muted-foreground mb-2">Your Referral Code</p>
          <div className="flex gap-3">
            <div className="flex-1 p-4 bg-primary/20 rounded-lg font-mono text-2xl text-primary text-center border border-primary/30">
              {referralCode}
            </div>
            <Button onClick={handleCopyCode} variant="outline" className="border-primary/30 hover:bg-primary/10">
              <Copy className="w-5 h-5 text-primary" />
            </Button>
          </div>
        </div>

        <div>
          <p className="text-sm text-muted-foreground mb-2">Your Referral Link</p>
          <div className="flex gap-3">
            <div className="flex-1 p-4 bg-secondary/30 rounded-lg font-mono text-sm text-primary break-all border border-border/50">
              {referralLink}
            </div>
            <Button onClick={handleCopyLink} variant="outline" className="border-primary/30 hover:bg-primary/10">
              <Copy className="w-5 h-5 text-primary" />
            </Button>
            <Button onClick={handleShare} className="bg-primary hover:bg-primary/90 text-primary-foreground">
              <Share2 className="w-5 h-5 mr-2" />
              Share
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
          <div className="p-4 bg-primary/10 border border-primary/30 rounded-lg">
            <p className="text-sm font-medium text-primary mb-1">Commission Rate</p>
            <p className="text-2xl font-bold text-foreground">5%</p>
          </div>
          <div className="p-4 bg-secondary/30 rounded-lg">
            <p className="text-sm font-medium text-muted-foreground mb-1">Lifetime Earnings</p>
            <p className="text-2xl font-bold text-foreground">Unlimited</p>
          </div>
          <div className="p-4 bg-secondary/30 rounded-lg">
            <p className="text-sm font-medium text-muted-foreground mb-1">Payout</p>
            <p className="text-2xl font-bold text-foreground">Instant</p>
          </div>
        </div>
      </div>
    </div>
  );
}
