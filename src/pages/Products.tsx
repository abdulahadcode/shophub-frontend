import { useEffect, useMemo, useState } from "react";
import { useSearchParams, Link } from "react-router";
import ProductCard from "../components/ProductCard";
// The API module is JavaScript and currently has no declaration file.
// @ts-expect-error TS7016: productApi.js is intentionally consumed here.
import { getProducts } from "../api/productApi";

const CATEGORIES = [
  { label: "All", value: "" },
  { label: "Electronics", value: "electronics" },
  { label: "Fashion", value: "fashion" },
  { label: "Beauty", value: "beauty" },
  { label: "Home & Office", value: "home-office" },
];

const SORTS = [
  { label: "Featured", value: "" },
  { label: "Price: Low to High", value: "price_asc" },
  { label: "Price: High to Low", value: "price_desc" },
  { label: "Newest", value: "newest" },
  { label: "Top Rated", value: "rating" },
];

export default function Products() {
  const [searchParams, setSearchParams] = useSearchParams();

  const query = searchParams.get("q") || "";
  const category = searchParams.get("category") || "";
  const sort = searchParams.get("sort") || "";

  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    console.log("🔥 Products useEffect running");
    async function loadProducts() {
      try {
        setLoading(true);
        setError("");

        const data = await getProducts({
          search: query,
          category,
          sort,
        });

        setProducts(data);
      } catch (err) {
        console.error(err);
        setError("Unable to load products.");
      } finally {
        setLoading(false);
      }
    }

    loadProducts();
  }, [query, category, sort]);

  function updateParam(key: string, value: string) {
    const params = new URLSearchParams(searchParams);

    if (!value) {
      params.delete(key);
    } else {
      params.set(key, value);
    }

    setSearchParams(params);
  }

  function clearFilters() {
    setSearchParams(new URLSearchParams());
  }

  const hasFilters = query || category || sort;

  return (
    <main className="min-h-full bg-[#f8fafc]">
      <section className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 py-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <h1 className="font-['Outfit',sans-serif] font-black text-3xl sm:text-4xl text-slate-900">
                All Products
              </h1>

              <p className="text-slate-500 mt-2 text-sm">
                Explore our complete collection.
              </p>
            </div>

            <Link
              to="/"
              className="text-sm text-[#2563eb] font-semibold hover:underline"
            >
              ← Back to Home
            </Link>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-8 py-8">
        {/* Filters */}
        <div className="bg-white rounded-2xl border border-slate-200 p-4 mb-6">
          <div className="flex flex-col lg:flex-row gap-4 justify-between">
            
            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map((item) => {
                const active = category === item.value;

                return (
                  <button
                    key={item.label}
                    onClick={() =>
                      updateParam("category", item.value)
                    }
                    className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                      active
                        ? "bg-[#2563eb] text-white shadow-md"
                        : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                    }`}
                  >
                    {item.label}
                  </button>
                );
              })}
            </div>

            <div className="flex items-center gap-2">
              <label className="text-xs text-slate-500 font-medium">
                Sort:
              </label>

              <select
                value={sort}
                onChange={(e) =>
                  updateParam("sort", e.target.value)
                }
                className="border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-700 font-medium bg-white focus:outline-none focus:border-[#2563eb]"
              >
                {SORTS.map((item) => (
                  <option key={item.label} value={item.value}>
                    {item.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Heading */}
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="font-['Outfit',sans-serif] font-bold text-xl text-slate-900">
              {query
                ? `Search results for "${query}"`
                : category
                  ? category
                  : "All Products"}

              <span className="ml-2 text-sm text-slate-400 font-normal">
                ({products.length})
              </span>
            </h2>
          </div>

          {hasFilters && (
            <button
              onClick={clearFilters}
              className="text-xs text-[#2563eb] font-semibold hover:underline"
            >
              Clear filters
            </button>
          )}
        </div>

        {/* Loading */}
        {loading && (
          <div className="text-center py-20">
            <p className="text-slate-500">
              Loading products...
            </p>
          </div>
        )}

        {/* Error */}
        {!loading && error && (
          <div className="bg-white rounded-3xl border border-red-200 py-20 text-center">
            <h2 className="font-bold text-xl text-slate-900">
              Something went wrong
            </h2>

            <p className="text-sm text-slate-500 mt-2">
              {error}
            </p>
          </div>
        )}

        {/* Products */}
        {!loading && !error && products.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-5">
            {products.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
              />
            ))}
          </div>
        )}

        {/* Empty */}
        {!loading && !error && products.length === 0 && (
          <div className="bg-white rounded-3xl border border-slate-200 py-20 text-center">
            <div className="text-5xl mb-4">🔍</div>

            <h2 className="font-['Outfit',sans-serif] font-bold text-xl text-slate-900">
              No products found
            </h2>

            <p className="text-sm text-slate-500 mt-2">
              Try a different search term or category.
            </p>

            <button
              onClick={clearFilters}
              className="mt-5 bg-[#2563eb] text-white px-5 py-2.5 rounded-xl text-sm font-semibold"
            >
              Browse All Products
            </button>
          </div>
        )}
      </section>
    </main>
  );
}