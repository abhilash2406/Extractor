import { useState } from 'react';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useSkills, useCreateSkill, useDeleteSkill } from '../../hooks/useSkills';
import Modal from '../../components/ui/Modal';
import moment from 'moment';
import { 
  Plus, 
  Search, 
  Trash2, 
  Sparkles, 
  ChevronLeft, 
  ChevronRight,
  Code
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

const schema = yup.object().shape({
  name: yup.string().required('Skill name is required').min(2, 'Too short'),
});

const SkillsPage = () => {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);

  const { data: response, isLoading } = useSkills({ page, limit: 10, search });
  const { mutate: createSkill, isPending: isCreating } = useCreateSkill();
  const { mutate: deleteSkill, isPending: isDeleting } = useDeleteSkill();

  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = (data) => {
    createSkill(data, {
      onSuccess: () => {
        setIsAddModalOpen(false);
        reset();
      },
    });
  };

  const handleDelete = () => {
    if (deleteConfirmId) {
      deleteSkill(deleteConfirmId, {
        onSuccess: () => setDeleteConfirmId(null),
      });
    }
  };

  const skills = response?.data || [];
  const meta = response?.meta || { totalPages: 1, page: 1 };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-heading text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
            Skills Library
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Manage searchable taxonomies, proficiencies, and extraction tags.
          </p>
        </div>
        <Button onClick={() => setIsAddModalOpen(true)} className="gap-2 self-start sm:self-auto">
          <Plus className="h-4 w-4" />
          <span>Add Skill</span>
        </Button>
      </div>

      {/* Main Table Card */}
      <Card>
        <CardHeader className="p-4 sm:p-6 pb-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="relative w-full sm:w-72">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search skills..."
                className="pl-9"
                value={search}
                onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              />
            </div>
            <div className="text-xs text-muted-foreground font-medium">
              Showing <span className="font-semibold text-foreground">{skills.length}</span> skills
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-0 sm:p-6 pt-0">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
              <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent mb-3" />
              <p className="text-sm font-medium">Loading skills...</p>
            </div>
          ) : skills.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center text-muted-foreground px-4">
              <div className="h-12 w-12 rounded-full bg-muted/60 flex items-center justify-center mb-3">
                <Code className="h-6 w-6 text-muted-foreground/60" />
              </div>
              <h3 className="font-semibold text-foreground">No skills found</h3>
              <p className="text-xs text-muted-foreground mt-1 max-w-sm">
                Add your first skill to start categorizing candidate profiles.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Skill Name</TableHead>
                    <TableHead>Date Added</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {skills.map((skill) => (
                    <TableRow key={skill.id}>
                      <TableCell className="font-semibold text-foreground">
                        {skill.name}
                      </TableCell>
                      <TableCell className="text-xs text-muted-foreground">
                        {moment(skill.created_at).format('MMM DD, YYYY')}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 rounded-lg text-destructive hover:text-destructive hover:bg-destructive/10"
                          onClick={() => setDeleteConfirmId(skill.id)}
                          title="Delete Skill"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}

          {/* Pagination */}
          {meta.totalPages > 1 && (
            <div className="flex items-center justify-between px-4 py-3 border-t border-border/60">
              <div className="text-xs text-muted-foreground">
                Page <span className="font-semibold text-foreground">{meta.page}</span> of <span className="font-semibold text-foreground">{meta.totalPages}</span>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={meta.page <= 1}
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  className="h-8 gap-1"
                >
                  <ChevronLeft className="h-4 w-4" />
                  <span>Previous</span>
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={meta.page >= meta.totalPages}
                  onClick={() => setPage((p) => p + 1)}
                  className="h-8 gap-1"
                >
                  <span>Next</span>
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Add Skill Modal */}
      <Modal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} title="Add New Skill" size="sm">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Skill Name</label>
            <Input 
              placeholder="e.g., React, Python, UI/UX" 
              {...register('name')} 
            />
            {errors.name && <p className="text-xs text-destructive mt-1">{errors.name.message}</p>}
          </div>
          <div className="flex justify-end gap-2 pt-2 border-t border-border/60">
            <Button type="button" variant="outline" onClick={() => setIsAddModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isCreating}>
              {isCreating ? 'Saving...' : 'Save Skill'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal isOpen={!!deleteConfirmId} onClose={() => setDeleteConfirmId(null)} title="Confirm Deletion" size="sm">
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Are you sure you want to delete this skill?
          </p>
          <div className="flex justify-end gap-2 pt-2 border-t border-border/60">
            <Button variant="outline" onClick={() => setDeleteConfirmId(null)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete} disabled={isDeleting}>
              {isDeleting ? 'Deleting...' : 'Delete Skill'}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default SkillsPage;
