import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { AuthSDK } from "../Api/sdk";
import { 
  Search, 
  BookMarked, 
  PlusCircle, 
  UserCircle, 
  LogOut, 
  Library,
  Menu,
  X    
} from "lucide-react";

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(false); 
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

  const toggleSidebar = () => setIsOpen(!isOpen);
  const isActive = (path) => location.pathname === path;

  const navItems = [
    { path: "/dashboard/browse", label: "Browse Books", icon: <Search size={20} /> },
    { path: "/dashboard/my-books", label: "My Books", icon: <BookMarked size={20} /> },
    { path: "/dashboard/add-book", label: "Add Book", icon: <PlusCircle size={20} /> },
    { path: "/dashboard/profile", label: "Profile", icon: <UserCircle size={20} /> },
  ];

  return (
    <>
      <button 
        onClick={toggleSidebar}
        aria-label="Toggle Menu"
        className="fixed top-4 left-4 z-[60] p-2 bg-violet-600 text-white rounded-lg shadow-lg lg:hidden block"
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>
      {isOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-40 lg:hidden"
          onClick={toggleSidebar}
        />
      )}
      <aside className={`
        /* Base styles (Mobile): Fixed, slide-in from left */
        fixed inset-y-0 left-0 z-50 w-72 bg-white border-r border-slate-100 px-6 py-10 transition-transform duration-300 ease-in-out
        
        /* Desktop overrides: Always visible, sticky position */
        lg:sticky lg:top-0 lg:h-screen lg:translate-x-0 lg:flex lg:z-30
        
        /* Toggle state for mobile */
        ${isOpen ? "translate-x-0" : "-translate-x-full"}
      `}>
        <div className="flex items-center gap-3 px-2 mb-12">
          <div className="w-10 h-10 bg-violet-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-violet-200">
            <Library size={24} />
          </div>
          <h2 className="text-xl font-black text-slate-900 tracking-tighter">
            BOOK<span className="text-violet-600">LOOP</span>
          </h2>
        </div>

        <nav className="flex-1 space-y-2 overflow-y-auto">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => setIsOpen(false)} 
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
    </>
  );
}