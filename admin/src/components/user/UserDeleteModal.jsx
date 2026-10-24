import React from 'react';
import Modal from '@/components/ui/Modal';
import { Button } from '@/components/ui/button';

export const UserDeleteModal = ({
  isOpen,
  onClose,
  onConfirmDelete,
  isUpdating = false,
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Confirm Deletion" size="sm">
      <div className="space-y-4">
        <p className="text-sm text-muted-foreground">
          Are you sure you want to delete this user? This action will disable their account access.
        </p>
        <div className="flex justify-end gap-2 pt-2 border-t border-border/60">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="destructive" onClick={onConfirmDelete} disabled={isUpdating}>
            {isUpdating ? 'Deleting...' : 'Delete User'}
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default UserDeleteModal;
