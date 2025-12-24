import React from "react";
import type { Book } from "../types";

interface BookCardProps {
  book: Book;
  onBack: () => void;
}

const BookCard: React.FC<BookCardProps> = ({ book, onBack }) => {
  return (
    <div
      style={{
        padding: "20px",
        border: "1px solid #ccc",
        borderRadius: "10px",
        backgroundColor: "#f9f9f9",
      }}>
      <button
        onClick={onBack}
        style={{ marginBottom: "20px", cursor: "pointer" }}>
        ⬅️ Torna alla lista
      </button>

      <h2
        style={{
          color: "#333",
          borderBottom: "2px solid #007bff",
          paddingBottom: "10px",
        }}>
        Dettagli Libro
      </h2>

      <div style={{ lineHeight: "1.6", marginTop: "20px" }}>
        <p>
          <strong>Titolo:</strong> {book.titolo}
        </p>
        <p>
          <strong>Autore:</strong> {book.autore}
        </p>
        <p>
          <strong>Anno di pubblicazione:</strong> {book.anno}
        </p>
        {book.descrizione && (
          <p>
            <strong>Descrizione:</strong>
            <br /> {book.descrizione}
          </p>
        )}
      </div>
    </div>
  );
};

export default BookCard;
