import { Link, useNavigate } from "react-router";
import { useState, useEffect, useRef } from "react";
import { useStore } from "../store";

export default function Navbar() {
  const { cartCount, isLoggedIn, user, logout } = useStore();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchVal, setSearchVal] = useState("");
  const navigate = useNavigate();

  const NAV_LINKS = [
    { label: "Electronics", path: "/products/electronics" },
    { label: "Fashion", path: "/products/fashion" },
    { label: "Beauty", path: "/products/beauty" },
    { label: "Home & Office", path: "/products/home-office" },
  ];

  const displayName =
    user?.user_metadata?.full_name ||
    user?.email?.split("@")[0] ||
    "User";

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    const q = searchVal.trim();
    if (!q) return;
    navigate(`/products?q=${encodeURIComponent(q)}`);
    setMobileOpen(false);
  }

  async function handleLogout() {
    await logout();
    setMobileOpen(false);
    navigate("/");
  }
  const menuRef = useRef<HTMLDivElement>(null);

  // Bahar click pe menu band
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        mobileOpen &&
        menuRef.current &&
        !menuRef.current.contains(event.target as Node)
      ) {
        setMobileOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [mobileOpen]);

  return (
    <>
      {/* Top bar */}
      <div className="bg-[#1e3a5f] text-white text-center text-xs py-2 px-4 tracking-wide">
        Free shipping on orders over $99 &nbsp;·&nbsp; 30-day free returns &nbsp;·&nbsp;
        <span className="font-semibold text-[#fbbf24]">
          Use code SAVE15 for 15% off
        </span>
      </div>

      {/* Main nav */}
      <nav className="sticky top-0 z-50 bg-white shadow-sm border-b border-slate-200">
        <div className="max-w-[76rem] mx-auto px-4 sm:px-6 lg:px-8">

          {/* Top row */}
          <div className="flex items-center gap-3 h-16">

            {/* Logo */}
            <Link
              to="/"
              onClick={() => setMobileOpen(false)}
              className="flex-shrink-0 flex items-center gap-1.5"
            >
              <div className="w-8 h-8 bg-[#2563eb] rounded-lg flex items-center justify-center">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
                  <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" />
                  <line x1="3" y1="6" x2="21" y2="6" />
                  <path d="M16 10a4 4 0 0 1-8 0" />
                </svg>
              </div>
              <span className="font-['Outfit',sans-serif] font-bold text-lg sm:text-xl text-slate-900 tracking-tight">
                Shop<span className="text-[#2563eb]">Hub</span>
              </span>
            </Link>

            {/* Search - Desktop */}
            <form onSubmit={handleSearch} className="flex-1 hidden sm:flex max-w-xl">
              <div className="flex w-full rounded-xl overflow-hidden border border-slate-300 focus-within:border-[#2563eb] focus-within:ring-2 focus-within:ring-blue-100 transition-all">
                <input
                  value={searchVal}
                  onChange={(e) => setSearchVal(e.target.value)}
                  placeholder="Search products, brands, categories..."
                  className="flex-1 px-4 py-2.5 text-sm outline-none bg-white text-slate-800 placeholder-slate-400"
                />
                <button
                  type="submit"
                  className="bg-[#2563eb] px-4 text-white hover:bg-[#1d4ed8] transition-colors"
                >
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <circle cx="11" cy="11" r="8" />
                    <path d="m21 21-4.35-4.35" />
                  </svg>
                </button>
              </div>
            </form>

            {/* Right actions */}
            <div className="flex items-center gap-2 ml-auto">

              {/* ===== AUTH (Desktop + Mobile) ===== */}
              {isLoggedIn ? (
                <div className="flex items-center gap-1 md:gap-2">
                  {/* Avatar circle - hamesha dikhe */}
                  <div className="w-8 h-8 rounded-full bg-[#2563eb] text-white flex items-center justify-center text-xs font-bold">
                    {displayName[0]?.toUpperCase() || "U"}
                  </div>

                  {/* Name - sirf bade screen pe */}
                  <div className="hidden sm:block text-right mr-1">
                    <div className="text-[11px] text-slate-500 leading-none">Hello,</div>
                    <div className="text-sm font-semibold text-slate-800 leading-tight">
                      {displayName.split(" ")[0]}
                    </div>
                  </div>

                  {/* Sign out button */}
                  <button
                    onClick={handleLogout}
                    className="text-xs font-medium text-slate-500 hover:text-red-600 hover:bg-red-50 px-2 py-1.5 rounded-lg transition"
                  >
                    Sign out
                  </button>
                </div>
              ) : (
                <Link
                  to="/login"
                  className="flex items-center gap-1.5 text-sm font-medium text-slate-700 hover:text-[#2563eb] transition-colors px-2.5 py-2 rounded-xl hover:bg-blue-50"
                >
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                    <circle cx="12" cy="7" r="4" />
                  </svg>
                  <span className="hidden xs:inline sm:inline">Sign In</span>
                </Link>
              )}

              {isLoggedIn && (
                <Link
                  to="/orders"
                  className="hidden sm:block text-sm font-medium text-slate-700 hover:text-[#2563eb] px-3 py-2 rounded-xl hover:bg-blue-50"
                >
                  My Orders
                </Link>
              )}

              {/* Cart */}
              <Link
                to="/cart"
                className="relative flex items-center gap-1.5 bg-[#2563eb] text-white px-3 sm:px-4 py-2.5 rounded-xl text-sm font-semibold hover:bg-[#1d4ed8] transition-colors"
              >
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="9" cy="21" r="1" />
                  <circle cx="20" cy="21" r="1" />
                  <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
                </svg>
                <span className="hidden sm:inline">Cart</span>
                {cartCount > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 bg-[#f59e0b] text-white text-[10px] font-bold rounded-full min-w-[18px] h-[18px] flex items-center justify-center px-1">
                    {cartCount}
                  </span>
                )}
              </Link>

              {/* Mobile Hamburger */}
              <button
                className="sm:hidden p-2 rounded-lg hover:bg-slate-100"
                onClick={() => setMobileOpen((o) => !o)}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  {mobileOpen ? (
                    <path d="M18 6 6 18M6 6l12 12" />
                  ) : (
                    <>
                      <line x1="3" y1="6" x2="21" y2="6" />
                      <line x1="3" y1="12" x2="21" y2="12" />
                      <line x1="3" y1="18" x2="21" y2="18" />
                    </>
                  )}
                </svg>
              </button>
            </div>
          </div>

          {/* Desktop Categories */}
          <div className="hidden sm:flex items-center gap-1 pb-2.5 overflow-x-auto">
            <Link
              to="/products"
              className="text-xs font-semibold px-3 py-1.5 rounded-full text-slate-600 hover:text-[#2563eb] hover:bg-blue-50 transition-colors whitespace-nowrap"
            >
              All Products
            </Link>
            {NAV_LINKS.map(({ label, path }) => (
              <Link
                key={path}
                to={path}
                className="text-xs font-semibold px-3 py-1.5 rounded-full text-slate-600 hover:text-[#2563eb] hover:bg-blue-50 transition-colors whitespace-nowrap"
              >
                {label}
              </Link>
            ))}
            <Link
              to="/deals"
              className="text-xs font-semibold px-3 py-1.5 rounded-full text-red-600 bg-red-50 hover:bg-red-100 transition-colors whitespace-nowrap"
            >
              🔥 Deals
            </Link>
          </div>
        </div>

        {/* ================= MOBILE MENU ================= */}
        {mobileOpen && (
          <div ref={menuRef} className="sm:hidden border-t border-slate-200 bg-white">

            {/* Mobile Search */}
            <form onSubmit={handleSearch} className="px-4 pt-4 pb-3">
              <div className="flex rounded-xl overflow-hidden border border-slate-300">
                <input
                  value={searchVal}
                  onChange={(e) => setSearchVal(e.target.value)}
                  placeholder="Search products..."
                  className="flex-1 px-3 py-2.5 text-sm outline-none"
                />
                <button type="submit" className="bg-[#2563eb] px-4 text-white">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="11" cy="11" r="8" />
                    <path d="m21 21-4.35-4.35" />
                  </svg>
                </button>
              </div>
            </form>

            {/* Mobile Links */}
            <div className="px-4 space-y-1">
              <Link
                to="/products"
                onClick={() => setMobileOpen(false)}
                className="block text-sm font-medium py-2.5 px-3 rounded-xl text-slate-700 hover:bg-slate-50"
              >
                All Products
              </Link>

              {NAV_LINKS.map(({ label, path }) => (
                <Link
                  key={path}
                  to={path}
                  onClick={() => setMobileOpen(false)}
                  className="block text-sm font-medium py-2.5 px-3 rounded-xl text-slate-700 hover:bg-slate-50"
                >
                  {label}
                </Link>
              ))}

              <Link
                to="/deals"
                onClick={() => setMobileOpen(false)}
                className="block text-sm font-medium py-2.5 px-3 rounded-xl text-red-600 hover:bg-red-50"
              >
                🔥 Deals
              </Link>

              {isLoggedIn && (
                <Link
                  to="/orders"
                  onClick={() => setMobileOpen(false)}
                  className="block text-sm font-medium py-2.5 px-3 rounded-xl text-slate-700 hover:bg-slate-50"
                >
                  My Orders
                </Link>
              )}
            </div>

            {/* Mobile Auth Section */}
            <div className="border-t border-slate-200 mx-4 mt-3 pt-4 pb-5">
              {isLoggedIn ? (
                <div className="px-1">
                  {/* User row */}
                  <div className="flex items-center gap-3 mb-4">
                    {/* Circle with first letter */}
                    <div className="w-11 h-11 rounded-full bg-[#2563eb] text-white flex items-center justify-center text-base font-bold shadow-sm">
                      {displayName[0]?.toUpperCase() || "U"}
                    </div>

                    <div>
                      <div className="text-xs text-slate-500">Hello,</div>
                      <div className="text-sm font-semibold text-slate-900">
                        {displayName}
                      </div>
                    </div>
                  </div>

                  {/* Sign out button */}
                  <button
                    onClick={handleLogout}
                    className="w-full text-sm font-medium text-red-600 bg-red-50 hover:bg-red-100 py-2.5 px-4 rounded-xl transition"
                  >
                    Sign out
                  </button>
                </div>
              ) : (
                <div className="space-y-2">
                  <Link
                    to="/login"
                    onClick={() => setMobileOpen(false)}
                    className="block text-center text-sm font-semibold text-white bg-[#2563eb] py-2.5 px-4 rounded-xl hover:bg-[#1d4ed8] transition"
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/register"
                    onClick={() => setMobileOpen(false)}
                    className="block text-center text-sm font-semibold text-slate-700 bg-slate-100 py-2.5 px-4 rounded-xl hover:bg-slate-200 transition"
                  >
                    Create Account
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </nav>
    </>
  );
}