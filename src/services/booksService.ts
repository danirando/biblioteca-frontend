// src/services/booksService.ts (o nella tua cartella dedicata)
import api from "../services/api"; // Importa l'istanza configurata prima

export interface Book {
  id?: number;
  titolo: string;
  autore: string;
  descrizione?: string;
  anno?: number;
  genere?: string;
}

// src/services/booksService.ts

// Ottenere tutti i libri
export const getAllBooks = async (): Promise<Book[]> => {
  const response = await api.get<Book[]>("/books");
  return response.data;
};

// Ottenere un libro specifico
export const getBookById = async (id: number): Promise<Book> => {
  const response = await api.get<Book>(`/books/${id}`);
  return response.data;
};

// Creare un nuovo libro
export const createBook = async (bookData: Book): Promise<Book> => {
  const response = await api.post<Book>("/books", bookData);
  return response.data;
};

// Aggiornare un libro esistente
export const updateBook = async (id: number, bookData: Book): Promise<Book> => {
  const response = await api.put<Book>(`/books/${id}`, bookData);
  return response.data;
};

// Eliminare un libro
export const deleteBook = async (id: number): Promise<void> => {
  await api.delete(`/books/${id}`);
};
