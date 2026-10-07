import React from 'react';
import { useAuthStore } from '../../store/authStore';
import { useDashboardStats } from '../../hooks/useDashboard';
import { 
  Users, 
  Activity, 
  FileText, 
  IndianRupee, 
  Sparkles, 
  TrendingUp, 
  Bot,
  CreditCard,
  UserCheck,
  Zap,
  ArrowUpRight,
  Clock,
  ShieldCheck,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  BarChart, 
  Bar, 
  PieChart, 
  Pie, 
  Cell, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip as RechartsTooltip, 
  Legend 
} from 'recharts';

// Data for User Growth Chart
const userGrowthData = [
  { month: 'Jan', users: 850, active: 620 },
  { month: 'Feb', users: 1100, active: 890 },
  { month: 'Mar', users: 1350, active: 1050 },
  { month: 'Apr', users: 1580, active: 1210 },
  { month: 'May', users: 1820, active: 1400 },
  { month: 'Jun', users: 1950, active: 1530 },
  { month: 'Jul', users: 2120, active: 1640 },
  { month: 'Aug', users: 2280, active: 1720 },
  { month: 'Sep', users: 2350, active: 1780 },
  { month: 'Oct', users: 2431, active: 1842 },
];

// Data for Revenue Chart (in ₹ thousands)
const revenueData = [
  { month: 'Jan', revenue: 32.5 },
  { month: 'Feb', revenue: 41.2 },
  { month: 'Mar', revenue: 48.0 },
  { month: 'Apr', revenue: 54.6 },
  { month: 'May', revenue: 61.8 },
  { month: 'Jun', revenue: 68.4 },
  { month: 'Jul', revenue: 73.1 },
  { month: 'Aug', revenue: 76.5 },
  { month: 'Sep', revenue: 79.2 },
  { month: 'Oct', revenue: 82.4 },
];

// Data for Subscription Distribution
const subscriptionDistribution = [
  { name: 'Free Tier', value: 45, count: '1,094' },
  { name: 'Starter Plan', value: 25, count: '608' },
  { name: 'Pro Plan', value: 20, count: '486' },
  { name: 'Enterprise', value: 10, count: '243' },
];

const SUB_COLORS = ['#6366F1', '#3B82F6', '#10B981', '#F59E0B'];

// Data for Template Usage
const templateUsageData = [
  { name: 'Modern Resume', extractions: 2450, percentage: 88 },
  { name: 'Executive CV', extractions: 1820, percentage: 65 },
  { name: 'Technical Schema', extractions: 1240, percentage: 44 },
  { name: 'Invoice Parser', extractions: 890, percentage: 32 },
  { name: 'ID Document OCR', extractions: 423, percentage: 15 },
];

// Data for AI Usage Categories
const aiUsageBreakdown = [
  { 
    name: 'Resume Analysis', 
    count: '4,210 requests', 
    percentage: 85, 
    color: 'bg-indigo-600',
    description: 'Parsing skills, experience, education schemas'
  },
  { 
    name: 'Optimization', 
    count: '2,680 requests', 
    percentage: 54, 
    color: 'bg-purple-600',
    description: 'ATS keyword matching and gap score optimization'
  },
  { 
    name: 'Cover Letter', 
    count: '1,890 requests', 
    percentage: 38, 
    color: 'bg-violet-600',
    description: 'Custom personalized letter generation'
  },
  { 
    name: 'Interview Prep', 
    count: '1,240 requests', 
    percentage: 25, 
    color: 'bg-amber-600',
    description: 'AI question answering and technical interview simulations'
  },
];

// Recent Transactions Data
const recentTransactions = [
  { user: 'Alex Johnson', email: 'alex@enterprise.io', plan: 'Pro Plan', amount: '₹1,499', status: 'COMPLETED' },
  { user: 'Sarah Miller', email: 'sarah@fintech.co', plan: 'Enterprise', amount: '₹4,999', status: 'COMPLETED' },
  { user: 'Michael Chen', email: 'm.chen@dev.io', plan: 'Starter', amount: '₹499', status: 'COMPLETED' },
  { user: 'Emma Watson', email: 'emma@design.org', plan: 'Pro Plan', amount: '₹1,499', status: 'PENDING' },
  { user: 'David Brown', email: 'david@corp.in', plan: 'Enterprise', amount: '₹4,999', status: 'COMPLETED' },
];

