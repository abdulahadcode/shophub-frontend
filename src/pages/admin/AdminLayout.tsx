import { Link, Outlet, useLocation } from "react-router";
import { useStore } from "../../store";

export default function AdminLayout() {
  const { user, logout } = useStore();
  const location = useLocation();

  const displayName =
    user?.user_metadata?.full_name ||
    user?.email?.split("@")[0] ||
    "Admin";
const links = [
  { label: "Dashboard", path: "/admin" },
  { label: "Products", path: "/admin/products" },
  { label: "Orders", path: "/admin/orders" },
];

  return (
    <div className="min-h-screen bg-slate-100 flex">
      <aside className="w-64 bg-slate-900 text-white flex flex-col">
        <div className="p-5 border-b border-slate-700">
          <div className="font-bold text-lg tracking-tight">ShopHub Admin</div>
          <div className="text-xs text-slate-400 mt-1 truncate">{displayName}</div>
        </div>

        <nav className="flex-1 p-3 space-y-1">
          {links.map((link) => {
            const active = location.pathname === link.path;
            return (
              <Link
                key={link.path}
                to={link.path}
                className={`block px-4 py-2.5 rounded-xl text-sm font-medium transition ${
                  active
                    ? "bg-[#2563eb] text-white shadow-lg shadow-blue-900/40"
                    : "text-slate-300 hover:bg-slate-800 hover:text-white"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="p-3 border-t border-slate-700 space-y-2">
          <Link
            to="/"
            className="flex items-center justify-center gap-2 w-full text-sm font-medium bg-slate-800 hover:bg-slate-700 text-white py-2.5 px-4 rounded-xl transition"
          >
            ← Store Home
          </Link>
          <button
            onClick={() => logout()}
            className="w-full text-sm font-medium bg-red-500/15 hover:bg-red-500/25 text-red-400 py-2.5 px-4 rounded-xl transition"
          >
            Sign out
          </button>
        </div>
      </aside>

      <main className="flex-1 p-6 overflow-auto">
        <Outlet />
      </main>
    </div>
  );
}