import { useState } from 'react';
import { AppLayout } from '@/components/layouts/AppLayout';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { Mail, Server } from 'lucide-react';

const EmailSettings = () => {
  const [settings, setSettings] = useState({
    requireEmailVerification: true,
    smtpHost: 'smtp.gmail.com',
    smtpPort: '587',
    smtpUser: '',
    smtpPassword: '',
    fromEmail: 'noreply@tonmining.com',
    fromName: 'TON MINING',
  });

  const handleSave = () => {
    toast.success('Pengaturan email berhasil disimpan!');
  };

  return (
    <AppLayout>
      <div className="p-4 md:p-8">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Header */}
          <div className="flex items-center gap-3 mb-8">
            <div className="p-3 rounded-lg bg-primary/10 neon-border">
              <Mail className="w-8 h-8 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl font-bold neon-text">Email Settings</h1>
              <p className="text-muted-foreground">Konfigurasi email dan notifikasi sistem</p>
            </div>
          </div>

          {/* Email Verification */}
          <Card className="p-6 bg-card/50 border-primary/20 backdrop-blur-sm">
            <div className="flex items-center justify-between p-4 rounded-lg bg-background/30 border border-primary/10">
              <div className="space-y-1">
                <Label className="text-base font-medium">Verifikasi Email Wajib</Label>
                <p className="text-sm text-muted-foreground">
                  User baru harus verifikasi email sebelum dapat login
                </p>
              </div>
              <Switch
                checked={settings.requireEmailVerification}
                onCheckedChange={(checked) => 
                  setSettings(prev => ({ ...prev, requireEmailVerification: checked }))
                }
              />
            </div>
          </Card>

          {/* SMTP Settings */}
          <Card className="p-6 bg-card/50 border-primary/20 backdrop-blur-sm">
            <div className="flex items-center gap-2 mb-4">
              <Server className="w-5 h-5 text-primary" />
              <h2 className="text-xl font-semibold">SMTP Configuration</h2>
            </div>
            
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="smtpHost">SMTP Host</Label>
                  <Input
                    id="smtpHost"
                    value={settings.smtpHost}
                    onChange={(e) => setSettings(prev => ({ ...prev, smtpHost: e.target.value }))}
                    className="mt-1 bg-background/50 border-primary/20 focus:border-primary"
                  />
                </div>
                <div>
                  <Label htmlFor="smtpPort">SMTP Port</Label>
                  <Input
                    id="smtpPort"
                    value={settings.smtpPort}
                    onChange={(e) => setSettings(prev => ({ ...prev, smtpPort: e.target.value }))}
                    className="mt-1 bg-background/50 border-primary/20 focus:border-primary"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="smtpUser">SMTP Username</Label>
                <Input
                  id="smtpUser"
                  value={settings.smtpUser}
                  onChange={(e) => setSettings(prev => ({ ...prev, smtpUser: e.target.value }))}
                  placeholder="your-email@gmail.com"
                  className="mt-1 bg-background/50 border-primary/20 focus:border-primary"
                />
              </div>

              <div>
                <Label htmlFor="smtpPassword">SMTP Password</Label>
                <Input
                  id="smtpPassword"
                  type="password"
                  value={settings.smtpPassword}
                  onChange={(e) => setSettings(prev => ({ ...prev, smtpPassword: e.target.value }))}
                  placeholder="••••••••"
                  className="mt-1 bg-background/50 border-primary/20 focus:border-primary"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="fromEmail">From Email</Label>
                  <Input
                    id="fromEmail"
                    value={settings.fromEmail}
                    onChange={(e) => setSettings(prev => ({ ...prev, fromEmail: e.target.value }))}
                    className="mt-1 bg-background/50 border-primary/20 focus:border-primary"
                  />
                </div>
                <div>
                  <Label htmlFor="fromName">From Name</Label>
                  <Input
                    id="fromName"
                    value={settings.fromName}
                    onChange={(e) => setSettings(prev => ({ ...prev, fromName: e.target.value }))}
                    className="mt-1 bg-background/50 border-primary/20 focus:border-primary"
                  />
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
              <Mail className="w-4 h-4 mr-2" />
              Simpan Pengaturan
            </Button>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default EmailSettings;
