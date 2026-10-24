import React from 'react';
import moment from 'moment';
import { Mail, FileText, Clock, Eye, Trash2 } from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { getPlanBadge } from './UserPlanBadge';
import { UserStatusDropdown } from './UserStatusDropdown';

export const UserTable = ({
  users = [],
  onViewUser,
  onDeleteUser,
  onStatusChange,
  isUpdating = false,
}) => {
  return (
    <div className="hidden md:block overflow-x-auto">
      <Table className="min-w-[850px]">
        <TableHeader>
          <TableRow className="border-border/60 hover:bg-transparent">
            <TableHead className="whitespace-nowrap sticky left-0 bg-card z-10 w-[200px] pl-6 font-bold text-xs uppercase text-muted-foreground">
              User
            </TableHead>
            <TableHead className="whitespace-nowrap font-bold text-xs uppercase text-muted-foreground">
              Email
            </TableHead>
            <TableHead className="whitespace-nowrap font-bold text-xs uppercase text-muted-foreground">
              Plan
            </TableHead>
            <TableHead className="whitespace-nowrap font-bold text-xs uppercase text-muted-foreground">
              Resumes
            </TableHead>
            <TableHead className="whitespace-nowrap font-bold text-xs uppercase text-muted-foreground">
              Last Active
            </TableHead>
            <TableHead className="whitespace-nowrap hidden lg:table-cell font-bold text-xs uppercase text-muted-foreground">
              Joined
            </TableHead>
            <TableHead className="whitespace-nowrap w-[140px] font-bold text-xs uppercase text-muted-foreground">
              Status
            </TableHead>
            <TableHead className="whitespace-nowrap text-right pr-6 font-bold text-xs uppercase text-muted-foreground">
              Actions
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((user) => (
            <TableRow key={user.id} className="group hover:bg-muted/30 transition-colors">
              <TableCell className="py-3.5 whitespace-nowrap sticky left-0 bg-card z-10 group-hover:bg-muted/40 transition-colors pl-6 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.08)]">
                <div className="flex items-center gap-3">
                  <Avatar className="h-9 w-9 border border-primary/20 shrink-0 shadow-xs">
                    <AvatarFallback className="bg-primary/10 text-primary font-bold text-xs">
                      {(user.username || user.email || 'U').charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="font-semibold text-sm text-foreground truncate max-w-[140px]">
                    {user.username}
                  </div>
                </div>
              </TableCell>

              <TableCell className="py-3.5 whitespace-nowrap">
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <Mail className="h-3.5 w-3.5 shrink-0 text-muted-foreground/70" />
                  <span className="font-medium text-foreground/90 select-all">{user.email}</span>
                </div>
              </TableCell>

              <TableCell className="whitespace-nowrap">
                {getPlanBadge(user.plan, user.plan_code)}
              </TableCell>

              <TableCell className="whitespace-nowrap">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-muted/60 border border-border/50 text-xs font-semibold text-foreground">
                  <FileText className="h-3.5 w-3.5 text-primary" />
                  <span>{user.resumes_count ?? user.resume_count ?? 0}</span>
                </span>
              </TableCell>

              <TableCell className="whitespace-nowrap">
                {user.last_login_at ? (
                  <div className="flex flex-col whitespace-nowrap">
                    <span className="text-xs font-medium text-foreground flex items-center gap-1">
                      <Clock className="h-3 w-3 text-muted-foreground shrink-0" />
                      {moment(user.last_login_at).fromNow()}
                    </span>
                    <span className="text-[11px] text-muted-foreground">
                      {moment(user.last_login_at).format('MMM DD, YYYY')}
                    </span>
                  </div>
                ) : (
                  <span className="text-xs text-muted-foreground/60 italic">Never</span>
                )}
              </TableCell>

              <TableCell className="whitespace-nowrap hidden lg:table-cell text-xs text-muted-foreground">
                {moment(user.createdAt || user.created_at).format('MMM DD, YYYY')}
              </TableCell>

              <TableCell className="whitespace-nowrap">
                <UserStatusDropdown
                  status={user.status}
                  disabled={isUpdating}
                  onStatusChange={(newStatus) => onStatusChange(user.id, newStatus)}
                />
              </TableCell>

              <TableCell className="whitespace-nowrap text-right pr-6">
                <div className="flex items-center justify-end gap-1">
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
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default UserTable;
