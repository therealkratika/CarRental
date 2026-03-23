import { useState } from "react";
import { AppSDK } from "../Api/appSdk";
import "./AddBookModal.css";

export default function AddBook() {
  const [formData, setFormData] = useState({
    title: "",
    author: "",
    price: "",
    type: "sell",
    city: "",
    area: "",
    coordinates: { lat: "", lng: "" },
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
        city: loc.city,
        area: loc.area,
        coordinates: { lat: loc.lat, lng: loc.lng },
      }));

    } catch (err) {
      alert(err);
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
      alert(err);
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
      !formData.city ||
      !formData.sellerName ||
      !formData.sellerPhone
    ) {
      return alert("Please fill all required fields");
    }

    try {
      setLoading(true);

      const payload = {
        title: formData.title,
        author: formData.author,
        isForSale: formData.type === "sell",
        isForRent: formData.type === "rent",
        salePrice: formData.type === "sell" ? formData.price : undefined,
        rentPricePerDay: formData.type === "rent" ? formData.price : undefined,
        image: formData.image,

        city: formData.city,
        area: formData.area,
        coordinates: formData.coordinates,

        name: formData.sellerName,
        phone: formData.sellerPhone,
        email: formData.sellerEmail,
      };

      await AppSDK.addBook(payload);

      alert("Book added successfully ");
      setFormData({
        title: "",
        author: "",
        price: "",
        type: "sell",
        city: "",
        area: "",
        coordinates: { lat: "", lng: "" },
        image: "",
        sellerName: "",
        sellerPhone: "",
        sellerEmail: "",
      });

    } catch (err) {
      alert(err.message || "Error adding book");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="addbook-container">
      <h2>Add Book</h2>

      <form onSubmit={handleSubmit} className="form">

        <label>Book Title</label>
        <input name="title" value={formData.title} onChange={handleChange} />

        <label>Author</label>
        <input name="author" value={formData.author} onChange={handleChange} />

        <label>Price</label>
        <input
          name="price"
          type="number"
          value={formData.price}
          onChange={handleChange}
        />
        <label>Type</label>
        <div className="toggle">
          <button
            type="button"
            className={formData.type === "rent" ? "active" : ""}
            onClick={() => setFormData({ ...formData, type: "rent" })}
          >
            For Rent
          </button>

          <button
            type="button"
            className={formData.type === "sell" ? "active" : ""}
            onClick={() => setFormData({ ...formData, type: "sell" })}
          >
            For Sale
          </button>
        </div>
        <div className="row">
          <div>
            <label>City</label>
            <input name="city" value={formData.city} onChange={handleChange} />
          </div>

          <div>
            <label>Area</label>
            <input name="area" value={formData.area} onChange={handleChange} />
          </div>
        </div>

        <button
          type="button"
          className="location-btn"
          onClick={handleUseCurrentLocation}
        >
          {gettingLocation ? "Getting..." : "📍 Use Current Location"}
        </button>
        <label>Your Name</label>
        <input
          name="sellerName"
          value={formData.sellerName}
          onChange={handleChange}
        />

        <label>Phone</label>
        <input
          name="sellerPhone"
          value={formData.sellerPhone}
          onChange={handleChange}
        />

        <label>Email</label>
        <input
          name="sellerEmail"
          value={formData.sellerEmail}
          onChange={handleChange}
        />

        {/* Image Upload */}
        <label>Upload Image</label>
        <input type="file" accept="image/*" onChange={handleImageUpload} />

        {uploading && <p>Uploading...</p>}

        {formData.image && (
          <img src={formData.image} alt="preview" className="preview" />
        )}

        <button type="submit" className="submit-btn">
          {loading ? "Adding..." : "Add Book"}
        </button>

      </form>
    </div>
  );
}