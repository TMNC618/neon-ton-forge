import { useState } from 'react';
import { AppLayout } from '@/components/layouts/AppLayout';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { ArrowUpFromLine, Percent } from 'lucide-react';

const WithdrawManagement = () => {
  const [settings, setSettings] = useState({
    minWithdraw: '5',
    maxWithdraw: '5000',
    withdrawFee: '2',
  });

  const handleSave = () => {
    toast.success('Pengaturan withdraw berhasil disimpan!');
  };

  return (
    <AppLayout>
      <div className="p-4 md:p-8">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Header */}
          <div className="flex items-center gap-3 mb-8">
            <div className="p-3 rounded-lg bg-primary/10 neon-border">
              <ArrowUpFromLine className="w-8 h-8 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl font-bold neon-text">Withdraw Management</h1>
              <p className="text-muted-foreground">Kelola pengaturan minimum, maksimum, dan fee withdraw</p>
            </div>
          </div>

          {/* Withdraw Limits */}
          <Card className="p-6 bg-card/50 border-primary/20 backdrop-blur-sm">
            <h2 className="text-xl font-semibold mb-6">Batas Withdraw</h2>
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="minWithdraw">Minimum Withdraw (TON)</Label>
                <Input
                  id="minWithdraw"
                  type="number"
                  value={settings.minWithdraw}
                  onChange={(e) => setSettings(prev => ({ ...prev, minWithdraw: e.target.value }))}
                  className="mt-1 bg-background/50 border-primary/20 focus:border-primary"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Jumlah minimum yang dapat ditarik user
                </p>
              </div>

              <div>
                <Label htmlFor="maxWithdraw">Maximum Withdraw (TON)</Label>
                <Input
                  id="maxWithdraw"
                  type="number"
                  value={settings.maxWithdraw}
                  onChange={(e) => setSettings(prev => ({ ...prev, maxWithdraw: e.target.value }))}
                  className="mt-1 bg-background/50 border-primary/20 focus:border-primary"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Jumlah maksimum yang dapat ditarik user
                </p>
              </div>
            </div>
          </Card>

          {/* Withdraw Fee */}
          <Card className="p-6 bg-card/50 border-primary/20 backdrop-blur-sm">
            <div className="flex items-center gap-2 mb-6">
              <Percent className="w-5 h-5 text-primary" />
              <h2 className="text-xl font-semibold">Fee Withdraw</h2>
            </div>
            
            <div>
              <Label htmlFor="withdrawFee">Withdraw Fee (%)</Label>
              <Input
                id="withdrawFee"
                type="number"
                step="0.1"
                value={settings.withdrawFee}
                onChange={(e) => setSettings(prev => ({ ...prev, withdrawFee: e.target.value }))}
                className="mt-1 bg-background/50 border-primary/20 focus:border-primary"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Fee yang dipotong dari setiap withdraw (dalam persen)
              </p>
            </div>

            <div className="mt-4 p-4 bg-primary/5 border border-primary/20 rounded-lg">
              <p className="text-sm text-muted-foreground">
                <span className="font-semibold text-foreground">Contoh:</span> Jika fee 2% dan user withdraw 100 TON, 
                maka yang diterima adalah 98 TON (fee 2 TON)
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
              <ArrowUpFromLine className="w-4 h-4 mr-2" />
              Simpan Pengaturan
            </Button>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default WithdrawManagement;
