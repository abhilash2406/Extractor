import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Coins, 
  Sparkles, 
  Eye, 
  User, 
  CreditCard, 
  Calendar, 
  CheckCircle2, 
  XCircle, 
  AlertCircle, 
  Clock, 
  Filter, 
  ChevronDown, 
  ArrowUpDown,
  Download,
  ShieldCheck,
  Check,
  Zap,
  Layers,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from '@/components/ui/dropdown-menu';
import Modal from '@/components/ui/Modal';
import moment from 'moment';
import toast from 'react-hot-toast';

// Rich Mock data including Free users without payment, Pro, Basic, and Canceled users
const initialSubscriptions = [
  {
    id: 'sub-001',
    user: {
      id: 'u-101',
      name: 'User One',
      email: 'user@example.com',
      username: 'user_one',
      role: 'USER',
      status: 'ACTIVE',
      created_at: '2026-08-15T10:00:00.000Z',
      last_login_at: '2026-10-09T08:30:00.000Z',
    },
    plan: {
      code: 'FREE',
      name: 'Free',
      price: 0,
      currency: 'INR',
      billing_interval: 'NO_EXPIRY',
      resume_limit: 1,
      ai_analyses_limit: 3,
      cover_letters_limit: 1,
    },
    status: 'ACTIVE',
    billing_period: 'No expiry',
    starts_at: '2026-08-15T10:00:00.000Z',
    current_period_start: null,
    current_period_end: null,
    cancel_at_period_end: false,
    canceled_at: null,
    gateway: null,
    gateway_subscription_id: null,
    payments: [],
  },
  {
    id: 'sub-002',
    user: {
      id: 'u-102',
      name: 'Alex Morgan',
      email: 'user2@example.com',
      username: 'alex_pro',
      role: 'USER',
      status: 'ACTIVE',
      created_at: '2026-09-01T14:20:00.000Z',
      last_login_at: '2026-10-09T09:15:00.000Z',
    },
    plan: {
      code: 'PRO',
      name: 'Pro',
      price: 199,
      currency: 'INR',
      billing_interval: 'MONTHLY',
      resume_limit: 15,
      ai_analyses_limit: 50,
      cover_letters_limit: 25,
    },
    status: 'ACTIVE',
    billing_period: 'Monthly',
    starts_at: '2026-09-01T14:20:00.000Z',
    current_period_start: '2026-10-01T00:00:00.000Z',
    current_period_end: '2026-11-01T00:00:00.000Z',
    cancel_at_period_end: false,
    canceled_at: null,
    gateway: 'RAZORPAY',
    gateway_subscription_id: 'sub_rzp_84719284',
    payments: [
      { id: 'pay-201', amount: 199, status: 'SUCCESS', date: '2026-10-01T00:05:00.000Z', method: 'UPI' },
      { id: 'pay-101', amount: 199, status: 'SUCCESS', date: '2026-09-01T14:20:00.000Z', method: 'Card' }
    ],
  },
  {
    id: 'sub-003',
    user: {
      id: 'u-103',
      name: 'Sarah Connor',
      email: 'user3@example.com',
      username: 'sarah_c',
      role: 'USER',
      status: 'ACTIVE',
      created_at: '2026-07-10T09:00:00.000Z',
      last_login_at: '2026-10-08T17:40:00.000Z',
    },
    plan: {
      code: 'BASIC',
      name: 'Basic',
      price: 99,
      currency: 'INR',
      billing_interval: 'MONTHLY',
      resume_limit: 5,
      ai_analyses_limit: 20,
      cover_letters_limit: 10,
    },
    status: 'CANCELED',
    billing_period: 'Until period end',
    starts_at: '2026-07-10T09:00:00.000Z',
    current_period_start: '2026-09-10T00:00:00.000Z',
    current_period_end: '2026-10-10T00:00:00.000Z',
    cancel_at_period_end: true,
    canceled_at: '2026-10-02T11:20:00.000Z',
    gateway: 'STRIPE',
    gateway_subscription_id: 'sub_str_93819234',
    payments: [
      { id: 'pay-301', amount: 99, status: 'SUCCESS', date: '2026-09-10T00:00:00.000Z', method: 'Card' }
    ],
  },
  {
    id: 'sub-004',
    user: {
      id: 'u-104',
      name: 'Abhi',
      email: 'abhilashkumar66666@gmail.com',
      username: 'Abhi',
      role: 'USER',
      status: 'ACTIVE',
      created_at: '2026-10-01T12:00:00.000Z',
      last_login_at: '2026-10-09T11:45:00.000Z',
    },
    plan: {
      code: 'FREE',
      name: 'Free',
      price: 0,
      currency: 'INR',
      billing_interval: 'NO_EXPIRY',
      resume_limit: 1,
      ai_analyses_limit: 3,
      cover_letters_limit: 1,
    },
    status: 'ACTIVE',
    billing_period: 'No expiry',
    starts_at: '2026-10-01T12:00:00.000Z',
    current_period_start: null,
    current_period_end: null,
    cancel_at_period_end: false,
    canceled_at: null,
    gateway: null,
    gateway_subscription_id: null,
    payments: [],
  },
  {
    id: 'sub-005',
    user: {
      id: 'u-105',
      name: 'Vikram Mehta',
      email: 'vikram.m@enterprise.in',
      username: 'vikram_m',
      role: 'USER',
      status: 'ACTIVE',
      created_at: '2026-06-20T11:00:00.000Z',
      last_login_at: '2026-10-09T10:00:00.000Z',
    },
    plan: {
      code: 'PREMIUM',
      name: 'Premium',
      price: 399,
      currency: 'INR',
      billing_interval: 'MONTHLY',
      resume_limit: 50,
      ai_analyses_limit: 200,
      cover_letters_limit: 100,
    },
    status: 'ACTIVE',
    billing_period: 'Monthly',
    starts_at: '2026-06-20T11:00:00.000Z',
    current_period_start: '2026-09-20T00:00:00.000Z',
    current_period_end: '2026-10-20T00:00:00.000Z',
    cancel_at_period_end: false,
    canceled_at: null,
    gateway: 'RAZORPAY',
    gateway_subscription_id: 'sub_rzp_99283711',
    payments: [
      { id: 'pay-501', amount: 399, status: 'SUCCESS', date: '2026-09-20T00:00:00.000Z', method: 'UPI' }
    ],
  },
  {
    id: 'sub-006',
    user: {
      id: 'u-106',
      name: 'Elena Gilbert',
      email: 'elena.g@mystic.com',
      username: 'elena_g',
      role: 'USER',
      status: 'ACTIVE',
      created_at: '2026-08-01T15:30:00.000Z',
      last_login_at: '2026-10-05T14:10:00.000Z',
    },
    plan: {
      code: 'PRO',
      name: 'Pro',
      price: 199,
      currency: 'INR',
      billing_interval: 'MONTHLY',
      resume_limit: 15,
      ai_analyses_limit: 50,
      cover_letters_limit: 25,
    },
    status: 'PAST_DUE',
    billing_period: 'Monthly',
    starts_at: '2026-08-01T15:30:00.000Z',
    current_period_start: '2026-09-01T00:00:00.000Z',
    current_period_end: '2026-10-01T00:00:00.000Z',
    cancel_at_period_end: false,
    canceled_at: null,
    gateway: 'STRIPE',
    gateway_subscription_id: 'sub_str_11827364',
    payments: [
      { id: 'pay-601', amount: 199, status: 'FAILED', date: '2026-10-01T00:00:00.000Z', method: 'Card' }
    ],
  },
  {
    id: 'sub-007',
    user: {
      id: 'u-107',
      name: 'David Miller',
      email: 'david.m@devs.net',
      username: 'david_m',
      role: 'USER',
      status: 'ACTIVE',
      created_at: '2026-05-12T10:00:00.000Z',
      last_login_at: '2026-09-30T09:00:00.000Z',
    },
    plan: {
      code: 'BASIC',
      name: 'Basic',
      price: 99,
      currency: 'INR',
      billing_interval: 'MONTHLY',
      resume_limit: 5,
      ai_analyses_limit: 20,
      cover_letters_limit: 10,
    },
    status: 'EXPIRED',
    billing_period: 'Monthly',
    starts_at: '2026-05-12T10:00:00.000Z',
    current_period_start: '2026-08-12T00:00:00.000Z',
    current_period_end: '2026-09-12T00:00:00.000Z',
    cancel_at_period_end: true,
    canceled_at: '2026-09-12T00:00:00.000Z',
    gateway: 'RAZORPAY',
    gateway_subscription_id: 'sub_rzp_44556677',
    payments: [
      { id: 'pay-701', amount: 99, status: 'SUCCESS', date: '2026-08-12T00:00:00.000Z', method: 'UPI' }
    ],
  }
];

