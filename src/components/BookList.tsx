import React from "react";
import type { Book } from "../types";

interface BookListProps {
  books: Book[];
  onEdit: (book: Book) => void;
}

const BookList: React.FC<BookListProps> = ({ books, onEdit }) => {
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
              }}>
              <strong>{book.titolo}</strong> - {book.autore} (Anno: {book.anno})
              <br />
              <button onClick={() => onEdit(book)}>Modifica</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default BookList;
