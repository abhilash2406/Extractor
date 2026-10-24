import React from 'react';
import moment from 'moment';
import toast from 'react-hot-toast';
import { User, FileText, CreditCard } from 'lucide-react';
import Modal from '@/components/ui/Modal';
import { UserResumePreview } from './UserResumePreview';

export const UserDetailsModal = ({
  isOpen,
  onClose,
  detailedUser,
  isLoading,
  showResume,
  setShowResume,
  resumeUrl,
  isResumeLoading,
  isResumeError,
  fetchResume,
  onStatusChange,
  isUpdating,
  onNavigateToSubscriptions,
}) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={showResume ? 'Candidate Resume' : 'User Details'}
      size={showResume ? 'xl' : 'lg'}
    >
      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
          <div className="h-10 w-10 animate-spin rounded-full border-3 border-primary border-t-transparent mb-3" />
          <p className="text-sm font-medium">Retrieving user profile...</p>
        </div>
      ) : detailedUser ? (
        showResume ? (
          <UserResumePreview
            onBack={() => setShowResume(false)}
            resumeUrl={resumeUrl}
            isResumeLoading={isResumeLoading}
            isResumeError={isResumeError}
          />
        ) : (
          <div className="space-y-6">
            {/* Header Profile Summary */}
            <div className="flex items-start gap-3.5">
              <div className="h-12 w-12 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-foreground font-bold shrink-0">
                {detailedUser.profile_pic ? (
                  <img
                    src={detailedUser.profile_pic}
                    alt={detailedUser.username}
                    className="h-full w-full rounded-full object-cover"
                  />
                ) : (
                  <User className="h-6 w-6 text-muted-foreground" />
                )}
              </div>
              <div className="space-y-1">
                <h3 className="font-heading font-bold text-lg text-foreground leading-snug">
                  {detailedUser.username}
                </h3>
                <p className="text-xs text-muted-foreground">{detailedUser.email}</p>
                <div className="flex items-center gap-2 pt-0.5">
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${
                      detailedUser.status === 'ACTIVE'
                        ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/30'
                        : 'bg-rose-500/10 text-rose-500 border-rose-500/30'
                    }`}
                  >
                    {detailedUser.status === 'ACTIVE' ? 'Active' : 'Blocked'}
                  </span>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-muted/70 text-foreground border border-border/80">
                    {detailedUser.plan} Plan
                  </span>
                </div>
              </div>
            </div>

            {/* 1. User Information */}
            <div className="space-y-3 pt-4 border-t border-border/60">
              <h4 className="font-heading text-xs font-bold uppercase tracking-wider text-foreground">
                1. User Information
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-3.5 gap-x-6 text-xs">
                <div>
                  <span className="text-muted-foreground block text-[11px]">Full Name</span>
                  <span className="font-semibold text-foreground text-sm">{detailedUser.username}</span>
                </div>
                <div>
                  <span className="text-muted-foreground block text-[11px]">Email</span>
                  <span className="font-semibold text-foreground text-sm">{detailedUser.email}</span>
                </div>
                <div>
                  <span className="text-muted-foreground block text-[11px]">Joined On</span>
                  <span className="font-semibold text-foreground text-sm">
                    {moment(detailedUser.created_at || detailedUser.createdAt).format('MMM D, YYYY')}
                  </span>
                </div>
                <div>
                  <span className="text-muted-foreground block text-[11px]">Last Login</span>
                  <span className="font-semibold text-foreground text-sm">
                    {detailedUser.last_login_at ? moment(detailedUser.last_login_at).format('MMM D, YYYY') : 'Never'}
                  </span>
                </div>
                <div>
                  <span className="text-muted-foreground block text-[11px]">Email Verified</span>
                  <div className="mt-0.5">
                    {detailedUser.is_verified ? (
                      <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-semibold bg-emerald-500/10 text-emerald-500 border border-emerald-500/30">
                        Verified
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-semibold bg-amber-500/10 text-amber-500 border border-amber-500/30">
                        Unverified
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* 2. Subscription Overview */}
            <div className="space-y-3 pt-4 border-t border-border/60">
              <h4 className="font-heading text-xs font-bold uppercase tracking-wider text-foreground">
                2. Subscription Overview
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-3.5 gap-x-6 text-xs">
                <div>
                  <span className="text-muted-foreground block text-[11px]">Current Plan</span>
                  <span className="font-semibold text-foreground text-sm">{detailedUser.plan}</span>
                </div>
                <div>
                  <span className="text-muted-foreground block text-[11px]">Subscription Status</span>
                  <span className="font-semibold text-foreground text-sm">
                    {detailedUser.subscription?.status
                      ? detailedUser.subscription.status.charAt(0) +
                        detailedUser.subscription.status.slice(1).toLowerCase()
                      : 'Active'}
                  </span>
                </div>
                <div>
                  <span className="text-muted-foreground block text-[11px]">Billing Cycle</span>
                  <span className="font-semibold text-foreground text-sm">
                    {detailedUser.subscription?.plan?.billing_interval
                      ? detailedUser.subscription.plan.billing_interval.charAt(0) +
                        detailedUser.subscription.plan.billing_interval.slice(1).toLowerCase()
                      : 'Not applicable'}
                  </span>
                </div>
                <div>
                  <span className="text-muted-foreground block text-[11px]">Next Renewal</span>
                  <span className="font-semibold text-foreground text-sm">
                    {detailedUser.subscription?.current_period_end
                      ? moment(detailedUser.subscription.current_period_end).format('MMM D, YYYY')
                      : 'Not applicable'}
                  </span>
                </div>
              </div>
            </div>

            {/* 3. Usage Statistics */}
            <div className="space-y-3 pt-4 border-t border-border/60">
              <h4 className="font-heading text-xs font-bold uppercase tracking-wider text-foreground">
                3. Usage Statistics
              </h4>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                <div>
                  <span className="text-muted-foreground block text-[11px] mb-1">Resumes Created</span>
                  <span className="text-xl font-bold text-foreground">
                    {detailedUser.resumes_count ?? 0}
                  </span>
                </div>
                <div>
                  <span className="text-muted-foreground block text-[11px] mb-1">AI Generations</span>
                  <span className="text-xl font-bold text-foreground">
                    {detailedUser.ai_analyses_count ?? 0}
                  </span>
                </div>
                <div>
                  <span className="text-muted-foreground block text-[11px] mb-1">Last Activity</span>
                  <span className="text-sm font-bold text-foreground mt-1 block">
                    {detailedUser.last_login_at
                      ? moment(detailedUser.last_login_at).format('MMM D, YYYY')
                      : moment(detailedUser.created_at || detailedUser.createdAt).format('MMM D, YYYY')}
                  </span>
                </div>
              </div>
            </div>

            {/* 4. Admin Actions */}
            <div className="space-y-3 pt-4 border-t border-border/60">
              <h4 className="font-heading text-xs font-bold uppercase tracking-wider text-foreground">
                4. Admin Actions
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <button
                  type="button"
                  onClick={() => {
                    if (detailedUser.resumes_count > 0 || detailedUser.latest_resume) {
                      fetchResume();
                      setShowResume(true);
                    } else {
                      toast.error('No resume uploaded by this user yet.');
                    }
                  }}
                  className="flex flex-col items-center justify-center p-3.5 rounded-xl border border-border/80 bg-background/50 hover:bg-muted/60 transition-all duration-150 cursor-pointer group"
                >
                  <FileText className="h-4 w-4 text-muted-foreground group-hover:text-primary mb-1.5 transition-colors" />
                  <span className="text-xs font-semibold text-foreground">View Resumes</span>
                </button>

                <button
                  type="button"
                  onClick={onNavigateToSubscriptions}
                  className="flex flex-col items-center justify-center p-3.5 rounded-xl border border-border/80 bg-background/50 hover:bg-muted/60 transition-all duration-150 cursor-pointer group"
                >
                  <CreditCard className="h-4 w-4 text-muted-foreground group-hover:text-primary mb-1.5 transition-colors" />
                  <span className="text-xs font-semibold text-foreground">View Subscription</span>
                </button>

                <button
                  type="button"
                  disabled={isUpdating}
                  onClick={() => {
                    const nextStatus = detailedUser.status === 'ACTIVE' ? 'BLOCKED' : 'ACTIVE';
                    onStatusChange(detailedUser.id, nextStatus);
                  }}
                  className="flex flex-col items-center justify-center p-3.5 rounded-xl border border-border/80 bg-background/50 hover:bg-muted/60 transition-all duration-150 cursor-pointer group disabled:opacity-60"
                >
                  <User className="h-4 w-4 text-muted-foreground group-hover:text-primary mb-1.5 transition-colors" />
                  <span className="text-xs font-semibold text-foreground">
                    {detailedUser.status === 'ACTIVE' ? 'Block User' : 'Activate User'}
                  </span>
                </button>
              </div>
            </div>
          </div>
        )
      ) : null}
    </Modal>
  );
};

export default UserDetailsModal;
