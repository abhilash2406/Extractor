import React from 'react';
import moment from 'moment';
import { Eye, Trash2, FileText, Clock } from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { getPlanBadge } from './UserPlanBadge';
import { UserStatusDropdown } from './UserStatusDropdown';

export const UserMobileCards = ({
  users = [],
  onViewUser,
  onDeleteUser,
  onStatusChange,
  isUpdating = false,
}) => {
  return (
    <div className="block md:hidden p-3 sm:p-4 space-y-3">
      {users.map((user) => (
        <div key={user.id} className="p-4 rounded-2xl bg-card border border-border/80 shadow-xs space-y-3.5">
          {/* Top Row: Avatar, User Details & Action Buttons */}
          <div className="flex items-start justify-between gap-2">
            <div className="flex items-center gap-3 min-w-0">
              <Avatar className="h-10 w-10 border border-primary/20 shrink-0 shadow-xs">
                <AvatarFallback className="bg-primary/10 text-primary font-bold text-sm">
                  {(user.username || user.email || 'U').charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="min-w-0">
                <h4 className="font-bold text-sm text-foreground truncate">
                  {user.username}
                </h4>
                <p className="text-xs text-muted-foreground truncate select-all">
                  {user.email}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1 shrink-0">
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 rounded-lg text-primary hover:text-primary hover:bg-primary/10 cursor-pointer"
                onClick={() => onViewUser(user)}
                title="View Details"
              >
                <Eye className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 rounded-lg text-destructive hover:text-destructive hover:bg-destructive/10 cursor-pointer"
                onClick={() => onDeleteUser(user.id)}
                title="Delete User"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Middle Row: Plan & Status */}
          <div className="flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-border/40">
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-semibold text-muted-foreground">Plan:</span>
              {getPlanBadge(user.plan, user.plan_code)}
            </div>

            <div className="flex items-center gap-2">
              <UserStatusDropdown
                status={user.status}
                disabled={isUpdating}
                align="end"
                onStatusChange={(newStatus) => onStatusChange(user.id, newStatus)}
              />
            </div>
          </div>

          {/* Bottom Row: Metrics (Resumes, Last Active) */}
          <div className="grid grid-cols-2 gap-2 pt-2 border-t border-border/40 text-xs">
            <div className="flex items-center gap-1.5 text-muted-foreground">
              <FileText className="h-3.5 w-3.5 text-primary shrink-0" />
              <span>Resumes:</span>
              <span className="font-bold text-foreground">{user.resumes_count ?? user.resume_count ?? 0}</span>
            </div>

            <div className="flex items-center gap-1.5 text-muted-foreground justify-end">
              <Clock className="h-3.5 w-3.5 shrink-0" />
              <span>Active:</span>
              <span className="font-medium text-foreground">
                {user.last_login_at ? moment(user.last_login_at).fromNow() : 'Never'}
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default UserMobileCards;
