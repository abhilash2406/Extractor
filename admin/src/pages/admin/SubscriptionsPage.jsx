import React, { useState } from 'react';
import { 
  Coins, 
  Check, 
  Plus, 
  Sparkles, 
  Users, 
  ShieldCheck, 
  Zap,
  CheckCircle2
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const subscriptionPlans = [
  {
    id: 'starter',
    name: 'Starter Tier',
    price: '$49',
    interval: '/month',
    description: 'Perfect for small teams and individual recruiters getting started with document extraction.',
    popular: false,
    activeSubscribers: 142,
    features: [
      '500 Resume & Document Extractions/mo',
      'Standard AI Parser Engine',
      'Basic Custom Field Schema',
      'Email Support (24h SLA)',
      '1 Admin Seat'
    ]
  },
  {
    id: 'pro',
    name: 'Professional Tier',
    price: '$149',
    interval: '/month',
    description: 'Designed for fast-growing recruitment agencies and HR tech platforms.',
    popular: true,
    activeSubscribers: 389,
    features: [
      '3,500 Extractions/mo with Groq AI',
      'Advanced Semantic Matching & Scoring',
      'Custom OCR & Multi-language Support',
      'Priority Webhooks & API Integration',
      '5 Team Admin Seats',
      'Dedicated Account Manager'
    ]
  },
  {
    id: 'enterprise',
    name: 'Enterprise Tier',
    price: '$499',
    interval: '/month',
    description: 'For large organizations needing unlimited extraction scale and custom LLM tuning.',
    popular: false,
    activeSubscribers: 64,
    features: [
      'Unlimited Extractions & Batch Processing',
      'Custom Fine-Tuned AI Models',
      'Dedicated Cloud Storage & SLA Guarantee',
      'SSO, Audit Logs & Enterprise Security',
      'Unlimited Seats & Roles'
    ]
  }
];

const SubscriptionsPage = () => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-heading text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
            Subscription Plans
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Configure pricing tiers, subscriber quotas, and feature entitlements.
          </p>
        </div>
        <Button className="gap-2 self-start sm:self-auto">
          <Plus className="h-4 w-4" />
          <span>New Pricing Tier</span>
        </Button>
      </div>

      {/* Plans Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {subscriptionPlans.map((plan) => (
          <Card 
            key={plan.id} 
            className={`flex flex-col justify-between relative transition-all duration-200 ${
              plan.popular 
                ? 'border-primary shadow-lg ring-2 ring-primary/20 shadow-blue-500/10' 
                : 'hover:shadow-md'
            }`}
          >
            {plan.popular && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                <Badge variant="default" className="bg-primary text-primary-foreground font-semibold shadow-xs">
                  <Sparkles className="h-3 w-3 mr-1" /> Most Popular
                </Badge>
              </div>
            )}

            <CardHeader className="p-6 pb-4">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg font-bold">{plan.name}</CardTitle>
                  <span className="text-xs text-muted-foreground mt-0.5 block">{plan.activeSubscribers} Active Subscribers</span>
                </div>
              </div>

              <div className="mt-4 flex items-baseline gap-1">
                <span className="font-heading text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">{plan.price}</span>
                <span className="text-xs text-muted-foreground font-medium">{plan.interval}</span>
              </div>
              <p className="text-xs text-muted-foreground mt-2 leading-relaxed">{plan.description}</p>
            </CardHeader>

            <CardContent className="p-6 pt-2 flex-grow">
              <div className="space-y-2.5 pt-4 border-t border-border/60">
                <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground block mb-2">Included Features</span>
                {plan.features.map((feat, idx) => (
                  <div key={idx} className="flex items-start gap-2.5 text-xs text-foreground">
                    <Check className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                    <span>{feat}</span>
                  </div>
                ))}
              </div>
            </CardContent>

            <CardFooter className="p-6 pt-0">
              <Button 
                variant={plan.popular ? 'default' : 'outline'} 
                className="w-full rounded-xl"
              >
                Edit Plan Settings
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default SubscriptionsPage;
