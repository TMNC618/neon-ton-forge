import { useState } from 'react';
import { AppLayout } from '@/components/layouts/AppLayout';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { Settings, Globe, FileText, Wrench } from 'lucide-react';

const WebsiteSettings = () => {
  const [settings, setSettings] = useState({
    title: 'TON MINING',
    description: 'Platform mining cryptocurrency TON dengan profit harian hingga 1%',
    metaKeywords: 'ton mining, cryptocurrency, crypto mining, ton coin, blockchain',
    maintenanceMode: false,
    emailVerification: true,
    autoApproveDeposit: false,
  });

  const handleSave = () => {
    // Mock save
    toast.success('Pengaturan website berhasil disimpan!');
  };

  const handleToggle = (field: string) => {
    setSettings(prev => ({
      ...prev,
      [field]: !prev[field as keyof typeof prev]
    }));
  };

  return (
    <AppLayout>
      <div className="p-4 md:p-8">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Header */}
          <div className="flex items-center gap-3 mb-8">
            <div className="p-3 rounded-lg bg-primary/10 neon-border">
              <Settings className="w-8 h-8 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl font-bold neon-text">Website Settings</h1>
              <p className="text-muted-foreground">Kelola pengaturan website dan konfigurasi sistem</p>
            </div>
          </div>

          {/* Basic Settings */}
          <Card className="p-6 bg-card/50 border-primary/20 backdrop-blur-sm">
            <div className="flex items-center gap-2 mb-4">
              <Globe className="w-5 h-5 text-primary" />
              <h2 className="text-xl font-semibold">Pengaturan Dasar</h2>
            </div>
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="title">Judul Website</Label>
                <Input
                  id="title"
                  value={settings.title}
                  onChange={(e) => setSettings(prev => ({ ...prev, title: e.target.value }))}
                  className="mt-1 bg-background/50 border-primary/20 focus:border-primary"
                />
              </div>

              <div>
                <Label htmlFor="description">Deskripsi Website</Label>
                <Textarea
                  id="description"
                  value={settings.description}
                  onChange={(e) => setSettings(prev => ({ ...prev, description: e.target.value }))}
                  className="mt-1 bg-background/50 border-primary/20 focus:border-primary"
                  rows={3}
                />
              </div>

              <div>
                <Label htmlFor="keywords">Meta Keywords</Label>
                <Input
                  id="keywords"
                  value={settings.metaKeywords}
                  onChange={(e) => setSettings(prev => ({ ...prev, metaKeywords: e.target.value }))}
                  className="mt-1 bg-background/50 border-primary/20 focus:border-primary"
                  placeholder="Pisahkan dengan koma"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Pisahkan setiap keyword dengan koma
                </p>
              </div>
            </div>
          </Card>

          {/* System Settings */}
          <Card className="p-6 bg-card/50 border-primary/20 backdrop-blur-sm">
            <div className="flex items-center gap-2 mb-4">
              <Wrench className="w-5 h-5 text-primary" />
              <h2 className="text-xl font-semibold">Pengaturan Sistem</h2>
            </div>
            
            <div className="space-y-6">
              <div className="flex items-center justify-between p-4 rounded-lg bg-background/30 border border-primary/10">
                <div className="space-y-1">
                  <Label className="text-base font-medium">Mode Maintenance</Label>
                  <p className="text-sm text-muted-foreground">
                    Aktifkan mode maintenance untuk menutup akses sementara
                  </p>
                </div>
                <Switch
                  checked={settings.maintenanceMode}
                  onCheckedChange={() => handleToggle('maintenanceMode')}
                />
              </div>

              <div className="flex items-center justify-between p-4 rounded-lg bg-background/30 border border-primary/10">
                <div className="space-y-1">
                  <Label className="text-base font-medium">Verifikasi Email</Label>
                  <p className="text-sm text-muted-foreground">
                    Wajibkan verifikasi email saat pendaftaran user baru
                  </p>
                </div>
                <Switch
                  checked={settings.emailVerification}
                  onCheckedChange={() => handleToggle('emailVerification')}
                />
              </div>

              <div className="flex items-center justify-between p-4 rounded-lg bg-background/30 border border-primary/10">
                <div className="space-y-1">
                  <Label className="text-base font-medium">Auto Approve Deposit</Label>
                  <p className="text-sm text-muted-foreground">
                    Otomatis menyetujui deposit tanpa verifikasi manual
                  </p>
                </div>
                <Switch
                  checked={settings.autoApproveDeposit}
                  onCheckedChange={() => handleToggle('autoApproveDeposit')}
                />
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
              <FileText className="w-4 h-4 mr-2" />
              Simpan Pengaturan
            </Button>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default WebsiteSettings;
