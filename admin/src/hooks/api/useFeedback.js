import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import * as feedbackApi from '@/api/feedback.api';

export const FEEDBACK_STATUS = {
  NEW: 'NEW',
  IN_REVIEW: 'IN_REVIEW',
  RESOLVED: 'RESOLVED',
  CLOSED: 'CLOSED',
};

export const useFeedbacks = (params) =>
  useQuery({
    queryKey: ['admin-feedbacks', params],
    queryFn: () => feedbackApi.getFeedbacks(params).then((r) => r.data),
    placeholderData: (prev) => prev,
    staleTime: 15 * 1000,
  });

export const useUpdateFeedback = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, ...data }) => feedbackApi.updateFeedback(id, data).then((r) => r.data.data),
    onSuccess: (updated, variables) => {
      queryClient.invalidateQueries({ queryKey: ['admin-feedbacks'] });
      if (variables.status && variables.admin_notes === undefined) {
        const label = variables.status.replace('_', ' ');
        toast.success(`Feedback status updated to ${label}`);
      } else if (variables.admin_notes !== undefined && !variables.status) {
        toast.success('Admin notes saved successfully');
      } else {
        toast.success('Feedback updated successfully');
      }
      return updated;
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || 'Failed to update feedback');
    },
  });
};

export const useDeleteFeedback = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id) => feedbackApi.deleteFeedback(id).then((r) => r.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-feedbacks'] });
      toast.success('Feedback entry deleted');
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || 'Failed to delete feedback');
    },
  });
};
