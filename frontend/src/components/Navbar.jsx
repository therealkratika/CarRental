import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Search, BookOpen, Heart, ShoppingCart, LogIn, Library, Menu, X } from "lucide-react";

export default function Navbar({ cartCount = 0 }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/books?search=${encodeURIComponent(searchQuery)}`);
      setSearchQuery("");
      setIsMenuOpen(false);
    }
  };

  return (
    <nav className="sticky top-0 z-50 w-full bg-white border-b border-gray-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Height set to h-20 for better vertical breathing room */}
        <div className="flex items-center justify-between h-20 gap-8">
          
          {/* 1. Logo Section */}
          <Link to="/" className="flex items-center gap-3 shrink-0 group">
            <div className="w-11 h-11 bg-gradient-to-tr from-violet-600 to-indigo-500 rounded-xl flex items-center justify-center text-white shadow-md group-hover:scale-105 transition-transform">
              <Library size={24} />
            </div>
            <div className="hidden sm:block leading-tight">
              <span className="text-xl font-bold tracking-tight text-slate-800">
                Book<span className="text-violet-600">Hub</span>
              </span>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest leading-none mt-1">
                Read More, Spend Less
              </p>
            </div>
          </Link>

          {/* 2. Center Search Bar - Improved Alignment */}
         {/* Center: Search Bar */}
<div className="hidden md:flex flex-1 max-w-lg px-8">
  <form onSubmit={handleSearch} className="relative w-full group">
    {/* Icon Container - Perfectly Centered Vertically */}
    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
      <Search 
        className="text-slate-400 group-focus-within:text-violet-500 transition-colors" 
        size={18} 
      />
    </div>
    
    {/* Input - Increased height (py-3) and pill-shaped (rounded-2xl) */}
    <input
      type="text"
      placeholder="Search by title, author, or ISBN..."
      className="block w-full bg-slate-100 border-2 border-transparent focus:border-violet-100 focus:bg-white rounded-2xl py-3 pl-12 pr-4 text-sm text-slate-700 placeholder:text-slate-400 transition-all outline-none shadow-sm group-hover:bg-slate-200/50 focus:group-hover:bg-white"
      value={searchQuery}
      onChange={(e) => setSearchQuery(e.target.value)}
    />
    
    {/* Optional: Add a 'Cmd + K' or 'Enter' hint for a premium feel */}
    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
       <kbd className="hidden lg:inline-block px-1.5 py-0.5 text-[10px] font-medium text-slate-400 border border-slate-200 rounded bg-white">
         Enter
       </kbd>
    </div>
  </form>
</div>

          {/* 3. Right Side Actions - Better Spacing */}
          <div className="flex items-center gap-2 md:gap-5">
            <Link 
              to="/books" 
              className="hidden lg:flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-violet-600 px-2 py-1 transition-colors"
            >
              <BookOpen size={20} />
              <span>Browse</span>
            </Link>

            <div className="flex items-center border-l border-slate-200 ml-2 pl-4 gap-2">
              <Link to="/dashboard" className="p-2 text-slate-600 hover:bg-slate-100 rounded-full transition-all relative">
                <Heart size={22} />
              </Link>

              <Link to="/cart" className="p-2 text-slate-600 hover:bg-slate-100 rounded-full transition-all relative">
                <ShoppingCart size={22} />
                {cartCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 bg-violet-600 text-white text-[10px] font-bold h-4 w-4 flex items-center justify-center rounded-full ring-2 ring-white">
                    {cartCount}
                  </span>
                )}
              </Link>
            </div>

            <Link 
              to="/login" 
              className="flex items-center gap-2 bg-violet-600 text-white px-6 py-2.5 rounded-xl text-sm font-bold hover:bg-violet-700 hover:shadow-lg hover:shadow-violet-200 transition-all active:scale-95"
            >
              <LogIn size={18} />
              <span className="hidden sm:inline">Login</span>
            </Link>

            {/* Mobile Menu Button */}
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
            >
              {isMenuOpen ? <X size={26} /> : <Menu size={26} />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown */}
        {isMenuOpen && (
          <div className="md:hidden pb-6 pt-2 border-t border-slate-50 animate-in fade-in slide-in-from-top-2">
             <div className="mt-4 space-y-4">
                <form onSubmit={handleSearch} className="relative">
                   <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                   <input
                    type="text"
                    placeholder="Search..."
                    className="w-full bg-slate-100 rounded-xl py-3 pl-10 pr-4 outline-none"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </form>
                <div className="flex flex-col gap-2">
                  <Link to="/books" className="flex items-center gap-3 p-3 text-slate-700 font-semibold hover:bg-slate-50 rounded-xl">
                    <BookOpen size={20} /> Browse
                  </Link>
                  <Link to="/login" className="flex items-center justify-center gap-2 p-3 bg-violet-600 text-white rounded-xl font-bold">
                    <LogIn size={20} /> Login
                  </Link>
                </div>
             </div>
          </div>
        )}
      </div>
    </nav>
  );
}