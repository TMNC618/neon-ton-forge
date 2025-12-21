import { MiningCircle } from '@/components/MiningCircle';
import { Button } from '@/components/ui/button';
import { Profile } from '@/hooks/useAuthState';

interface MiningSectionProps {
  profile: Profile;
  onStartMining: () => void;
  onStopMining: () => void;
}

export function MiningSection({ profile, onStartMining, onStopMining }: MiningSectionProps) {
  return (
    <div className="bg-card border border-border/50 rounded-2xl p-8">
      <h2 className="text-xl font-semibold text-foreground mb-6">Mining Status</h2>
      
      <MiningCircle
        miningBalance={profile.mining_balance}
        isActive={profile.mining_active}
        lastMiningStart={profile.last_mining_start ? new Date(profile.last_mining_start).getTime() : undefined}
      />

      <div className="mt-8 space-y-4">
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Mining Balance:</span>
          <span className="font-semibold text-foreground">{profile.mining_balance} TON</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Daily Profit Rate:</span>
          <span className="font-semibold text-primary">1.00%</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Expected Daily Profit:</span>
          <span className="font-semibold text-foreground">
            {(profile.mining_balance * 0.01).toFixed(4)} TON
          </span>
        </div>
      </div>

      <div className="mt-6 flex gap-3">
        {!profile.mining_active ? (
          <Button
            onClick={onStartMining}
            disabled={profile.mining_balance <= 0}
            className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground"
          >
            Start Mining
          </Button>
        ) : (
          <Button
            onClick={onStopMining}
            variant="destructive"
            className="flex-1"
          >
            Stop Mining & Claim
          </Button>
        )}
      </div>
    </div>
  );
}
