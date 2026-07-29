import type { Note } from '../../types/note';

import css from './NoteList.module.css';

interface NoteListProps {
  notes: Note[];
  onDelete: (noteId: string) => void;
  deletingNoteId: string | null;
}

const NoteList = ({
  notes,
  onDelete,
  deletingNoteId,
}: NoteListProps) => {
  return (
    <ul className={css.list}>
      {notes.map(note => {
        const isDeleting = deletingNoteId === note.id;

        return (
          <li key={note.id} className={css.listItem}>
            <h2 className={css.title}>{note.title}</h2>

            <p className={css.content}>{note.content}</p>

            <div className={css.footer}>
              <span className={css.tag}>{note.tag}</span>

              <button
                type="button"
                className={css.button}
                onClick={() => onDelete(note.id)}
                disabled={isDeleting}
              >
                {isDeleting ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </li>
        );
      })}
    </ul>
  );
}

export default NoteList;