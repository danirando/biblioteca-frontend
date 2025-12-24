import React from "react";
import type { Book } from "../types";

interface BookListProps {
  books: Book[];
  onEdit: (book: Book) => void;
  onDelete: (id: number) => void; // 1. Aggiunto il tipo per la cancellazione
}

const BookList: React.FC<BookListProps> = ({ books, onEdit, onDelete }) => {
  return (
    <div className="book-list">
      {books.length === 0 ? (
        <p>Nessun libro trovato.</p>
      ) : (
        <ul style={{ listStyle: "none", padding: 0 }}>
          {books.map((book) => (
            <li
              key={book.id}
              style={{
                border: "1px solid #ddd",
                margin: "10px 0",
                padding: "10px",
                borderRadius: "4px",
              }}>
              <strong>{book.titolo}</strong> - {book.autore} (Anno: {book.anno})
              <br />
              <div style={{ marginTop: "10px", display: "flex", gap: "10px" }}>
                <button
                  onClick={() => onEdit(book)}
                  style={{
                    backgroundColor: "#007bff",
                    color: "white",
                    border: "none",
                    padding: "5px 10px",
                    cursor: "pointer",
                  }}>
                  Modifica
                </button>

                {/* 2. Nuovo pulsante Elimina */}
                <button
                  onClick={() => book.id && onDelete(book.id)}
                  style={{
                    backgroundColor: "#dc3545",
                    color: "white",
                    border: "none",
                    padding: "5px 10px",
                    cursor: "pointer",
                  }}>
                  Elimina
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default BookList;
