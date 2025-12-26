import { useEffect, useState } from "react";
import BookList from "./components/BookList";
import BookForm from "./components/BookForm";
import BookCard from "./components/BookCard";
import type { Book, PaginationData } from "./types";
import "./index.css"; // <--- Importa qui il CSS

function App() {
  const [books, setBooks] = useState<Book[]>([]);
  const [editingBook, setEditingBook] = useState<Book | null>(null);
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [isAddingNew, setIsAddingNew] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [paginationLinks, setPaginationLinks] = useState<PaginationData | null>(
    null
  );

  const fetchBooks = async (url = "http://localhost:8000/api/books") => {
    setIsLoading(true);
    setError(null); // Reset dell'errore ad ogni tentativo
    try {
      const fetchUrl = new URL(url);
      if (searchTerm) fetchUrl.searchParams.append("search", searchTerm);

      const response = await fetch(fetchUrl.toString());
      if (!response.ok)
        throw new Error("Errore durante il caricamento dei dati");

      const responseData = await response.json();
      const booksArray = Array.isArray(responseData)
        ? responseData
        : responseData.data;

      setBooks(booksArray || []);
      if (responseData.current_page) {
        setPaginationLinks({
          current_page: responseData.current_page,
          last_page: responseData.last_page,
          prev_page_url: responseData.prev_page_url,
          next_page_url: responseData.next_page_url,
          total: responseData.total,
          links: responseData.links,
        });
      }
    } catch (err) {
      // TypeScript safe check
      const errorMessage =
        err instanceof Error ? err.message : "Errore di connessione.";
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => fetchBooks(), 500);
    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm]);

  const handleSaveBook = async (
    bookData: Omit<Book, "id"> & { id?: number }
  ) => {
    setIsLoading(true);
    setError(null); // Reset dell'errore precedente

    const isEditing = !!bookData.id;
    const baseUrl = import.meta.env.VITE_API_BASE_URL;
    const url = isEditing ? `${baseUrl}/${bookData.id}` : baseUrl;

    try {
      const response = await fetch(url, {
        method: isEditing ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bookData),
      });

      if (!response.ok)
        throw new Error(
          "Salvataggio fallito: il server ha risposto con un errore."
        );

      await fetchBooks(baseUrl);

      setEditingBook(null);
      setIsAddingNew(false);
    } catch (err) {
      // Gestione sicura per TypeScript
      const message =
        err instanceof Error ? err.message : "Errore durante il salvataggio.";
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteBook = async (id: number) => {
    if (!window.confirm("Eliminare definitivamente?")) return;

    setError(null);
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/${id}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) throw new Error("Impossibile eliminare il libro.");

      fetchBooks();
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Errore eliminazione.";
      setError(message);
    }
  };

  return (
    <div className="app-container">
      <h1>📚 Gestione Libreria</h1>

      {error && (
        <div className="error-banner">
          <span>⚠️ {error}</span>
          <button onClick={() => setError(null)} className="error-close-btn">
            X
          </button>
        </div>
      )}

      {selectedBook ? (
        <BookCard book={selectedBook} onBack={() => setSelectedBook(null)} />
      ) : (
        <>
          <div className="search-actions">
            <input
              type="text"
              className="search-input"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Cerca titolo o autore..."
            />
            <button className="btn-add" onClick={() => setIsAddingNew(true)}>
              + Nuovo Libro
            </button>
          </div>

          {(isAddingNew || editingBook) && (
            <BookForm
              key={editingBook?.id || "new"}
              initialData={editingBook}
              onSave={handleSaveBook}
              onCancel={() => {
                setEditingBook(null);
                setIsAddingNew(false);
              }}
            />
          )}

          {isLoading ? (
            <p>Caricamento...</p>
          ) : (
            <BookList
              books={books}
              onEdit={setEditingBook}
              onDelete={handleDeleteBook}
              onViewDetails={setSelectedBook}
            />
          )}

          {!isLoading && paginationLinks && (
            <div className="pagination-container">
              <button
                className="pagination-btn"
                disabled={!paginationLinks.prev_page_url}
                onClick={() => fetchBooks(paginationLinks.prev_page_url!)}>
                ⬅️
              </button>
              <span>
                {paginationLinks.current_page} / {paginationLinks.last_page}
              </span>
              <button
                className="pagination-btn"
                disabled={!paginationLinks.next_page_url}
                onClick={() => fetchBooks(paginationLinks.next_page_url!)}>
                ➡️
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default App;
