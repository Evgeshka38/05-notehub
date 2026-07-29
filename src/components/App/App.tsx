import { useState } from 'react';
import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
import { useDebouncedCallback } from 'use-debounce';

import NoteList from '../NoteList/NoteList';
import Pagination from '../Pagination/Pagination';
import SearchBox from '../SearchBox/SearchBox';
import Modal from '../Modal/Modal';
import NoteForm from '../NoteForm/NoteForm';

import Loader from '../Loader/Loader';
import ErrorMessage from '../ErrorMessage/ErrorMessage';

import {
  createNote,
  deleteNote,
  fetchNotes,
  type CreateNoteData,
} from '../../services/noteService';

import css from './App.module.css';

const PER_PAGE = 12;

  const App = () => {
  const [page, setPage] = useState(1);
  const [searchInput, setSearchInput] = useState('');
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deletingNoteId, setDeletingNoteId] = useState<string | null>(
    null,
  );

  const queryClient = useQueryClient();

  const updateSearch = useDebouncedCallback((value: string) => {
    setSearch(value.trim());
    setPage(1);
  }, 500);

  const handleSearchChange = (value: string) => {
    setSearchInput(value);
    updateSearch(value);
  };

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const { data, isLoading, isError } = useQuery({
    queryKey: ['notes', page, search],
    queryFn: () =>
      fetchNotes({
        page,
        perPage: PER_PAGE,
        search,
      }),
    placeholderData: keepPreviousData,
  });

  const createMutation = useMutation({
    mutationFn: createNote,

    onSuccess: async () => {
      setPage(1);
      setIsModalOpen(false);

      await queryClient.invalidateQueries({
        queryKey: ['notes'],
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteNote,

    onMutate: noteId => {
      setDeletingNoteId(noteId);
    },

    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ['notes'],
      });
    },

    onSettled: () => {
      setDeletingNoteId(null);
    },
  });

  const handleCreateNote = async (
    values: CreateNoteData,
  ): Promise<void> => {
    await createMutation.mutateAsync(values);
  };

  const handleDeleteNote = (noteId: string) => {
    deleteMutation.mutate(noteId);
  };

  const notes = data?.notes ?? [];
  const totalPages = data?.totalPages ?? 0;

  return (
    <div className={css.app}>
      <header className={css.toolbar}>
        <SearchBox
          value={searchInput}
          onChange={handleSearchChange}
        />

        {totalPages > 1 && (
          <Pagination
            page={page}
            totalPages={totalPages}
            onChange={setPage}
          />
        )}

        <button
          type="button"
          className={css.button}
          onClick={handleOpenModal}
        >
          Create note +
        </button>
      </header>

      {isLoading && <Loader />}

      {isError && (
        <ErrorMessage message="There was an error loading notes." />
      )}

      {deleteMutation.isError && (
        <ErrorMessage message="There was an error deleting the note." />
      )}

      {notes.length > 0 && !isError && (
        <NoteList
          notes={notes}
          onDelete={handleDeleteNote}
          deletingNoteId={deletingNoteId}
        />
      )}

      {isModalOpen && (
        <Modal onClose={handleCloseModal}>
          <NoteForm
            onSubmit={handleCreateNote}
            onCancel={handleCloseModal}
          />

          {createMutation.isError && (
            <ErrorMessage message="There was an error creating the note." />
          )}
        </Modal>
      )}
    </div>
  );
}

export default App;