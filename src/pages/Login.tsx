import { useState } from "react";
import { Link, useNavigate } from "react-router";
// @ts-expect-error The JavaScript auth module does not currently provide TypeScript declarations.
import { signIn } from "../lib/auth";

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await signIn(email, password);
      setSuccess(true);
      setTimeout(() => navigate("/"), 1200);
    } catch (err: any) {
      setError(err.message || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-[#f8fafc] px-4 py-12">
      <div className="bg-white p-8 sm:p-10 rounded-3xl shadow-xl border border-slate-100 w-full max-w-md">
        
        {success ? (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-5 text-3xl">
              ✓
            </div>
            <h2 className="text-2xl font-bold text-slate-900 mb-2">Welcome back!</h2>
            <p className="text-slate-500 text-sm">Login successful. Redirecting you...</p>
          </div>
        ) : (
          <>
            <div className="text-center mb-8">
              <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">Welcome back</h1>
              <p className="text-slate-500 text-sm mt-2">Sign in to your ShopHub account</p>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-100 text-red-600 text-sm p-3.5 rounded-xl mb-5 flex items-start gap-2">
                <span className="text-base">⚠️</span>
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Email address</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="you@example.com"
                  className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#2563eb] focus:ring-2 focus:ring-blue-50 transition"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="••••••••"
                  className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#2563eb] focus:ring-2 focus:ring-blue-50 transition"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#2563eb] text-white py-3.5 rounded-xl font-semibold hover:bg-[#1d4ed8] transition disabled:opacity-60 shadow-lg shadow-blue-200"
              >
                {loading ? "Signing in..." : "Sign In"}
              </button>
            </form>

            <p className="text-center text-sm text-slate-500 mt-7">
              Don't have an account?{" "}
              <Link to="/register" className="text-[#2563eb] font-semibold hover:underline">
                Create one
              </Link>
            </p>
          </>
        )}
      </div>
    </div>
  );
}