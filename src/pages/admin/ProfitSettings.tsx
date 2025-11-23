import { useState } from 'react';
import { AppLayout } from '@/components/layouts/AppLayout';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { Activity, TrendingUp } from 'lucide-react';

const ProfitSettings = () => {
  const [settings, setSettings] = useState({
    dailyProfitRate: '1',
    minMiningAmount: '10',
    maxMiningAmount: '10000',
  });

  const handleSave = () => {
    toast.success('Pengaturan profit berhasil disimpan!');
  };

  return (
    <AppLayout>
      <div className="p-4 md:p-8">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Header */}
          <div className="flex items-center gap-3 mb-8">
            <div className="p-3 rounded-lg bg-primary/10 neon-border">
              <Activity className="w-8 h-8 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl font-bold neon-text">Profit Settings</h1>
              <p className="text-muted-foreground">Kelola pengaturan profit mining harian user</p>
            </div>
          </div>

          {/* Daily Profit Rate */}
          <Card className="p-6 bg-card/50 border-primary/20 backdrop-blur-sm">
            <div className="flex items-center gap-2 mb-6">
              <TrendingUp className="w-5 h-5 text-primary" />
              <h2 className="text-xl font-semibold">Daily Profit Rate</h2>
            </div>
            
            <div>
              <Label htmlFor="profitRate">Profit Harian (%)</Label>
              <Input
                id="profitRate"
                type="number"
                step="0.01"
                value={settings.dailyProfitRate}
                onChange={(e) => setSettings(prev => ({ ...prev, dailyProfitRate: e.target.value }))}
                className="mt-1 bg-background/50 border-primary/20 focus:border-primary"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Persentase profit yang didapatkan user per 24 jam
              </p>
            </div>

            <div className="mt-4 p-4 bg-primary/5 border border-primary/20 rounded-lg">
              <p className="text-sm text-muted-foreground">
                <span className="font-semibold text-foreground">Contoh:</span> Jika profit rate 1% dan user mining 100 TON, 
                maka profit harian adalah 1 TON
              </p>
            </div>
          </Card>

          {/* Mining Limits */}
          <Card className="p-6 bg-card/50 border-primary/20 backdrop-blur-sm">
            <h2 className="text-xl font-semibold mb-6">Batas Mining</h2>
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="minMining">Minimum Mining Amount (TON)</Label>
                <Input
                  id="minMining"
                  type="number"
                  value={settings.minMiningAmount}
                  onChange={(e) => setSettings(prev => ({ ...prev, minMiningAmount: e.target.value }))}
                  className="mt-1 bg-background/50 border-primary/20 focus:border-primary"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Jumlah minimum yang dapat dimining user
                </p>
              </div>

              <div>
                <Label htmlFor="maxMining">Maximum Mining Amount (TON)</Label>
                <Input
                  id="maxMining"
                  type="number"
                  value={settings.maxMiningAmount}
                  onChange={(e) => setSettings(prev => ({ ...prev, maxMiningAmount: e.target.value }))}
                  className="mt-1 bg-background/50 border-primary/20 focus:border-primary"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Jumlah maksimum yang dapat dimining user
                </p>
              </div>
            </div>
          </Card>

          {/* Calculation Preview */}
          <Card className="p-6 bg-card/50 border-primary/20 backdrop-blur-sm">
            <h2 className="text-xl font-semibold mb-4">Preview Perhitungan</h2>
            
            <div className="space-y-3">
              <div className="flex justify-between p-3 bg-background/30 rounded">
                <span className="text-muted-foreground">Mining Amount:</span>
                <span className="font-semibold">100 TON</span>
              </div>
              <div className="flex justify-between p-3 bg-background/30 rounded">
                <span className="text-muted-foreground">Daily Profit Rate:</span>
                <span className="font-semibold text-primary">{settings.dailyProfitRate}%</span>
              </div>
              <div className="flex justify-between p-3 bg-primary/10 rounded border border-primary/30">
                <span className="text-foreground font-medium">Daily Profit:</span>
                <span className="font-bold text-primary text-lg">
                  {(100 * parseFloat(settings.dailyProfitRate) / 100).toFixed(2)} TON
                </span>
              </div>
            </div>
          </Card>

          {/* Save Button */}
          <div className="flex justify-end gap-3">
            <Button
              variant="outline"
              onClick={() => toast.info('Perubahan dibatalkan')}
              className="border-primary/20"
            >
              Batal
            </Button>
            <Button
              onClick={handleSave}
              className="bg-primary hover:bg-primary/90 mining-glow"
            >
              <Activity className="w-4 h-4 mr-2" />
              Simpan Pengaturan
            </Button>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default ProfitSettings;
