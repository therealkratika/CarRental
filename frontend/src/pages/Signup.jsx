import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { AuthSDK } from '../Api/sdk';
import { User, Mail, Lock, UserPlus, Loader2, ArrowRight, Library } from 'lucide-react';

export default function Signup() {
  const { register, handleSubmit, setError, formState: { errors, isSubmitting } } = useForm();
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    if (data.password !== data.confirmPassword) {
      setError('confirmPassword', { type: 'manual', message: 'Passwords do not match' });
      return;
    }
    try {
      await AuthSDK.signup({
        username: data.username,
        email: data.email,
        password: data.password
      });
      navigate("/login");
    } catch (err) {
      setError("root", {
        message: err.message || "Signup failed"
      });
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gray-50 bg-[radial-gradient(circle_at_bottom_left,_var(--tw-gradient-stops))] from-violet-100 via-white to-white px-4 py-12">
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-violet-600 to-indigo-500" />

      <div className="w-full max-w-md">
        <div className="flex flex-col items-center mb-8">
          <div className="w-12 h-12 bg-violet-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-violet-200 mb-4 transition-transform hover:rotate-12">
            <Library size={28} />
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Book<span className="text-violet-600">Hub</span>
          </h1>
        </div>
        <div className="bg-white rounded-[2.5rem] p-8 md:p-10 shadow-[0_20px_50px_rgba(124,58,237,0.1)] border border-gray-100">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-black text-slate-900">Get Started</h2>
            <p className="text-slate-500 mt-2 font-medium tracking-tight">Create your account to start reading</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div className="space-y-1.5">
              <label className="text-sm font-bold text-slate-700 ml-1">Username</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-violet-500 transition-colors">
                  <User size={18} />
                </div>
                <input
                  type="text"
                  placeholder="username"
                  className={`block w-full bg-slate-50 border-2 ${errors.username ? "border-red-100" : "border-transparent"} focus:border-violet-200 focus:bg-white rounded-2xl py-3 pl-11 pr-4 text-sm transition-all outline-none`}
                  {...register('username', { required: 'Username is required' })}
                />
              </div>
              {errors.username && <p className="text-xs font-bold text-red-500 ml-1 mt-1">{errors.username.message}</p>}
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-bold text-slate-700 ml-1">Email Address</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-violet-500 transition-colors">
                  <Mail size={18} />
                </div>
                <input
                  type="email"
                  placeholder="you@example.com"
                  className={`block w-full bg-slate-50 border-2 ${errors.email ? "border-red-100" : "border-transparent"} focus:border-violet-200 focus:bg-white rounded-2xl py-3 pl-11 pr-4 text-sm transition-all outline-none`}
                  {...register("email", {
                    required: "Email is required",
                    pattern: { value: /^\S+@\S+$/i, message: "Enter a valid email" }
                  })}
                />
              </div>
              {errors.email && <p className="text-xs font-bold text-red-500 ml-1 mt-1">{errors.email.message}</p>}
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-bold text-slate-700 ml-1">Password</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-violet-500 transition-colors">
                  <Lock size={18} />
                </div>
                <input
                  type="password"
                  placeholder="At least 6 characters"
                  className={`block w-full bg-slate-50 border-2 ${errors.password ? "border-red-100" : "border-transparent"} focus:border-violet-200 focus:bg-white rounded-2xl py-3 pl-11 pr-4 text-sm transition-all outline-none`}
                  {...register("password", {
                    required: "Password is required",
                    minLength: { value: 6, message: "Password must be at least 6 characters" }
                  })}
                />
              </div>
              {errors.password && <p className="text-xs font-bold text-red-500 ml-1 mt-1">{errors.password.message}</p>}
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-bold text-slate-700 ml-1">Confirm Password</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-violet-500 transition-colors">
                  <Lock size={18} />
                </div>
                <input
                  type="password"
                  placeholder="Repeat your password"
                  className={`block w-full bg-slate-50 border-2 ${errors.confirmPassword ? "border-red-100" : "border-transparent"} focus:border-violet-200 focus:bg-white rounded-2xl py-3 pl-11 pr-4 text-sm transition-all outline-none`}
                  {...register("confirmPassword", { required: "Please confirm your password" })}
                />
              </div>
              {errors.confirmPassword && <p className="text-xs font-bold text-red-500 ml-1 mt-1">{errors.confirmPassword.message}</p>}
            </div>
            {errors.root && (
              <div className="p-3 rounded-xl bg-red-50 border border-red-100">
                <p className="text-xs font-bold text-red-600 text-center">{errors.root.message}</p>
              </div>
            )}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full flex items-center justify-center gap-2 bg-violet-600 text-white py-4 rounded-2xl font-black text-sm shadow-xl shadow-violet-200 hover:bg-violet-700 hover:-translate-y-0.5 transition-all active:scale-[0.98] disabled:opacity-70 disabled:pointer-events-none mt-2"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="animate-spin" size={20} />
                  <span>Creating account...</span>
                </>
              ) : (
                <>
                  <span>Create Account</span>
                  <ArrowRight size={18} />
                </>
              )}
            </button>
          </form>
          <div className="mt-8 text-center border-t border-slate-50 pt-6">
            <p className="text-sm font-medium text-slate-500">
              Already have an account?{" "}
              <Link to="/login" className="text-violet-600 font-bold hover:underline">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}