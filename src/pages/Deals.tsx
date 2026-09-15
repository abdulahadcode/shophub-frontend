import { useEffect, useState } from "react";
import ProductCard from "../components/ProductCard";
// @ts-expect-error
import { getProducts } from "../api/productApi";

export default function Deals() {
  const [deals, setDeals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    setLoading(true);
    getProducts()
      .then((products: any[]) => setDeals(products.filter((p) => p.originalPrice)))
      .catch(() => setError("Unable to load deals."))
      .finally(() => setLoading(false));
  }, []);

  return (
    <main className="max-w-7xl mx-auto px-6 py-10">
      <h1 className="text-3xl font-bold mb-2">Deals</h1>
      <p className="text-slate-500 mb-8">Grab our latest discounted products.</p>

      {loading && (
        <div className="text-center py-20">
          <div className="inline-block w-8 h-8 border-4 border-[#2563eb] border-t-transparent rounded-full animate-spin"></div>
          <p className="text-slate-500 mt-4">Loading deals...</p>
        </div>
      )}

      {error && <p className="text-red-500 mb-6">{error}</p>}

      {!loading && !error && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {deals.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </main>
  );
}