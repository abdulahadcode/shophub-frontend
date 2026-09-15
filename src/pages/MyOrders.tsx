import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router";
import { useStore } from "../store";
// @ts-expect-error
import { getMyOrders } from "../api/orderApi";

const statusStyle: Record<string, string> = {
  pending: "bg-amber-50 text-amber-700",
  confirmed: "bg-blue-50 text-blue-700",
  shipped: "bg-violet-50 text-violet-700",
  delivered: "bg-emerald-50 text-emerald-700",
  cancelled: "bg-red-50 text-red-600",
};

export default function MyOrders() {
  const { user, isLoggedIn } = useStore();
  const navigate = useNavigate();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isLoggedIn) {
      navigate("/login", { state: { from: "/orders" } });
      return;
    }
    if (!user?.id) return;

    getMyOrders(user.id)
      .then(setOrders)
      .catch(() => setOrders([]))
      .finally(() => setLoading(false));
  }, [isLoggedIn, user, navigate]);

  if (!isLoggedIn) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center text-slate-500">
        Redirecting to login...
      </div>
    );
  }

  return (
    <main className="min-h-full bg-[#f8fafc] py-10">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        <h1 className="font-['Outfit',sans-serif] font-bold text-2xl sm:text-3xl text-slate-900 mb-2">
          My Orders
        </h1>
        <p className="text-slate-500 text-sm mb-8">
          Track your orders and their current status.
        </p>

        {loading ? (
          <div className="text-center py-16 text-slate-500">Loading orders...</div>
        ) : orders.length === 0 ? (
          <div className="bg-white rounded-3xl border border-slate-200 py-16 text-center">
            <div className="text-4xl mb-3">📦</div>
            <h2 className="font-bold text-lg text-slate-900 mb-2">No orders yet</h2>
            <p className="text-sm text-slate-500 mb-5">
              When you place an order, it will show up here.
            </p>
            <Link
              to="/products"
              className="inline-block bg-[#2563eb] text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-[#1d4ed8]"
            >
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((o) => (
              <div
                key={o.id}
                className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm"
              >
                <div className="flex flex-wrap items-start justify-between gap-3 mb-4">
                  <div>
                    <div className="font-bold text-slate-900">Order #{o.id}</div>
                    <div className="text-xs text-slate-400 mt-0.5">
                      {o.created_at
                        ? new Date(o.created_at).toLocaleString()
                        : ""}
                    </div>
                  </div>

                  <div className="text-right">
                    <span
                      className={`inline-block text-xs font-bold px-2.5 py-1 rounded-full capitalize ${
                        statusStyle[o.status] || "bg-slate-100 text-slate-600"
                      }`}
                    >
                      {o.status || "pending"}
                    </span>
                    <div className="font-bold text-slate-900 mt-2">
                      ${Number(o.total_amount || o.total || 0).toFixed(2)}
                    </div>
                  </div>
                </div>

                <div className="border-t border-slate-100 pt-3 space-y-2">
                  {(o.items || []).map((item: any) => (
                    <div
                      key={item.id}
                      className="flex justify-between text-sm text-slate-600"
                    >
                      <span>
                        Product #{item.product_id}
                        {item.selected_color ? ` · ${item.selected_color}` : ""}
                        {" · "}×{item.quantity}
                      </span>
                      <span className="font-medium text-slate-800">
                        ${(Number(item.price) * Number(item.quantity)).toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>

                {(o.city || o.address_line1) && (
                  <div className="mt-3 text-xs text-slate-400">
                    Ship to: {o.address_line1}
                    {o.city ? `, ${o.city}` : ""}
                    {o.state ? `, ${o.state}` : ""}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}