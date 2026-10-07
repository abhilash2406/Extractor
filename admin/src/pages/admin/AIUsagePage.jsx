import React from 'react';
import { 
  Bot, 
  Cpu, 
  Zap, 
  Activity, 
  Clock, 
  Flame, 
  CheckCircle2, 
  ShieldAlert,
  Server
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

const tokenUsageData = [
  { time: '00:00', tokens: 12000, latency: 240 },
  { time: '04:00', tokens: 8500, latency: 210 },
  { time: '08:00', tokens: 45000, latency: 310 },
  { time: '12:00', tokens: 89000, latency: 390 },
  { time: '16:00', tokens: 104000, latency: 420 },
  { time: '20:00', tokens: 62000, latency: 290 },
  { time: '23:59', tokens: 28000, latency: 230 },
];

const AIUsagePage = () => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-heading text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
            AI & Model Usage
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Real-time telemetry, token consumption, Groq Llama-3 performance, and rate limits.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="success" className="gap-1.5 py-1 px-3">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Groq Engine Active</span>
          </Badge>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Today's Tokens</span>
              <div className="h-9 w-9 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 text-primary flex items-center justify-center">
                <Flame className="h-5 w-5" />
              </div>
            </div>
            <div className="mt-3">
              <h3 className="text-2xl font-bold font-heading text-foreground">348,500</h3>
              <p className="text-xs text-muted-foreground mt-1">~ $0.18 estimated cost</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Average Latency</span>
              <div className="h-9 w-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <Zap className="h-5 w-5" />
              </div>
            </div>
            <div className="mt-3">
              <h3 className="text-2xl font-bold font-heading text-foreground">312 ms</h3>
              <p className="text-xs text-emerald-600 mt-1 font-medium">99.8% within SLA</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Active Model</span>
              <div className="h-9 w-9 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
                <Bot className="h-5 w-5" />
              </div>
            </div>
            <div className="mt-3">
              <h3 className="text-lg font-bold font-heading text-foreground truncate">Llama-3-70b</h3>
              <p className="text-xs text-muted-foreground mt-1">Groq LPUs</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Error Rate</span>
              <div className="h-9 w-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                <Activity className="h-5 w-5" />
              </div>
            </div>
            <div className="mt-3">
              <h3 className="text-2xl font-bold font-heading text-foreground">0.02%</h3>
              <p className="text-xs text-muted-foreground mt-1">Zero downtime recorded</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Chart */}
      <Card>
        <CardHeader className="p-6 pb-2">
          <CardTitle className="text-base font-semibold">24-Hour Token Volume (Tokens/hr)</CardTitle>
          <CardDescription>Groq AI inference load across daytime peak hours</CardDescription>
        </CardHeader>
        <CardContent className="p-6 pt-2">
          <div className="h-[280px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={tokenUsageData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="tokenGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="time" tick={{fontSize: 11}} stroke="#94a3b8" axisLine={false} tickLine={false} />
                <YAxis tick={{fontSize: 11}} stroke="#94a3b8" axisLine={false} tickLine={false} />
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <Tooltip 
                  contentStyle={{ 
                    borderRadius: '12px', 
                    border: '1px solid #e2e8f0', 
                    boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                    fontSize: '12px',
                  }} 
                />
                <Area type="monotone" dataKey="tokens" stroke="#8b5cf6" strokeWidth={2.5} fillOpacity={1} fill="url(#tokenGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AIUsagePage;
