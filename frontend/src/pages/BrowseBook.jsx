import { useEffect, useState, useCallback } from "react";
import { BookSDK } from "../Api/bookSDK";
import { AppSDK } from "../Api/appSdk";
import BookCard from "../components/BookCard";
import BookDetailModal from "../components/bookDetailsModal.jsx";
import { Search, MapPin, Loader2, BookCopy, FilterX } from "lucide-react";

export default function BrowseBooks() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [nearbyLoading, setNearbyLoading] = useState(false);
  const [selectedBook, setSelectedBook] = useState(null);
  const [search, setSearch] = useState("");

  const fetchBooks = useCallback(async (isRefresh = false) => {
    try {
      if (!isRefresh) setLoading(true);
      const data = await BookSDK.getAll();
      setBooks(data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBooks();
  }, [fetchBooks]);

  const handleNearby = async () => {
    try {
      setNearbyLoading(true);
      const loc = await AppSDK.getCurrentLocation();
      if (!loc?.lat || !loc?.lng) throw new Error("Invalid location");

      const data = await BookSDK.getNearby(loc.lat, loc.lng);
      setBooks(data);
    } catch (err) {
      console.error(err);
      alert("Please enable location services to find books nearby.");
    } finally {
      setNearbyLoading(false);
    }
  };

  const filteredBooks = books.filter((book) =>
    (book.title + book.author).toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-slate-500">
        <Loader2 className="w-10 h-10 animate-spin text-violet-600 mb-4" />
        <p className="font-bold animate-pulse">Curating your library...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* --- HEADER & FILTERS --- */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">Browse Books</h2>
          <p className="text-slate-500 font-medium mt-1">Discover your next favorite read from our community.</p>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch gap-3">
          {/* Search Bar */}
          <div className="relative group min-w-[300px]">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-violet-600 transition-colors" />
            <input
              type="text"
              placeholder="Title, author, or genre..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-white border-2 border-slate-100 rounded-2xl focus:border-violet-200 focus:bg-white outline-none transition-all shadow-sm"
            />
          </div>

          {/* Nearby Button */}
          <button
            onClick={handleNearby}
            disabled={nearbyLoading}
            className={`flex items-center justify-center gap-2 px-6 py-3 rounded-2xl font-bold transition-all shadow-lg ${
              nearbyLoading 
                ? "bg-slate-100 text-slate-400" 
                : "bg-violet-600 text-white hover:bg-violet-700 hover:-translate-y-0.5 active:scale-95 shadow-violet-200"
            }`}
          >
            {nearbyLoading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <MapPin className="w-5 h-5" />
            )}
            <span>{nearbyLoading ? "Locating..." : "Near Me"}</span>
          </button>
        </div>
      </div>

      {/* --- CONTENT GRID --- */}
      {filteredBooks.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 bg-slate-50 rounded-[3rem] border-2 border-dashed border-slate-200">
          <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center text-slate-400 mb-4">
            <FilterX size={40} />
          </div>
          <p className="text-xl font-bold text-slate-800">No books found</p>
          <p className="text-slate-500 mt-1">Try adjusting your search or filters.</p>
          {search && (
            <button 
              onClick={() => setSearch("")}
              className="mt-4 text-violet-600 font-bold hover:underline"
            >
              Clear search
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-8">
          {filteredBooks.map((book) => (
            <div key={book._id} className="transition-transform duration-300 hover:-translate-y-2">
              <BookCard
                book={book}
                onSelect={setSelectedBook}
                onRefresh={() => fetchBooks(true)}
              />
            </div>
          ))}
        </div>
      )}

      {/* --- MODAL --- */}
      {selectedBook && (
        <BookDetailModal
          book={selectedBook}
          onClose={() => setSelectedBook(null)}
          onActionSuccess={() => fetchBooks(true)}
        />
      )}
    </div>
  );
}