// Recent Users Data
const recentUsers = [
  { name: 'Priya Sharma', email: 'priya@tech.in', plan: 'Pro', joined: '2 hours ago', initials: 'PS' },
  { name: 'Rohan Verma', email: 'rohan@code.org', plan: 'Starter', joined: '5 hours ago', initials: 'RV' },
  { name: 'Ananya Iyer', email: 'ananya@startup.io', plan: 'Enterprise', joined: '1 day ago', initials: 'AI' },
  { name: 'Vikram Patel', email: 'vikram@ai.in', plan: 'Free', joined: '2 days ago', initials: 'VP' },
  { name: 'Neha Gupta', email: 'neha@growth.co', plan: 'Pro', joined: '3 days ago', initials: 'NG' },
];

const DashboardPage = () => {
  const { user } = useAuthStore();
  const { data: stats } = useDashboardStats();

  // Top metric cards
  const metrics = [
    {
      title: 'Users',
      value: stats?.totalUsers ? stats.totalUsers.toLocaleString() : '2,431',
      growth: '+12.5%',
      icon: Users,
      iconBg: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20',
    },
    {
      title: 'Active',
      value: '1,842',
      growth: '+8.2%',
      icon: Activity,
      iconBg: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    },
    {
      title: 'Resumes',
      value: '5,823',
      growth: '+15.4%',
      icon: FileText,
      iconBg: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
    },
    {
      title: 'Revenue',
      value: '₹82.4K',
      growth: '+18.7%',
      icon: IndianRupee,
      iconBg: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    },
    {
      title: 'AI Usage',
      value: '8,923',
      growth: '+21.4%',
      icon: Bot,
      iconBg: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
    },
  ];

  return (
    <div className="space-y-6 pb-6">
      {/* Dashboard Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="font-heading text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
            Dashboard
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Welcome back, <span className="font-semibold text-foreground">{user?.name || 'admin'}</span>
          </p>
        </div>
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <Badge variant="outline" className="px-3 py-1.5 gap-1.5 text-xs bg-card border-border/80 shadow-xs">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="font-medium text-foreground">Live System Telemetry</span>
          </Badge>
        </div>
      </div>

      {/* Top 5 Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {metrics.map((metric, idx) => {
          const Icon = metric.icon;
          return (
            <Card key={idx} className="hover:shadow-md transition-all duration-200">
              <CardContent className="p-5 flex flex-col justify-between h-full">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    {metric.title}
                  </span>
                  <div className={`flex h-9 w-9 items-center justify-center rounded-xl border ${metric.iconBg} shadow-xs`}>
                    <Icon className="h-4 w-4" />
                  </div>
                </div>
                <div>
                  <div className="font-heading text-2xl font-bold tracking-tight text-foreground">
                    {metric.value}
                  </div>
                  <div className="flex items-center gap-1 mt-1.5">
                    <span className="inline-flex items-center text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                      <TrendingUp className="h-3 w-3 mr-0.5" />
                      {metric.growth}
                    </span>
                    <span className="text-[11px] text-muted-foreground">vs last mo</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Row 1: User Growth & Revenue */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* User Growth Chart */}
        <Card>
          <CardHeader className="p-6 pb-2 flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-base font-semibold">USER GROWTH</CardTitle>
              <CardDescription>Monthly registered vs active users</CardDescription>
            </div>
            <Badge variant="secondary" className="text-xs font-normal">
              +12.5% MTD
            </Badge>
          </CardHeader>
          <CardContent className="p-6 pt-2">
            <div className="h-[260px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={userGrowthData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="userGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6366F1" stopOpacity={0.35}/>
                      <stop offset="95%" stopColor="#6366F1" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="activeGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10B981" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="month" tick={{fontSize: 11}} stroke="#94a3b8" axisLine={false} tickLine={false} />
                  <YAxis tick={{fontSize: 11}} stroke="#94a3b8" axisLine={false} tickLine={false} />
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="currentColor" className="text-border/60" />
                  <RechartsTooltip 
                    contentStyle={{ 
                      backgroundColor: 'var(--card)', 
                      borderColor: 'var(--border)', 
                      borderRadius: '12px', 
                      boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                      fontSize: '12px',
                    }} 
                  />
                  <Area type="monotone" dataKey="users" name="Total Users" stroke="#6366F1" strokeWidth={2.5} fillOpacity={1} fill="url(#userGrad)" />
                  <Area type="monotone" dataKey="active" name="Active Users" stroke="#10B981" strokeWidth={2} fillOpacity={1} fill="url(#activeGrad)" />
                  <Legend verticalAlign="top" height={30} iconType="circle" wrapperStyle={{ fontSize: '12px' }} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Revenue Chart */}
        <Card>
          <CardHeader className="p-6 pb-2 flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-base font-semibold">REVENUE</CardTitle>
              <CardDescription>Monthly recurring revenue in ₹ (INR)</CardDescription>
            </div>
            <div className="font-heading text-lg font-bold text-foreground">₹82.4K</div>
          </CardHeader>
          <CardContent className="p-6 pt-2">
            <div className="h-[260px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={revenueData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                  <defs>
                    <linearGradient id="barGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#8B5CF6"/>
                      <stop offset="100%" stopColor="#6366F1"/>
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="month" tick={{fontSize: 11}} stroke="#94a3b8" axisLine={false} tickLine={false} />
                  <YAxis 
                    tickFormatter={(val) => `₹${val}k`} 
                    tick={{fontSize: 11}} 
                    stroke="#94a3b8" 
                    axisLine={false} 
                    tickLine={false} 
                  />
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="currentColor" className="text-border/60" />
                  <RechartsTooltip 
                    formatter={(val) => [`₹${val}K`, 'Revenue']}
                    contentStyle={{ 
                      backgroundColor: 'var(--card)', 
                      borderColor: 'var(--border)', 
                      borderRadius: '12px', 
                      boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                      fontSize: '12px',
                    }} 
                  />
                  <Bar dataKey="revenue" name="Revenue (₹K)" fill="url(#barGrad)" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Row 2: Subscription Distribution & Template Usage */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Subscription Distribution */}
        <Card>
          <CardHeader className="p-6 pb-2">
            <CardTitle className="text-base font-semibold">SUBSCRIPTION DISTRIBUTION</CardTitle>
            <CardDescription>Breakdown by tier plans</CardDescription>
          </CardHeader>
          <CardContent className="p-6 pt-2">
            <div className="h-[260px] w-full flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={subscriptionDistribution}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={95}
                    paddingAngle={4}
                    dataKey="value"
                    stroke="none"
                  >
                    {subscriptionDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={SUB_COLORS[index % SUB_COLORS.length]} />
                    ))}
                  </Pie>
                  <RechartsTooltip 
                    formatter={(value, name, item) => [`${value}% (${item.payload.count} users)`, name]}
                    contentStyle={{ 
                      backgroundColor: 'var(--card)', 
                      borderColor: 'var(--border)', 
                      borderRadius: '12px', 
                      boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                      fontSize: '12px',
                    }} 
                  />
                  <Legend verticalAlign="bottom" height={36} iconType="circle" wrapperStyle={{ fontSize: '11px' }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Template Usage */}
        <Card>
          <CardHeader className="p-6 pb-2">
            <CardTitle className="text-base font-semibold">TEMPLATE USAGE</CardTitle>
            <CardDescription>Top extraction schemas by volume</CardDescription>
          </CardHeader>
          <CardContent className="p-6 pt-4 space-y-4">
            {templateUsageData.map((tpl, i) => (
              <div key={i} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-foreground">{tpl.name}</span>
                  <span className="text-muted-foreground font-mono">{tpl.extractions.toLocaleString()} extractions</span>
                </div>
                <div className="h-2 w-full rounded-full bg-muted/60 overflow-hidden">
                  <div 
                    className="h-full rounded-full bg-primary transition-all duration-500" 
                    style={{ width: `${tpl.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Row 3: AI USAGE Breakdown */}
      <Card>
        <CardHeader className="p-6 pb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <div className="flex items-center gap-2">
              <Bot className="h-5 w-5 text-primary" />
              <CardTitle className="text-base font-semibold">AI USAGE</CardTitle>
            </div>
            <CardDescription className="mt-1">
              Groq LPU inference workload distribution across extraction modules
            </CardDescription>
          </div>
          <Badge variant="success" className="self-start sm:self-auto gap-1 text-xs">
            <Zap className="h-3 w-3" />
            <span>Groq Llama-3 Active • 310ms latency</span>
          </Badge>
        </CardHeader>
        <CardContent className="p-6 pt-3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {aiUsageBreakdown.map((item, idx) => (
              <div key={idx} className="p-4 rounded-2xl border border-border/70 bg-card/60 space-y-2.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-sm text-foreground">{item.name}</span>
                  </div>
                  <span className="text-xs font-semibold text-foreground bg-muted px-2 py-0.5 rounded-md">
                    {item.percentage}%
                  </span>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {item.description}
                </p>
                <div className="space-y-1">
                  <div className="h-2.5 w-full rounded-full bg-muted/60 overflow-hidden">
                    <div 
                      className={`h-full rounded-full ${item.color} transition-all duration-500`}
                      style={{ width: `${item.percentage}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-[11px] text-muted-foreground pt-0.5">
                    <span>Processed Volume</span>
                    <span className="font-medium text-foreground">{item.count}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Row 4: Recent Transactions & Recent Users */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Transactions */}
        <Card>
          <CardHeader className="p-6 pb-3 flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-base font-semibold">RECENT TRANSACTIONS</CardTitle>
              <CardDescription>Latest customer billing events</CardDescription>
            </div>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent className="p-0 sm:p-6 pt-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>User</TableHead>
                    <TableHead>Plan</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead className="text-right">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentTransactions.map((tx, idx) => (
                    <TableRow key={idx}>
                      <TableCell>
                        <div className="font-medium text-foreground text-xs">{tx.user}</div>
                        <div className="text-[11px] text-muted-foreground truncate max-w-[120px]">{tx.email}</div>
                      </TableCell>
                      <TableCell className="text-xs">{tx.plan}</TableCell>
                      <TableCell className="font-bold text-xs text-foreground">{tx.amount}</TableCell>
                      <TableCell className="text-right">
                        <Badge 
                          variant={tx.status === 'COMPLETED' ? 'success' : 'warning'} 
                          className="text-[10px]"
                        >
                          {tx.status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {/* Recent Users */}
        <Card>
          <CardHeader className="p-6 pb-3 flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-base font-semibold">RECENT USERS</CardTitle>
              <CardDescription>New registered Users & team members</CardDescription>
            </div>
            <UserCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent className="p-0 sm:p-6 pt-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Plan</TableHead>
                    <TableHead className="text-right">Joined</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentUsers.map((u, idx) => (
                    <TableRow key={idx}>
                      <TableCell>
                        <div className="flex items-center gap-2.5">
                          <Avatar className="h-7 w-7 border border-primary/20 shrink-0">
                            <AvatarFallback className="bg-primary/10 text-primary font-bold text-[10px]">
                              {u.initials}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium text-foreground text-xs">{u.name}</div>
                            <div className="text-[11px] text-muted-foreground truncate max-w-[120px]">{u.email}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary" className="text-[10px]">
                          {u.plan}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right text-xs text-muted-foreground whitespace-nowrap">
                        {u.joined}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DashboardPage;
