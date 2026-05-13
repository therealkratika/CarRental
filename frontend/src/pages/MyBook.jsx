import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase";
import { BookSDK } from "../Api/bookSDK";
import { 
  Trash2, 
  MapPin, 
  Package, 
  Tag, 
  Plus, 
  Loader2, 
  AlertCircle,
  TrendingUp
} from "lucide-react";
import { Link } from "react-router-dom";

export default function MyBooks() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchMyBooks = async () => {
    try {
      const data = await BookSDK.getMy();
      setBooks(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        fetchMyBooks();
      } else {
        setLoading(false);
      }
    });
    return () => unsubscribe();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to remove this listing?")) return;
    try {
      await BookSDK.deleteMy(id);
      setBooks((prev) => prev.filter((b) => b._id !== id));
    } catch (err) {
      alert("Failed to delete the listing.");
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-slate-400">
        <Loader2 className="animate-spin mb-4" size={40} />
        <p className="font-bold uppercase tracking-widest text-xs">Syncing your library...</p>
      </div>
    );
  }

  return (
    <div className="pt-20 md:pt-0">
    <div className="max-w-7xl mx-auto px-6 py-10 space-y-10 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">Your Inventory</h1>
          <p className="text-slate-500 font-medium mt-1">Manage the books you've listed for the community.</p>
        </div>
        <div className="flex gap-4">
           <div className="bg-violet-50 px-6 py-3 rounded-2xl border border-violet-100">
             <p className="text-[10px] font-black text-violet-400 uppercase tracking-wider">Total Listings</p>
             <p className="text-2xl font-black text-violet-700">{books.length}</p>
           </div>
           <Link 
            to="/dashboard/add-book" 
            className="flex items-center gap-2 bg-slate-900 text-white px-6 py-3 rounded-2xl font-bold hover:bg-slate-800 transition-all hover:-translate-y-1 shadow-lg shadow-slate-200"
          >
            <Plus size={20} /> Add New
          </Link>
        </div>
      </div>

      {/* --- CONTENT SECTION --- */}
      {books.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 bg-slate-50 rounded-[3rem] border-2 border-dashed border-slate-200 text-center">
          <div className="w-20 h-20 bg-white rounded-3xl flex items-center justify-center text-slate-200 mb-6 shadow-sm">
            <Package size={40} />
          </div>
          <h3 className="text-xl font-black text-slate-900">Your library is empty</h3>
          <p className="text-slate-500 max-w-xs mt-2">You haven't listed any books for sale or rent yet.</p>
          <Link to="/dashboard/add-book" className="mt-6 text-violet-600 font-black flex items-center gap-2 hover:gap-3 transition-all">
            Start listing now <TrendingUp size={18} />
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {books.map((book) => (
            <div key={book._id} className="group bg-white rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-2xl hover:shadow-violet-100 transition-all duration-500 overflow-hidden flex flex-col">
              
              {/* Image & Overlay */}
              <div className="relative h-64 overflow-hidden">
                <img 
                  src={book.image || "https://images.unsplash.com/photo-1544640808-32ca72ac7f67?w=400"} 
                  alt={book.title} 
                  className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700" 
                />
                <div className="absolute top-4 left-4 flex gap-2">
                  <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest backdrop-blur-md shadow-sm ${
                    book.isForSale ? "bg-emerald-500/90 text-white" : "bg-violet-600/90 text-white"
                  }`}>
                    {book.isForSale ? "For Sale" : "For Rent"}
                  </span>
                  {book.status && (
                    <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest bg-white/90 text-slate-900 backdrop-blur-md">
                      {book.status}
                    </span>
                  )}
                </div>
              </div>

              {/* Body */}
              <div className="p-6 flex-1 flex flex-col">
                <div className="flex-1 space-y-1">
                  <h3 className="text-xl font-black text-slate-900 leading-tight group-hover:text-violet-600 transition-colors">
                    {book.title}
                  </h3>
                  <p className="text-sm font-bold text-slate-400">{book.author}</p>
                </div>

                {/* Info Metadata */}
                <div className="mt-4 pt-4 border-t border-slate-50 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-slate-500 text-xs font-bold">
                      <MapPin size={14} className="text-violet-500" />
                      {book.location?.city}
                    </div>
                    <div className="text-lg font-black text-slate-900">
                      ₹{book.isForSale ? book.salePrice : `${book.rentPricePerDay}/d`}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 pt-2">
                    <button
                      onClick={() => handleDelete(book._id)}
                      className="flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl bg-red-50 text-red-500 font-bold text-xs hover:bg-red-500 hover:text-white transition-all active:scale-95"
                    >
                      <Trash2 size={16} /> Delete Listing
                    </button>
                    <Link
                      to={`/dashboard/edit-book/${book._id}`}
                      className="p-3 rounded-2xl bg-slate-50 text-slate-400 hover:bg-slate-900 hover:text-white transition-all"
                    >
                      <AlertCircle size={20} />
                    </Link>
                  </div>
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