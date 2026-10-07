import React, { useState } from 'react';
import { 
  Settings, 
  Save, 
  Key, 
  Database, 
  Mail, 
  Bot, 
  ShieldCheck, 
  HardDrive,
  CheckCircle2
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import toast from 'react-hot-toast';

const SettingsPage = () => {
  const [activeTab, setActiveTab] = useState('general');
  const [loading, setLoading] = useState(false);

  const handleSave = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      toast.success('System settings saved successfully!');
    }, 600);
  };

  const tabs = [
    { id: 'general', label: 'General & Branding', icon: Settings },
    { id: 'ai', label: 'Groq AI Engine', icon: Bot },
    { id: 'storage', label: 'Storage & B2 Cloud', icon: HardDrive },
    { id: 'email', label: 'Email & SMTP', icon: Mail },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="font-heading text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
          Platform Settings
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Configure global application settings, API keys, and environment integrations.
        </p>
      </div>

      {/* Settings Navigation Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 border-b border-border/60">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2.5 text-xs font-semibold rounded-xl transition-all whitespace-nowrap ${
                activeTab === tab.id
                  ? 'bg-primary text-primary-foreground shadow-xs'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted/60'
              }`}
            >
              <Icon className="h-4 w-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab Contents */}
      <form onSubmit={handleSave}>
        {activeTab === 'general' && (
          <Card>
            <CardHeader className="p-6 pb-4">
              <CardTitle className="text-base font-semibold">General Information</CardTitle>
              <CardDescription>Configure application title, support email, and brand identity.</CardDescription>
            </CardHeader>
            <CardContent className="p-6 pt-0 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">App Name</label>
                  <Input defaultValue="Extractor" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Support Contact</label>
                  <Input defaultValue="support@extractor.io" />
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Platform Description</label>
                <Input defaultValue="AI-Powered Document and Candidate Resume Extraction Engine" />
              </div>
            </CardContent>
            <CardFooter className="p-6 pt-0 flex justify-end">
              <Button type="submit" disabled={loading} className="gap-2">
                <Save className="h-4 w-4" />
                <span>{loading ? 'Saving...' : 'Save General Settings'}</span>
              </Button>
            </CardFooter>
          </Card>
        )}

        {activeTab === 'ai' && (
          <Card>
            <CardHeader className="p-6 pb-4">
              <CardTitle className="text-base font-semibold">Groq AI Configuration</CardTitle>
              <CardDescription>Setup LLM inference parameters and Groq API token.</CardDescription>
            </CardHeader>
            <CardContent className="p-6 pt-0 space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Groq API Key</label>
                <Input type="password" defaultValue="gsk_********************************" />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Default Model</label>
                  <Input defaultValue="llama-3.3-70b-versatile" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Max Tokens Per Request</label>
                  <Input defaultValue="4096" />
                </div>
              </div>
            </CardContent>
            <CardFooter className="p-6 pt-0 flex justify-end">
              <Button type="submit" disabled={loading} className="gap-2">
                <Save className="h-4 w-4" />
                <span>Save AI Config</span>
              </Button>
            </CardFooter>
          </Card>
        )}

        {activeTab === 'storage' && (
          <Card>
            <CardHeader className="p-6 pb-4">
              <CardTitle className="text-base font-semibold">Backblaze B2 Storage</CardTitle>
              <CardDescription>Manage cloud object storage for resumes and parsed files.</CardDescription>
            </CardHeader>
            <CardContent className="p-6 pt-0 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Bucket Name</label>
                  <Input defaultValue="extractor-production" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">B2 Endpoint</label>
                  <Input defaultValue="s3.us-west-004.backblazeb2.com" />
                </div>
              </div>
            </CardContent>
            <CardFooter className="p-6 pt-0 flex justify-end">
              <Button type="submit" disabled={loading} className="gap-2">
                <Save className="h-4 w-4" />
                <span>Save Storage Config</span>
              </Button>
            </CardFooter>
          </Card>
        )}

        {activeTab === 'email' && (
          <Card>
            <CardHeader className="p-6 pb-4">
              <CardTitle className="text-base font-semibold">SMTP Email Gateway</CardTitle>
              <CardDescription>Setup automated email notifications and verification emails.</CardDescription>
            </CardHeader>
            <CardContent className="p-6 pt-0 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">SMTP Host</label>
                  <Input defaultValue="smtp.gmail.com" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">SMTP Port</label>
                  <Input defaultValue="587" />
                </div>
              </div>
            </CardContent>
            <CardFooter className="p-6 pt-0 flex justify-end">
              <Button type="submit" disabled={loading} className="gap-2">
                <Save className="h-4 w-4" />
                <span>Save SMTP Config</span>
              </Button>
            </CardFooter>
          </Card>
        )}
      </form>
    </div>
  );
};

export default SettingsPage;
