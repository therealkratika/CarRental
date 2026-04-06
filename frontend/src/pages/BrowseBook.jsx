import { useEffect, useState } from "react";
import { BookSDK } from "../Api/bookSDK";
import { AppSDK } from "../Api/appSdk";
import "./BrowseBook.css";
import BookDetailModal from "../components/bookDetailsModal.jsx";

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
      alert(err?.message || "Error fetching books");
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
    console.log("LOCATION:", loc);

    if (!loc?.lat || !loc?.lng) {
      throw new Error("Invalid location");
    }

    const data = await BookSDK.getNearby(loc.lat, loc.lng);
    console.log("NEARBY BOOKS:", data);

    setBooks(data);

  } catch (err) {
    console.error(err);
    alert(err?.message || "Location error");
  } finally {
    setNearbyLoading(false);
  }
};

  const filteredBooks = books.filter((book) =>
    (book.title + book.author)
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  if (loading) return <p className="loading">Loading books...</p>;

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
              
              <div
                key={book._id}
                className="book-card"
              >
                <img
                  src={
                    book.image || "https://dummyimage.com/200x250/cccccc/000000&text=No+Image"
                  }
                  alt={book.title}
                />
                
                <div className="card-body">
                  <h3>{book.title}</h3>
                  <p className="author">{book.author}</p>
                  <p className="price">
                    {book.isForSale && `₹${book.salePrice}`}
                    {book.isForRent && `₹${book.rentPricePerDay}/day`}
                  </p>
                  <p className="location">
  📍 {book.location?.city
    ? `${book.location.city}, ${book.location.area || ""}`
    : "Location not available"}
</p>
                  <div className="actions">

                    {book.isForSale && (
                      <button
                        className="buy-btn"
                        onClick={() => setSelectedBook(book)}
                      >
                        Buy
                      </button>
                    )}

                    {book.isForRent && (
                      <button
                        className="rent-btn"
                        onClick={() => setSelectedBook(book)}
                      >
                        Rent
                      </button>
                    )}

                  </div>
                </div>
              </div>
            ))}

          </div>
        )}

      </div>
      <BookDetailModal
        book={selectedBook}
        onClose={() => setSelectedBook(null)}
        onActionSuccess={fetchBooks}
      />
    </div>
  );
}