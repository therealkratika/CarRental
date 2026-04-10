import { useState } from "react";
import { AppSDK } from "../Api/appSdk";
import { BookSDK } from "../Api/bookSDK";
import "./AddBook.css";

export default function AddBook() {
  const [formData, setFormData] = useState({
    title: "",
    author: "",
    price: "",
    type: "sell",
    city: "",
    area: "",
    coordinates: { lat: null, lng: null },
    image: "",
    sellerName: "",
    sellerPhone: "",
    sellerEmail: "",
  });

  const [loading, setLoading] = useState(false);
  const [gettingLocation, setGettingLocation] = useState(false);
  const [uploading, setUploading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleUseCurrentLocation = async () => {
    try {
      setGettingLocation(true);

      const loc = await AppSDK.getCurrentLocation();

      setFormData((prev) => ({
        ...prev,
        coordinates: {
          lat: Number(loc.lat),
          lng: Number(loc.lng),
        },
      }));

      alert("Location captured 📍");
    } catch (err) {
      alert(err?.message || "Location error");
    } finally {
      setGettingLocation(false);
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      setUploading(true);
      const url = await AppSDK.uploadImage(file);

      setFormData((prev) => ({
        ...prev,
        image: url,
      }));
    } catch (err) {
      alert(err.message || "Image upload failed");
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !formData.title ||
      !formData.author ||
      !formData.price ||
      !formData.sellerName ||
      !formData.sellerPhone
    ) {
      return alert("Fill all required fields");
    }

    if (!formData.coordinates.lat) {
      return alert("Please select location 📍");
    }

    try {
      setLoading(true);

      const payload = {
        title: formData.title,
        author: formData.author,

        isForSale: formData.type === "sell",
        isForRent: formData.type === "rent",

        salePrice:
          formData.type === "sell" ? Number(formData.price) : undefined,

        rentPricePerDay:
          formData.type === "rent" ? Number(formData.price) : undefined,

        image: formData.image,
        city: formData.city,
        area: formData.area,

        coordinates: formData.coordinates,

        name: formData.sellerName,
        phone: formData.sellerPhone,
        email: formData.sellerEmail,
      };

      await BookSDK.create(payload);

      alert("Book added 🎉");

      // reset
      setFormData({
        title: "",
        author: "",
        price: "",
        type: "sell",
        city: "",
        area: "",
        coordinates: { lat: null, lng: null },
        image: "",
        sellerName: "",
        sellerPhone: "",
        sellerEmail: "",
      });

    } catch (err) {
      alert(err?.message || "Error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="addbook-page">
      <div className="addbook-container">
        <h1>Add Book</h1>

        <form onSubmit={handleSubmit} className="form">

          {/* Title */}
          <input
            name="title"
            placeholder="Book Title"
            value={formData.title}
            onChange={handleChange}
          />

          {/* Author */}
          <input
            name="author"
            placeholder="Author"
            value={formData.author}
            onChange={handleChange}
          />

          {/* Price */}
          <input
            name="price"
            type="number"
            placeholder="Price ₹"
            value={formData.price}
            onChange={handleChange}
          />

          {/* Type */}
          <div className="toggle">
            <button
              type="button"
              className={formData.type === "rent" ? "active" : ""}
              onClick={() => setFormData({ ...formData, type: "rent" })}
            >
              Rent
            </button>
            <button
              type="button"
              className={formData.type === "sell" ? "active" : ""}
              onClick={() => setFormData({ ...formData, type: "sell" })}
            >
              Sell
            </button>
          </div>

          {/* Location */}
          <div className="row">
            <input
              name="city"
              placeholder="City"
              value={formData.city}
              onChange={handleChange}
            />
            <input
              name="area"
              placeholder="Area"
              value={formData.area}
              onChange={handleChange}
            />
          </div>

          <button
            type="button"
            className="location-btn"
            onClick={handleUseCurrentLocation}
          >
            {gettingLocation ? "Getting..." : "📍 Use Current Location"}
          </button>

          {/* Seller */}
          <input
            name="sellerName"
            placeholder="Your Name"
            value={formData.sellerName}
            onChange={handleChange}
          />

          <input
            name="sellerPhone"
            placeholder="Phone"
            value={formData.sellerPhone}
            onChange={handleChange}
          />

          <input
            name="sellerEmail"
            placeholder="Email (optional)"
            value={formData.sellerEmail}
            onChange={handleChange}
          />

          {/* Image */}
          <input type="file" onChange={handleImageUpload} />

          {uploading && <p>Uploading...</p>}

          {formData.image && (
            <img src={formData.image} className="preview" alt="preview" />
          )}

          {/* Submit */}
          <button type="submit" className="submit-btn">
            {loading ? "Adding..." : "Add Book"}
          </button>
        </form>
      </div>
    </div>
  );
}