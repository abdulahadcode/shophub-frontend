import { useEffect, useState } from "react";
// @ts-expect-error
import { getOrders, updateOrderStatus } from "../../api/orderApi";

const STATUSES = ["pending", "confirmed", "shipped", "delivered", "cancelled"];

export default function AdminOrders() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState<number | null>(null);

  async function load() {
    try {
      setLoading(true);
      const data = await getOrders();
      setOrders(data);
    } catch {
      setOrders([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function changeStatus(id: number, status: string) {
    try {
      await updateOrderStatus(id, status);
      await load();
    } catch {
      alert("Failed to update status");
    }
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Orders</h1>
        <p className="text-slate-500 text-sm mt-1">
          All placed orders · {orders.length} total
        </p>
      </div>

      {loading ? (
        <div className="text-slate-500 py-12 text-center">Loading orders...</div>
      ) : orders.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-2xl py-16 text-center text-slate-500">
          No orders yet.
        </div>
      ) : (
        <div className="space-y-3">
          {orders.map((o, index) => (
            <div
              key={o.id}
              className="bg-white border border-slate-200 rounded-2xl overflow-hidden"
            >
              <div className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
                <div className="text-slate-400 text-sm font-medium w-8">
                  #{index + 1}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-bold text-slate-900">Order #{o.id}</span>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 capitalize">
                      {o.status || "—"}
                    </span>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 capitalize">
                      {o.payment_status || "—"}
                    </span>
                  </div>
                  <div className="text-sm text-slate-500 mt-1">
                    {o.first_name} {o.last_name} · {o.email}
                  </div>
                  <div className="text-xs text-slate-400 mt-0.5">
                    {o.created_at
                      ? new Date(o.created_at).toLocaleString()
                      : ""}
                  </div>
                </div>

                <div className="text-right">
                  <div className="font-bold text-slate-900 text-lg">
                    ${Number(o.total_amount || o.total || 0).toFixed(2)}
                  </div>
                  <div className="text-xs text-slate-400">
                    {(o.items || []).length} item(s)
                  </div>
                </div>

                <select
                  value={o.status || "confirmed"}
                  onChange={(e) => changeStatus(o.id, e.target.value)}
                  className="border border-slate-200 rounded-xl px-3 py-2 text-sm bg-white"
                >
                  {STATUSES.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>

                <button
                  onClick={() => setExpanded(expanded === o.id ? null : o.id)}
                  className="text-sm font-medium text-[#2563eb] hover:underline px-2"
                >
                  {expanded === o.id ? "Hide" : "Details"}
                </button>
              </div>

              {expanded === o.id && (
                <div className="border-t border-slate-100 bg-slate-50 px-4 sm:px-5 py-4 text-sm">
                  <div className="grid sm:grid-cols-2 gap-4 mb-4">
                    <div>
                      <div className="text-xs font-bold text-slate-400 uppercase mb-1">
                        Shipping
                      </div>
                      <div className="text-slate-700">
                        {o.address_line1}
                        {o.address_line2 ? `, ${o.address_line2}` : ""}
                        <br />
                        {o.city}
                        {o.state ? `, ${o.state}` : ""} {o.zip}
                        <br />
                        {o.country}
                      </div>
                      <div className="text-slate-500 mt-1 text-xs">
                        Method: {o.shipping_method || "—"} · Phone: {o.phone || "—"}
                      </div>
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-400 uppercase mb-1">
                        Payment
                      </div>
                      <div className="text-slate-700 capitalize">
                        {o.payment_method || "—"} · {o.payment_status || "—"}
                      </div>
                      <div className="text-xs text-slate-500 mt-2 space-y-0.5">
                        <div>Subtotal: ${Number(o.subtotal || 0).toFixed(2)}</div>
                        <div>Shipping: ${Number(o.shipping_cost || 0).toFixed(2)}</div>
                        <div>Tax: ${Number(o.tax || 0).toFixed(2)}</div>
                        <div className="font-semibold text-slate-800">
                          Total: ${Number(o.total_amount || o.total || 0).toFixed(2)}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="text-xs font-bold text-slate-400 uppercase mb-2">
                    Items
                  </div>
                  <div className="space-y-2">
                    {(o.items || []).map((item: any) => (
                      <div
                        key={item.id}
                        className="flex justify-between bg-white rounded-xl px-3 py-2 border border-slate-200"
                      >
                        <span className="text-slate-700">
                          Product #{item.product_id}
                          {item.selected_color ? ` · ${item.selected_color}` : ""}
                          {" · "}Qty {item.quantity}
                        </span>
                        <span className="font-medium text-slate-900">
                          ${(Number(item.price) * Number(item.quantity)).toFixed(2)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}