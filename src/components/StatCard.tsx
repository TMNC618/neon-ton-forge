import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  icon: LucideIcon;
  label: string;
  value: string | number;
  subValue?: string;
  trend?: 'up' | 'down';
  glowing?: boolean;
}

export const StatCard = ({ icon: Icon, label, value, subValue, trend, glowing }: StatCardProps) => {
  return (
    <div
      className={`bg-card border rounded-xl p-6 transition-all hover:border-primary/50 ${
        glowing ? 'neon-border mining-glow' : 'border-border/50'
      }`}
    >
      <div className="flex items-start justify-between mb-4">
        <div
          className={`w-12 h-12 rounded-lg flex items-center justify-center ${
            glowing ? 'bg-primary/20' : 'bg-secondary/50'
          }`}
        >
          <Icon className={`w-6 h-6 ${glowing ? 'text-primary' : 'text-muted-foreground'}`} />
        </div>
        {trend && (
          <div
            className={`text-xs font-medium ${
              trend === 'up' ? 'text-green-500' : 'text-red-500'
            }`}
          >
            {trend === 'up' ? '↑' : '↓'}
          </div>
        )}
      </div>
      
      <div className="space-y-1">
        <p className="text-sm text-muted-foreground">{label}</p>
        <p className={`text-2xl font-bold ${glowing ? 'neon-text' : 'text-foreground'}`}>
          {value}
        </p>
        {subValue && (
          <p className="text-xs text-muted-foreground">{subValue}</p>
        )}
      </div>
    </div>
  );
};
