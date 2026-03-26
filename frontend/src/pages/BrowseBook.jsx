import { useEffect, useState } from "react";
import { BookSDK } from "../Api/bookSDK";
import {AppSDK} from '../Api/appSdk'
import "./BrowseBook.css";

export default function BrowseBooks() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [nearbyLoading, setNearbyLoading] = useState(false);
  const [search, setSearch] = useState("");
  const fetchBooks = async () => {
    try {
      setLoading(true);
      const data = await BookSDK.getAll();
      setBooks(data);
    } catch (err){
      alert(err);
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
      const data = await BookSDK.getNearby(loc.lat, loc.lng);

      setBooks(data);
    } catch (err) {
      alert(err);
    } finally {
      setNearbyLoading(false);
    }
  };
  const handleAction = async (id, action) => {
    try {
      let days = 1;

      if (action === "rent") {
        const input = prompt("Enter number of days:");
        days = Number(input);
        if (!days || days <= 0) return;
      }

      await BookSDK.handleAction(id, action, days);

      alert("Success!");
      fetchBooks();
    } catch (err) {
      alert(err);
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
          <h2>Browse Books </h2>

          <div className="top-actions">
            <input
              type="text"
              placeholder="Search by title or author..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="search-input"
            />

            <button className="nearby-btn" onClick={handleNearby}>
              {nearbyLoading ? "Finding..." : "Near Me"}
            </button>
          </div>
        </div>

        {filteredBooks.length === 0 ? (
          <p className="empty">No books available</p>
        ) : (
          <div className="books-grid">

            {filteredBooks.map((book) => (
              <div key={book._id} className="book-card">

                {book.image && (
                  <img src={book.image} alt={book.title} />
                )}

                <div className="card-body">
                  <h3>{book.title}</h3>
                  <p className="author">{book.author}</p>

                  <p className="price">
                    {book.isForSale && `₹${book.salePrice}`}
                    {book.isForRent && `₹${book.rentPricePerDay}/day`}
                  </p>

                  <p className="location">
                    📍 {book.location?.city || "N/A"}, {book.location?.area || ""}
                  </p>

                  <div className="actions">
                    {book.isForSale && (
                      <button
                        className="buy-btn"
                        onClick={() => handleAction(book._id, "buy")}
                      >
                        Buy
                      </button>
                    )}

                    {book.isForRent && (
                      <button
                        className="rent-btn"
                        onClick={() => handleAction(book._id, "rent")}
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
    </div>
  );
}