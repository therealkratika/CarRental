import { useState } from "react";
import { BookSDK } from "../Api/bookSDK";
import "./BookDetailsModal.css";

export default function BookDetailModal({ book, onClose, onActionSuccess }) {
  const [rating, setRating] = useState(book?.userRating || 0);
  const [hoverRating, setHoverRating] = useState(0);
  const [loading, setLoading] = useState(false);

  if (!book) return null;

  const handleRating = async (value) => {
    try {
      setLoading(true);
      setRating(value);
      const res = await BookSDK.rateBook(book._id, value);

      if (res?.rating !== undefined) {
        book.rating = res.rating;
      }
      book.userRating = value;

      if (onActionSuccess) onActionSuccess();
    } catch (err) {
      console.error(err);
      alert("Rating failed");
    } finally {
      setLoading(false);
    }
  };

  const phone = book.contact?.phone || "";
  const whatsappLink = `https://wa.me/91${phone}`;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-container" onClick={(e) => e.stopPropagation()}>
        
        {/* CLOSE BUTTON */}
        <button className="close-modal" onClick={onClose}>
          ✖
        </button>

        {/* IMAGE SECTION */}
        <div className="modal-image-container">
          <img
            src={book.image || "https://dummyimage.com/200x250/cccccc/000000&text=No+Image"}
            alt={book.title}
          />
        </div>

        {/* DETAILS SECTION */}
        <div className="modal-body">
          <h2 className="book-title">{book.title}</h2>
          <p className="author-name">by {book.author}</p>

          <div className="stats-row">
            <span className="badge">{book.category}</span>
            <span className="badge">Condition: {book.condition || "Good"}</span>
          </div>

          {/* PRICE TAG */}
          <div className="price-tag">
            {book.isForSale && <span>Buy: ₹{book.salePrice}</span>}
            {book.isForSale && book.isForRent && <span style={{margin: '0 10px'}}>|</span>}
            {book.isForRent && <span>Rent: ₹{book.rentPricePerDay}/day</span>}
          </div>

          <p className="location">
            📍 {book.location?.city || "Unknown"}, {book.location?.area || ""}
          </p>

          {/* SELLER CARD */}
          <div className="seller-card">
            <h4>Contact Seller</h4>
            <div className="contact-info">
              <p>Name: {book.contact?.name || "N/A"}</p>
              <p>Phone: {phone || "N/A"}</p>
            </div>

            <div className="action-buttons">
              {phone && (
                <>
                  <a href={`tel:${phone}`} className="btn call-btn">
                    📞 Call
                  </a>
                  <a href={whatsappLink} target="_blank" rel="noreferrer" className="btn whatsapp-btn">
                    💬 WhatsApp
                  </a>
                </>
              )}
            </div>
          </div>

          {/* RATING SECTION */}
          <div className="rating-section">
            <p style={{marginBottom: '5px', fontWeight: 'bold'}}>
              Rate this book {rating > 0 && <span style={{color: '#5e548e'}}>(Your rating: {rating})</span>}
            </p>
            <div className="stars-wrapper">
              {[1, 2, 3, 4, 5].map((star) => (
                <span
                  key={star}
                  className={`star ${star <= (hoverRating || rating) ? "active" : ""}`}
                  onClick={() => handleRating(star)}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                >
                  ★
                </span>
              ))}
              <span className="avg-rating">
                 ({book.rating?.toFixed(1) || "0.0"})
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}