export function SystemStatus() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="bg-card border border-border/50 rounded-2xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-medium text-muted-foreground">Mining Status</h3>
          <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse"></div>
        </div>
        <p className="text-2xl font-bold text-foreground">Active</p>
      </div>

      <div className="bg-card border border-border/50 rounded-2xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-medium text-muted-foreground">System Health</h3>
          <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse"></div>
        </div>
        <p className="text-2xl font-bold text-foreground">99.9%</p>
      </div>

      <div className="bg-card border border-border/50 rounded-2xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-medium text-muted-foreground">Maintenance</h3>
          <div className="w-3 h-3 rounded-full bg-gray-500"></div>
        </div>
        <p className="text-2xl font-bold text-foreground">Off</p>
      </div>
    </div>
  );
}
