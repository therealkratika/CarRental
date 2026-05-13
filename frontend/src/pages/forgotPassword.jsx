import { useState } from "react";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from '../firebase';
import { Link } from "react-router-dom";
import { KeyRound, ArrowLeft, Mail, Loader2, CheckCircle2 } from "lucide-react";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState("idle"); // 'idle' | 'loading' | 'success' | 'error'

  const handleReset = async (e) => {
    e.preventDefault();
    setStatus("loading");
    setMessage("");

    try {
      await sendPasswordResetEmail(auth, email);
      setStatus("success");
      setMessage("Check your inbox! We've sent instructions to reset your password.");
    } catch (err) {
      setStatus("error");
      setMessage(err.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
      <div className="w-full max-w-md bg-white rounded-[2.5rem] shadow-xl shadow-slate-200/50 p-8 md:p-10 border border-slate-100 animate-in fade-in zoom-in-95 duration-500">
        
        {/* ICON & HEADER */}
        <div className="flex flex-col items-center text-center mb-8">
          <div className="w-16 h-16 bg-violet-600 rounded-2xl flex items-center justify-center text-white mb-4 shadow-lg shadow-violet-200">
            <KeyRound size={32} />
          </div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">Forgot Password?</h2>
          <p className="text-slate-500 font-medium mt-2">
            No worries, it happens. Enter your email and we'll send you a reset link.
          </p>
        </div>

        {/* FORM */}
        <form className="space-y-6" onSubmit={handleReset}>
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700 ml-1">Email Address</label>
            <div className="relative group">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-violet-600 transition-colors" size={20} />
              <input
                type="email"
                placeholder="name@example.com"
                className="w-full pl-12 pr-5 py-4 bg-slate-50 border-2 border-transparent focus:border-violet-200 focus:bg-white rounded-2xl outline-none transition-all font-medium"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          <button 
            type="submit" 
            disabled={status === "loading" || status === "success"}
            className="w-full bg-violet-600 text-white py-4 rounded-2xl font-black text-lg shadow-lg shadow-violet-100 hover:bg-violet-700 hover:-translate-y-1 transition-all active:scale-[0.98] flex items-center justify-center gap-3 disabled:opacity-70"
          >
            {status === "loading" ? (
              <Loader2 className="animate-spin" size={20} />
            ) : status === "success" ? (
              <CheckCircle2 size={20} />
            ) : null}
            {status === "loading" ? "Sending..." : status === "success" ? "Email Sent" : "Send Reset Link"}
          </button>
        </form>

        {/* FEEDBACK MESSAGE */}
        {message && (
          <div className={`mt-6 p-4 rounded-2xl text-sm font-bold flex gap-3 items-center animate-in slide-in-from-top-2 duration-300 ${
            status === "success" ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-700"
          }`}>
            {status === "success" && <CheckCircle2 size={18} />}
            {message}
          </div>
        )}

        {/* FOOTER */}
        <div className="mt-8 pt-6 border-t border-slate-50">
          <Link 
            to="/login" 
            className="flex items-center justify-center gap-2 text-slate-500 font-bold hover:text-violet-600 transition-colors group"
          >
            <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
            Back to Sign in
          </Link>
        </div>
      </div>
    </div>
  );
}