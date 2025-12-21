interface PendingCardsProps {
  pendingDeposits: number;
  pendingWithdrawals: number;
}

export function PendingCards({ pendingDeposits, pendingWithdrawals }: PendingCardsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="bg-card border border-border/50 rounded-2xl p-6">
        <h2 className="text-xl font-semibold text-foreground mb-4">Pending Deposits</h2>
        <div className="text-4xl font-bold text-primary">{pendingDeposits}</div>
        <p className="text-sm text-muted-foreground mt-2">Waiting for approval</p>
      </div>
      <div className="bg-card border border-border/50 rounded-2xl p-6">
        <h2 className="text-xl font-semibold text-foreground mb-4">Pending Withdrawals</h2>
        <div className="text-4xl font-bold text-orange-400">{pendingWithdrawals}</div>
        <p className="text-sm text-muted-foreground mt-2">Waiting for approval</p>
      </div>
    </div>
  );
}
