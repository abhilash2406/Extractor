import { useState } from 'react';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useQuestions, useCreateQuestion, useUpdateQuestion, useDeleteQuestion } from '../../hooks/useQuestions';
import Modal from '../../components/ui/Modal';

import * as questionsApi from '../../api/questions.api';
import toast from 'react-hot-toast';

const schema = yup.object().shape({
  question: yup.string().required('Question is required'),
  option_a: yup.string().required('Option A is required'),
  option_b: yup.string().required('Option B is required'),
  option_c: yup.string().required('Option C is required'),
  option_d: yup.string().required('Option D is required'),
  correct_answer: yup.string().required('Correct answer is required').oneOf(['A', 'B', 'C', 'D']),
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

  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    resolver: yupResolver(schema),
  });

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
          question: q.question,
          option_a: q.option_a,
          option_b: q.option_b,
          option_c: q.option_c,
          option_d: q.option_d,
          correct_answer: mappedCorrectAnswer,
        });
        setModalState({ isOpen: true, data: q });
      } catch (err) {
        toast.error('Failed to fetch question details');
      } finally {
        setIsFetchingDetail(false);
      }
    } else {
      reset({ question: '', option_a: '', option_b: '', option_c: '', option_d: '', correct_answer: 'A' });
      setModalState({ isOpen: true, data: null });
    }
  };

  const closeModal = () => {
    setModalState({ isOpen: false, data: null });
    reset();
  };

  const onSubmit = (data) => {
    if (modalState.data?.id) {
      updateQuestion({ id: modalState.data.id, data }, { onSuccess: closeModal });
    } else {
      createQuestion(data, { onSuccess: closeModal });
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
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h4 className="fw-bold tracking-tight text-dark mb-0">Questions</h4>
        <button className="btn btn-dark fw-medium shadow-sm" onClick={() => openModal()}>
          <i className="bi bi-plus-lg me-2"></i>Add Question
        </button>
      </div>

      <div className="bg-white rounded-4 shadow-soft border p-4 mb-4">
        <div className="mb-4" style={{ maxWidth: '300px' }}>
          <div className="position-relative">
            <i className="bi bi-search position-absolute top-50 translate-middle-y text-muted ms-3"></i>
            <input 
              type="text" 
              className="form-control input-stylish ps-5" 
              placeholder="Search questions..." 
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            />
          </div>
        </div>

        {isLoading ? (
          <div className="text-center py-5"><div className="spinner-border text-primary" /></div>
        ) : questions.length === 0 ? (
          <div className="text-center py-5 text-muted">No questions found.</div>
        ) : (
          <div className="table-responsive">
            <table className="table table-hover align-middle">
              <thead className="table-light">
                <tr>
                  <th className="fw-semibold text-muted small text-uppercase">Question</th>
                  <th className="fw-semibold text-muted small text-uppercase">Correct Option</th>
                  <th className="fw-semibold text-muted small text-uppercase text-end">Actions</th>
                </tr>
              </thead>
              <tbody>
                {questions.map((q) => (
                  <tr key={q.id}>
                    <td className="fw-medium text-dark">
                      <div className="text-truncate" style={{maxWidth: '400px'}} title={q.question}>{q.question}</div>
                    </td>
                    <td><span className="badge bg-success-subtle text-success border border-success-subtle">Option {q.correct_answer}</span></td>
                    <td className="text-end">
                      <button 
                        className="btn btn-sm btn-light text-primary border-0 me-2" 
                        title="Edit"
                        onClick={() => openModal(q.id)}
                        disabled={isFetchingDetail}
                      >
                        <i className="bi bi-pencil"></i>
                      </button>
                      <button 
                        className="btn btn-sm btn-light text-danger border-0" 
                        title="Delete"
                        onClick={() => setDeleteConfirmId(q.id)}
                      >
                        <i className="bi bi-trash"></i>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {meta.totalPages > 1 && (
          <div className="d-flex justify-content-between align-items-center mt-3">
            <div className="small text-muted">
              Showing page {meta.page} of {meta.totalPages}
            </div>
            <div className="d-flex gap-2">
              <button 
                className="btn btn-sm btn-light border" 
                disabled={meta.page <= 1}
                onClick={() => setPage(p => Math.max(1, p - 1))}
              >
                Previous
              </button>
              <button 
                className="btn btn-sm btn-light border" 
                disabled={meta.page >= meta.totalPages}
                onClick={() => setPage(p => p + 1)}
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Add/Edit Question Modal */}
      <Modal isOpen={modalState.isOpen} onClose={closeModal} title={modalState.data ? 'Edit Question' : 'Add New Question'} size="lg">
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-3">
            <label className="form-label small fw-semibold text-dark">Question Text</label>
            <textarea 
              className={`form-control input-stylish ${errors.question ? 'is-invalid' : ''}`} 
              rows="3"
              placeholder="Enter the test question..."
              {...register('question')} 
            />
            {errors.question && <div className="invalid-feedback">{errors.question.message}</div>}
          </div>
          
          <div className="row mb-3">
            <div className="col-md-6 mb-3 mb-md-0">
              <label className="form-label small fw-semibold text-dark">Option A</label>
              <input type="text" className={`form-control input-stylish ${errors.option_a ? 'is-invalid' : ''}`} {...register('option_a')} />
              {errors.option_a && <div className="invalid-feedback">{errors.option_a.message}</div>}
            </div>
            <div className="col-md-6">
              <label className="form-label small fw-semibold text-dark">Option B</label>
              <input type="text" className={`form-control input-stylish ${errors.option_b ? 'is-invalid' : ''}`} {...register('option_b')} />
              {errors.option_b && <div className="invalid-feedback">{errors.option_b.message}</div>}
            </div>
          </div>

          <div className="row mb-4">
            <div className="col-md-6 mb-3 mb-md-0">
              <label className="form-label small fw-semibold text-dark">Option C</label>
              <input type="text" className={`form-control input-stylish ${errors.option_c ? 'is-invalid' : ''}`} {...register('option_c')} />
              {errors.option_c && <div className="invalid-feedback">{errors.option_c.message}</div>}
            </div>
            <div className="col-md-6">
              <label className="form-label small fw-semibold text-dark">Option D</label>
              <input type="text" className={`form-control input-stylish ${errors.option_d ? 'is-invalid' : ''}`} {...register('option_d')} />
              {errors.option_d && <div className="invalid-feedback">{errors.option_d.message}</div>}
            </div>
          </div>

          <div className="mb-4">
            <label className="form-label small fw-semibold text-dark">Correct Answer</label>
            <select className={`form-select input-stylish ${errors.correct_answer ? 'is-invalid' : ''}`} {...register('correct_answer')}>
              <option value="A">Option A</option>
              <option value="B">Option B</option>
              <option value="C">Option C</option>
              <option value="D">Option D</option>
            </select>
            {errors.correct_answer && <div className="invalid-feedback">{errors.correct_answer.message}</div>}
          </div>

          <div className="d-flex justify-content-end gap-2 border-top pt-3">
            <button type="button" className="btn btn-light border" onClick={closeModal}>Cancel</button>
            <button type="submit" className="btn btn-dark" disabled={isCreating || isUpdating}>
              {isCreating || isUpdating ? 'Saving...' : 'Save Question'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal isOpen={!!deleteConfirmId} onClose={() => setDeleteConfirmId(null)} title="Confirm Deletion" size="sm">
        <p className="text-muted mb-4">Are you sure you want to delete this question? This action cannot be undone.</p>
        <div className="d-flex justify-content-end gap-2">
          <button type="button" className="btn btn-light border" onClick={() => setDeleteConfirmId(null)}>Cancel</button>
          <button type="button" className="btn btn-danger" onClick={handleDelete} disabled={isDeleting}>
            {isDeleting ? 'Deleting...' : 'Delete'}
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default QuestionsPage;
