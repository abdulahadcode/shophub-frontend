import { useEffect, useState } from "react";
// @ts-expect-error
import { getProducts } from "../../api/productApi";
// @ts-expect-error
import { getOrders } from "../../api/orderApi";

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    products: 0,
    totalStock: 0,
    lowStock: 0,
    orders: 0,
    revenue: 0,
  });
  const [loading, setLoading] = useState(true);
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    Promise.all([getProducts(), getOrders()])
      .then(([products, orders]: [any[], any[]]) => {
        setStats({
          products: products.length,
          totalStock: products.reduce(
            (s, p) => s + (Number(p.stock) || 0),
            0
          ),
          lowStock: products.filter(
            (p) =>
              (Number(p.stock) || 0) > 0 && (Number(p.stock) || 0) <= 10
          ).length,
          orders: orders.length,
          revenue: orders.reduce(
            (s, o) => s + (Number(o.total_amount || o.total) || 0),
            0
          ),
        });
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  const timeStr = now.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });

  const dateStr = now.toLocaleDateString("en-US", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  const cards = [
    { label: "Total Products", value: stats.products, hint: "In catalog" },
    { label: "Total Stock Units", value: stats.totalStock, hint: "All products combined" },
    { label: "Low Stock (≤10)", value: stats.lowStock, hint: "Need restock soon" },
    { label: "Total Orders", value: stats.orders, hint: "All time" },
    {
      label: "Revenue",
      value: `$${stats.revenue.toFixed(0)}`,
      hint: "From all orders",
    },
  ];

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>
          <p className="text-slate-500 text-sm mt-1">Store overview</p>
        </div>

        <div className="bg-slate-900 text-white rounded-2xl px-5 py-3 text-right shadow-lg">
          <div className="font-mono text-2xl font-bold tracking-wider tabular-nums">
            {timeStr}
          </div>
          <div className="text-xs text-slate-400 mt-0.5">{dateStr}</div>
        </div>
      </div>

      {loading ? (
        <div className="text-slate-500">Loading stats...</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {cards.map((card) => (
            <div
              key={card.label}
              className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm"
            >
              <div className="text-sm text-slate-500">{card.label}</div>
              <div className="text-3xl font-bold text-slate-900 mt-1">
                {card.value}
              </div>
              <div className="text-xs text-slate-400 mt-2">{card.hint}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}