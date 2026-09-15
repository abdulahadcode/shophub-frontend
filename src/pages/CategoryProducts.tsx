import { useEffect, useState } from "react";
import ProductCard from "../components/ProductCard";
// @ts-expect-error
import { getProducts } from "../api/productApi";

export default function CategoryProducts({ category }: { category: string }) {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    setLoading(true);
    setError("");

    getProducts({ category: category.toLowerCase().replace(/ & /g, "-") })
      .then(setProducts)
      .catch(() => setError("Unable to load products."))
      .finally(() => setLoading(false));
  }, [category]);

  return (
    <main className="max-w-7xl mx-auto px-6 py-10">
      <h1 className="text-3xl font-bold mb-2">{category}</h1>
      <p className="text-slate-500 mb-8">
        Browse our {category.toLowerCase()} collection.
      </p>

      {/* Loading State */}
      {loading && (
        <div className="text-center py-20">
          <div className="inline-block w-8 h-8 border-4 border-[#2563eb] border-t-transparent rounded-full animate-spin"></div>
          <p className="text-slate-500 mt-4">Loading products...</p>
        </div>
      )}

      {/* Error State */}
      {!loading && error && (
        <p className="text-red-500 mb-6">{error}</p>
      )}

      {/* Products */}
      {!loading && !error && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}

      {/* Empty State */}
      {!loading && !error && products.length === 0 && (
        <p className="text-slate-500 text-center py-10">No products found in this category.</p>
      )}
    </main>
  );
}