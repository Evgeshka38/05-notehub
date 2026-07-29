import { useMutation, useQueryClient } from '@tanstack/react-query';
import { ErrorMessage, Field, Form, Formik } from 'formik';
import * as Yup from 'yup';

import {
  createNote,
  type CreateNoteData,
} from '../../services/noteService';
import type { NoteTag } from '../../types/note';

import css from './NoteForm.module.css';

const initialValues: CreateNoteData = {
  title: '',
  content: '',
  tag: 'Todo',
};

const validationSchema = Yup.object({
  title: Yup.string()
    .min(3, 'Title must be at least 3 characters')
    .max(50, 'Title must be at most 50 characters')
    .required('Title is required'),

  content: Yup.string().max(
    500,
    'Content must be at most 500 characters',
  ),

  tag: Yup.mixed<NoteTag>()
    .oneOf(
      ['Todo', 'Work', 'Personal', 'Meeting', 'Shopping'],
      'Select a valid tag',
    )
    .required('Tag is required'),
});

interface NoteFormProps {
  onCancel: () => void;
}

const NoteForm = ({ onCancel }: NoteFormProps) => {
  const queryClient = useQueryClient();

  const createMutation = useMutation({
    mutationFn: createNote,

    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ['notes'],
      });

      onCancel();
    },
  });

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={async (values, actions) => {
        try {
          await createMutation.mutateAsync(values);
          actions.resetForm();
        } finally {
          actions.setSubmitting(false);
        }
      }}
    >
      {({ isSubmitting }) => {
        const isCreating =
          isSubmitting || createMutation.isPending;

        return (
          <Form className={css.form}>
            <div className={css.formGroup}>
              <label htmlFor="title">Title</label>

              <Field
                id="title"
                type="text"
                name="title"
                className={css.input}
              />

              <ErrorMessage
                name="title"
                component="span"
                className={css.error}
              />
            </div>

            <div className={css.formGroup}>
              <label htmlFor="content">Content</label>

              <Field
                as="textarea"
                id="content"
                name="content"
                rows={8}
                className={css.textarea}
              />

              <ErrorMessage
                name="content"
                component="span"
                className={css.error}
              />
            </div>

            <div className={css.formGroup}>
              <label htmlFor="tag">Tag</label>

              <Field
                as="select"
                id="tag"
                name="tag"
                className={css.select}
              >
                <option value="Todo">Todo</option>
                <option value="Work">Work</option>
                <option value="Personal">Personal</option>
                <option value="Meeting">Meeting</option>
                <option value="Shopping">Shopping</option>
              </Field>

              <ErrorMessage
                name="tag"
                component="span"
                className={css.error}
              />
            </div>

            {createMutation.isError && (
              <p className={css.error} role="alert">
                There was an error creating the note.
              </p>
            )}

            <div className={css.actions}>
              <button
                type="button"
                className={css.cancelButton}
                onClick={onCancel}
                disabled={isCreating}
              >
                Cancel
              </button>

              <button
                type="submit"
                className={css.submitButton}
                disabled={isCreating}
              >
                {isCreating ? 'Creating...' : 'Create note'}
              </button>
            </div>
          </Form>
        );
      }}
    </Formik>
  );
};

export default NoteForm;