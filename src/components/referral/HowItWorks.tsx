const steps = [
  { num: '1', title: 'Share Your Link', desc: 'Copy and share your unique referral link' },
  { num: '2', title: 'They Sign Up', desc: 'When someone registers, they become your referral' },
  { num: '3', title: 'Earn Commission', desc: 'Earn 5% of their mining profits instantly' },
  { num: '4', title: 'Lifetime Earnings', desc: 'Continue earning as long as they mine' },
];

export function HowItWorks() {
  return (
    <div className="bg-card border border-border/50 rounded-2xl p-8">
      <h2 className="text-xl font-semibold text-foreground mb-6">How It Works</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {steps.map((step) => (
          <div key={step.num} className="flex flex-col items-center text-center">
            <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center mb-4">
              <span className="text-primary font-bold text-lg">{step.num}</span>
            </div>
            <h3 className="font-semibold text-foreground mb-2">{step.title}</h3>
            <p className="text-sm text-muted-foreground">{step.desc}</p>
          </div>
        ))}
      </div>

      <div className="mt-8 p-4 bg-primary/10 border border-primary/30 rounded-lg text-center">
        <p className="text-sm text-foreground">
          <strong>Bonus:</strong> Refer 10+ active users and unlock 7% commission rate!
        </p>
      </div>
    </div>
  );
}
