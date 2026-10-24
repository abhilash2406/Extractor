import React, { useState } from 'react';
import { 
  CreditCard, 
  Search, 
  Download, 
  ArrowUpRight, 
  ArrowDownLeft, 
  CheckCircle2, 
  Clock, 
  AlertCircle,
  Filter
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

const transactions = [
  {
    id: 'TX-94821',
    user: 'Alex Johnson',
    email: 'alex.j@enterprise.io',
    amount: '$149.00',
    plan: 'Pro Plan (Monthly)',
    date: 'Oct 07, 2026',
    status: 'COMPLETED',
    paymentMethod: 'Visa •••• 4242'
  },
  {
    id: 'TX-94820',
    user: 'Sarah Miller',
    email: 'sarah.m@fintech.co',
    amount: '$499.00',
    plan: 'Enterprise Tier',
    date: 'Oct 06, 2026',
    status: 'COMPLETED',
    paymentMethod: 'Mastercard •••• 8812'
  },
  {
    id: 'TX-94819',
    user: 'Michael Chen',
    email: 'm.chen@startuplab.dev',
    amount: '$49.00',
    plan: 'Starter Plan',
    date: 'Oct 05, 2026',
    status: 'COMPLETED',
    paymentMethod: 'Stripe Pay'
  },
  {
    id: 'TX-94818',
    user: 'Emma Watson',
    email: 'emma@designcraft.org',
    amount: '$149.00',
    plan: 'Pro Plan (Monthly)',
    date: 'Oct 04, 2026',
    status: 'FAILED',
    paymentMethod: 'Visa •••• 1092'
  },
  {
    id: 'TX-94817',
    user: 'David Brown',
    email: 'david@globalrecruitment.com',
    amount: '$499.00',
    plan: 'Enterprise Tier',
    date: 'Oct 03, 2026',
    status: 'COMPLETED',
    paymentMethod: 'Bank Transfer'
  }
];

const TransactionsPage = () => {
  const [search, setSearch] = useState('');

  const filtered = transactions.filter(tx => 
    tx.user.toLowerCase().includes(search.toLowerCase()) ||
    tx.email.toLowerCase().includes(search.toLowerCase()) ||
    tx.id.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-heading text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
            Transactions & Billing
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Monitor payment histories, subscriptions revenue, and customer invoices.
          </p>
        </div>
        <Button variant="outline" className="gap-2 self-start sm:self-auto">
          <Download className="h-4 w-4" />
          <span>Export CSV</span>
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-6">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Total Revenue (MTD)</span>
            <div className="flex items-center justify-between mt-2">
              <span className="text-2xl font-bold font-heading text-foreground">$18,420.00</span>
              <Badge variant="success" className="gap-1 text-[11px]"><ArrowUpRight className="h-3 w-3" /> +14.2%</Badge>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Successful Payments</span>
            <div className="flex items-center justify-between mt-2">
              <span className="text-2xl font-bold font-heading text-foreground">1,248</span>
              <span className="text-xs text-muted-foreground">99.4% rate</span>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Failed Transactions</span>
            <div className="flex items-center justify-between mt-2">
              <span className="text-2xl font-bold font-heading text-foreground">7</span>
              <Badge variant="destructive" className="text-[11px]">Action Req.</Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Table */}
      <Card>
        <CardHeader className="p-4 sm:p-6 pb-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="relative w-full sm:w-72">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by ID, customer..."
                className="pl-9"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0 sm:p-6 pt-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Transaction ID</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Plan</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Payment Method</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead className="text-right">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((tx) => (
                  <TableRow key={tx.id}>
                    <TableCell className="font-mono text-xs font-semibold text-foreground">
                      {tx.id}
                    </TableCell>
                    <TableCell>
                      <div className="font-medium text-foreground">{tx.user}</div>
                      <div className="text-xs text-muted-foreground">{tx.email}</div>
                    </TableCell>
                    <TableCell className="text-xs font-medium">{tx.plan}</TableCell>
                    <TableCell className="font-bold text-foreground">{tx.amount}</TableCell>
                    <TableCell className="text-xs text-muted-foreground">{tx.paymentMethod}</TableCell>
                    <TableCell className="text-xs text-muted-foreground">{tx.date}</TableCell>
                    <TableCell className="text-right">
                      <Badge variant={tx.status === 'COMPLETED' ? 'success' : 'destructive'} className="text-[11px]">
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
    </div>
  );
};

export default TransactionsPage;
