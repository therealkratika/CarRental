import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase";
import "./MyBook.css";
import { BookSDK } from "../Api/bookSDK";

export default function MyBooks() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchMyBooks = async () => {
    try {
      const data = await BookSDK.getMy();
      setBooks(data);
    } catch (err) {
      alert(err?.message || JSON.stringify(err)); 
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      console.log("User:", user);

      if (user) {
        fetchMyBooks();
      } else {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this book?")) return;

    try {
      await BookSDK.deleteMy(id);

      setBooks((prev) => prev.filter((b) => b._id !== id));

    } catch (err) {
      alert(err?.message || JSON.stringify(err));
    }
  };

  if (loading) return <p className="loading">Loading...</p>;

  return (
    <div className="mybooks-container">
      <h2>My Books</h2>

      {books.length === 0 ? (
        <p>No books added yet</p>
      ) : (
        <div className="books-grid">
          {books.map((book) => (
            <div key={book._id} className="book-card">

              {book.image && (
                <img src={book.image} alt={book.title} />
              )}

              <h3>{book.title}</h3>
              <p>{book.author}</p>

              <p className="price">
                {book.isForSale && `₹${book.salePrice}`}
                {book.isForRent && `₹${book.rentPricePerDay}/day`}
              </p>

              <p className="type">
                {book.isForSale ? "For Sale" : "For Rent"}
              </p>

              <p className="location">
                {book.location?.city}, {book.location?.area}
              </p>

              <p className={`status ${book.status}`}>
                {book.status}
              </p>

              <button
                className="delete-btn"
                onClick={() => handleDelete(book._id)}
              >
                Delete
              </button>

            </div>
          ))}
        </div>
      )}
    </div>
  );
}