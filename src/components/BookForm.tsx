import React, { useState } from "react";
import type { Book } from "../types";

interface BookFormProps {
  initialData: Book | null;
  // Accettiamo l'oggetto completo, con ID opzionale per la creazione
  onSave: (book: Omit<Book, "id"> & { id?: number }) => void;
  onCancel: () => void;
}

const BookForm: React.FC<BookFormProps> = ({
  initialData,
  onSave,
  onCancel,
}) => {
  // Stati locali per tutti i campi dell'interfaccia Book
  // Lo stato viene impostato SOLO alla nascita del componente
  const [titolo, setTitolo] = useState(initialData?.titolo ?? "");
  const [autore, setAutore] = useState(initialData?.autore ?? "");
  const [anno, setAnno] = useState(
    initialData?.anno ?? new Date().getFullYear()
  );
  const [genere, setGenere] = useState(initialData?.genere ?? "");
  const [descrizione, setDescrizione] = useState(
    initialData?.descrizione ?? ""
  );

  const [formError, setFormError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      ...(initialData?.id && { id: initialData.id }),
      titolo,
      autore,
      anno,
      genere,
      descrizione,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="book-form">
      <h3 className="form-title">
        {initialData ? "📝 Modifica Libro" : "✨ Aggiungi Nuovo Libro"}
      </h3>

      {formError && <p className="error-message">{formError}</p>}

      <div className="form-group">
        <label htmlFor="titolo">Titolo</label>
        <input
          id="titolo"
          placeholder="Es: Il Signore degli Anelli"
          value={titolo}
          onChange={(e) => setTitolo(e.target.value)}
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="autore">Autore</label>
        <input
          id="autore"
          placeholder="Es: J.R.R. Tolkien"
          value={autore}
          onChange={(e) => setAutore(e.target.value)}
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="anno">Anno di pubblicazione</label>
        <input
          id="anno"
          type="number"
          placeholder="Es: 1954"
          value={anno}
          onChange={(e) => setAnno(Number(e.target.value))}
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="genere">Genere</label>
        <input
          id="genere"
          placeholder="Es: Fantasy, Romanzo..."
          value={genere}
          onChange={(e) => setGenere(e.target.value)}
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="descrizione">Descrizione / Trama</label>
        <textarea
          id="descrizione"
          placeholder="Inserisci una breve descrizione..."
          value={descrizione}
          onChange={(e) => setDescrizione(e.target.value)}
          required
        />
      </div>

      <div className="form-actions">
        <button type="submit" className="btn-save">
          {initialData ? "Aggiorna Libro" : "Salva Libro"}
        </button>
        <button type="button" onClick={onCancel} className="btn-cancel">
          Annulla
        </button>
      </div>
    </form>
  );
};

export default BookForm;
