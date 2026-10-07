import { useState } from 'react';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useQuestions, useCreateQuestion, useUpdateQuestion, useDeleteQuestion, useGenerateQuestion } from '../../hooks/useQuestions';
import Modal from '../../components/ui/Modal';
import * as questionsApi from '../../api/questions.api';
import toast from 'react-hot-toast';
import { 
  Plus, 
  Search, 
  Pencil, 
  Trash2, 
  Sparkles, 
  HelpCircle, 
  ChevronLeft, 
  ChevronRight,
  Code2,
  ListChecks
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
  type: yup.string().required('Type is required').oneOf(['MCQ', 'PROGRAMMING']),
  question: yup.string().required('Question is required'),
  option_a: yup.string().when('type', {
    is: 'MCQ',
    then: (schema) => schema.required('Option A is required'),
    otherwise: (schema) => schema.nullable().notRequired()
  }),
  option_b: yup.string().when('type', {
    is: 'MCQ',
    then: (schema) => schema.required('Option B is required'),
    otherwise: (schema) => schema.nullable().notRequired()
  }),
  option_c: yup.string().when('type', {
    is: 'MCQ',
    then: (schema) => schema.required('Option C is required'),
    otherwise: (schema) => schema.nullable().notRequired()
  }),
  option_d: yup.string().when('type', {
    is: 'MCQ',
    then: (schema) => schema.required('Option D is required'),
    otherwise: (schema) => schema.nullable().notRequired()
  }),
  correct_answer: yup.string().when('type', {
    is: 'MCQ',
    then: (schema) => schema.required('Correct answer is required').oneOf(['A', 'B', 'C', 'D']),
    otherwise: (schema) => schema.nullable().notRequired()
  }),
});

