import { Link, useNavigate, useLocation } from "react-router-dom";
import { useState } from "react";
import { AuthSDK } from "../Api/sdk";
import {
  Search,
  BookMarked,
  PlusCircle,
  UserCircle,
  LogOut,
  Library,
  Menu,
  X,
} from "lucide-react";

export default function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();

  const [isOpen, setIsOpen] = useState(false);

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
      icon: <Search size={20} />,
    },
    {
      path: "/dashboard/my-books",
      label: "My Books",
      icon: <BookMarked size={20} />,
    },
    {
      path: "/dashboard/add-book",
      label: "Add Book",
      icon: <PlusCircle size={20} />,
      isHighlight: true,
    },
    {
      path: "/dashboard/profile",
      label: "Profile",
      icon: <UserCircle size={20} />,
    },
  ];

  return (
    <>
      {/* Mobile Topbar */}
      <div className="md:hidden flex items-center justify-between px-4 py-4 bg-white border-b border-slate-100 sticky top-0 z-50">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 bg-violet-600 rounded-xl flex items-center justify-center text-white">
            <Library size={20} />
          </div>

          <h2 className="text-lg font-black text-slate-900 tracking-tight">
            BOOK<span className="text-violet-600">LOOP</span>
          </h2>
        </div>

        <button
          onClick={() => setIsOpen(true)}
          className="p-2 rounded-lg hover:bg-slate-100"
        >
          <Menu size={24} />
        </button>
      </div>

      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed md:sticky top-0 left-0 z-50
          h-screen w-72
          bg-white border-r border-slate-100
          px-6 py-10
          flex flex-col
          transform transition-transform duration-300
          ${
            isOpen ? "translate-x-0" : "-translate-x-full"
          }
          md:translate-x-0
        `}
      >
        {/* Mobile Close Button */}
        <div className="md:hidden flex justify-end mb-4">
          <button
            onClick={() => setIsOpen(false)}
            className="p-2 rounded-lg hover:bg-slate-100"
          >
            <X size={24} />
          </button>
        </div>

        {/* Logo */}
        <div className="flex items-center gap-3 px-2 mb-12">
          <div className="w-10 h-10 bg-violet-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-violet-200">
            <Library size={24} />
          </div>

          <h2 className="text-xl font-black text-slate-900 tracking-tighter">
            BOOK<span className="text-violet-600">LOOP</span>
          </h2>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-2">
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
              <span
                className={`${
                  isActive(item.path)
                    ? "text-white"
                    : "text-slate-400 group-hover:text-violet-600"
                }`}
              >
                {item.icon}
              </span>

              <span className="text-[15px]">{item.label}</span>
            </Link>
          ))}
        </nav>

        {/* Logout */}
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