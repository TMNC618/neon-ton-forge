import { useState } from 'react';
import { Sidebar } from '@/components/Sidebar';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { Image, FileImage, Info } from 'lucide-react';

const Branding = () => {
  const [settings, setSettings] = useState({
    siteLogo: '',
    favicon: '',
    siteInfo: 'Platform mining cryptocurrency TON terpercaya dengan teknologi blockchain',
    loginBackground: '',
  });

  const handleSave = () => {
    toast.success('Branding berhasil disimpan!');
  };

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      
      <main className="flex-1 p-8">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Header */}
          <div className="flex items-center gap-3 mb-8">
            <div className="p-3 rounded-lg bg-primary/10 neon-border">
              <Image className="w-8 h-8 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl font-bold neon-text">Branding & Logo</h1>
              <p className="text-muted-foreground">Kelola logo, favicon, dan tampilan website</p>
            </div>
          </div>

          {/* Logo Settings */}
          <Card className="p-6 bg-card/50 border-primary/20 backdrop-blur-sm">
            <div className="flex items-center gap-2 mb-4">
              <Image className="w-5 h-5 text-primary" />
              <h2 className="text-xl font-semibold">Site Logo</h2>
            </div>
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="logo">Logo URL</Label>
                <Input
                  id="logo"
                  value={settings.siteLogo}
                  onChange={(e) => setSettings(prev => ({ ...prev, siteLogo: e.target.value }))}
                  placeholder="https://example.com/logo.png"
                  className="mt-1 bg-background/50 border-primary/20 focus:border-primary"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Ukuran rekomendasi: 200x60 pixels
                </p>
              </div>

              <div className="p-4 bg-background/30 rounded-lg border border-primary/10">
                <p className="text-sm text-muted-foreground mb-2">Preview:</p>
                <div className="h-16 flex items-center justify-center bg-secondary/30 rounded">
                  {settings.siteLogo ? (
                    <img src={settings.siteLogo} alt="Logo" className="max-h-12" />
                  ) : (
                    <span className="text-muted-foreground">No logo uploaded</span>
                  )}
                </div>
              </div>
            </div>
          </Card>

          {/* Favicon */}
          <Card className="p-6 bg-card/50 border-primary/20 backdrop-blur-sm">
            <div className="flex items-center gap-2 mb-4">
              <FileImage className="w-5 h-5 text-primary" />
              <h2 className="text-xl font-semibold">Favicon</h2>
            </div>
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="favicon">Favicon URL</Label>
                <Input
                  id="favicon"
                  value={settings.favicon}
                  onChange={(e) => setSettings(prev => ({ ...prev, favicon: e.target.value }))}
                  placeholder="https://example.com/favicon.ico"
                  className="mt-1 bg-background/50 border-primary/20 focus:border-primary"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Format: .ico, .png (32x32 atau 16x16 pixels)
                </p>
              </div>
            </div>
          </Card>

          {/* Site Info */}
          <Card className="p-6 bg-card/50 border-primary/20 backdrop-blur-sm">
            <div className="flex items-center gap-2 mb-4">
              <Info className="w-5 h-5 text-primary" />
              <h2 className="text-xl font-semibold">Site Information</h2>
            </div>
            
            <div>
              <Label htmlFor="siteInfo">Deskripsi Website</Label>
              <Textarea
                id="siteInfo"
                value={settings.siteInfo}
                onChange={(e) => setSettings(prev => ({ ...prev, siteInfo: e.target.value }))}
                className="mt-1 bg-background/50 border-primary/20 focus:border-primary"
                rows={4}
              />
            </div>
          </Card>

          {/* Login Background */}
          <Card className="p-6 bg-card/50 border-primary/20 backdrop-blur-sm">
            <div className="flex items-center gap-2 mb-4">
              <Image className="w-5 h-5 text-primary" />
              <h2 className="text-xl font-semibold">Login Page Background</h2>
            </div>
            
            <div>
              <Label htmlFor="loginBg">Background Image URL</Label>
              <Input
                id="loginBg"
                value={settings.loginBackground}
                onChange={(e) => setSettings(prev => ({ ...prev, loginBackground: e.target.value }))}
                placeholder="https://example.com/background.jpg"
                className="mt-1 bg-background/50 border-primary/20 focus:border-primary"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Ukuran rekomendasi: 1920x1080 pixels
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
              <Image className="w-4 h-4 mr-2" />
              Simpan Branding
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Branding;
