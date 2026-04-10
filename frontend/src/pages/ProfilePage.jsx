import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./ProfilePage.css";
import { BookSDK } from "../Api/bookSDK";
import { AppSDK } from "../Api/appSdk";

export default function ProfilePage() {
  const [user, setUser] = useState({});
  const [wishlist, setWishlist] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userData = await AppSDK.getProfile();
        const wishlistData = await BookSDK.getWishlist();

        setUser(userData);
        setWishlist(wishlistData);

      } catch (err) {
        console.error(err);
        alert("Error loading profile");
      }
    };

    fetchData();
  }, []);

  const handleRemove = async (id) => {
    try {
      await BookSDK.removeFromWishlist(id);
      setWishlist((prev) => prev.filter((b) => b._id !== id));
    } catch (err) {
      alert(err?.message || "Error removing from wishlist");
    }
  };

  return (
    <div className="profile-page">
      <div className="container">
        <div className="profile-header">
          <div className="profile-info">
            <div className="avatar">👤</div>

            <div>
              <h1>{user.name}</h1>
              <p>{user.email}</p>
              <span>
                Member since{" "}
                {user.joinedDate
                  ? new Date(user.joinedDate).toLocaleDateString()
                  : ""}
              </span>
            </div>
          </div>
          <div className="profile-actions">
            <Link to="/dashboard/my-books" className="mybooks-btn">
               My Books
            </Link>

            <Link to="/dashboard/add-book" className="add-btn">
               List Book
            </Link>
          </div>
        </div>
        <div className="stats">
          <div>
            <h3>{wishlist.length}</h3>
            <p>Wishlist</p>
          </div>
        </div>
        <div className="grid-books">
          {wishlist.length === 0 ? (
            <Empty text="Wishlist empty ❤️" />
          ) : (
            wishlist.map((b) => (
              <div className="small-card" key={b._id}>
                <img src={b.image} alt={b.title} />

                <h4>{b.title}</h4>
                <p>{b.author}</p>
                <p>₹{b.salePrice}</p>

                <button
                  className="remove-btn"
                  onClick={() => handleRemove(b._id)}
                >
                   Remove
                </button>
              </div>
            ))
          )}
        </div>

      </div>
    </div>
  );
}

function Empty({ text }) {
  return <p className="empty">{text}</p>;
}