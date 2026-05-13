import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { BookSDK } from "../Api/bookSDK";
import { 
  ArrowRight, 
  Library, 
  Banknote, 
  Clock, 
  TrendingUp, 
  BookOpen, 
  Code, 
  Microscope, 
  History, 
  Layers 
} from "lucide-react";

export default function Landing() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchBooks() {
      try {
        const res = await BookSDK.getAll();
        setBooks(res || []);
      } catch (err) {
        console.error("Error fetching books:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchBooks();
  }, []);

  const categories = [
    { name: "Fiction", icon: <BookOpen className="w-6 h-6" />, color: "bg-purple-100 text-purple-600" },
    { name: "Programming", icon: <Code className="w-6 h-6" />, color: "bg-blue-100 text-blue-600" },
    { name: "Science", icon: <Microscope className="w-6 h-6" />, color: "bg-emerald-100 text-emerald-600" },
    { name: "History", icon: <History className="w-6 h-6" />, color: "bg-amber-100 text-amber-600" },
    { name: "Other", icon: <Layers className="w-6 h-6" />, color: "bg-slate-100 text-slate-600" },
  ];

  return (
    <div className="bg-white">
      {/* --- HERO SECTION --- */}
      <section className="relative overflow-hidden pt-16 pb-20 lg:pt-24 lg:pb-32">
        {/* Decorative Background Blob */}
        <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/4 w-[500px] h-[500px] bg-violet-100/50 rounded-full blur-3xl -z-10" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <span className="inline-flex items-center px-4 py-1.5 rounded-full text-sm font-bold bg-violet-100 text-violet-700 ring-1 ring-inset ring-violet-200">
                ✨ Your Premium Reading Partner
              </span>

              <h1 className="text-5xl lg:text-7xl font-black text-slate-900 leading-tight">
                Read More, <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-600 to-indigo-500">
                  Spend Less
                </span>
              </h1>

              <p className="text-lg text-slate-600 max-w-lg leading-relaxed">
                Join a community of 1,000+ readers. Buy, rent, or sell books at prices that make sense. Smart reading starts right here.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/signup?rentOnly=true" className="inline-flex items-center justify-center px-8 py-4 rounded-2xl bg-violet-600 text-white font-bold hover:bg-violet-700 transition-all shadow-lg shadow-violet-200 hover:-translate-y-1">
                  Rent Books <ArrowRight className="ml-2 w-5 h-5" />
                </Link>
                <Link to="/books" className="inline-flex items-center justify-center px-8 py-4 rounded-2xl bg-white text-slate-700 font-bold border-2 border-slate-100 hover:border-violet-200 hover:bg-violet-50 transition-all">
                  Buy Used Books
                </Link>
              </div>

              {/* Stats Bar */}
              <div className="grid grid-cols-3 gap-8 pt-8 border-t border-slate-100">
                {[
                  { label: "Books", val: `${books.length}+` },
                  { label: "Users", val: "1000+" },
                  { label: "Start Price", val: "₹50" },
                ].map((stat, i) => (
                  <div key={i}>
                    <p className="text-2xl font-black text-slate-900">{stat.val}</p>
                    <p className="text-sm text-slate-500 font-medium uppercase tracking-wider">{stat.label}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative">
              <div className="absolute -inset-4 bg-violet-200/30 rounded-[3rem] blur-2xl -z-10 animate-pulse" />
              <img
                src="https://images.unsplash.com/photo-1507842217343-583bb7270b66?w=800&q=80"
                alt="Library"
                className="rounded-[2.5rem] shadow-2xl object-cover aspect-[4/3] w-full"
              />
            </div>
          </div>
        </div>
      </section>

      {/* --- FEATURES SECTION --- */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-black text-slate-900">Why Choose Us?</h2>
            <div className="h-1.5 w-20 bg-violet-600 mx-auto mt-4 rounded-full" />
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { title: "Huge Collection", desc: "Thousands of books available", icon: <Library /> },
              { title: "Affordable", desc: "Cheaper than market prices", icon: <Banknote /> },
              { title: "Flexible Rental", desc: "Rent books for any duration", icon: <Clock /> },
              { title: "Earn Money", desc: "Sell your old books instantly", icon: <TrendingUp /> },
            ].map((f, i) => (
              <div key={i} className="p-8 bg-white rounded-3xl border border-slate-100 hover:shadow-xl transition-all group">
                <div className="w-12 h-12 rounded-2xl bg-violet-50 text-violet-600 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-violet-600 group-hover:text-white transition-all">
                  {f.icon}
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">{f.title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- CATEGORIES SECTION --- */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-black text-slate-900 mb-12">Browse Categories</h2>
          <div className="flex flex-wrap justify-center gap-6">
            {categories.map((cat) => (
              <Link
                key={cat.name}
                to={`/books?category=${cat.name}`}
                className="group flex flex-col items-center gap-4 min-w-[140px] p-6 rounded-3xl hover:bg-white hover:shadow-xl transition-all border border-transparent hover:border-slate-100"
              >
                <div className={`w-16 h-16 ${cat.color} rounded-2xl flex items-center justify-center transition-transform group-hover:rotate-6`}>
                  {cat.icon}
                </div>
                <span className="font-bold text-slate-700">{cat.name}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-12">
            <div>
              <h2 className="text-3xl font-black text-slate-900">Featured Books</h2>
              <p className="text-slate-500 mt-2 font-medium">Handpicked gems for your collection</p>
            </div>
            <Link to="/dashboard" className="text-violet-600 font-bold hover:underline">View All →</Link>
          </div>
        </div>
      </section>
      <section className="px-4 py-20">
        <div className="max-w-5xl mx-auto rounded-[3rem] bg-gradient-to-br from-violet-600 to-indigo-700 p-12 lg:p-20 text-center relative overflow-hidden">
          <div className="absolute top-0 left-0 w-32 h-32 bg-white/10 rounded-full -translate-x-1/2 -translate-y-1/2" />
          <div className="absolute bottom-0 right-0 w-64 h-64 bg-white/10 rounded-full translate-x-1/3 translate-y-1/3" />
          
          <div className="relative z-10 space-y-6">
            <h2 className="text-4xl md:text-5xl font-black text-white">
              Have Books You Don’t Need?
            </h2>
            <p className="text-violet-100 text-lg max-w-xl mx-auto leading-relaxed font-medium">
              Turn your shelf clutter into instant cash. Sell or list your old books easily and securely.
            </p>
            <div className="pt-4">
              <Link to="/add-book" className="inline-flex items-center px-10 py-4 rounded-2xl bg-white text-violet-600 font-black text-lg hover:bg-violet-50 transition-all shadow-xl hover:-translate-y-1">
                Start Selling Now <ArrowRight className="ml-2" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}