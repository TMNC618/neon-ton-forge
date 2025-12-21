import { Link } from 'react-router-dom';
import { MiningCircle } from '@/components/MiningCircle';
import { Button } from '@/components/ui/button';
import { Profile } from '@/hooks/useAuthState';
import { ArrowRightLeft, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface MiningSectionProps {
  profile: Profile;
  onStartMining: () => void;
  onStopMining: () => void;
}

export function MiningSection({ profile, onStartMining, onStopMining }: MiningSectionProps) {
  const canStartMining = profile.tera_balance > 0 && !profile.mining_active;
  const needsSwap = profile.tera_balance <= 0 && profile.mining_balance <= 0 && !profile.mining_active;

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
          <span className="font-semibold text-foreground">{profile.mining_balance.toFixed(2)} TERA</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">TERA Available:</span>
          <span className="font-semibold text-primary">{profile.tera_balance.toFixed(2)} TERA</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Daily Profit Rate:</span>
          <span className="font-semibold text-primary">1.00%</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Expected Daily Profit:</span>
          <span className="font-semibold text-foreground">
            {(profile.mining_balance * 0.01).toFixed(4)} TERA
          </span>
        </div>
      </div>

      {/* Info about mining flow */}
      {needsSwap && (
        <Alert className="mt-6 border-primary/30 bg-primary/5">
          <AlertCircle className="h-4 w-4 text-primary" />
          <AlertDescription className="text-sm text-muted-foreground">
            To start mining, you need TERA balance. Please{' '}
            <Link to="/swap" className="text-primary hover:underline font-medium">
              swap TON to TERA
            </Link>{' '}
            first.
          </AlertDescription>
        </Alert>
      )}

      <div className="mt-6 flex gap-3">
        {!profile.mining_active ? (
          <>
            {needsSwap ? (
              <Button asChild className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground">
                <Link to="/swap">
                  <ArrowRightLeft className="w-4 h-4 mr-2" />
                  Swap TON to TERA
                </Link>
              </Button>
            ) : (
              <Button
                onClick={onStartMining}
                disabled={!canStartMining}
                className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground"
              >
                Start Mining ({profile.tera_balance.toFixed(2)} TERA)
              </Button>
            )}
          </>
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

      {/* Mining profit info */}
      {profile.mining_active && (
        <p className="mt-4 text-xs text-center text-muted-foreground">
          Mining profit will be added to your TERA Balance when you stop mining.
        </p>
      )}
    </div>
  );
}
