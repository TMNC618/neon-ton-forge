import { useState } from 'react';
import { AppLayout } from '@/components/layouts/AppLayout';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { Repeat, ArrowRightLeft, Percent } from 'lucide-react';

const SwapManagement = () => {
  const [settings, setSettings] = useState({
    tonToTeraRate: '10',
    teraToTonRate: '0.084',
    swapFee: '0.5',
  });

  const handleSave = () => {
    toast.success('Pengaturan swap berhasil disimpan!');
  };

  return (
    <AppLayout>
      <div className="p-4 md:p-8">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Header */}
          <div className="flex items-center gap-3 mb-8">
            <div className="p-3 rounded-lg bg-primary/10 neon-border">
              <Repeat className="w-8 h-8 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl font-bold neon-text">Swap Management</h1>
              <p className="text-muted-foreground">Kelola nilai tukar dan fee swap coin</p>
            </div>
          </div>

          {/* Exchange Rates */}
          <Card className="p-6 bg-card/50 border-primary/20 backdrop-blur-sm">
            <div className="flex items-center gap-2 mb-6">
              <ArrowRightLeft className="w-5 h-5 text-primary" />
              <h2 className="text-xl font-semibold">Exchange Rates</h2>
            </div>
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="tonToTera">1 TON = ? TERA</Label>
                <Input
                  id="tonToTera"
                  type="number"
                  step="0.1"
                  value={settings.tonToTeraRate}
                  onChange={(e) => setSettings(prev => ({ ...prev, tonToTeraRate: e.target.value }))}
                  className="mt-1 bg-background/50 border-primary/20 focus:border-primary"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Nilai tukar dari TON ke TERA
                </p>
              </div>

              <div>
                <Label htmlFor="teraToTon">1 TERA = ? TON</Label>
                <Input
                  id="teraToTon"
                  type="number"
                  step="0.01"
                  value={settings.teraToTonRate}
                  onChange={(e) => setSettings(prev => ({ ...prev, teraToTonRate: e.target.value }))}
                  className="mt-1 bg-background/50 border-primary/20 focus:border-primary"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Nilai tukar dari TERA ke TON
                </p>
              </div>
            </div>

            <div className="mt-4 p-4 bg-primary/5 border border-primary/20 rounded-lg">
              <p className="text-sm text-muted-foreground">
                <span className="font-semibold text-foreground">Catatan:</span> Pastikan nilai tukar konsisten. 
                Jika 1 TON = 10 TERA, maka 1 TERA harus = 0.084 TON
              </p>
            </div>
          </Card>

          {/* Swap Fee */}
          <Card className="p-6 bg-card/50 border-primary/20 backdrop-blur-sm">
            <div className="flex items-center gap-2 mb-6">
              <Percent className="w-5 h-5 text-primary" />
              <h2 className="text-xl font-semibold">Swap Fee</h2>
            </div>
            
            <div>
              <Label htmlFor="swapFee">Swap Fee (%)</Label>
              <Input
                id="swapFee"
                type="number"
                step="0.1"
                value={settings.swapFee}
                onChange={(e) => setSettings(prev => ({ ...prev, swapFee: e.target.value }))}
                className="mt-1 bg-background/50 border-primary/20 focus:border-primary"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Fee yang dipotong dari setiap transaksi swap (dalam persen)
              </p>
            </div>

            <div className="mt-4 p-4 bg-primary/5 border border-primary/20 rounded-lg">
              <p className="text-sm text-muted-foreground">
                <span className="font-semibold text-foreground">Contoh:</span> Jika fee 0.5% dan user swap 100 TON, 
                fee yang dipotong adalah 0.5 TON
              </p>
            </div>
          </Card>

          {/* Calculation Preview */}
          <Card className="p-6 bg-card/50 border-primary/20 backdrop-blur-sm">
            <h2 className="text-xl font-semibold mb-4">Preview Perhitungan</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* TON to TERA */}
              <div className="p-4 bg-background/30 rounded-lg border border-primary/10">
                <h3 className="font-semibold mb-3 text-primary">TON → TERA</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Input:</span>
                    <span className="font-semibold">100 TON</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Rate:</span>
                    <span>1 TON = {settings.tonToTeraRate} TERA</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Before Fee:</span>
                    <span>{(100 * parseFloat(settings.tonToTeraRate)).toFixed(2)} TERA</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Fee ({settings.swapFee}%):</span>
                    <span className="text-orange-400">
                      {(100 * parseFloat(settings.tonToTeraRate) * parseFloat(settings.swapFee) / 100).toFixed(2)} TERA
                    </span>
                  </div>
                  <div className="flex justify-between pt-2 border-t border-primary/20">
                    <span className="font-medium">You Get:</span>
                    <span className="font-bold text-green-400">
                      {(100 * parseFloat(settings.tonToTeraRate) * (1 - parseFloat(settings.swapFee) / 100)).toFixed(2)} TERA
                    </span>
                  </div>
                </div>
              </div>

              {/* TERA to TON */}
              <div className="p-4 bg-background/30 rounded-lg border border-primary/10">
                <h3 className="font-semibold mb-3 text-cyan-400">TERA → TON</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Input:</span>
                    <span className="font-semibold">100 TERA</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Rate:</span>
                    <span>1 TERA = {settings.teraToTonRate} TON</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Before Fee:</span>
                    <span>{(100 * parseFloat(settings.teraToTonRate)).toFixed(2)} TON</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Fee ({settings.swapFee}%):</span>
                    <span className="text-orange-400">
                      {(100 * parseFloat(settings.teraToTonRate) * parseFloat(settings.swapFee) / 100).toFixed(2)} TON
                    </span>
                  </div>
                  <div className="flex justify-between pt-2 border-t border-primary/20">
                    <span className="font-medium">You Get:</span>
                    <span className="font-bold text-green-400">
                      {(100 * parseFloat(settings.teraToTonRate) * (1 - parseFloat(settings.swapFee) / 100)).toFixed(2)} TON
                    </span>
                  </div>
                </div>
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
              <Repeat className="w-4 h-4 mr-2" />
              Simpan Pengaturan
            </Button>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default SwapManagement;
