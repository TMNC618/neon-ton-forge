import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppLayout } from '@/components/layouts/AppLayout';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Users, Copy, Share2, TrendingUp, Loader2 } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

const Referral = () => {
  const { user, profile, loading } = useAuth();
  const navigate = useNavigate();
  
  useEffect(() => {
    if (!loading && !user) {
      navigate('/login');
    }
  }, [user, loading, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user || !profile) return null;

  const referralLink = `https://tonmining.com/ref/${profile.referral_code}`;
  
  const referralData = {
    totalReferrals: 0,
    activeReferrals: 0,
    totalEarnings: profile.earning_referral,
    thisMonthEarnings: 0,
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(referralLink);
    toast.success('Referral link copied!');
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(profile.referral_code);
    toast.success('Referral code copied!');
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
    <AppLayout>
      <div className="p-4 md:p-8">
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
            <h2 className="text-xl font-semibold text-foreground mb-6">Your Referral Link & Code</h2>
            
            <div className="space-y-4">
              {/* Referral Code */}
              <div>
                <p className="text-sm text-muted-foreground mb-2">Your Referral Code</p>
                <div className="flex gap-3">
                  <div className="flex-1 p-4 bg-primary/20 rounded-lg font-mono text-2xl text-primary text-center border border-primary/30">
                    {profile.referral_code}
                  </div>
                  <Button
                    onClick={handleCopyCode}
                    variant="outline"
                    className="border-primary/30 hover:bg-primary/10"
                  >
                    <Copy className="w-5 h-5 text-primary" />
                  </Button>
                </div>
              </div>

              {/* Referral Link */}
              <div>
                <p className="text-sm text-muted-foreground mb-2">Your Referral Link</p>
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

          {/* How it Works */}
          <div className="bg-card border border-border/50 rounded-2xl p-8">
            <h2 className="text-xl font-semibold text-foreground mb-6">How It Works</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="flex flex-col items-center text-center">
                <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center mb-4">
                  <span className="text-primary font-bold text-lg">1</span>
                </div>
                <h3 className="font-semibold text-foreground mb-2">Share Your Link</h3>
                <p className="text-sm text-muted-foreground">
                  Copy and share your unique referral link with friends and family
                </p>
              </div>

              <div className="flex flex-col items-center text-center">
                <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center mb-4">
                  <span className="text-primary font-bold text-lg">2</span>
                </div>
                <h3 className="font-semibold text-foreground mb-2">They Sign Up</h3>
                <p className="text-sm text-muted-foreground">
                  When someone registers using your link, they become your referral
                </p>
              </div>

              <div className="flex flex-col items-center text-center">
                <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center mb-4">
                  <span className="text-primary font-bold text-lg">3</span>
                </div>
                <h3 className="font-semibold text-foreground mb-2">Earn Commission</h3>
                <p className="text-sm text-muted-foreground">
                  Earn 5% of their mining profits automatically, paid instantly
                </p>
              </div>

              <div className="flex flex-col items-center text-center">
                <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center mb-4">
                  <span className="text-primary font-bold text-lg">4</span>
                </div>
                <h3 className="font-semibold text-foreground mb-2">Lifetime Earnings</h3>
                <p className="text-sm text-muted-foreground">
                  Continue earning from your referrals as long as they mine
                </p>
              </div>
            </div>

            <div className="mt-8 p-4 bg-primary/10 border border-primary/30 rounded-lg text-center">
              <p className="text-sm text-foreground">
                <strong>Bonus:</strong> Refer 10+ active users and unlock 7% commission rate!
              </p>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default Referral;
