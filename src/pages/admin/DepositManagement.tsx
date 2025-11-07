import { useState } from 'react';
import { Sidebar } from '@/components/Sidebar';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { ArrowDownToLine, Percent } from 'lucide-react';

const DepositManagement = () => {
  const [settings, setSettings] = useState({
    minDeposit: '10',
    maxDeposit: '10000',
    depositFee: '0',
  });

  const handleSave = () => {
    toast.success('Pengaturan deposit berhasil disimpan!');
  };

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      
      <main className="flex-1 p-8">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Header */}
          <div className="flex items-center gap-3 mb-8">
            <div className="p-3 rounded-lg bg-primary/10 neon-border">
              <ArrowDownToLine className="w-8 h-8 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl font-bold neon-text">Deposit Management</h1>
              <p className="text-muted-foreground">Kelola pengaturan minimum, maksimum, dan fee deposit</p>
            </div>
          </div>

          {/* Deposit Limits */}
          <Card className="p-6 bg-card/50 border-primary/20 backdrop-blur-sm">
            <h2 className="text-xl font-semibold mb-6">Batas Deposit</h2>
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="minDeposit">Minimum Deposit (TON)</Label>
                <Input
                  id="minDeposit"
                  type="number"
                  value={settings.minDeposit}
                  onChange={(e) => setSettings(prev => ({ ...prev, minDeposit: e.target.value }))}
                  className="mt-1 bg-background/50 border-primary/20 focus:border-primary"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Jumlah minimum yang dapat didepositkan user
                </p>
              </div>

              <div>
                <Label htmlFor="maxDeposit">Maximum Deposit (TON)</Label>
                <Input
                  id="maxDeposit"
                  type="number"
                  value={settings.maxDeposit}
                  onChange={(e) => setSettings(prev => ({ ...prev, maxDeposit: e.target.value }))}
                  className="mt-1 bg-background/50 border-primary/20 focus:border-primary"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Jumlah maksimum yang dapat didepositkan user
                </p>
              </div>
            </div>
          </Card>

          {/* Deposit Fee */}
          <Card className="p-6 bg-card/50 border-primary/20 backdrop-blur-sm">
            <div className="flex items-center gap-2 mb-6">
              <Percent className="w-5 h-5 text-primary" />
              <h2 className="text-xl font-semibold">Fee Deposit</h2>
            </div>
            
            <div>
              <Label htmlFor="depositFee">Deposit Fee (%)</Label>
              <Input
                id="depositFee"
                type="number"
                step="0.1"
                value={settings.depositFee}
                onChange={(e) => setSettings(prev => ({ ...prev, depositFee: e.target.value }))}
                className="mt-1 bg-background/50 border-primary/20 focus:border-primary"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Fee yang dipotong dari setiap deposit (dalam persen)
              </p>
            </div>

            <div className="mt-4 p-4 bg-primary/5 border border-primary/20 rounded-lg">
              <p className="text-sm text-muted-foreground">
                <span className="font-semibold text-foreground">Contoh:</span> Jika fee 2% dan user deposit 100 TON, 
                maka yang masuk ke saldo adalah 98 TON
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
              <ArrowDownToLine className="w-4 h-4 mr-2" />
              Simpan Pengaturan
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default DepositManagement;
