import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppLayout } from '@/components/layouts/AppLayout';
import { useAuth } from '@/contexts/AuthContext';
import { Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { StatsGrid } from '@/components/dashboard/StatsGrid';
import { MiningSection } from '@/components/dashboard/MiningSection';
import { MiningHistory } from '@/components/dashboard/MiningHistory';
import { QuickActions } from '@/components/dashboard/QuickActions';

const Dashboard = () => {
  const { user, profile, loading, refreshProfile } = useAuth();
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

  const handleStartMining = async () => {
    try {
      const { error } = await supabase.rpc('start_mining');
      if (error) throw error;
      toast.success('Mining started!');
      await refreshProfile();
    } catch (error: any) {
      toast.error(error.message || 'Failed to start mining');
    }
  };

  const handleStopMining = async () => {
    try {
      const { data, error } = await supabase.rpc('stop_mining');
      if (error) throw error;
      toast.success(`Mining stopped! Earned: ${Number(data).toFixed(6)} TON`);
      await refreshProfile();
    } catch (error: any) {
      toast.error(error.message || 'Failed to stop mining');
    }
  };

  return (
    <AppLayout>
      <div className="p-4 md:p-8">
        <div className="max-w-7xl mx-auto space-y-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">
              Welcome back, <span className="neon-text">{profile.username}</span>
            </h1>
            <p className="text-muted-foreground">Monitor your mining operations</p>
          </div>

          <StatsGrid profile={profile} />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <MiningSection 
              profile={profile} 
              onStartMining={handleStartMining} 
              onStopMining={handleStopMining} 
            />
            <MiningHistory />
          </div>

          <QuickActions />
        </div>
      </div>
    </AppLayout>
  );
};

export default Dashboard;
