import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Wallet, TrendingUp, Users } from 'lucide-react';

export function QuickActions() {
  const navigate = useNavigate();

  return (
    <div className="bg-card border border-border/50 rounded-2xl p-8">
      <h2 className="text-xl font-semibold text-foreground mb-6">Quick Actions</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Button
          variant="outline"
          onClick={() => navigate('/deposit')}
          className="h-24 flex flex-col items-center justify-center gap-2 border-primary/30 hover:bg-primary/10"
        >
          <Wallet className="w-6 h-6 text-primary" />
          <span>Deposit TON</span>
        </Button>
        <Button
          variant="outline"
          onClick={() => navigate('/withdraw')}
          className="h-24 flex flex-col items-center justify-center gap-2 border-primary/30 hover:bg-primary/10"
        >
          <TrendingUp className="w-6 h-6 text-primary" />
          <span>Withdraw Profit</span>
        </Button>
        <Button
          variant="outline"
          onClick={() => navigate('/referral')}
          className="h-24 flex flex-col items-center justify-center gap-2 border-primary/30 hover:bg-primary/10"
        >
          <Users className="w-6 h-6 text-primary" />
          <span>Invite Friends</span>
        </Button>
      </div>
    </div>
  );
}
