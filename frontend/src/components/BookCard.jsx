import { useState, useEffect } from "react";
import { BookSDK } from "../Api/bookSDK";
import { Heart, Star, ShoppingBag, Clock, Info } from "lucide-react";

export default function BookCard({ book, onSelect, onRefresh }) {
  const [wishlisted, setWishlisted] = useState(book.isWishlisted || false);
  const [loading, setLoading] = useState(false);

  // Keep local heart in sync with database if the book prop updates
  useEffect(() => {
    setWishlisted(book.isWishlisted || false);
  }, [book.isWishlisted, book._id]);

  const handleWishlist = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (loading) return;

    const previousState = wishlisted;
    setWishlisted(!previousState);

    try {
      setLoading(true);
      if (previousState) {
        await BookSDK.removeFromWishlist(book._id);
      } else {
        await BookSDK.addToWishlist(book._id);
      }

      if (onRefresh) {
        await onRefresh();
      }
    } catch (err) {
      console.error(err);
      setWishlisted(previousState);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div 
      className="group relative bg-white rounded-[2rem] overflow-hidden border border-slate-100 shadow-sm hover:shadow-2xl hover:shadow-violet-100 transition-all duration-500 cursor-pointer"
      onClick={() => onSelect && onSelect(book)}
    >
      {/* --- IMAGE CONTAINER --- */}
      <div className="relative aspect-[3/4] overflow-hidden">
        <img
          src={book.image || "https://images.unsplash.com/photo-1543004407-1bc9adacc49f?w=400"}
          alt={book.title}
          className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
        />
        
        {/* Overlay Gradients */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* Wishlist Button */}
        <button
          type="button"
          onClick={handleWishlist}
          disabled={loading}
          className={`absolute top-4 right-4 z-20 p-2.5 rounded-xl backdrop-blur-md transition-all duration-300 ${
            wishlisted 
              ? "bg-red-500 text-white shadow-lg shadow-red-200" 
              : "bg-white/80 text-slate-400 hover:text-red-500"
          }`}
        >
          <Heart 
            size={18} 
            fill={wishlisted ? "currentColor" : "none"} 
            className={loading ? "animate-pulse" : ""}
          />
        </button>

        {/* Status Tags */}
        <div className="absolute bottom-4 left-4 right-4 flex flex-wrap gap-2">
          {book.isForRent && (
            <span className="flex items-center gap-1 px-3 py-1 rounded-lg bg-violet-600/90 backdrop-blur-sm text-[10px] font-black text-white uppercase tracking-wider">
              <Clock size={10} /> Rent
            </span>
          )}
          {book.condition && (
            <span className="px-3 py-1 rounded-lg bg-white/90 backdrop-blur-sm text-[10px] font-black text-slate-800 uppercase tracking-wider border border-white/20">
              {book.condition}
            </span>
          )}
        </div>
      </div>

      {/* --- CARD CONTENT --- */}
      <div className="p-5 space-y-3">
        <div className="flex justify-between items-start">
          <span className="text-[10px] font-bold text-violet-600 uppercase tracking-widest bg-violet-50 px-2 py-0.5 rounded-md">
            {book.category || "General"}
          </span>
          <div className="flex items-center gap-1 text-amber-500">
            <Star size={14} fill="currentColor" />
            <span className="text-xs font-black text-slate-700">
              {book.rating > 0 ? book.rating.toFixed(1) : "N/A"}
            </span>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-black text-slate-900 leading-tight line-clamp-1 group-hover:text-violet-600 transition-colors">
            {book.title}
          </h3>
          <p className="text-sm font-medium text-slate-500 mt-0.5">{book.author}</p>
        </div>

        {/* Pricing & CTA */}
        <div className="pt-3 border-t border-slate-50 flex items-center justify-between">
          <div className="flex flex-col">
            {book.isForSale && (
              <span className="text-lg font-black text-slate-900">₹{book.salePrice}</span>
            )}
            {book.isForRent && (
              <span className="text-[11px] font-bold text-slate-400">₹{book.rentPricePerDay}/day</span>
            )}
          </div>
          
          <div className="p-2 rounded-xl bg-slate-50 text-slate-400 group-hover:bg-violet-600 group-hover:text-white transition-all">
            <ShoppingBag size={18} />
          </div>
        </div>
      </div>

      {/* Quick View Button (Slide up on hover) */}
      <div className="absolute inset-x-0 bottom-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300 bg-white/10 backdrop-blur-md border-t border-white/20 flex justify-center">
         <span className="text-xs font-black text-white flex items-center gap-2">
           <Info size={14} /> CLICK FOR DETAILS
         </span>
      </div>
    </div>
  );
}