import { useEffect, useState } from "react";
import BookList from "./components/BookList";
import type { Book, PaginationData } from "./types";
import BookForm from "./components/BookForm";

function App() {
  const [books, setBooks] = useState<Book[]>([]);
  const [editingBook, setEditingBook] = useState<Book | null>(null);
  const [isAddingNew, setIsAddingNew] = useState<boolean>(false); // Stato per il nuovo libro
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [paginationLinks, setPaginationLinks] = useState<PaginationData | null>(
    null
  );

  // FILTRO: Calcolato in modo sicuro
  const filteredBooks = Array.isArray(books)
    ? books.filter((book) => {
        const t = book.titolo?.toLowerCase() || "";
        const a = book.autore?.toLowerCase() || "";
        const s = searchTerm.toLowerCase();
        return t.includes(s) || a.includes(s);
      })
    : [];

  // FETCH INIZIALE
  // 1. DEFINISCI la funzione qui (fuori dallo useEffect)
  const fetchBooks = async (url = "http://localhost:8000/api/books") => {
    setIsLoading(true);
    try {
      const response = await fetch(url);
      const responseData = await response.json();

      // Se la risposta è paginata, i libri sono in .data
      const booksArray = Array.isArray(responseData)
        ? responseData
        : responseData.data;
      setBooks(booksArray || []);

      // Se la risposta contiene i dati di paginazione, li salviamo
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
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  // 2. RICHIAMALA nello useEffect al caricamento iniziale
  useEffect(() => {
    fetchBooks();
  }, []);

  const handleSaveBook = async (
    bookData: Omit<Book, "id"> & { id?: number }
  ) => {
    setIsLoading(true);
    setError(null);

    const isEditing = !!bookData.id;

    // Assicurati che l'URL sia corretto. Se usi .env, verifica che VITE_API_BASE_URL
    // finisca con /api/books o aggiungilo qui:
    const url = isEditing
      ? `${import.meta.env.VITE_API_BASE_URL}/${bookData.id}`
      : `${import.meta.env.VITE_API_BASE_URL}`;

    try {
      const response = await fetch(url, {
        method: isEditing ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(bookData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        // Se Laravel fallisce la validazione, vedrai i dettagli qui
        console.error("Dettagli errore validazione:", errorData.errors);
        throw new Error(errorData.message || "Errore nel salvataggio");
      }

      const responseData = await response.json();
      console.log("Risposta dal server:", responseData);

      // ESECUZIONE AGGIORNAMENTO:
      // Poiché il tuo controller restituisce { data: { ... } },
      // ricaricare tutto dal server è la scelta più sicura per il DB e la paginazione.
      await fetchBooks();

      // Chiudi i form
      setEditingBook(null);
      setIsAddingNew(false);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Errore di connessione al server"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteBook = async (id: number) => {
    if (!window.confirm("Sei sicuro di voler eliminare questo libro?")) return;

    setIsLoading(true);
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/${id}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) throw new Error("Errore durante l'eliminazione");

      setBooks((prevBooks) => prevBooks.filter((b) => b.id !== id));
    } catch (err: unknown) {
      // TypeScript tipizza err come unknown
      // Controllo di sicurezza
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Si è verificato un errore imprevisto");
      }
      console.error("Dettagli errore:", err);
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div
      className="app-container"
      style={{ padding: "20px", maxWidth: "800px", margin: "0 auto" }}>
      <h1>📚 Gestione Libreria</h1>

      <div style={{ display: "flex", gap: "10px", marginBottom: "20px" }}>
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Cerca titolo o autore..."
          style={{ flex: 1, padding: "10px" }}
        />
        <button
          onClick={() => {
            setIsAddingNew(true);
            setEditingBook(null);
          }}
          style={{
            padding: "10px",
            backgroundColor: "#28a745",
            color: "white",
            border: "none",
            cursor: "pointer",
          }}>
          + Nuovo Libro
        </button>
      </div>

      {error && <p style={{ color: "red" }}>{error}</p>}

      {/* FORM: Si mostra se stiamo aggiungendo O modificando */}
      {(isAddingNew || editingBook) && (
        <BookForm
          // Questa è la chiave magica: se cambia l'ID, il form si resetta da solo
          key={editingBook?.id || "new-book"}
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
          books={filteredBooks}
          onEdit={(book) => {
            setEditingBook(book);
            setIsAddingNew(false);
          }}
          onDelete={handleDeleteBook} // <--- Passa la funzione qui
        />
      )}

      {!isLoading && paginationLinks && (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: "20px",
            marginTop: "20px",
          }}>
          <button
            disabled={!paginationLinks.prev_page_url}
            // Se l'url esiste lo usiamo, altrimenti non facciamo nulla
            onClick={() =>
              paginationLinks.prev_page_url &&
              fetchBooks(paginationLinks.prev_page_url)
            }>
            ⬅️ Precedente
          </button>

          <span>
            Pagina {paginationLinks.current_page} di {paginationLinks.last_page}
          </span>

          <button
            disabled={!paginationLinks.next_page_url}
            onClick={() =>
              paginationLinks.next_page_url &&
              fetchBooks(paginationLinks.next_page_url)
            }>
            Successiva ➡️
          </button>
        </div>
      )}
    </div>
  );
}

export default App;
