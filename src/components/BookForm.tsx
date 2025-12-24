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
  const [titolo, setTitolo] = useState(initialData?.titolo || "");
  const [autore, setAutore] = useState(initialData?.autore || "");
  const [anno, setAnno] = useState(
    initialData?.anno || new Date().getFullYear()
  );
  const [genere, setGenere] = useState(initialData?.genere || "");
  const [descrizione, setDescrizione] = useState(
    initialData?.descrizione || ""
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    onSave({
      ...(initialData?.id && { id: initialData.id }),
      titolo,
      autore,
      anno: Number(anno), // Assicuriamoci che sia un numero
      genere,
      descrizione,
    });
  };

  return (
    <form onSubmit={handleSubmit} style={formStyle}>
      <h3>{initialData ? "Modifica Libro" : "Nuovo Libro"}</h3>

      <input
        placeholder="Titolo"
        value={titolo}
        onChange={(e) => setTitolo(e.target.value)}
        required
      />
      <input
        placeholder="Autore"
        value={autore}
        onChange={(e) => setAutore(e.target.value)}
        required
      />
      <input
        type="number"
        placeholder="Anno"
        value={anno}
        onChange={(e) => setAnno(Number(e.target.value))}
        required
      />
      <input
        placeholder="Genere"
        value={genere}
        onChange={(e) => setGenere(e.target.value)}
        required
      />
      <textarea
        placeholder="Descrizione"
        value={descrizione}
        onChange={(e) => setDescrizione(e.target.value)}
        required
      />

      <div style={{ marginTop: "10px" }}>
        <button type="submit">{initialData ? "Aggiorna" : "Salva"}</button>
        <button type="button" onClick={onCancel}>
          Annulla
        </button>
      </div>
    </form>
  );
};

const formStyle: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  gap: "10px",
  padding: "20px",
  border: "1px solid #ddd",
  borderRadius: "8px",
};

export default BookForm;
