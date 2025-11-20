import { LucideIcon } from 'lucide-react';

interface PageHeaderProps {
  icon?: LucideIcon;
  title: string;
  description: string;
  titleClassName?: string;
}

export const PageHeader = ({ icon: Icon, title, description, titleClassName }: PageHeaderProps) => {
  return (
    <div className="flex items-center gap-3 mb-8">
      {Icon && (
        <div className="p-3 rounded-lg bg-primary/10 neon-border">
          <Icon className="w-8 h-8 text-primary" />
        </div>
      )}
      <div>
        <h1 className={`text-3xl font-bold ${titleClassName || 'neon-text'}`}>
          {title}
        </h1>
        <p className="text-muted-foreground">{description}</p>
      </div>
    </div>
  );
};
