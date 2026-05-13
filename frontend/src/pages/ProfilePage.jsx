import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { BookSDK } from "../Api/bookSDK";
import { AppSDK } from "../Api/appSdk";
import { 
  User, 
  Mail, 
  Calendar, 
  BookMarked, 
  PlusCircle, 
  Library, 
  Trash2, 
  ArrowRight,
  Heart
} from "lucide-react";

export default function ProfilePage() {
  const [user, setUser] = useState({});
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const userData = await AppSDK.getProfile();
        const wishlistData = await BookSDK.getWishlist();

        setUser(userData);
        setWishlist(wishlistData);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
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
    <div className="max-w-6xl mx-auto px-6 py-10 space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
       <div className="relative overflow-hidden bg-white rounded-[3rem] border border-slate-100 shadow-sm p-8 md:p-12">
    
        <div className="absolute top-0 right-0 w-64 h-64 bg-violet-50 rounded-full -mr-20 -mt-20 blur-3xl opacity-50" />
        
        <div className="relative flex flex-col md:flex-row items-center gap-8">
          {/* Avatar Area */}
          <div className="w-32 h-32 rounded-[2.5rem] bg-violet-600 flex items-center justify-center text-white shadow-2xl shadow-violet-200">
            <User size={60} strokeWidth={1.5} />
          </div>

          {/* User Info */}
          <div className="flex-1 text-center md:text-left space-y-2">
            <h1 className="text-4xl font-black text-slate-900 tracking-tight">
              {user.name || "Book Enthusiast"}
            </h1>
            <div className="flex flex-wrap justify-center md:justify-start gap-4">
              <div className="flex items-center gap-2 text-slate-500 font-medium bg-slate-50 px-4 py-1.5 rounded-full text-sm">
                <Mail size={14} className="text-violet-500" />
                {user.email}
              </div>
              <div className="flex items-center gap-2 text-slate-500 font-medium bg-slate-50 px-4 py-1.5 rounded-full text-sm">
                <Calendar size={14} className="text-violet-500" />
                Joined {user.joinedDate ? new Date(user.joinedDate).toLocaleDateString() : "Recently"}
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex flex-col sm:flex-row gap-3">
            <Link 
              to="/dashboard/my-books" 
              className="flex items-center justify-center gap-2 px-6 py-3.5 bg-slate-900 text-white rounded-2xl font-bold text-sm hover:bg-slate-800 transition-all hover:-translate-y-1"
            >
              <Library size={18} /> My Collection
            </Link>
            <Link 
              to="/dashboard/add-book" 
              className="flex items-center justify-center gap-2 px-6 py-3.5 bg-violet-600 text-white rounded-2xl font-bold text-sm shadow-lg shadow-violet-100 hover:bg-violet-700 transition-all hover:-translate-y-1"
            >
              <PlusCircle size={18} /> List New Book
            </Link>
          </div>
        </div>
      </div>

      {/* --- STATS & WISHLIST SECTION --- */}
      <div className="space-y-6">
        <div className="flex items-center justify-between px-2">
          <h2 className="text-2xl font-black text-slate-900 flex items-center gap-3">
            <Heart className="text-red-500 fill-red-500" size={24} /> 
            Saved for Later
            <span className="text-sm font-bold bg-slate-100 text-slate-500 px-3 py-1 rounded-full">
              {wishlist.length}
            </span>
          </h2>
          {wishlist.length > 0 && (
            <Link to="/dashboard/browse" className="text-sm font-bold text-violet-600 hover:underline flex items-center gap-1">
              Browse More <ArrowRight size={14} />
            </Link>
          )}
        </div>

        {wishlist.length === 0 ? (
          <Empty text="Your wishlist is waiting for its first book! ❤️" />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {wishlist.map((book) => (
              <div 
                key={book._id} 
                className="group bg-white rounded-[2rem] p-4 border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-300 relative overflow-hidden"
              >
                <div className="aspect-[4/5] rounded-2xl overflow-hidden mb-4 relative">
                  <img 
                    src={book.image} 
                    alt={book.title} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
                  />
                  <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                     <button
                      onClick={() => handleRemove(book._id)}
                      className="p-3 bg-white text-red-500 rounded-2xl shadow-xl hover:bg-red-50 transition-colors"
                      title="Remove from wishlist"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                </div>

                <div className="space-y-1 px-1">
                  <h4 className="font-black text-slate-900 leading-tight line-clamp-1 group-hover:text-violet-600 transition-colors">
                    {book.title}
                  </h4>
                  <p className="text-xs font-bold text-slate-400">{book.author}</p>
                  <div className="flex items-center justify-between pt-2">
                    <span className="text-lg font-black text-slate-900">₹{book.salePrice}</span>
                    <Link to={`/dashboard/browse`} className="p-2 bg-slate-50 rounded-xl text-slate-400 hover:text-violet-600 transition-colors">
                       <ArrowRight size={16} />
                    </Link>
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

function Empty({ text }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 bg-slate-50 rounded-[3rem] border-2 border-dashed border-slate-200">
      <div className="w-20 h-20 bg-white rounded-3xl flex items-center justify-center text-slate-200 mb-4 shadow-sm">
        <BookMarked size={40} />
      </div>
      <p className="text-slate-500 font-black text-xl">{text}</p>
      <Link to="/dashboard/browse" className="mt-4 text-violet-600 font-bold hover:underline">
        Go find some books
      </Link>
    </div>
  );
}