import axios from 'axios';

import type { Note, NoteTag } from '../types/note';

const BASE_URL = 'https://notehub-public.goit.study/api';
const token = import.meta.env.VITE_NOTEHUB_TOKEN;

interface GetNotesParams {
  page: number;
  perPage: number;
  search?: string;
}

export interface FetchNotesResponse {
  notes: Note[];
  totalPages: number;
}

export interface CreateNoteData {
  title: string;
  content: string;
  tag: NoteTag;
}

const noteApi = axios.create({
  baseURL: BASE_URL,
  headers: {
    Authorization: `Bearer ${token}`,
  },
});

export const fetchNotes = async({
  page,
  perPage,
  search,
}: GetNotesParams): Promise<FetchNotesResponse> => {
  const response = await noteApi.get<FetchNotesResponse>('/notes', {
    params: {
      page,
      perPage,
      search: search || undefined,
    },
  });

  return response.data;
}

export const createNote = async(
  note: CreateNoteData,
): Promise<Note> => {
  const response = await noteApi.post<Note>('/notes', note);

  return response.data;
}

export const deleteNote = async(noteId: string): Promise<Note> => {
  const response = await noteApi.delete<Note>(
    `/notes/${noteId}`,
  );

  return response.data;
}