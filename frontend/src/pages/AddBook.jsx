import { useState } from "react";
import { AppSDK } from "../Api/appSdk";
import { BookSDK } from "../Api/bookSDK";
import { 
  BookPlus, 
  MapPin, 
  Image as ImageIcon, 
  User, 
  Phone, 
  Mail, 
  Loader2, 
  CheckCircle2,
  UploadCloud,
  Type
} from "lucide-react";

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
      setFormData((prev) => ({ ...prev, image: url }));
    } catch (err) {
      alert(err.message || "Image upload failed");
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.title || !formData.author || !formData.price || !formData.sellerName || !formData.sellerPhone) {
      return alert("Fill all required fields");
    }

    if (!formData.coordinates.lat) {
      return alert("Please capture your location 📍");
    }

    try {
      setLoading(true);
      const payload = {
        title: formData.title,
        author: formData.author,
        isForSale: formData.type === "sell",
        isForRent: formData.type === "rent",
        salePrice: formData.type === "sell" ? Number(formData.price) : undefined,
        rentPricePerDay: formData.type === "rent" ? Number(formData.price) : undefined,
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

      setFormData({
        title: "", author: "", price: "", type: "sell", city: "", area: "",
        coordinates: { lat: null, lng: null }, image: "",
        sellerName: "", sellerPhone: "", sellerEmail: "",
      });
    } catch (err) {
      alert(err?.message || "Error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <div className="w-12 h-12 bg-violet-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-violet-200">
          <BookPlus size={24} />
        </div>
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">List Your Book</h1>
          <p className="text-slate-500 font-medium">Fill in the details to share your book with the community.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* SECTION 1: BOOK DETAILS */}
        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm space-y-6">
          <h2 className="text-lg font-black text-slate-900 flex items-center gap-2 mb-2">
            <Type className="text-violet-600" size={20} /> Book Information
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 ml-1">Book Title *</label>
              <input
                name="title"
                placeholder="e.g. The Great Gatsby"
                value={formData.title}
                onChange={handleChange}
                className="w-full px-5 py-3.5 bg-slate-50 border-2 border-transparent focus:border-violet-200 focus:bg-white rounded-2xl outline-none transition-all"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 ml-1">Author Name *</label>
              <input
                name="author"
                placeholder="e.g. F. Scott Fitzgerald"
                value={formData.author}
                onChange={handleChange}
                className="w-full px-5 py-3.5 bg-slate-50 border-2 border-transparent focus:border-violet-200 focus:bg-white rounded-2xl outline-none transition-all"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-end">
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 ml-1">Pricing & Intent *</label>
              <div className="flex bg-slate-100 p-1 rounded-2xl">
                <button
                  type="button"
                  className={`flex-1 py-2.5 rounded-xl text-sm font-black transition-all ${formData.type === "sell" ? "bg-white text-violet-600 shadow-sm" : "text-slate-500"}`}
                  onClick={() => setFormData({ ...formData, type: "sell" })}
                >
                  Sell
                </button>
                <button
                  type="button"
                  className={`flex-1 py-2.5 rounded-xl text-sm font-black transition-all ${formData.type === "rent" ? "bg-white text-violet-600 shadow-sm" : "text-slate-500"}`}
                  onClick={() => setFormData({ ...formData, type: "rent" })}
                >
                  Rent
                </button>
              </div>
            </div>
            <div className="space-y-2">
              <input
                name="price"
                type="number"
                placeholder={formData.type === "sell" ? "Sale Price (₹)" : "Rent per Day (₹)"}
                value={formData.price}
                onChange={handleChange}
                className="w-full px-5 py-3.5 bg-slate-50 border-2 border-transparent focus:border-violet-200 focus:bg-white rounded-2xl outline-none transition-all font-bold text-violet-600"
              />
            </div>
          </div>
        </div>

        {/* SECTION 2: LOCATION & IMAGE */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm space-y-6">
            <h2 className="text-lg font-black text-slate-900 flex items-center gap-2">
              <MapPin className="text-violet-600" size={20} /> Location
            </h2>
            <div className="space-y-4">
              <div className="flex gap-4">
                <input name="city" placeholder="City" value={formData.city} onChange={handleChange} className="w-1/2 px-4 py-3 bg-slate-50 rounded-xl outline-none" />
                <input name="area" placeholder="Area" value={formData.area} onChange={handleChange} className="w-1/2 px-4 py-3 bg-slate-50 rounded-xl outline-none" />
              </div>
              <button
                type="button"
                onClick={handleUseCurrentLocation}
                className={`w-full py-4 rounded-2xl font-black text-sm flex items-center justify-center gap-2 transition-all ${formData.coordinates.lat ? "bg-emerald-50 text-emerald-600 border-2 border-emerald-100" : "bg-violet-50 text-violet-600 border-2 border-violet-100 hover:bg-violet-100"}`}
              >
                {gettingLocation ? <Loader2 className="animate-spin" size={18} /> : <MapPin size={18} />}
                {formData.coordinates.lat ? "Location Captured" : "Use Current Location"}
              </button>
            </div>
          </div>

          <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm space-y-4 text-center">
             <h2 className="text-lg font-black text-slate-900 flex items-center justify-center gap-2">
              <ImageIcon className="text-violet-600" size={20} /> Book Cover
            </h2>
            <div className="relative group h-40 bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200 flex flex-col items-center justify-center overflow-hidden transition-all hover:border-violet-300">
              {formData.image ? (
                <img src={formData.image} className="w-full h-full object-cover" alt="preview" />
              ) : (
                <div className="flex flex-col items-center text-slate-400">
                  {uploading ? <Loader2 className="animate-spin mb-2" /> : <UploadCloud size={32} className="mb-2" />}
                  <p className="text-xs font-bold uppercase tracking-wider">{uploading ? "Uploading..." : "Click to Upload"}</p>
                </div>
              )}
              <input type="file" onChange={handleImageUpload} className="absolute inset-0 opacity-0 cursor-pointer" />
            </div>
          </div>
        </div>

        {/* SECTION 3: SELLER DETAILS */}
        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm space-y-6">
          <h2 className="text-lg font-black text-slate-900 flex items-center gap-2 mb-2">
            <User className="text-violet-600" size={20} /> Contact Information
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input name="sellerName" placeholder="Full Name" value={formData.sellerName} onChange={handleChange} className="w-full pl-12 pr-4 py-3.5 bg-slate-50 rounded-2xl outline-none" />
            </div>
            <div className="relative">
              <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input name="sellerPhone" placeholder="Phone Number" value={formData.sellerPhone} onChange={handleChange} className="w-full pl-12 pr-4 py-3.5 bg-slate-50 rounded-2xl outline-none" />
            </div>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input name="sellerEmail" placeholder="Email (Optional)" value={formData.sellerEmail} onChange={handleChange} className="w-full pl-12 pr-4 py-3.5 bg-slate-50 rounded-2xl outline-none" />
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading || uploading}
          className="w-full bg-violet-600 text-white py-5 rounded-[2rem] font-black text-lg shadow-xl shadow-violet-100 hover:bg-violet-700 hover:-translate-y-1 transition-all active:scale-[0.98] flex items-center justify-center gap-3 disabled:opacity-70"
        >
          {loading ? <Loader2 className="animate-spin" /> : <CheckCircle2 />}
          {loading ? "Creating Listing..." : "Publish Listing"}
        </button>
      </form>
    </div>
  );
}