export default function SubscriptionsPage() {
  const [subscriptions, setSubscriptions] = useState(initialSubscriptions);
  const [search, setSearch] = useState('');
  const [selectedPlan, setSelectedPlan] = useState('ALL');
  const [selectedStatus, setSelectedStatus] = useState('ALL');
  const [selectedPeriod, setSelectedPeriod] = useState('ALL');
  const [viewSub, setViewSub] = useState(null);
  const [page, setPage] = useState(1);
  const itemsPerPage = 8;

  // Filtered Subscriptions
  const filteredSubscriptions = useMemo(() => {
    return subscriptions.filter((sub) => {
      const matchesSearch = 
        sub.user.email.toLowerCase().includes(search.toLowerCase()) ||
        sub.user.name?.toLowerCase().includes(search.toLowerCase()) ||
        sub.user.username?.toLowerCase().includes(search.toLowerCase());

      const matchesPlan = selectedPlan === 'ALL' || sub.plan.code === selectedPlan;
      const matchesStatus = selectedStatus === 'ALL' || sub.status === selectedStatus;
      const matchesPeriod = selectedPeriod === 'ALL' || sub.billing_period === selectedPeriod;

      return matchesSearch && matchesPlan && matchesStatus && matchesPeriod;
    });
  }, [subscriptions, search, selectedPlan, selectedStatus, selectedPeriod]);

  // Pagination
  const totalPages = Math.ceil(filteredSubscriptions.length / itemsPerPage) || 1;
  const pagedSubscriptions = useMemo(() => {
    const start = (page - 1) * itemsPerPage;
    return filteredSubscriptions.slice(start, start + itemsPerPage);
  }, [filteredSubscriptions, page]);

  const handleStatusChange = (subId, newStatus) => {
    setSubscriptions(prev => prev.map(s => {
      if (s.id === subId) {
        return {
          ...s,
          status: newStatus,
          billing_period: newStatus === 'CANCELED' ? 'Until period end' : s.billing_period,
          cancel_at_period_end: newStatus === 'CANCELED',
          canceled_at: newStatus === 'CANCELED' ? new Date().toISOString() : s.canceled_at,
        };
      }
      return s;
    }));
    toast.success(`Subscription status updated to ${newStatus}`);
    if (viewSub && viewSub.id === subId) {
      setViewSub(prev => ({
        ...prev,
        status: newStatus,
        billing_period: newStatus === 'CANCELED' ? 'Until period end' : prev.billing_period,
      }));
    }
  };

  const getPlanBadge = (code) => {
    switch (code) {
      case 'PREMIUM':
        return <Badge className="bg-gradient-to-r from-amber-500 to-orange-500 text-white font-bold text-[10px] px-2.5 py-0.5 shadow-xs">Premium</Badge>;
      case 'PRO':
        return <Badge className="bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-bold text-[10px] px-2.5 py-0.5 shadow-xs">Pro</Badge>;
      case 'BASIC':
        return <Badge variant="outline" className="bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/30 font-bold text-[10px] px-2.5 py-0.5">Basic</Badge>;
      case 'FREE':
      default:
        return <Badge variant="secondary" className="bg-slate-500/10 text-slate-600 dark:text-slate-300 font-bold text-[10px] px-2 py-0.5 border border-slate-500/20">Free</Badge>;
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'ACTIVE':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 shadow-xs shadow-emerald-500/60" />
            Active
          </span>
        );
      case 'CANCELED':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/30">
            <span className="h-1.5 w-1.5 rounded-full bg-rose-500 shadow-xs shadow-rose-500/60" />
            Canceled
          </span>
        );
      case 'PAST_DUE':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/30">
            <span className="h-1.5 w-1.5 rounded-full bg-amber-500 shadow-xs shadow-amber-500/60" />
            Past Due
          </span>
        );
      case 'EXPIRED':
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-500/10 text-slate-500 dark:text-slate-400 border border-slate-500/30">
            <span className="h-1.5 w-1.5 rounded-full bg-slate-400" />
            Expired
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20 text-[11px] font-bold mb-1.5">
            <Coins className="h-3.5 w-3.5" />
            <span>Customer Subscriptions</span>
          </div>
          <h1 className="font-heading text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
            User Subscriptions
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
            Manage user subscription statuses, renewals, plan tiers, and billing periods.
          </p>
        </div>

        {/* Top Summary Stats */}
        <div className="flex items-center gap-2">
          <div className="px-3.5 py-1.5 rounded-2xl bg-card border border-border/80 text-xs shadow-xs">
            <span className="text-muted-foreground">Total Users: </span>
            <span className="font-bold text-foreground">{subscriptions.length}</span>
          </div>
          <div className="px-3.5 py-1.5 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-xs text-indigo-600 dark:text-indigo-400 font-bold shadow-xs">
            <span>Paid Active: </span>
            <span>{subscriptions.filter(s => s.status === 'ACTIVE' && s.plan.code !== 'FREE').length}</span>
          </div>
        </div>
      </div>

      {/* Filter and Search Card */}
      <Card className="rounded-3xl border-border/80 bg-card/90 backdrop-blur-xl shadow-sm">
        <CardHeader className="p-4 sm:p-5 pb-3">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
            
            {/* Search Input */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by user email, name, or username..."
                className="pl-10 h-10 rounded-xl bg-background/60"
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
              />
            </div>

            {/* Filter Dropdowns */}
            <div className="flex flex-wrap items-center gap-2.5">
              
              {/* Plan Filter */}
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-semibold text-muted-foreground">Plan:</span>
                <select
                  value={selectedPlan}
                  onChange={(e) => {
                    setSelectedPlan(e.target.value);
                    setPage(1);
                  }}
                  className="h-9 px-3 rounded-xl border border-border bg-background text-xs font-semibold focus:ring-2 focus:ring-primary outline-none cursor-pointer"
                >
                  <option value="ALL">All Plans</option>
                  <option value="FREE">Free</option>
                  <option value="BASIC">Basic</option>
                  <option value="PRO">Pro</option>
                  <option value="PREMIUM">Premium</option>
                </select>
              </div>

              {/* Status Filter */}
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-semibold text-muted-foreground">Status:</span>
                <select
                  value={selectedStatus}
                  onChange={(e) => {
                    setSelectedStatus(e.target.value);
                    setPage(1);
                  }}
                  className="h-9 px-3 rounded-xl border border-border bg-background text-xs font-semibold focus:ring-2 focus:ring-primary outline-none cursor-pointer"
                >
                  <option value="ALL">All Statuses</option>
                  <option value="ACTIVE">Active</option>
                  <option value="CANCELED">Canceled</option>
                  <option value="PAST_DUE">Past Due</option>
                  <option value="EXPIRED">Expired</option>
                </select>
              </div>

              {/* Period Filter */}
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-semibold text-muted-foreground">Period:</span>
                <select
                  value={selectedPeriod}
                  onChange={(e) => {
                    setSelectedPeriod(e.target.value);
                    setPage(1);
                  }}
                  className="h-9 px-3 rounded-xl border border-border bg-background text-xs font-semibold focus:ring-2 focus:ring-primary outline-none cursor-pointer"
                >
                  <option value="ALL">All Periods</option>
                  <option value="No expiry">No expiry</option>
                  <option value="Monthly">Monthly</option>
                  <option value="Until period end">Until period end</option>
                </select>
              </div>

            </div>

          </div>
        </CardHeader>

        {/* Table Content */}
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-border/60 hover:bg-transparent">
                  <TableHead className="font-bold text-xs uppercase text-muted-foreground pl-6">User</TableHead>
                  <TableHead className="font-bold text-xs uppercase text-muted-foreground">Plan</TableHead>
                  <TableHead className="font-bold text-xs uppercase text-muted-foreground">Status</TableHead>
                  <TableHead className="font-bold text-xs uppercase text-muted-foreground">Billing period</TableHead>
                  <TableHead className="font-bold text-xs uppercase text-muted-foreground hidden md:table-cell">Member Since</TableHead>
                  <TableHead className="font-bold text-xs uppercase text-muted-foreground text-right pr-6">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {pagedSubscriptions.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-16 text-muted-foreground">
                      <div className="flex flex-col items-center justify-center space-y-2">
                        <Coins className="h-8 w-8 opacity-40 text-muted-foreground" />
                        <p className="text-sm font-semibold">No subscriptions found</p>
                        <p className="text-xs text-muted-foreground">Try adjusting your filters or search keywords.</p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  pagedSubscriptions.map((sub) => (
                    <TableRow key={sub.id} className="border-border/60 hover:bg-muted/40 transition-colors">
                      
                      {/* User Column */}
                      <TableCell className="pl-6 py-3.5">
                        <div className="flex items-center gap-3">
                          <Avatar className="h-9 w-9 ring-2 ring-primary/10">
                            <AvatarFallback className="bg-gradient-to-tr from-indigo-600 to-violet-600 text-white font-bold text-xs">
                              {sub.user.name?.slice(0, 2).toUpperCase() || sub.user.username?.slice(0, 2).toUpperCase() || 'U'}
                            </AvatarFallback>
                          </Avatar>
                          <div className="min-w-0">
                            <div className="font-semibold text-xs sm:text-sm text-foreground truncate flex items-center gap-1.5">
                              <span>{sub.user.name || sub.user.username}</span>
                              {sub.user.status === 'BLOCKED' && (
                                <Badge variant="destructive" className="text-[9px] px-1.5 py-0 uppercase">Blocked</Badge>
                              )}
                            </div>
                            <div className="text-xs text-muted-foreground truncate">{sub.user.email}</div>
                          </div>
                        </div>
                      </TableCell>

                      {/* Plan Column */}
                      <TableCell className="py-3.5">
                        <div className="flex items-center gap-2">
                          {getPlanBadge(sub.plan.code)}
                        </div>
                      </TableCell>

                      {/* Status Column */}
                      <TableCell className="py-3.5">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <button type="button" className="cursor-pointer outline-none group">
                              {getStatusBadge(sub.status)}
                            </button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="start" className="w-36 p-1 rounded-xl bg-card/95 backdrop-blur-xl border border-border shadow-xl">
                            <DropdownMenuItem 
                              onClick={() => handleStatusChange(sub.id, 'ACTIVE')}
                              className="text-xs font-semibold flex items-center justify-between cursor-pointer"
                            >
                              <span>Active</span>
                              {sub.status === 'ACTIVE' && <Check className="h-3.5 w-3.5 text-emerald-500" />}
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              onClick={() => handleStatusChange(sub.id, 'CANCELED')}
                              className="text-xs font-semibold flex items-center justify-between cursor-pointer text-rose-500"
                            >
                              <span>Canceled</span>
                              {sub.status === 'CANCELED' && <Check className="h-3.5 w-3.5 text-rose-500" />}
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              onClick={() => handleStatusChange(sub.id, 'PAST_DUE')}
                              className="text-xs font-semibold flex items-center justify-between cursor-pointer text-amber-500"
                            >
                              <span>Past Due</span>
                              {sub.status === 'PAST_DUE' && <Check className="h-3.5 w-3.5 text-amber-500" />}
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              onClick={() => handleStatusChange(sub.id, 'EXPIRED')}
                              className="text-xs font-semibold flex items-center justify-between cursor-pointer text-muted-foreground"
                            >
                              <span>Expired</span>
                              {sub.status === 'EXPIRED' && <Check className="h-3.5 w-3.5" />}
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>

                      {/* Billing Period Column */}
                      <TableCell className="py-3.5">
                        <div className="flex items-center gap-1.5 text-xs font-medium text-foreground">
                          <Clock className="h-3.5 w-3.5 text-muted-foreground" />
                          <span>{sub.billing_period}</span>
                        </div>
                      </TableCell>

                      {/* Member Since */}
                      <TableCell className="py-3.5 hidden md:table-cell text-xs text-muted-foreground">
                        {moment(sub.starts_at).format('MMM DD, YYYY')}
                      </TableCell>

                      {/* Actions */}
                      <TableCell className="py-3.5 text-right pr-6">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setViewSub(sub)}
                          className="h-8 w-8 rounded-xl text-primary hover:bg-primary/10"
                          title="View Subscription Details"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                      </TableCell>

                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between px-6 py-3.5 border-t border-border/60">
              <span className="text-xs text-muted-foreground">
                Page <span className="font-bold text-foreground">{page}</span> of <span className="font-bold text-foreground">{totalPages}</span>
              </span>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={page <= 1}
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  className="h-8 rounded-xl gap-1 text-xs"
                >
                  <ChevronLeft className="h-3.5 w-3.5" /> Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={page >= totalPages}
                  onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                  className="h-8 rounded-xl gap-1 text-xs"
                >
                  Next <ChevronRight className="h-3.5 w-3.5" />
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Subscription Details Modal */}
      <Modal 
        isOpen={!!viewSub} 
        onClose={() => setViewSub(null)} 
        title="Subscription Profile & Details" 
        size="lg"
      >
        {viewSub && (
          <div className="space-y-6">
            
            {/* Top User & Plan Banner */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-2xl bg-muted/40 border border-border/70 gap-4">
              <div className="flex items-center gap-3.5">
                <Avatar className="h-12 w-12 ring-2 ring-primary/20">
                  <AvatarFallback className="bg-gradient-to-tr from-indigo-600 to-violet-600 text-white font-bold text-sm">
                    {viewSub.user.name?.slice(0, 2).toUpperCase() || 'U'}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-bold text-sm text-foreground">{viewSub.user.name || viewSub.user.username}</h3>
                  <p className="text-xs text-muted-foreground">{viewSub.user.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 self-start sm:self-auto">
                {getPlanBadge(viewSub.plan.code)}
                {getStatusBadge(viewSub.status)}
              </div>
            </div>

            {/* Quota & Plan Entitlement Details */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="p-3.5 rounded-2xl bg-card border border-border/80 space-y-1">
                <span className="text-[11px] font-bold text-muted-foreground uppercase">Resume Limit</span>
                <p className="text-lg font-extrabold text-foreground">{viewSub.plan.resume_limit} Builds</p>
              </div>
              <div className="p-3.5 rounded-2xl bg-card border border-border/80 space-y-1">
                <span className="text-[11px] font-bold text-muted-foreground uppercase">AI Scans Limit</span>
                <p className="text-lg font-extrabold text-foreground">{viewSub.plan.ai_analyses_limit} Analyses</p>
              </div>
              <div className="p-3.5 rounded-2xl bg-card border border-border/80 space-y-1">
                <span className="text-[11px] font-bold text-muted-foreground uppercase">Cover Letters</span>
                <p className="text-lg font-extrabold text-foreground">{viewSub.plan.cover_letters_limit} Letters</p>
              </div>
            </div>

            {/* Period & Gateway Dates */}
            <div className="p-4 rounded-2xl border border-border/80 space-y-3 bg-card">
              <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Lifecycle & Billing Breakdown
              </h4>
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-2.5 rounded-xl bg-muted/40">
                  <span className="text-muted-foreground block mb-0.5">Billing Cadence</span>
                  <span className="font-semibold text-foreground">{viewSub.billing_period}</span>
                </div>
                <div className="p-2.5 rounded-xl bg-muted/40">
                  <span className="text-muted-foreground block mb-0.5">Subscription Started</span>
                  <span className="font-semibold text-foreground">
                    {moment(viewSub.starts_at).format('MMM DD, YYYY')}
                  </span>
                </div>
                <div className="p-2.5 rounded-xl bg-muted/40">
                  <span className="text-muted-foreground block mb-0.5">Current Period Ends</span>
                  <span className="font-semibold text-foreground">
                    {viewSub.current_period_end ? moment(viewSub.current_period_end).format('MMM DD, YYYY') : 'No expiry date'}
                  </span>
                </div>
                <div className="p-2.5 rounded-xl bg-muted/40">
                  <span className="text-muted-foreground block mb-0.5">Payment Gateway</span>
                  <span className="font-semibold text-foreground">{viewSub.gateway || 'Free Tier (Direct)'}</span>
                </div>
              </div>
            </div>

            {/* Payment History */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Payment History
              </h4>
              {viewSub.payments && viewSub.payments.length > 0 ? (
                <div className="space-y-2">
                  {viewSub.payments.map((p) => (
                    <div key={p.id} className="flex items-center justify-between p-3 rounded-xl bg-muted/30 border border-border/60 text-xs">
                      <div className="flex items-center gap-2.5">
                        <CreditCard className="h-4 w-4 text-primary" />
                        <div>
                          <span className="font-bold text-foreground">₹{p.amount} via {p.method}</span>
                          <span className="text-muted-foreground block text-[11px]">{moment(p.date).format('MMM DD, YYYY [at] hh:mm A')}</span>
                        </div>
                      </div>
                      <Badge variant={p.status === 'SUCCESS' ? 'default' : 'destructive'} className="text-[10px] font-bold uppercase">
                        {p.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-4 rounded-xl bg-muted/20 border border-dashed border-border/80 text-center text-xs text-muted-foreground">
                  No payment transactions recorded (Free tier assignment).
                </div>
              )}
            </div>

            <div className="pt-2 flex justify-end">
              <Button onClick={() => setViewSub(null)} className="rounded-xl">
                Close Details
              </Button>
            </div>

          </div>
        )}
      </Modal>

    </div>
  );
}
