import { useEffect, useState } from "react";
import BookList from "./components/BookList";
import type { Book } from "./types";
import BookForm from "./components/BookForm";

function App() {
  const [books, setBooks] = useState<Book[]>([]);
  const [editingBook, setEditingBook] = useState<Book | null>(null);
  const [isAddingNew, setIsAddingNew] = useState<boolean>(false); // Stato per il nuovo libro
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

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
  useEffect(() => {
    const fetchBooks = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch("http://localhost:8000/api/books");
        if (!response.ok) throw new Error("Errore nel caricamento");

        const data = await response.json();
        // Gestione risposta Laravel/API: se i dati sono dentro data.data o solo data
        const finalData = Array.isArray(data) ? data : data.data || [];
        setBooks(finalData);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Errore sconosciuto");
      } finally {
        setIsLoading(false);
      }
    };
    fetchBooks();
  }, []);

  // SALVATAGGIO (Crea o Aggiorna)
  const handleSaveBook = async (
    bookData: Omit<Book, "id"> & { id?: number }
  ) => {
    setIsLoading(true);
    const isEditing = !!bookData.id;
    const url = isEditing
      ? `${import.meta.env.VITE_API_BASE_URL}/${bookData.id}`
      : `${import.meta.env.VITE_API_BASE_URL}`;

    try {
      const response = await fetch(url, {
        method: isEditing ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bookData),
      });

      if (!response.ok) throw new Error("Errore nel salvataggio");

      const savedBook: Book = await response.json();

      if (isEditing) {
        setBooks(books.map((b) => (b.id === savedBook.id ? savedBook : b)));
      } else {
        setBooks([...books, savedBook]);
      }

      // Chiudi tutto dopo il salvataggio
      setEditingBook(null);
      setIsAddingNew(false);
    } catch (err) {
      // Usiamo 'err' per stampare il motivo del fallimento in console (utile per il debug)
      console.error("Errore durante il salvataggio:", err);
      setError(
        "Impossibile salvare il libro. Controlla la connessione o i dati inseriti."
      );
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
          key={editingBook?.id || "new-form"}
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
        />
      )}
    </div>
  );
}

export default App;
