import { useEffect, useState } from "react";
import { BookSDK } from "../Api/bookSDK";
import { AppSDK } from "../Api/appSdk";
import BookCard from "../components/BookCard";
import BookDetailModal from "../components/bookDetailsModal.jsx";
import "./BrowseBook.css";

export default function BrowseBooks() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [nearbyLoading, setNearbyLoading] = useState(false);
  const [selectedBook, setSelectedBook] = useState(null);
  const [search, setSearch] = useState("");
  const fetchBooks = async () => {
    try {
      setLoading(true);
      const data = await BookSDK.getAll();
      setBooks(data);
    } catch (err) {
      console.error(err);
      alert("Error fetching books");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, []);
  const handleNearby = async () => {
    try {
      setNearbyLoading(true);

      const loc = await AppSDK.getCurrentLocation();

      if (!loc?.lat || !loc?.lng) {
        throw new Error("Invalid location");
      }

      const data = await BookSDK.getNearby(loc.lat, loc.lng);
      setBooks(data);

    } catch (err) {
      console.error(err);
      alert("Location error");
    } finally {
      setNearbyLoading(false);
    }
  };
  const filteredBooks = books.filter((book) =>
    (book.title + book.author)
      .toLowerCase()
      .includes(search.toLowerCase())
  );
  if (loading) {
    return <p className="loading">Loading books...</p>;
  }

  return (
    <div className="dashboard-layout">
      <div className="main-content">
        <div className="top-bar">
          <h2>Browse Books</h2>

          <div className="top-actions">
            <input
              type="text"
              placeholder="Search by title or author..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="search-input"
            />

            <button className="nearby-btn" onClick={handleNearby}>
              {nearbyLoading ? "Finding..." : "📍 Near Me"}
            </button>
          </div>
        </div>
        {filteredBooks.length === 0 ? (
          <p className="empty">No books available</p>
        ) : (
          <div className="books-grid">
            {filteredBooks.map((book) => (
              <BookCard
                key={book._id}
                book={book}
                onSelect={setSelectedBook} 
              />
            ))}
          </div>
        )}

      </div>
      {selectedBook && (
        <BookDetailModal
          book={selectedBook}
          onClose={() => setSelectedBook(null)}
        />
      )}
    </div>
  );
}