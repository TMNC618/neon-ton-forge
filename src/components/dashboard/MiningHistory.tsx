const miningRecords = [
  { date: '2024-01-20', profit: 1.05, status: 'completed' },
  { date: '2024-01-19', profit: 1.02, status: 'completed' },
  { date: '2024-01-18', profit: 0.98, status: 'completed' },
  { date: '2024-01-17', profit: 1.01, status: 'completed' },
  { date: '2024-01-16', profit: 0.99, status: 'completed' },
];

export function MiningHistory() {
  return (
    <div className="bg-card border border-border/50 rounded-2xl p-8">
      <h2 className="text-xl font-semibold text-foreground mb-6">Mining History</h2>
      
      <div className="space-y-4">
        {miningRecords.map((record, idx) => (
          <div
            key={idx}
            className="flex items-center justify-between p-4 bg-secondary/30 rounded-lg hover:bg-secondary/50 transition-colors"
          >
            <div>
              <p className="text-sm font-medium text-foreground">{record.date}</p>
              <p className="text-xs text-muted-foreground">24 hours mining</p>
            </div>
            <div className="text-right">
              <p className="text-sm font-semibold text-primary">
                +{record.profit.toFixed(4)} TON
              </p>
              <p className="text-xs text-green-500">Completed</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
