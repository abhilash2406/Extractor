import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search } from 'lucide-react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { useUsers, useUser, useUpdateUserStatus, useUserResume } from '@/hooks/api/useUsers';
import { useUserFilters } from '@/hooks/custom/useUserFilters';

import {
  UserFilters,
  UserTable,
  UserMobileCards,
  UserDetailsModal,
  UserDeleteModal,
  UserPagination,
} from '@/components/user';

const UsersPage = () => {
  const navigate = useNavigate();
  const filters = useUserFilters();

  // Modal & Selection States
  const [viewUser, setViewUser] = useState(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);
  const [showResume, setShowResume] = useState(false);

  // Queries & Mutations
  const { data: response, isLoading } = useUsers(filters.queryParams);
  const { mutate: updateStatus, isPending: isUpdating } = useUpdateUserStatus();

  // Fetch detailed user profile for modal
  const { data: detailedUser, isLoading: isDetailedUserLoading } = useUser(viewUser?.id);

  // Resume fetching query for modal
  const {
    data: resumeUrl,
    isLoading: isResumeLoading,
    isError: isResumeError,
    refetch: fetchResume,
  } = useUserResume(viewUser?.id);

  useEffect(() => {
    if (!viewUser) {
      setShowResume(false);
    }
  }, [viewUser]);

  useEffect(() => {
    if (showResume && viewUser) {
      fetchResume();
    }
  }, [showResume, viewUser, fetchResume]);

  const users = response?.data || [];
  const meta = response?.meta || { totalPages: 1, page: 1, total: 0 };

  const handleStatusChange = (id, newStatus) => {
    updateStatus({ id, status: newStatus });
  };

  const handleDelete = () => {
    if (deleteConfirmId) {
      updateStatus(
        { id: deleteConfirmId, status: 'DELETED' },
        {
          onSuccess: () => setDeleteConfirmId(null),
        }
      );
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-heading text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
            User Management
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Manage system users, subscription plans, resume metrics, and account status.
          </p>
        </div>
      </div>

      {/* Main Content Card */}
      <Card>
        <CardHeader className="p-4 sm:p-6 pb-4">
          <UserFilters
            filters={filters}
            totalUsers={meta.total || users.length}
            currentCount={users.length}
          />
        </CardHeader>

        <CardContent className="p-0 sm:p-6 pt-0">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
              <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent mb-3" />
              <p className="text-sm font-medium">Loading users...</p>
            </div>
          ) : users.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center text-muted-foreground px-4">
              <div className="h-12 w-12 rounded-full bg-muted/60 flex items-center justify-center mb-3">
                <Search className="h-6 w-6 text-muted-foreground/60" />
              </div>
              <h3 className="font-semibold text-foreground">No users found</h3>
              <p className="text-xs text-muted-foreground mt-1 max-w-sm">
                Try adjusting your search keywords or filters to find what you're looking for.
              </p>
            </div>
          ) : (
            <>
              {/* Desktop Table View (>= md) */}
              <UserTable
                users={users}
                onViewUser={(user) => setViewUser(user)}
                onDeleteUser={(id) => setDeleteConfirmId(id)}
                onStatusChange={handleStatusChange}
                isUpdating={isUpdating}
              />

              {/* Mobile User Cards (< md) */}
              <UserMobileCards
                users={users}
                onViewUser={(user) => setViewUser(user)}
                onDeleteUser={(id) => setDeleteConfirmId(id)}
                onStatusChange={handleStatusChange}
                isUpdating={isUpdating}
              />
            </>
          )}

          {/* Pagination */}
          <UserPagination
            page={filters.page}
            totalPages={meta.totalPages}
            onPageChange={filters.setPage}
          />
        </CardContent>
      </Card>

      {/* User Details / Resume Modal */}
      <UserDetailsModal
        isOpen={Boolean(viewUser)}
        onClose={() => setViewUser(null)}
        detailedUser={detailedUser}
        isLoading={isDetailedUserLoading}
        showResume={showResume}
        setShowResume={setShowResume}
        resumeUrl={resumeUrl}
        isResumeLoading={isResumeLoading}
        isResumeError={isResumeError}
        fetchResume={fetchResume}
        onStatusChange={handleStatusChange}
        isUpdating={isUpdating}
        onNavigateToSubscriptions={() => {
          setViewUser(null);
          navigate('/admin/subscriptions');
        }}
      />

      {/* Delete Confirmation Modal */}
      <UserDeleteModal
        isOpen={Boolean(deleteConfirmId)}
        onClose={() => setDeleteConfirmId(null)}
        onConfirmDelete={handleDelete}
        isUpdating={isUpdating}
      />
    </div>
  );
};

export default UsersPage;
