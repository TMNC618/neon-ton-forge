import { Users } from 'lucide-react';

interface RecentActivity {
  id: string;
  user_email: string;
  action: string;
  amount: string;
  time: string;
}

interface RecentActivitiesProps {
  activities: RecentActivity[];
}

export function RecentActivities({ activities }: RecentActivitiesProps) {
  return (
    <div className="bg-card border border-border/50 rounded-2xl p-8">
      <h2 className="text-xl font-semibold text-foreground mb-6">Recent User Activities</h2>
      
      {activities.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">No recent activities</div>
      ) : (
        <div className="space-y-4">
          {activities.map((activity) => (
            <div
              key={activity.id}
              className="flex items-center justify-between p-4 bg-secondary/30 rounded-lg hover:bg-secondary/50 transition-colors"
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                  <Users className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">{activity.user_email}</p>
                  <p className="text-xs text-muted-foreground">{activity.action}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-semibold text-primary">{activity.amount}</p>
                <p className="text-xs text-muted-foreground">{activity.time}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