const QuestionsPage = () => {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [modalState, setModalState] = useState({ isOpen: false, data: null });
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);
  const [isFetchingDetail, setIsFetchingDetail] = useState(false);

  const { data: response, isLoading } = useQuestions({ page, limit: 10, search });
  const { mutate: createQuestion, isPending: isCreating } = useCreateQuestion();
  const { mutate: updateQuestion, isPending: isUpdating } = useUpdateQuestion();
  const { mutate: deleteQuestion, isPending: isDeleting } = useDeleteQuestion();
  const { mutate: generateQuestionWithAI, isPending: isGeneratingQuestion } = useGenerateQuestion();
  const [aiTopic, setAiTopic] = useState('');
  const [aiDifficulty, setAiDifficulty] = useState('Medium');

  const { register, handleSubmit, reset, watch, formState: { errors } } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      type: 'MCQ',
      correct_answer: 'A'
    }
  });

  const selectedType = watch('type');
  const [isBulkModalOpen, setIsBulkModalOpen] = useState(false);

  const handleGenerateQuestion = () => {
    if (!aiTopic.trim()) {
      toast.error('Please enter a topic to generate questions.');
      return;
    }
    
    generateQuestionWithAI({ topic: aiTopic, difficulty: aiDifficulty }, {
      onSuccess: () => {
        setIsBulkModalOpen(false);
        setAiTopic('');
      }
    });
  };

  const openModal = async (id = null) => {
    if (id) {
      try {
        setIsFetchingDetail(true);
        const { data } = await questionsApi.getQuestionById(id);
        const q = data.data;
        let mappedCorrectAnswer = q.correct_answer;
        if (!['A', 'B', 'C', 'D'].includes(mappedCorrectAnswer)) {
          if (mappedCorrectAnswer === q.option_a) mappedCorrectAnswer = 'A';
          else if (mappedCorrectAnswer === q.option_b) mappedCorrectAnswer = 'B';
          else if (mappedCorrectAnswer === q.option_c) mappedCorrectAnswer = 'C';
          else if (mappedCorrectAnswer === q.option_d) mappedCorrectAnswer = 'D';
        }

        reset({
          type: q.type || 'MCQ',
          question: q.question,
          option_a: q.option_a || '',
          option_b: q.option_b || '',
          option_c: q.option_c || '',
          option_d: q.option_d || '',
          correct_answer: mappedCorrectAnswer || 'A',
        });
        setModalState({ isOpen: true, data: q });
      } catch (err) {
        toast.error('Failed to fetch question details');
      } finally {
        setIsFetchingDetail(false);
      }
    } else {
      reset({ type: 'MCQ', question: '', option_a: '', option_b: '', option_c: '', option_d: '', correct_answer: 'A' });
      setModalState({ isOpen: true, data: null });
    }
  };

  const closeModal = () => {
    setModalState({ isOpen: false, data: null });
    reset();
  };

  const onSubmit = (data) => {
    const payload = { ...data };
    if (payload.type === 'PROGRAMMING') {
      delete payload.option_a;
      delete payload.option_b;
      delete payload.option_c;
      delete payload.option_d;
      delete payload.correct_answer;
    }
    
    if (modalState.data?.id) {
      updateQuestion({ id: modalState.data.id, data: payload }, { onSuccess: closeModal });
    } else {
      createQuestion(payload, { onSuccess: closeModal });
    }
  };

  const handleDelete = () => {
    if (deleteConfirmId) {
      deleteQuestion(deleteConfirmId, {
        onSuccess: () => setDeleteConfirmId(null),
      });
    }
  };

  const questions = response?.data || [];
  const meta = response?.meta || { totalPages: 1, page: 1 };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-heading text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
            Assessment Questions
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Build MCQ and coding challenges to test candidate skills.
          </p>
        </div>
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <Button 
            variant="outline" 
            onClick={() => setIsBulkModalOpen(true)} 
            className="gap-2 text-primary border-primary/30 hover:bg-primary/10"
          >
            <Sparkles className="h-4 w-4" />
            <span>Generate with AI</span>
          </Button>
          <Button onClick={() => openModal()} className="gap-2">
            <Plus className="h-4 w-4" />
            <span>Add Question</span>
          </Button>
        </div>
      </div>

      {/* Main Table Card */}
      <Card>
        <CardHeader className="p-4 sm:p-6 pb-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="relative w-full sm:w-72">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search questions..."
                className="pl-9"
                value={search}
                onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              />
            </div>
            <div className="text-xs text-muted-foreground font-medium">
              Showing <span className="font-semibold text-foreground">{questions.length}</span> questions
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-0 sm:p-6 pt-0">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
              <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent mb-3" />
              <p className="text-sm font-medium">Loading questions...</p>
            </div>
          ) : questions.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center text-muted-foreground px-4">
              <div className="h-12 w-12 rounded-full bg-muted/60 flex items-center justify-center mb-3">
                <HelpCircle className="h-6 w-6 text-muted-foreground/60" />
              </div>
              <h3 className="font-semibold text-foreground">No questions found</h3>
              <p className="text-xs text-muted-foreground mt-1 max-w-sm">
                Add manual test questions or generate a batch using Groq AI.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Question Statement</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Answer</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {questions.map((q) => (
                    <TableRow key={q.id}>
                      <TableCell className="font-medium text-foreground max-w-md truncate">
                        {q.question}
                      </TableCell>
                      <TableCell>
                        <Badge variant={q.type === 'PROGRAMMING' ? 'default' : 'secondary'} className="text-[11px]">
                          {q.type || 'MCQ'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {q.type === 'PROGRAMMING' ? (
                          <span className="text-xs text-muted-foreground font-mono">Code Evaluation</span>
                        ) : (
                          <Badge variant="success" className="text-[11px]">
                            Option {q.correct_answer}
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 rounded-lg text-primary hover:text-primary hover:bg-primary/10"
                            onClick={() => openModal(q.id)}
                            disabled={isFetchingDetail}
                            title="Edit"
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 rounded-lg text-destructive hover:text-destructive hover:bg-destructive/10"
                            onClick={() => setDeleteConfirmId(q.id)}
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

      {/* Add / Edit Question Modal */}
      <Modal isOpen={modalState.isOpen} onClose={closeModal} title={modalState.data ? 'Edit Question' : 'Add New Question'} size="lg">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Question Type</label>
            <select 
              className="w-full rounded-xl border border-input bg-background/80 p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
              {...register('type')}
            >
              <option value="MCQ">Multiple Choice (MCQ)</option>
              <option value="PROGRAMMING">Programming Challenge</option>
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Question Text</label>
            <textarea
              rows={3}
              className="w-full rounded-xl border border-input bg-background/80 p-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
              placeholder={selectedType === 'PROGRAMMING' ? "Enter problem description..." : "Enter the assessment question..."}
              {...register('question')}
            />
            {errors.question && <p className="text-xs text-destructive mt-1">{errors.question.message}</p>}
          </div>

          {selectedType === 'MCQ' && (
            <div className="space-y-4 pt-2 border-t border-border/60">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Option A</label>
                  <Input {...register('option_a')} placeholder="Option A text" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Option B</label>
                  <Input {...register('option_b')} placeholder="Option B text" />
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Option C</label>
                  <Input {...register('option_c')} placeholder="Option C text" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Option D</label>
                  <Input {...register('option_d')} placeholder="Option D text" />
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Correct Answer</label>
                <select 
                  className="w-full rounded-xl border border-input bg-background/80 p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
                  {...register('correct_answer')}
                >
                  <option value="A">Option A</option>
                  <option value="B">Option B</option>
                  <option value="C">Option C</option>
                  <option value="D">Option D</option>
                </select>
              </div>
            </div>
          )}

          <div className="flex justify-end gap-2 pt-3 border-t border-border/60">
            <Button type="button" variant="outline" onClick={closeModal}>
              Cancel
            </Button>
            <Button type="submit" disabled={isCreating || isUpdating}>
              {isCreating || isUpdating ? 'Saving...' : 'Save Question'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal isOpen={!!deleteConfirmId} onClose={() => setDeleteConfirmId(null)} title="Confirm Deletion" size="sm">
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Are you sure you want to delete this question?
          </p>
          <div className="flex justify-end gap-2 pt-2 border-t border-border/60">
            <Button variant="outline" onClick={() => setDeleteConfirmId(null)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete} disabled={isDeleting}>
              {isDeleting ? 'Deleting...' : 'Delete Question'}
            </Button>
          </div>
        </div>
      </Modal>

      {/* AI Bulk Generation Modal */}
      <Modal isOpen={isBulkModalOpen} onClose={() => setIsBulkModalOpen(false)} title="Generate AI Questions (Groq)" size="md">
        <div className="space-y-4">
          <p className="text-xs text-muted-foreground">
            Groq Llama-3 AI will generate 10 structured multiple-choice questions on your specified topic and save them directly into your question bank.
          </p>
          <div className="space-y-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Topic or Tech Stack</label>
            <Input 
              placeholder="e.g., React 19 Hooks, PostgreSQL Indexing, Docker" 
              value={aiTopic} 
              onChange={(e) => setAiTopic(e.target.value)} 
              disabled={isGeneratingQuestion} 
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Difficulty Level</label>
            <select 
              className="w-full rounded-xl border border-input bg-background/80 p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
              value={aiDifficulty} 
              onChange={(e) => setAiDifficulty(e.target.value)} 
              disabled={isGeneratingQuestion}
            >
              <option value="Easy">Easy</option>
              <option value="Medium">Medium</option>
              <option value="Hard">Hard</option>
            </select>
          </div>
          <div className="flex justify-end gap-2 pt-3 border-t border-border/60">
            <Button type="button" variant="outline" onClick={() => setIsBulkModalOpen(false)} disabled={isGeneratingQuestion}>
              Cancel
            </Button>
            <Button onClick={handleGenerateQuestion} disabled={isGeneratingQuestion} className="gap-2">
              <Sparkles className="h-4 w-4" />
              <span>{isGeneratingQuestion ? 'Generating Questions...' : 'Generate 10 Questions'}</span>
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default QuestionsPage;
