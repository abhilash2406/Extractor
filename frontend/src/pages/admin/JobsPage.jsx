import { useState } from 'react';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useJobs, useCreateJob, useUpdateJob, useDeleteJob, useGenerateJobDescription } from '../../hooks/useJobs';
import { useSkills } from '../../hooks/useSkills';
import Modal from '../../components/ui/Modal';
import moment from 'moment';
import * as jobsApi from '../../api/jobs.api';
import toast from 'react-hot-toast';
import { 
  Briefcase, 
  Plus, 
  Search, 
  Pencil, 
  Trash2, 
  Sparkles, 
  Calendar, 
  GraduationCap, 
  Clock, 
  ChevronLeft, 
  ChevronRight,
  Check
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

const schema = yup.object().shape({
  title: yup.string().required('Title is required'),
  description: yup.string().required('Description is required'),
  min_education: yup.string().required('Min Education is required'),
  min_experience: yup.number().typeError('Must be a number').required('Min Experience is required').min(0, 'Cannot be negative'),
  last_application_date: yup.string().required('Last Application Date is required'),
  skill_ids: yup.array().of(yup.string()),
});

const JobsPage = () => {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [modalState, setModalState] = useState({ isOpen: false, data: null });
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);
  const [isFetchingDetail, setIsFetchingDetail] = useState(false);

  const { data: response, isLoading } = useJobs({ page, limit: 10, search });
  const { data: skillsResponse } = useSkills({ limit: 100 });
  const skillsList = skillsResponse?.data || [];

  const { mutate: createJob, isPending: isCreating } = useCreateJob();
  const { mutate: updateJob, isPending: isUpdating } = useUpdateJob();
  const { mutate: deleteJob, isPending: isDeleting } = useDeleteJob();
  const { mutate: generateDescription, isPending: isGeneratingDesc } = useGenerateJobDescription();

  const { register, handleSubmit, reset, setValue, watch, formState: { errors } } = useForm({
    resolver: yupResolver(schema),
    defaultValues: { skill_ids: [] }
  });

  const selectedSkills = watch('skill_ids') || [];

  const handleGenerateDescription = () => {
    const title = watch('title');
    const minExperience = watch('min_experience');
    const minEducation = watch('min_education');
    const skillIds = watch('skill_ids') || [];
    
    const skills = skillsList.filter(s => skillIds.includes(s.id)).map(s => s.name);

    if (!title && skills.length === 0) {
      toast.error('Please enter a Job Title or select some skills first.');
      return;
    }

    generateDescription(
      { title, skills, minExperience, minEducation },
      {
        onSuccess: (res) => {
          setValue('description', res.data.data, { shouldValidate: true });
        }
      }
    );
  };

  const openModal = async (id = null) => {
    if (id) {
      try {
        setIsFetchingDetail(true);
        const { data } = await jobsApi.getJobById(id);
        const job = data.data;
        reset({
          title: job.title,
          description: job.description,
          min_education: job.min_education,
          min_experience: job.min_experience,
          last_application_date: job.last_application_date || '',
          skill_ids: job.required_skills?.map(s => s.id) || [],
        });
        setModalState({ isOpen: true, data: job });
      } catch (err) {
        toast.error('Failed to fetch job details');
      } finally {
        setIsFetchingDetail(false);
      }
    } else {
      reset({ title: '', description: '', min_education: '', min_experience: 0, last_application_date: '', skill_ids: [] });
      setModalState({ isOpen: true, data: null });
    }
  };

  const closeModal = () => {
    setModalState({ isOpen: false, data: null });
    reset();
  };

  const onSubmit = (data) => {
    if (modalState.data?.id) {
      updateJob({ id: modalState.data.id, data }, { onSuccess: closeModal });
    } else {
      createJob(data, { onSuccess: closeModal });
    }
  };

  const handleDelete = () => {
    if (deleteConfirmId) {
      deleteJob(deleteConfirmId, { onSuccess: () => setDeleteConfirmId(null) });
    }
  };

  const handleSkillToggle = (skillId) => {
    if (selectedSkills.includes(skillId)) {
      setValue('skill_ids', selectedSkills.filter(id => id !== skillId));
    } else {
      setValue('skill_ids', [...selectedSkills, skillId]);
    }
  };

  const jobs = response?.data || [];
  const meta = response?.meta || { totalPages: 1, page: 1 };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-heading text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
            Job Openings
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Create, manage and distribute job positions across candidate pipelines.
          </p>
        </div>
        <Button onClick={() => openModal()} className="gap-2 self-start sm:self-auto">
          <Plus className="h-4 w-4" />
          <span>Add Position</span>
        </Button>
      </div>

      {/* Main Table Card */}
      <Card>
        <CardHeader className="p-4 sm:p-6 pb-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="relative w-full sm:w-72">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search jobs..."
                className="pl-9"
                value={search}
                onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              />
            </div>
            <div className="text-xs text-muted-foreground font-medium">
              Showing <span className="font-semibold text-foreground">{jobs.length}</span> positions
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-0 sm:p-6 pt-0">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
              <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent mb-3" />
              <p className="text-sm font-medium">Loading positions...</p>
            </div>
          ) : jobs.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center text-muted-foreground px-4">
              <div className="h-12 w-12 rounded-full bg-muted/60 flex items-center justify-center mb-3">
                <Briefcase className="h-6 w-6 text-muted-foreground/60" />
              </div>
              <h3 className="font-semibold text-foreground">No jobs posted yet</h3>
              <p className="text-xs text-muted-foreground mt-1 max-w-sm">
                Click "Add Position" to create your first job posting.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Role Title</TableHead>
                    <TableHead>Experience</TableHead>
                    <TableHead className="hidden md:table-cell">Deadline</TableHead>
                    <TableHead>Required Skills</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {jobs.map((job) => (
                    <TableRow key={job.id}>
                      <TableCell className="font-semibold text-foreground">
                        {job.title}
                      </TableCell>
                      <TableCell className="text-xs text-muted-foreground">
                        {job.min_experience} yrs min
                      </TableCell>
                      <TableCell className="hidden md:table-cell text-xs text-muted-foreground">
                        {job.last_application_date ? moment(job.last_application_date).format('MMM DD, YYYY') : '-'}
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1 max-w-xs">
                          {job.required_skills?.map((s) => (
                            <Badge key={s.id} variant="secondary" className="text-[11px] font-normal">
                              {s.name}
                            </Badge>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 rounded-lg text-primary hover:text-primary hover:bg-primary/10"
                            onClick={() => openModal(job.id)}
                            disabled={isFetchingDetail}
                            title="Edit"
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 rounded-lg text-destructive hover:text-destructive hover:bg-destructive/10"
                            onClick={() => setDeleteConfirmId(job.id)}
                            title="Delete"
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

      {/* Add / Edit Job Modal */}
      <Modal isOpen={modalState.isOpen} onClose={closeModal} title={modalState.data ? 'Edit Job Opening' : 'Add New Position'} size="lg">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Job Title</label>
            <Input {...register('title')} placeholder="e.g., Senior Full Stack Engineer" />
            {errors.title && <p className="text-xs text-destructive mt-1">{errors.title.message}</p>}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Min Education</label>
              <Input {...register('min_education')} placeholder="e.g., Bachelor's Degree" />
              {errors.min_education && <p className="text-xs text-destructive mt-1">{errors.min_education.message}</p>}
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Min Experience (Yrs)</label>
              <Input type="number" min="0" {...register('min_experience')} />
              {errors.min_experience && <p className="text-xs text-destructive mt-1">{errors.min_experience.message}</p>}
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Deadline Date</label>
              <Input type="date" {...register('last_application_date')} />
              {errors.last_application_date && <p className="text-xs text-destructive mt-1">{errors.last_application_date.message}</p>}
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Required Skills</label>
            <div className="flex flex-wrap gap-2 p-3 border rounded-xl bg-muted/30 max-h-36 overflow-y-auto">
              {skillsList.map((skill) => (
                <button
                  key={skill.id}
                  type="button"
                  onClick={() => handleSkillToggle(skill.id)}
                  className={`inline-flex items-center gap-1 px-3 py-1 rounded-lg text-xs font-medium transition-all ${
                    selectedSkills.includes(skill.id)
                      ? 'bg-primary text-primary-foreground shadow-xs'
                      : 'bg-card text-muted-foreground border hover:text-foreground'
                  }`}
                >
                  <span>{skill.name}</span>
                  {selectedSkills.includes(skill.id) && <Check className="h-3 w-3" />}
                </button>
              ))}
              {skillsList.length === 0 && <span className="text-xs text-muted-foreground">No skills available.</span>}
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Job Description</label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="h-7 text-xs gap-1.5 text-primary border-primary/30 hover:bg-primary/10"
                onClick={handleGenerateDescription}
                disabled={isGeneratingDesc}
              >
                <Sparkles className="h-3.5 w-3.5" />
                <span>{isGeneratingDesc ? 'Generating with AI...' : 'Auto-Generate (Groq AI)'}</span>
              </Button>
            </div>
            <textarea
              rows={6}
              className="w-full rounded-xl border border-input bg-background/80 p-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 leading-relaxed"
              placeholder="Detailed roles, responsibilities, and qualifications..."
              {...register('description')}
            />
            {errors.description && <p className="text-xs text-destructive mt-1">{errors.description.message}</p>}
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-border/60">
            <Button type="button" variant="outline" onClick={closeModal}>
              Cancel
            </Button>
            <Button type="submit" disabled={isCreating || isUpdating}>
              {isCreating || isUpdating ? 'Saving...' : 'Save Job Opening'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal isOpen={!!deleteConfirmId} onClose={() => setDeleteConfirmId(null)} title="Confirm Deletion" size="sm">
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Are you sure you want to delete this job opening? Candidates will no longer be able to apply.
          </p>
          <div className="flex justify-end gap-2 pt-2 border-t border-border/60">
            <Button variant="outline" onClick={() => setDeleteConfirmId(null)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete} disabled={isDeleting}>
              {isDeleting ? 'Deleting...' : 'Delete Position'}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default JobsPage;
