import React, { useState, useEffect } from 'react';
import {
  MessageSquarePlus,
  Star,
  Send,
  Loader2,
  CheckCircle2,
  Bug,
  Sparkles,
  CreditCard,
  LifeBuoy,
  MessageCircle,
} from 'lucide-react';
import toast from 'react-hot-toast';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuthStore } from '@/store/authStore';
import { submitFeedback } from '@/api/feedback.api';
import { cn } from '@/lib/utils';

const CATEGORIES = [
  { id: 'feature_request', label: 'Feature Idea', icon: Sparkles },
  { id: 'bug', label: 'Bug Report', icon: Bug },
  { id: 'general', label: 'General', icon: MessageCircle },
  { id: 'support', label: 'Support', icon: LifeBuoy },
  { id: 'pricing', label: 'Pricing', icon: CreditCard },
];

export default function FeedbackModal({ isOpen, onClose, initialCategory = 'general' }) {
  const { user, isAuthenticated } = useAuthStore();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [category, setCategory] = useState(initialCategory);
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setCategory(initialCategory || 'general');
      setSubmitted(false);
      if (isAuthenticated && user) {
        setName((prev) => prev || user.name || user.username || '');
        setEmail((prev) => prev || user.email || '');
      }
    }
  }, [isOpen, initialCategory, isAuthenticated, user]);

  const resetForm = () => {
    setSubject('');
    setMessage('');
    setRating(5);
    setHoverRating(0);
    setSubmitted(false);
  };

  const handleClose = () => {
    if (isSubmitting) return;
    resetForm();
    onClose();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim() || name.trim().length < 2) {
      toast.error('Please enter your name.');
      return;
    }
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      toast.error('Please enter a valid email address.');
      return;
    }
    if (!subject.trim() || subject.trim().length < 3) {
      toast.error('Please enter a short subject.');
      return;
    }
    if (!message.trim() || message.trim().length < 10) {
      toast.error('Please enter at least 10 characters in your message.');
      return;
    }

    setIsSubmitting(true);
    try {
      await submitFeedback({
        name: name.trim(),
        email: email.trim(),
        category,
        subject: subject.trim(),
        message: message.trim(),
        rating: rating || undefined,
      });
      setSubmitted(true);
      toast.success('Feedback sent! Thank you for helping us improve.');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Could not send feedback. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent className="sm:max-w-[520px] p-0 overflow-hidden rounded-2xl border-border/80 bg-card shadow-2xl">
        {/* Top Accent Strip */}
        <div className="h-1 w-full bg-gradient-to-r from-indigo-500 via-purple-500 to-violet-500" />

        {submitted ? (
          <div className="p-8 text-center space-y-4">
            <div className="mx-auto w-14 h-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/25 flex items-center justify-center text-emerald-500">
              <CheckCircle2 className="w-7 h-7" />
            </div>
            <div className="space-y-1.5">
              <DialogTitle className="font-heading text-xl font-bold text-foreground">
                Thanks for your feedback!
              </DialogTitle>
              <DialogDescription className="text-sm text-muted-foreground max-w-sm mx-auto">
                Your message has been delivered to the Extractor team. We review every inquiry carefully.
              </DialogDescription>
            </div>
            <div className="pt-2">
              <Button onClick={handleClose} className="rounded-xl px-6 h-10 text-xs font-semibold">
                Back to Extractor
              </Button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            <DialogHeader className="space-y-1 text-left">
              <div className="flex items-center gap-2.5">
                <div className="h-9 w-9 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary shrink-0">
                  <MessageSquarePlus className="h-4 w-4" />
                </div>
                <div>
                  <DialogTitle className="font-heading text-lg font-bold text-foreground">
                    Share Your Feedback
                  </DialogTitle>
                  <DialogDescription className="text-xs text-muted-foreground">
                    Report a bug, request a resume template, or tell us how we can improve.
                  </DialogDescription>
                </div>
              </div>
            </DialogHeader>

            {/* Category Selector */}
            <div className="space-y-1.5">
              <Label className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                Category
              </Label>
              <div className="flex flex-wrap gap-1.5">
                {CATEGORIES.map((cat) => {
                  const Icon = cat.icon;
                  const active = category === cat.id;
                  return (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => setCategory(cat.id)}
                      className={cn(
                        'inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer',
                        active
                          ? 'bg-primary text-primary-foreground border-primary shadow-xs'
                          : 'bg-background/60 text-muted-foreground border-border/80 hover:border-primary/40 hover:text-foreground'
                      )}
                    >
                      <Icon className="h-3.5 w-3.5" />
                      <span>{cat.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Name & Email */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="fb-name" className="text-xs font-medium">
                  Your Name
                </Label>
                <Input
                  id="fb-name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Alex Rivera"
                  required
                  className="h-9 text-xs rounded-xl bg-background/60"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="fb-email" className="text-xs font-medium">
                  Email Address
                </Label>
                <Input
                  id="fb-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="alex@example.com"
                  required
                  className="h-9 text-xs rounded-xl bg-background/60"
                />
              </div>
            </div>

            {/* Subject */}
            <div className="space-y-1.5">
              <Label htmlFor="fb-subject" className="text-xs font-medium">
                Subject
              </Label>
              <Input
                id="fb-subject"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="e.g. Add a minimalist two-column template"
                required
                className="h-9 text-xs rounded-xl bg-background/60"
              />
            </div>

            {/* Message */}
            <div className="space-y-1.5">
              <Label htmlFor="fb-message" className="text-xs font-medium">
                Message
              </Label>
              <textarea
                id="fb-message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Tell us the details so our team can act on it quickly..."
                rows={4}
                required
                className="w-full rounded-xl border border-input bg-background/60 px-3 py-2.5 text-xs text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring resize-none"
              />
            </div>

            {/* Star Rating + Submit */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2 border-t border-border/60">
              <div className="flex items-center gap-2">
                <span className="text-xs font-medium text-muted-foreground">Experience:</span>
                <div className="flex items-center gap-0.5">
                  {[1, 2, 3, 4, 5].map((star) => {
                    const filled = (hoverRating || rating) >= star;
                    return (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setRating(star)}
                        onMouseEnter={() => setHoverRating(star)}
                        onMouseLeave={() => setHoverRating(0)}
                        className="p-0.5 cursor-pointer transition-transform hover:scale-110"
                        aria-label={`Rate ${star} stars`}
                      >
                        <Star
                          className={cn(
                            'h-4 w-4 transition-colors',
                            filled
                              ? 'fill-amber-400 text-amber-400'
                              : 'text-muted-foreground/40'
                          )}
                        />
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="flex items-center gap-2 justify-end">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  disabled={isSubmitting}
                  onClick={handleClose}
                  className="h-9 rounded-xl text-xs"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  size="sm"
                  disabled={isSubmitting}
                  className="h-9 px-4 rounded-xl text-xs font-semibold gap-1.5 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white shadow-sm shadow-indigo-500/20"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      <span>Sending...</span>
                    </>
                  ) : (
                    <>
                      <Send className="h-3.5 w-3.5" />
                      <span>Send Feedback</span>
                    </>
                  )}
                </Button>
              </div>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
