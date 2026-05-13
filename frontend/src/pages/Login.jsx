import { useNavigate, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { AuthSDK } from "../Api/sdk";
import { Mail, Lock, ArrowRight, Loader2, Library } from "lucide-react";

export default function Login() {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm();

  const onSubmit = async (data) => {
    try {
      await AuthSDK.login(data.email, data.password);
      navigate("/dashboard", { replace: true });
    } catch (err) {
      setError("email", {
        message: err.message || "Invalid email or password",
      });
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gray-50 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-violet-100 via-white to-white px-4">
      {/* Background Decorative Element */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-violet-600 to-indigo-500" />

      <div className="w-full max-w-md">
        {/* Logo Branding */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-12 h-12 bg-violet-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-violet-200 mb-4">
            <Library size={28} />
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Book<span className="text-violet-600">Hub</span>
          </h1>
        </div>

        {/* Auth Card */}
        <div className="bg-white rounded-[2.5rem] p-8 md:p-10 shadow-[0_20px_50px_rgba(124,58,237,0.1)] border border-gray-100">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-black text-slate-900">Welcome Back</h2>
            <p className="text-slate-500 mt-2 font-medium">Please enter your details to sign in</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Email Field */}
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 ml-1">Email Address</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-violet-500 transition-colors">
                  <Mail size={18} />
                </div>
                <input
                  type="email"
                  placeholder="you@example.com"
                  className={`block w-full bg-slate-50 border-2 ${
                    errors.email ? "border-red-100" : "border-transparent"
                  } focus:border-violet-200 focus:bg-white rounded-2xl py-3.5 pl-11 pr-4 text-sm transition-all outline-none`}
                  {...register("email", { required: "Email is required" })}
                />
              </div>
              {errors.email && (
                <p className="text-xs font-bold text-red-500 ml-1 mt-1">{errors.email.message}</p>
              )}
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <div className="flex justify-between items-center ml-1">
                <label className="text-sm font-bold text-slate-700">Password</label>
                <button
                  type="button"
                  onClick={() => navigate("/forgot-password")}
                  className="text-xs font-bold text-violet-600 hover:text-violet-700 hover:underline"
                >
                  Forgot password?
                </button>
              </div>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-violet-500 transition-colors">
                  <Lock size={18} />
                </div>
                <input
                  type="password"
                  placeholder="••••••••"
                  className={`block w-full bg-slate-50 border-2 ${
                    errors.password ? "border-red-100" : "border-transparent"
                  } focus:border-violet-200 focus:bg-white rounded-2xl py-3.5 pl-11 pr-4 text-sm transition-all outline-none`}
                  {...register("password", { required: "Password is required" })}
                />
              </div>
              {errors.password && (
                <p className="text-xs font-bold text-red-500 ml-1 mt-1">{errors.password.message}</p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full flex items-center justify-center gap-2 bg-violet-600 text-white py-4 rounded-2xl font-black text-sm shadow-xl shadow-violet-200 hover:bg-violet-700 hover:-translate-y-0.5 transition-all active:scale-[0.98] disabled:opacity-70 disabled:pointer-events-none"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="animate-spin" size={20} />
                  <span>Signing in...</span>
                </>
              ) : (
                <>
                  <span>Sign In</span>
                  <ArrowRight size={18} />
                </>
              )}
            </button>
          </form>

          {/* Footer Link */}
          <div className="mt-8 text-center">
            <p className="text-sm font-medium text-slate-500">
              Don’t have an account?{" "}
              <Link to="/signup" className="text-violet-600 font-bold hover:underline">
                Create account
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}