import { useState } from 'react';
import { Sidebar } from '@/components/Sidebar';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { Users, Award } from 'lucide-react';

const ReferralSettings = () => {
  const [settings, setSettings] = useState({
    level1Commission: '5',
    level2Commission: '2',
    level3Commission: '1',
    minWithdrawReferral: '5',
  });

  const handleSave = () => {
    toast.success('Pengaturan referral berhasil disimpan!');
  };

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      
      <main className="flex-1 p-8">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Header */}
          <div className="flex items-center gap-3 mb-8">
            <div className="p-3 rounded-lg bg-primary/10 neon-border">
              <Users className="w-8 h-8 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl font-bold neon-text">Referral Settings</h1>
              <p className="text-muted-foreground">Kelola bonus dan level program referral</p>
            </div>
          </div>

          {/* Commission Rates */}
          <Card className="p-6 bg-card/50 border-primary/20 backdrop-blur-sm">
            <div className="flex items-center gap-2 mb-6">
              <Award className="w-5 h-5 text-primary" />
              <h2 className="text-xl font-semibold">Commission Rates</h2>
            </div>
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="level1">Level 1 Commission (%)</Label>
                <Input
                  id="level1"
                  type="number"
                  step="0.1"
                  value={settings.level1Commission}
                  onChange={(e) => setSettings(prev => ({ ...prev, level1Commission: e.target.value }))}
                  className="mt-1 bg-background/50 border-primary/20 focus:border-primary"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Komisi dari profit mining referral langsung
                </p>
              </div>

              <div>
                <Label htmlFor="level2">Level 2 Commission (%)</Label>
                <Input
                  id="level2"
                  type="number"
                  step="0.1"
                  value={settings.level2Commission}
                  onChange={(e) => setSettings(prev => ({ ...prev, level2Commission: e.target.value }))}
                  className="mt-1 bg-background/50 border-primary/20 focus:border-primary"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Komisi dari profit mining referral level 2
                </p>
              </div>

              <div>
                <Label htmlFor="level3">Level 3 Commission (%)</Label>
                <Input
                  id="level3"
                  type="number"
                  step="0.1"
                  value={settings.level3Commission}
                  onChange={(e) => setSettings(prev => ({ ...prev, level3Commission: e.target.value }))}
                  className="mt-1 bg-background/50 border-primary/20 focus:border-primary"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Komisi dari profit mining referral level 3
                </p>
              </div>
            </div>
          </Card>

          {/* Referral Example */}
          <Card className="p-6 bg-card/50 border-primary/20 backdrop-blur-sm">
            <h2 className="text-xl font-semibold mb-4">Contoh Perhitungan</h2>
            
            <div className="space-y-3">
              <div className="p-4 bg-background/30 rounded-lg border border-primary/10">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center text-xs font-bold text-primary">
                    1
                  </div>
                  <span className="font-semibold">Level 1 (Direct Referral)</span>
                </div>
                <p className="text-sm text-muted-foreground ml-8">
                  Referral mining 100 TON, profit harian 1 TON → Anda dapat {settings.level1Commission}% = {(1 * parseFloat(settings.level1Commission) / 100).toFixed(3)} TON
                </p>
              </div>

              <div className="p-4 bg-background/30 rounded-lg border border-primary/10">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-6 h-6 rounded-full bg-cyan-500/20 flex items-center justify-center text-xs font-bold text-cyan-400">
                    2
                  </div>
                  <span className="font-semibold">Level 2</span>
                </div>
                <p className="text-sm text-muted-foreground ml-8">
                  Referral level 2 mining 100 TON, profit harian 1 TON → Anda dapat {settings.level2Commission}% = {(1 * parseFloat(settings.level2Commission) / 100).toFixed(3)} TON
                </p>
              </div>

              <div className="p-4 bg-background/30 rounded-lg border border-primary/10">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-6 h-6 rounded-full bg-purple-500/20 flex items-center justify-center text-xs font-bold text-purple-400">
                    3
                  </div>
                  <span className="font-semibold">Level 3</span>
                </div>
                <p className="text-sm text-muted-foreground ml-8">
                  Referral level 3 mining 100 TON, profit harian 1 TON → Anda dapat {settings.level3Commission}% = {(1 * parseFloat(settings.level3Commission) / 100).toFixed(3)} TON
                </p>
              </div>
            </div>
          </Card>

          {/* Minimum Withdraw */}
          <Card className="p-6 bg-card/50 border-primary/20 backdrop-blur-sm">
            <h2 className="text-xl font-semibold mb-4">Withdraw Settings</h2>
            
            <div>
              <Label htmlFor="minWithdraw">Minimum Withdraw Referral (TON)</Label>
              <Input
                id="minWithdraw"
                type="number"
                value={settings.minWithdrawReferral}
                onChange={(e) => setSettings(prev => ({ ...prev, minWithdrawReferral: e.target.value }))}
                className="mt-1 bg-background/50 border-primary/20 focus:border-primary"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Minimum earning referral yang dapat ditarik
              </p>
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
              <Users className="w-4 h-4 mr-2" />
              Simpan Pengaturan
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ReferralSettings;
