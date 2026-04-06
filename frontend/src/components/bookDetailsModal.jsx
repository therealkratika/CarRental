import { useState } from "react";
import "./BookDetailsModal.css";
import { AppSDK } from "../Api/appSdk";

export default function BookDetailModal({ book, onClose, onActionSuccess }) {
  const [rentalDays, setRentalDays] = useState(7);
  const [loading, setLoading] = useState(false);

  if (!book) return null;
  const handleAction = async (action) => {
    try {
      setLoading(true);

      await AppSDK.handleBookAction(
        book._id,
        action,
        action === "rent" ? rentalDays : 1
      );

      alert("Success!");

      onActionSuccess && onActionSuccess();
      onClose();

    } catch (err) {
      alert(err?.message || "Action failed");
    } finally {
      setLoading(false);
    }
  };
  const handleContact = () => {
    const phone = book.contact?.phone;

    if (!phone) return alert("Phone not available");

    const message = `Hi! I'm interested in your book "${book.title}"`;
    const url = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;

    window.open(url, "_blank");
  };

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <div className="modal-header">
          <h2>Book Details</h2>
          <button onClick={onClose}>✖</button>
        </div>

        <div className="modal-body">

          <div className="book-section">

            <img src={book.image} alt={book.title} />

            <div className="book-info">
              <h3>{book.title}</h3>
              <p className="author">by {book.author}</p>

              <p className="price">
                {book.isForSale && `₹${book.salePrice}`}
                {book.isForRent && `₹${book.rentPricePerDay}/day`}
              </p>

              <p className="location">
                📍 {book.location?.city}, {book.location?.area}
              </p>
              <div className="seller-box">
                <h4>Seller Info</h4>
                <p>👤 {book.contact?.name}</p>
                <p>📞 {book.contact?.phone}</p>
                <p>✉️ {book.contact?.email}</p>
              </div>

            </div>
          </div>
          {book.isForRent && (
            <div className="rent-box">
              <label>Rental Days</label>

              <div className="rent-row">
                <input
                  type="number"
                  min="1"
                  value={rentalDays}
                  onChange={(e) => setRentalDays(e.target.value)}
                />

                <span>
                  Total: ₹
                  {(book.rentPricePerDay * rentalDays).toFixed(2)}
                </span>
              </div>
            </div>
          )}

          {/* ACTION BUTTONS */}
          <div className="actions">

            {book.isForRent && (
              <button
                className="rent-btn"
                onClick={() => handleAction("rent")}
              >
                {loading ? "Processing..." : "Rent"}
              </button>
            )}

            {book.isForSale && (
              <button
                className="buy-btn"
                onClick={() => handleAction("buy")}
              >
                {loading ? "Processing..." : "Buy"}
              </button>
            )}

            <button className="contact-btn" onClick={handleContact}>
              Contact Seller
            </button>

          </div>

        </div>
      </div>
    </div>
  );
}