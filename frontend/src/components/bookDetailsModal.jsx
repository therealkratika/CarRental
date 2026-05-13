import { useState } from "react";
import { BookSDK } from "../Api/bookSDK";
import { 
  X, 
  MapPin, 
  Phone, 
  MessageCircle, 
  Star, 
  User, 
  ShieldCheck,
  Tag,
  Loader2
} from "lucide-react";

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
    } finally {
      setLoading(false);
    }
  };

  const phone = book.contact?.phone || "";
  const whatsappLink = `https://wa.me/91${phone}`;

  return (
    <div 
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300"
      onClick={onClose}
    >
      <div 
        className="relative w-full max-w-4xl bg-white rounded-[3rem] shadow-2xl overflow-hidden flex flex-col md:flex-row animate-in zoom-in-95 duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        {/* CLOSE BUTTON */}
        <button 
          className="absolute top-6 right-6 z-50 p-2 bg-white/80 backdrop-blur-md rounded-full text-slate-400 hover:text-slate-900 transition-colors shadow-sm"
          onClick={onClose}
        >
          <X size={20} />
        </button>

        {/* LEFT: IMAGE SECTION */}
        <div className="md:w-2/5 bg-slate-50 relative group">
          <img
            src={book.image || "https://images.unsplash.com/photo-1543004407-1bc9adacc49f?w=600"}
            alt={book.title}
            className="w-full h-full object-cover min-h-[300px] md:min-h-[500px]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-violet-600/20 to-transparent" />
        </div>

        {/* RIGHT: DETAILS SECTION */}
        <div className="md:w-3/5 p-8 md:p-12 overflow-y-auto max-h-[90vh]">
          <div className="space-y-6">
            {/* Header */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="px-3 py-1 bg-violet-100 text-violet-600 text-[10px] font-black uppercase tracking-widest rounded-full">
                  {book.category}
                </span>
                <span className="flex items-center gap-1 px-3 py-1 bg-amber-50 text-amber-600 text-[10px] font-black uppercase tracking-widest rounded-full">
                  <ShieldCheck size={12} /> {book.condition || "Good"}
                </span>
              </div>
              <h2 className="text-3xl md:text-4xl font-black text-slate-900 leading-tight">
                {book.title}
              </h2>
              <p className="text-lg font-medium text-slate-500 mt-1 flex items-center gap-2">
                by <span className="text-slate-900 underline decoration-violet-300 underline-offset-4">{book.author}</span>
              </p>
            </div>

            {/* Pricing Section */}
            <div className="flex flex-wrap gap-4 p-6 bg-slate-50 rounded-3xl border border-slate-100">
              {book.isForSale && (
                <div className="flex flex-col">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Buy Now</span>
                  <span className="text-2xl font-black text-slate-900">₹{book.salePrice}</span>
                </div>
              )}
              {book.isForSale && book.isForRent && <div className="w-px h-10 bg-slate-200 hidden sm:block" />}
              {book.isForRent && (
                <div className="flex flex-col">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Rent/Day</span>
                  <span className="text-2xl font-black text-violet-600">₹{book.rentPricePerDay}</span>
                </div>
              )}
            </div>

            {/* Location */}
            <div className="flex items-center gap-2 text-slate-600 font-medium">
              <MapPin size={18} className="text-violet-500" />
              <span>{book.location?.city || "Unknown"}, {book.location?.area || ""}</span>
            </div>

            {/* Seller Info Card */}
            <div className="p-6 border-2 border-slate-100 rounded-[2rem] space-y-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-slate-100 rounded-2xl flex items-center justify-center text-slate-500">
                  <User size={24} />
                </div>
                <div>
                  <h4 className="font-black text-slate-900 leading-none">{book.contact?.name || "N/A"}</h4>
                  <p className="text-xs font-medium text-slate-500 mt-1">Verified Seller</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2">
                <a 
                  href={`tel:${phone}`} 
                  className="flex items-center justify-center gap-2 py-3 bg-slate-900 text-white rounded-2xl font-bold text-sm hover:bg-slate-800 transition-all active:scale-95"
                >
                  <Phone size={16} /> Call
                </a>
                <a 
                  href={whatsappLink} 
                  target="_blank" 
                  rel="noreferrer" 
                  className="flex items-center justify-center gap-2 py-3 bg-emerald-500 text-white rounded-2xl font-bold text-sm hover:bg-emerald-600 transition-all shadow-lg shadow-emerald-100 active:scale-95"
                >
                  <MessageCircle size={16} /> WhatsApp
                </a>
              </div>
            </div>

            {/* Interactive Rating Section */}
            <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <p className="text-sm font-black text-slate-900 uppercase tracking-wider flex items-center gap-2">
                   Your Rating {loading && <Loader2 size={14} className="animate-spin text-violet-600" />}
                </p>
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(0)}
                      onClick={() => handleRating(star)}
                      className="transition-all duration-200 transform hover:scale-125 disabled:opacity-50"
                      disabled={loading}
                    >
                      <Star
                        size={24}
                        fill={star <= (hoverRating || rating) ? "#7c3aed" : "none"}
                        className={star <= (hoverRating || rating) ? "text-violet-600" : "text-slate-200"}
                      />
                    </button>
                  ))}
                </div>
              </div>

              <div className="bg-slate-50 px-5 py-3 rounded-2xl text-center">
                <p className="text-[10px] font-bold text-slate-400 uppercase">Avg Rating</p>
                <div className="flex items-center gap-1 justify-center">
                  <Star size={14} fill="#f59e0b" className="text-amber-500" />
                  <span className="text-xl font-black text-slate-900">
                    {book.rating?.toFixed(1) || "0.0"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}