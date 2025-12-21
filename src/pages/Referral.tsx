import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppLayout } from '@/components/layouts/AppLayout';
import { useAuth } from '@/contexts/AuthContext';
import { Loader2 } from 'lucide-react';
import { ReferralStatsGrid } from '@/components/referral/ReferralStatsGrid';
import { ReferralLinkCard } from '@/components/referral/ReferralLinkCard';
import { HowItWorks } from '@/components/referral/HowItWorks';

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

  return (
    <AppLayout>
      <div className="p-4 md:p-8">
        <div className="max-w-6xl mx-auto space-y-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">
              <span className="neon-text">Referral Program</span>
            </h1>
            <p className="text-muted-foreground">Invite friends and earn 5% of their mining profits</p>
          </div>

          <ReferralStatsGrid 
            totalReferrals={0}
            activeReferrals={0}
            totalEarnings={profile.earning_referral}
            thisMonthEarnings={0}
          />

          <ReferralLinkCard 
            referralCode={profile.referral_code}
            referralLink={referralLink}
          />

          <HowItWorks />
        </div>
      </div>
    </AppLayout>
  );
};

export default Referral;
