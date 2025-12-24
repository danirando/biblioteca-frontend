import React from "react";
import type { Book } from "../types";

interface BookListProps {
  books: Book[];
  onEdit: (book: Book) => void;
  onDelete: (id: number) => void;
  onViewDetails: (book: Book) => void;
}

const BookList: React.FC<BookListProps> = ({
  books,
  onEdit,
  onDelete,
  onViewDetails,
}) => {
  return (
    <div>
      {books.length === 0 ? (
        <p>Nessun libro trovato.</p>
      ) : (
        <ul style={{ listStyle: "none", padding: 0 }}>
          {books.map((book) => (
            <li
              key={book.id}
              style={{
                border: "1px solid #eee",
                marginBottom: "10px",
                padding: "15px",
                borderRadius: "8px",
                boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
              }}>
              <strong
                onClick={() => onViewDetails(book)}
                style={{
                  cursor: "pointer",
                  color: "#007bff",
                  fontSize: "1.2rem",
                  transition: "all 0.2s",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.textDecoration = "underline";
                  e.currentTarget.style.color = "#0056b3";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.textDecoration = "none";
                  e.currentTarget.style.color = "#007bff";
                }}>
                {book.titolo}
              </strong>
              <div
                style={{ fontSize: "0.9rem", color: "#555", marginTop: "5px" }}>
                di {book.autore} ({book.anno})
              </div>

              <div style={{ marginTop: "12px", display: "flex", gap: "8px" }}>
                <button
                  onClick={() => onEdit(book)}
                  style={{
                    backgroundColor: "#007bff",
                    color: "white",
                    border: "none",
                    padding: "6px 12px",
                    borderRadius: "4px",
                    cursor: "pointer",
                  }}>
                  Modifica
                </button>
                <button
                  onClick={() => book.id && onDelete(book.id)}
                  style={{
                    backgroundColor: "#dc3545",
                    color: "white",
                    border: "none",
                    padding: "6px 12px",
                    borderRadius: "4px",
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
