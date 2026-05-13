import { Link, useNavigate, useLocation } from "react-router-dom";
import { AuthSDK } from "../Api/sdk";
import { 
  Search, 
  BookMarked, 
  PlusCircle, 
  UserCircle, 
  LogOut, 
  Library 
} from "lucide-react";

export default function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    try {
      await AuthSDK.logout();
      navigate("/login");
    } catch (err) {
      console.error("Logout failed", err);
    }
  };

  const isActive = (path) => location.pathname === path;

  const navItems = [
    { 
      path: "/dashboard/browse", 
      label: "Browse Books", 
      icon: <Search size={20} /> 
    },
    { 
      path: "/dashboard/my-books", 
      label: "My Books", 
      icon: <BookMarked size={20} /> 
    },
    { 
      path: "/dashboard/add-book", 
      label: "Add Book", 
      icon: <PlusCircle size={20} />,
      isHighlight: true 
    },
    { 
      path: "/dashboard/profile", 
      label: "Profile", 
      icon: <UserCircle size={20} /> 
    },
  ];

  return (
    <aside className="w-72 h-screen sticky top-0 flex flex-col bg-white border-r border-slate-100 px-6 py-10">
      {/* --- LOGO SECTION --- */}
      <div className="flex items-center gap-3 px-2 mb-12">
        <div className="w-10 h-10 bg-violet-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-violet-200">
          <Library size={24} />
        </div>
        <h2 className="text-xl font-black text-slate-900 tracking-tighter">
          BOOK<span className="text-violet-600">LOOP</span>
        </h2>
      </div>

      {/* --- NAVIGATION LINKS --- */}
      <nav className="flex-1 space-y-2">
        {navItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`flex items-center gap-4 px-4 py-3.5 rounded-2xl font-bold transition-all duration-200 group ${
              isActive(item.path)
                ? "bg-violet-600 text-white shadow-lg shadow-violet-200"
                : "text-slate-500 hover:bg-violet-50 hover:text-violet-600"
            }`}
          >
            <span className={`${isActive(item.path) ? "text-white" : "text-slate-400 group-hover:text-violet-600"}`}>
              {item.icon}
            </span>
            <span className="text-[15px]">{item.label}</span>
          </Link>
        ))}
      </nav>

      {/* --- BOTTOM SECTION --- */}
      <div className="pt-6 border-t border-slate-50">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-4 px-4 py-3.5 rounded-2xl font-bold text-slate-500 hover:bg-red-50 hover:text-red-600 transition-all duration-200"
        >
          <LogOut size={20} className="rotate-180" />
          <span className="text-[15px]">Logout</span>
        </button>

      </div>
    </aside>
  );
}