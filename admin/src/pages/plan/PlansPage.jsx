import React, { useState } from 'react';
import { 
  Sparkles, 
  Check, 
  Plus, 
  FileText, 
  Bot, 
  Mail, 
  ShieldCheck, 
  Zap,
  CheckCircle2,
  Edit2,
  Save,
  Layers,
  Trash2,
  Coins
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import Modal from '@/components/ui/Modal';
import toast from 'react-hot-toast';

const initialPlans = [
  {
    id: 'free',
    code: 'FREE',
    name: 'Free Starter',
    price: 0,
    interval: '/month',
    billing_interval: 'MONTHLY',
    currency: 'INR',
    description: 'Essential AI resume tools for individual job seekers getting started.',
    popular: false,
    activeSubscribers: 1240,
    resume_limit: 1,
    ai_analyses_limit: 3,
    cover_letters_limit: 1,
    features: [
      '1 ATS Resume Builder Export',
      '3 AI Diagnostic Scans/mo',
      '1 AI Cover Letter Generation',
      'Standard ATS Layout Templates',
      'Community Support'
    ]
  },
  {
    id: 'basic',
    code: 'BASIC',
    name: 'Basic Tier',
    price: 99,
    interval: '/month',
    billing_interval: 'MONTHLY',
    currency: 'INR',
    description: 'Great for active job seekers needing frequent optimizations & cover letters.',
    popular: false,
    activeSubscribers: 420,
    resume_limit: 5,
    ai_analyses_limit: 20,
    cover_letters_limit: 10,
    features: [
      '5 ATS Resume Builder Exports',
      '20 AI Diagnostic & Keyword Scans/mo',
      '10 Tailored Cover Letters',
      'Standard & Clean Tech Templates',
      'Fast AI Processing',
      'Email Support (48h SLA)'
    ]
  },
  {
    id: 'pro',
    code: 'PRO',
    name: 'Professional Tier',
    price: 199,
    interval: '/month',
    billing_interval: 'MONTHLY',
    currency: 'INR',
    description: 'Designed for professionals targeting top roles with AI mock interview prep.',
    popular: true,
    activeSubscribers: 890,
    resume_limit: 15,
    ai_analyses_limit: 50,
    cover_letters_limit: 25,
    features: [
      '15 Resume Builds & PDF Exports',
      '50 Deep AI Semantic Scans & Fixes',
      '25 Tailored Cover Letters',
      'AI Mock Interview & Evaluation Coach',
      'All Pro & Executive Templates',
      'Priority Support (24h SLA)'
    ]
  },
  {
    id: 'premium',
    code: 'PREMIUM',
    name: 'Premium Enterprise',
    price: 399,
    interval: '/month',
    billing_interval: 'MONTHLY',
    currency: 'INR',
    description: 'Unlimited AI capabilities, career intelligence, and personal coaching.',
    popular: false,
    activeSubscribers: 165,
    resume_limit: 50,
    ai_analyses_limit: 200,
    cover_letters_limit: 100,
    features: [
      '50 Resume Builds & Unlimited Revisions',
      '200 AI Analyses & JD Match Scans',
      '100 Custom Cover Letters',
      'Unlimited Mock Interview Sessions',
      'All Resume Templates + Custom Branding',
      'Dedicated Account Support'
    ]
  }
];

export default function PlansPage() {
  const [plans, setPlans] = useState(initialPlans);
  const [editPlan, setEditPlan] = useState(null);
  const [isNewPlanModal, setIsNewPlanModal] = useState(false);
  
  const [formData, setFormData] = useState({
    code: '',
    name: '',
    price: 199,
    currency: 'INR',
    billing_interval: 'MONTHLY',
    resume_limit: 10,
    ai_analyses_limit: 50,
    cover_letters_limit: 20,
    description: '',
  });

  const handleOpenEdit = (plan) => {
    setEditPlan(plan);
    setFormData({
      code: plan.code,
      name: plan.name,
      price: plan.price,
      currency: plan.currency || 'INR',
      billing_interval: plan.billing_interval || 'MONTHLY',
      resume_limit: plan.resume_limit || 1,
      ai_analyses_limit: plan.ai_analyses_limit || 5,
      cover_letters_limit: plan.cover_letters_limit || 2,
      description: plan.description || '',
    });
  };

  const handleSaveEdit = (e) => {
    e.preventDefault();
    if (!editPlan) return;
    setPlans(prev => prev.map(p => {
      if (p.id === editPlan.id) {
        return {
          ...p,
          name: formData.name,
          price: parseFloat(formData.price),
          currency: formData.currency,
          billing_interval: formData.billing_interval,
          resume_limit: parseInt(formData.resume_limit, 10),
          ai_analyses_limit: parseInt(formData.ai_analyses_limit, 10),
          cover_letters_limit: parseInt(formData.cover_letters_limit, 10),
          description: formData.description,
        };
      }
      return p;
    }));
    toast.success('Plan settings updated successfully!');
    setEditPlan(null);
  };

  const handleCreateNew = (e) => {
    e.preventDefault();
    const newPlan = {
      id: formData.code.toLowerCase().replace(/\s+/g, '-'),
      code: formData.code.toUpperCase().replace(/\s+/g, '_'),
      name: formData.name,
      price: parseFloat(formData.price),
      currency: formData.currency,
      interval: `/${formData.billing_interval.toLowerCase() === 'yearly' ? 'year' : 'month'}`,
      billing_interval: formData.billing_interval,
      description: formData.description || 'Custom configured pricing tier.',
      popular: false,
      activeSubscribers: 0,
      resume_limit: parseInt(formData.resume_limit, 10),
      ai_analyses_limit: parseInt(formData.ai_analyses_limit, 10),
      cover_letters_limit: parseInt(formData.cover_letters_limit, 10),
      features: [
        `${formData.resume_limit} Resume Builds/mo`,
        `${formData.ai_analyses_limit} AI Analyses/mo`,
        `${formData.cover_letters_limit} Tailored Cover Letters`,
        'ATS Diagnostic Engine',
        'Standard Email Support'
      ]
    };

    setPlans(prev => [...prev, newPlan]);
    toast.success('New pricing tier created!');
    setIsNewPlanModal(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20 text-[11px] font-bold mb-1.5">
            <Layers className="h-3.5 w-3.5" />
            <span>Pricing Architecture</span>
          </div>
          <h1 className="font-heading text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
            Subscription Plans
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
            Configure pricing tiers, subscriber quotas, and feature entitlements.
          </p>
        </div>
        <Button 
          onClick={() => {
            setFormData({
              code: '',
              name: '',
              price: 199,
              currency: 'INR',
              billing_interval: 'MONTHLY',
              resume_limit: 10,
              ai_analyses_limit: 50,
              cover_letters_limit: 20,
              description: '',
            });
            setIsNewPlanModal(true);
          }}
          className="gap-2 self-start sm:self-auto rounded-xl shadow-xs"
        >
          <Plus className="h-4 w-4" />
          <span>New Pricing Tier</span>
        </Button>
      </div>

      {/* Plans Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {plans.map((plan) => {
          const isPro = plan.popular;
          return (
            <Card 
              key={plan.id} 
              className={`flex flex-col justify-between relative rounded-3xl border transition-all duration-200 bg-card/90 backdrop-blur-xl ${
                isPro 
                  ? 'border-indigo-500/40 shadow-xl ring-2 ring-indigo-500/20' 
                  : 'border-border/80 shadow-md hover:shadow-lg'
              }`}
            >
              {isPro && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <Badge variant="default" className="bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-bold text-[10px] px-2.5 py-0.5 shadow-md">
                    <Sparkles className="h-3 w-3 mr-1" /> Most Popular
                  </Badge>
                </div>
              )}

              <CardHeader className="p-6 pb-4">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="flex items-center gap-2">
                      <CardTitle className="text-lg font-bold">{plan.name}</CardTitle>
                      <Badge variant="outline" className="text-[10px] uppercase font-bold px-1.5 py-0 bg-muted/60">
                        {plan.code}
                      </Badge>
                    </div>
                    <span className="text-xs text-muted-foreground mt-1 block">
                      {plan.activeSubscribers} Active Subscribers
                    </span>
                  </div>
                </div>

                <div className="mt-4 flex items-baseline gap-1">
                  <span className="font-heading text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
                    {plan.currency === 'INR' ? '₹' : '$'}{plan.price}
                  </span>
                  <span className="text-xs text-muted-foreground font-medium">
                    /{plan.billing_interval?.toLowerCase() === 'yearly' ? 'yr' : 'mo'}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground mt-2 leading-relaxed min-h-[36px]">
                  {plan.description}
                </p>
              </CardHeader>

              <CardContent className="p-6 pt-2 flex-grow space-y-4">
                <div className="space-y-2 pt-3 border-t border-border/60">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground block">
                    Usage Quotas
                  </span>
                  
                  <div className="flex items-center justify-between text-xs py-1 px-2.5 rounded-lg bg-muted/40">
                    <span className="text-muted-foreground flex items-center gap-1.5">
                      <FileText className="h-3.5 w-3.5 text-primary" /> Resume Builds
                    </span>
                    <span className="font-bold text-foreground">{plan.resume_limit}</span>
                  </div>

                  <div className="flex items-center justify-between text-xs py-1 px-2.5 rounded-lg bg-muted/40">
                    <span className="text-muted-foreground flex items-center gap-1.5">
                      <Bot className="h-3.5 w-3.5 text-indigo-500" /> AI Analyses
                    </span>
                    <span className="font-bold text-foreground">{plan.ai_analyses_limit}</span>
                  </div>

                  <div className="flex items-center justify-between text-xs py-1 px-2.5 rounded-lg bg-muted/40">
                    <span className="text-muted-foreground flex items-center gap-1.5">
                      <Mail className="h-3.5 w-3.5 text-violet-500" /> Cover Letters
                    </span>
                    <span className="font-bold text-foreground">{plan.cover_letters_limit}</span>
                  </div>
                </div>

                <div className="pt-2 border-t border-border/60 space-y-1.5">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground block">
                    Included Features
                  </span>
                  {plan.features.map((feat, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-xs text-muted-foreground">
                      <Check className="h-3.5 w-3.5 text-primary shrink-0 mt-0.5" />
                      <span className="leading-tight">{feat}</span>
                    </div>
                  ))}
                </div>
              </CardContent>

              <CardFooter className="p-6 pt-0">
                <Button 
                  onClick={() => handleOpenEdit(plan)}
                  variant={isPro ? 'default' : 'outline'} 
                  className="w-full rounded-xl text-xs font-semibold gap-2"
                >
                  <Edit2 className="h-3.5 w-3.5" />
                  <span>Edit Plan Settings</span>
                </Button>
              </CardFooter>
            </Card>
          );
        })}
      </div>

      {/* Edit Plan Modal */}
      <Modal isOpen={!!editPlan} onClose={() => setEditPlan(null)} title={`Edit Plan: ${editPlan?.name}`} size="lg">
        <form onSubmit={handleSaveEdit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Plan Name</label>
              <Input
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
                className="h-10 rounded-xl"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Price (INR / USD)</label>
              <Input
                type="number"
                step="0.01"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                required
                className="h-10 rounded-xl"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Resume Builds Limit</label>
              <Input
                type="number"
                value={formData.resume_limit}
                onChange={(e) => setFormData({ ...formData, resume_limit: e.target.value })}
                required
                className="h-10 rounded-xl"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">AI Analyses Limit</label>
              <Input
                type="number"
                value={formData.ai_analyses_limit}
                onChange={(e) => setFormData({ ...formData, ai_analyses_limit: e.target.value })}
                required
                className="h-10 rounded-xl"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Cover Letters Limit</label>
              <Input
                type="number"
                value={formData.cover_letters_limit}
                onChange={(e) => setFormData({ ...formData, cover_letters_limit: e.target.value })}
                required
                className="h-10 rounded-xl"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Billing Interval</label>
              <select
                value={formData.billing_interval}
                onChange={(e) => setFormData({ ...formData, billing_interval: e.target.value })}
                className="w-full h-10 px-3 rounded-xl border border-border bg-background text-xs font-medium focus:ring-2 focus:ring-primary"
              >
                <option value="MONTHLY">Monthly</option>
                <option value="YEARLY">Yearly</option>
                <option value="ONE_TIME">One Time</option>
              </select>
            </div>

            <div className="sm:col-span-2 space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Short Description</label>
              <Input
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Description of the plan target audience"
                className="h-10 rounded-xl"
              />
            </div>
          </div>

          <div className="pt-4 flex justify-end gap-2 border-t border-border/60">
            <Button type="button" variant="ghost" onClick={() => setEditPlan(null)} className="rounded-xl">
              Cancel
            </Button>
            <Button type="submit" className="rounded-xl gap-2">
              <Save className="h-4 w-4" />
              <span>Save Changes</span>
            </Button>
          </div>
        </form>
      </Modal>

      {/* New Plan Modal */}
      <Modal isOpen={isNewPlanModal} onClose={() => setIsNewPlanModal(false)} title="Create New Pricing Tier" size="lg">
        <form onSubmit={handleCreateNew} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Plan Code (Unique)</label>
              <Input
                placeholder="e.g. ENTERPRISE"
                value={formData.code}
                onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                required
                className="h-10 rounded-xl uppercase"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Plan Display Name</label>
              <Input
                placeholder="e.g. Enterprise Tier"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
                className="h-10 rounded-xl"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Price (INR)</label>
              <Input
                type="number"
                step="0.01"
                placeholder="299"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                required
                className="h-10 rounded-xl"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Billing Interval</label>
              <select
                value={formData.billing_interval}
                onChange={(e) => setFormData({ ...formData, billing_interval: e.target.value })}
                className="w-full h-10 px-3 rounded-xl border border-border bg-background text-xs font-medium focus:ring-2 focus:ring-primary"
              >
                <option value="MONTHLY">Monthly</option>
                <option value="YEARLY">Yearly</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Resume Builds Limit</label>
              <Input
                type="number"
                value={formData.resume_limit}
                onChange={(e) => setFormData({ ...formData, resume_limit: e.target.value })}
                required
                className="h-10 rounded-xl"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">AI Analyses Limit</label>
              <Input
                type="number"
                value={formData.ai_analyses_limit}
                onChange={(e) => setFormData({ ...formData, ai_analyses_limit: e.target.value })}
                required
                className="h-10 rounded-xl"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Cover Letters Limit</label>
              <Input
                type="number"
                value={formData.cover_letters_limit}
                onChange={(e) => setFormData({ ...formData, cover_letters_limit: e.target.value })}
                required
                className="h-10 rounded-xl"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Short Description</label>
              <Input
                placeholder="e.g. For large teams"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="h-10 rounded-xl"
              />
            </div>
          </div>

          <div className="pt-4 flex justify-end gap-2 border-t border-border/60">
            <Button type="button" variant="ghost" onClick={() => setIsNewPlanModal(false)} className="rounded-xl">
              Cancel
            </Button>
            <Button type="submit" className="rounded-xl gap-2">
              <Plus className="h-4 w-4" />
              <span>Create Plan</span>
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
