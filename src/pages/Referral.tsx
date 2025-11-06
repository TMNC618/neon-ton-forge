import { useState } from 'react';
import { Sidebar } from '@/components/Sidebar';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Users, Copy, Share2, TrendingUp } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

const Referral = () => {
  const { user } = useAuth();
  const referralLink = `https://tonmining.com/ref/${user?.id}`;
  
  const referralData = {
    totalReferrals: 12,
    activeReferrals: 8,
    totalEarnings: user?.earningReferral || 0,
    thisMonthEarnings: 5.2,
  };

  const referralList = [
    { username: 'User123', joined: '2024-01-15', earnings: 2.5, status: 'active' },
    { username: 'Miner456', joined: '2024-01-18', earnings: 1.8, status: 'active' },
    { username: 'Crypto789', joined: '2024-01-19', earnings: 3.2, status: 'active' },
    { username: 'TON_Fan', joined: '2024-01-20', earnings: 1.5, status: 'active' },
    { username: 'UserABC', joined: '2024-01-12', earnings: 0.8, status: 'inactive' },
  ];

  const handleCopyLink = () => {
    navigator.clipboard.writeText(referralLink);
    toast.success('Referral link copied!');
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Join TON Mining',
          text: 'Start mining TON with me and earn passive income!',
          url: referralLink,
        });
        toast.success('Shared successfully!');
      } catch (error) {
        console.error('Error sharing:', error);
      }
    } else {
      handleCopyLink();
    }
  };

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      
      <main className="flex-1 p-8 overflow-auto">
        <div className="max-w-6xl mx-auto space-y-8">
          {/* Header */}
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">
              <span className="neon-text">Referral Program</span>
            </h1>
            <p className="text-muted-foreground">Invite friends and earn 5% of their mining profits</p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-card border neon-border rounded-2xl p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-lg bg-primary/20 flex items-center justify-center">
                  <Users className="w-6 h-6 text-primary" />
                </div>
              </div>
              <p className="text-sm text-muted-foreground mb-1">Total Referrals</p>
              <p className="text-3xl font-bold neon-text">{referralData.totalReferrals}</p>
            </div>

            <div className="bg-card border border-border/50 rounded-2xl p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-lg bg-secondary/50 flex items-center justify-center">
                  <Users className="w-6 h-6 text-muted-foreground" />
                </div>
              </div>
              <p className="text-sm text-muted-foreground mb-1">Active Referrals</p>
              <p className="text-3xl font-bold text-foreground">{referralData.activeReferrals}</p>
            </div>

            <div className="bg-card border border-border/50 rounded-2xl p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-lg bg-secondary/50 flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-muted-foreground" />
                </div>
              </div>
              <p className="text-sm text-muted-foreground mb-1">Total Earnings</p>
              <p className="text-3xl font-bold text-foreground">{referralData.totalEarnings.toFixed(2)} TON</p>
            </div>

            <div className="bg-card border border-border/50 rounded-2xl p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-lg bg-secondary/50 flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-muted-foreground" />
                </div>
              </div>
              <p className="text-sm text-muted-foreground mb-1">This Month</p>
              <p className="text-3xl font-bold text-foreground">{referralData.thisMonthEarnings.toFixed(2)} TON</p>
            </div>
          </div>

          {/* Referral Link */}
          <div className="bg-card border neon-border rounded-2xl p-8">
            <h2 className="text-xl font-semibold text-foreground mb-6">Your Referral Link</h2>
            
            <div className="space-y-4">
              <div className="flex gap-3">
                <div className="flex-1 p-4 bg-secondary/30 rounded-lg font-mono text-sm text-primary break-all border border-border/50">
                  {referralLink}
                </div>
                <Button
                  onClick={handleCopyLink}
                  variant="outline"
                  className="border-primary/30 hover:bg-primary/10"
                >
                  <Copy className="w-5 h-5 text-primary" />
                </Button>
                <Button
                  onClick={handleShare}
                  className="bg-primary hover:bg-primary/90 text-primary-foreground"
                >
                  <Share2 className="w-5 h-5 mr-2" />
                  Share
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Referral List */}
            <div className="bg-card border border-border/50 rounded-2xl p-8">
              <h2 className="text-xl font-semibold text-foreground mb-6">Your Referrals</h2>
              
              <div className="space-y-4">
                {referralList.map((referral, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-4 bg-secondary/30 rounded-lg hover:bg-secondary/50 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                        <Users className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-foreground">{referral.username}</p>
                        <p className="text-xs text-muted-foreground">Joined: {referral.joined}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold text-primary">+{referral.earnings} TON</p>
                      <p className={`text-xs ${referral.status === 'active' ? 'text-green-500' : 'text-gray-500'}`}>
                        {referral.status === 'active' ? 'Active' : 'Inactive'}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* How it Works */}
            <div className="bg-card border border-border/50 rounded-2xl p-8">
              <h2 className="text-xl font-semibold text-foreground mb-6">How It Works</h2>
              
              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                    <span className="text-primary font-bold">1</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground mb-2">Share Your Link</h3>
                    <p className="text-sm text-muted-foreground">
                      Copy and share your unique referral link with friends and family
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                    <span className="text-primary font-bold">2</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground mb-2">They Sign Up</h3>
                    <p className="text-sm text-muted-foreground">
                      When someone registers using your link, they become your referral
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                    <span className="text-primary font-bold">3</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground mb-2">Earn Commission</h3>
                    <p className="text-sm text-muted-foreground">
                      Earn 5% of their mining profits automatically, paid instantly
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                    <span className="text-primary font-bold">4</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground mb-2">Lifetime Earnings</h3>
                    <p className="text-sm text-muted-foreground">
                      Continue earning from your referrals as long as they mine
                    </p>
                  </div>
                </div>

                <div className="mt-6 p-4 bg-primary/10 border border-primary/30 rounded-lg">
                  <p className="text-sm text-foreground">
                    <strong>Bonus:</strong> Refer 10+ active users and unlock 7% commission rate!
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Referral;
