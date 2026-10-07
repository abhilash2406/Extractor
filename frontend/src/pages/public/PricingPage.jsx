import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Check, 
  Sparkles, 
  Zap, 
  ShieldCheck, 
  HelpCircle, 
  ArrowRight,
  Bot,
  Layers,
  Award
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

const pricingPlans = [
  {
    name: "Free Forever",
    priceMonthly: "₹0",
    priceAnnual: "₹0",
    period: "forever",
    description: "Essential tools to create a professional, ATS-optimized resume.",
    features: [
      "Full Interactive Resume Builder",
      "Standard PDF & Print Export",
      "Basic ATS Keyword Matcher",
      "1 Saved Resume in Dashboard",
      "Access to 4 Standard Templates",
      "Community Support"
    ],
    popular: false,
    cta: "Start Building Free",
    ctaLink: "/builder"
  },
  {
    name: "Starter Pro",
    priceMonthly: "₹499",
    priceAnnual: "₹399",
    period: "per month",
    description: "Designed for active job seekers targeting competitive tech roles.",
    features: [
      "Everything in Free Tier",
      "Groq LPU Sub-Second Resume Diagnostics",
      "Unlimited ATS Job Match Scans",
      "AI Bullet Point Metric Enhancer",
      "All Premium Resume Templates",
      "Unlimited Unbranded PDF & DOCX Exports",
      "AI Cover Letter Generator",
      "Priority Email Support"
    ],
    popular: true,
    cta: "Start Starter Pro",
    ctaLink: "/register"
  },
  {
    name: "Executive Scale",
    priceMonthly: "₹1,499",
    priceAnnual: "₹1,199",
    period: "per month",
    description: "For high-level leaders, career consultants, and executive candidates.",
    features: [
      "Everything in Starter Pro",
      "1-on-1 AI Interview Prep Simulations",
      "Executive Multi-Page Dossier Templates",
      "Automated LinkedIn Profile Optimizer",
      "Unlimited Cloud Resume Variations",
      "Dedicated Career Advisory Support"
    ],
    popular: false,
    cta: "Upgrade to Executive",
    ctaLink: "/register"
  }
];

const faqs = [
  {
    q: "Will these resumes pass modern ATS software like Workday and Greenhouse?",
    a: "Yes! Every single template and exported document adheres to strict ATS guidelines: single/clean dual column hierarchies, standard section headers, universal fonts, and zero unsupported graphical elements."
  },
  {
    q: "Can I try the Resume Builder and Analyzer without creating an account?",
    a: "Absolutely. You can customize your resume, test the AI keyword checker, and preview live templates without logging in. You only need to create a free account when saving your resume permanently."
  },
  {
    q: "How does the AI Resume Analyzer calculate the ATS score?",
    a: "Our engine uses sub-second Groq LPU inference to extract skills, calculate keyword density, inspect quantifiable metrics in work history bullets, and compare your text against hundreds of high-ranking recruiter schemas."
  },
  {
    q: "Can I cancel my subscription anytime?",
    a: "Yes, you can manage or cancel your subscription at any time directly from your account settings with zero cancellation fees."
  }
];

export default function PricingPage() {
  const [annual, setAnnual] = useState(true);

  return (
    <div className="min-h-screen bg-background text-foreground py-10 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-4 py-1.5 text-xs font-semibold text-indigo-600 dark:text-indigo-400 backdrop-blur-md shadow-xs">
            <Zap className="h-4 w-4 text-indigo-500" />
            <span>Simple, Transparent Career Investment</span>
          </div>
          <h1 className="font-heading text-3xl sm:text-5xl font-extrabold tracking-tight text-foreground leading-[1.15]">
            Land Interviews Faster with <span className="bg-gradient-to-r from-indigo-500 via-purple-500 to-violet-500 bg-clip-text text-transparent">AI-Powered Resumes</span>
          </h1>
          <p className="text-base text-muted-foreground leading-relaxed">
            Choose the plan that fits your job search. No hidden fees, cancel anytime.
          </p>

          {/* Billing Switcher */}
          <div className="flex items-center justify-center gap-3 pt-2">
            <span className={`text-xs font-semibold ${!annual ? 'text-foreground' : 'text-muted-foreground'}`}>
              Monthly Billing
            </span>
            <button
              onClick={() => setAnnual(!annual)}
              className="relative inline-flex h-6 w-12 items-center rounded-full bg-primary/20 border border-primary/30 p-1 transition-colors"
            >
              <span className={`inline-block h-4 w-4 transform rounded-full bg-primary transition-transform ${annual ? 'translate-x-6' : 'translate-x-0'}`} />
            </button>
            <span className={`text-xs font-semibold flex items-center gap-1.5 ${annual ? 'text-foreground' : 'text-muted-foreground'}`}>
              Annual Billing
              <Badge variant="secondary" className="text-[10px] bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 font-bold">
                Save 20%
              </Badge>
            </span>
          </div>
        </div>

        {/* Pricing Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
          {pricingPlans.map((plan) => (
            <Card 
              key={plan.name}
              className={`rounded-3xl border transition-all duration-300 relative flex flex-col justify-between ${
                plan.popular 
                  ? 'border-primary ring-2 ring-primary/20 shadow-2xl bg-card' 
                  : 'border-border/80 bg-card/60 shadow-md'
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                  <Badge variant="default" className="bg-gradient-to-r from-indigo-600 via-purple-600 to-violet-600 text-white font-bold text-xs shadow-md shadow-indigo-500/25 px-3 py-1">
                    <Sparkles className="h-3 w-3 mr-1" /> Most Popular
                  </Badge>
                </div>
              )}

              <CardHeader className="p-6 sm:p-8 pb-4">
                <CardTitle className="text-xl font-bold">{plan.name}</CardTitle>
                <CardDescription className="text-xs leading-relaxed mt-1">{plan.description}</CardDescription>
                
                <div className="pt-4 flex items-baseline gap-1">
                  <span className="font-heading text-4xl font-extrabold text-foreground">
                    {annual ? plan.priceAnnual : plan.priceMonthly}
                  </span>
                  <span className="text-xs text-muted-foreground font-semibold">/{plan.period}</span>
                </div>
              </CardHeader>

              <CardContent className="p-6 sm:p-8 pt-0 flex-1 flex flex-col justify-between space-y-6">
                <div className="space-y-3 pt-4 border-t border-border/60">
                  <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">What's Included:</span>
                  <ul className="space-y-2.5 text-xs">
                    {plan.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-2.5">
                        <Check className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                        <span className="text-foreground leading-relaxed">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <Button 
                  asChild
                  variant={plan.popular ? "gradient" : "outline"}
                  className="w-full h-11 rounded-xl text-xs font-bold gap-2 shadow-sm"
                >
                  <Link to={plan.ctaLink}>
                    <span>{plan.cta}</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* FAQs */}
        <div className="max-w-3xl mx-auto pt-10 space-y-6">
          <div className="text-center space-y-2">
            <h2 className="font-heading text-2xl font-bold text-foreground">Frequently Asked Questions</h2>
            <p className="text-xs text-muted-foreground">Everything you need to know about our resume platform</p>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, i) => (
              <Card key={i} className="border-border/80 bg-card/60 p-5 rounded-2xl shadow-xs">
                <h4 className="font-bold text-sm text-foreground mb-1.5 flex items-center gap-2">
                  <HelpCircle className="h-4 w-4 text-primary shrink-0" />
                  {faq.q}
                </h4>
                <p className="text-xs text-muted-foreground leading-relaxed pl-6">
                  {faq.a}
                </p>
              </Card>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
