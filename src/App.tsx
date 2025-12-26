import { useEffect, useState, useCallback } from "react";
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

  const fetchBooks = useCallback(
    async (url = "http://localhost:8000/api/books") => {
      setIsLoading(true);
      setError(null);

      try {
        const fetchUrl = new URL(url);

        // Aggiungiamo il search param solo se non è già presente nell'URL (utile per la paginazione)
        if (searchTerm && !fetchUrl.searchParams.has("search")) {
          fetchUrl.searchParams.append("search", searchTerm);
        }

        const response = await fetch(fetchUrl.toString());

        if (!response.ok) {
          throw new Error(
            `Errore: ${response.status} - Impossibile caricare i libri`
          );
        }

        const responseData = await response.json();

        // Gestione flessibile della struttura dati (array semplice o paginato)
        const booksArray = Array.isArray(responseData)
          ? responseData
          : responseData.data;
        setBooks(booksArray || []);

        // Aggiornamento link paginazione
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
        const errorMessage =
          err instanceof Error
            ? err.message
            : "Errore di connessione al server.";
        setError(errorMessage);
      } finally {
        setIsLoading(false);
      }
    },
    [searchTerm]
  ); // La funzione viene ricreata solo se il termine di ricerca cambia

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchBooks();
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [fetchBooks]); // Ora fetchBooks è una dipendenza stabile grazie a useCallback

  const handleSaveBook = async (
    bookData: Omit<Book, "id"> & { id?: number }
  ) => {
    setIsLoading(true);
    setError(null);
    const isEditing = !!bookData.id;
    const baseUrl = "http://localhost:8000/api/books"; // Assicurati che coincida con la tua API
    const url = isEditing ? `${baseUrl}/${bookData.id}` : baseUrl;

    try {
      const response = await fetch(url, {
        method: isEditing ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bookData),
      });

      if (!response.ok) throw new Error("Salvataggio fallito.");

      // Reset degli stati del form
      setEditingBook(null);
      setIsAddingNew(false);

      // Ricarichiamo la lista completa
      await fetchBooks(baseUrl);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Errore salvataggio");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteBook = async (id: number) => {
    if (!window.confirm("Eliminare definitivamente?")) return;
    setError(null);
    try {
      const response = await fetch(`http://localhost:8000/api/books/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Eliminazione fallita.");

      fetchBooks(); // Ricarica la pagina corrente
    } catch (err) {
      setError(err instanceof Error ? err.message : "Errore eliminazione");
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
