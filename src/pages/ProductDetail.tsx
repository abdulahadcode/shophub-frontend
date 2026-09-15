import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router";
import { useStore } from "../store";
import ProductCard from "../components/ProductCard";
// @ts-expect-error TS7016: productApi.js is intentionally consumed here.
import { getProductById, getProducts } from "../api/productApi";

function StarRating({ rating, reviews }: { rating: number; reviews: number }) {
  return (
    <div className="flex items-center gap-2">
      <div className="flex gap-0.5">
        {[1, 2, 3, 4, 5].map(i => (
          <svg key={i} width="18" height="18" viewBox="0 0 24 24" fill={i <= Math.round(rating) ? "#f59e0b" : "none"} stroke="#f59e0b" strokeWidth="1.5">
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
          </svg>
        ))}
      </div>
      <span className="text-sm font-semibold text-slate-700">{rating}</span>
      <span className="text-sm text-slate-400">({reviews.toLocaleString()} reviews)</span>
    </div>
  );
}
function getCategoryPath(category: string) {
  const paths: Record<string, string> = {
    Electronics: "/products/electronics",
    Fashion: "/products/fashion",
    Beauty: "/products/beauty",
    "Home & Office": "/products/home-office",
  };

  return paths[category] || "/products";
}

const MOCK_REVIEWS = [
  { name: "Sarah M.", rating: 5, date: "Oct 15, 2024", text: "Absolutely love this product! Quality is outstanding and delivery was super fast. Will definitely order again.", avatar: "S" },
  { name: "James K.", rating: 4, date: "Oct 3, 2024", text: "Great value for the price. Exactly as described. Packaging was neat and the product works perfectly.", avatar: "J" },
  { name: "Priya R.", rating: 5, date: "Sep 28, 2024", text: "Exceeded my expectations. I was a bit skeptical ordering online but this is better than what I saw in stores.", avatar: "P" },
];

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart, wishlist, toggleWishlist } = useStore();
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [related, setRelated] = useState<any[]>([]);
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);
  const [activeTab, setActiveTab] = useState<"description" | "features" | "reviews">("description");
  useEffect(() => {
    if (!id) return;
    setLoading(true);
    getProductById(id)
      .then((loadedProduct: any) => {
        setProduct(loadedProduct);
        setSelectedColor(loadedProduct.colors?.[0] || "");
        return getProducts({
          category: loadedProduct.category.toLowerCase().replace(/ & /g, "-"),
        }).then((products: any[]) => {
          setRelated(products.filter((item) => item.id !== loadedProduct.id).slice(0, 4));
        });
      })
      .catch(() => setError("Unable to load product."))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return <div className="min-h-full flex items-center justify-center py-20 text-slate-500">Loading product...</div>;
  }

  if (error || !product) {
    return (
      <div className="min-h-full bg-[#f8fafc] flex items-center justify-center py-20">
        <div className="text-center">
          <div className="text-5xl mb-4">🔍</div>
          <h2 className="font-['Outfit',sans-serif] font-bold text-2xl text-slate-900 mb-3">{error || "Product not found"}</h2>
          <Link to="/" className="text-[#2563eb] font-semibold hover:underline">← Back to shop</Link>
        </div>
      </div>
    );
  }

  const discount = product.originalPrice
    ? Math.round((1 - product.price / product.originalPrice) * 100)
    : null;

  function handleAddToCart() {
    for (let i = 0; i < qty; i++) addToCart(product!, selectedColor);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  }

  const wishlisted = wishlist.includes(product.id);

  return (
    <div className="min-h-full bg-[#f8fafc]">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs text-slate-400 mb-8 flex-wrap">
          <Link to="/" className="hover:text-[#2563eb] transition-colors">Home</Link>
          <span>/</span>
          <Link
            to={getCategoryPath(product.category)}
            className="hover:text-[#2563eb] transition-colors"
          >
            {product.category}
          </Link>          <span>/</span>
          <span className="text-slate-600 font-medium">{product.name}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mb-16">
          {/* Image */}
          <div className="space-y-4">
            <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden aspect-square relative">
              <img src={product.img} alt={product.name} className="w-full h-full object-cover" />
              {product.badge && (
                <span className={`absolute top-5 left-5 text-xs font-bold uppercase tracking-wider px-3 py-1.5 rounded-full ${({ "Hot Deal": "bg-red-500 text-white", "Best Seller": "bg-amber-500 text-white", "New": "bg-emerald-500 text-white", "Sale": "bg-red-600 text-white", "Trending": "bg-violet-600 text-white" } as Record<string, string>)[product.badge] || "bg-slate-700 text-white"
                  }`}>
                  {product.badge}
                </span>
              )}
              {discount && (
                <span className="absolute top-5 right-5 bg-white text-red-600 font-bold text-sm px-3 py-1 rounded-full shadow-md">
                  -{discount}% OFF
                </span>
              )}
            </div>
            {/* Thumbnail strip (using same image at different crops for demo) */}
            <div className="flex gap-3">
              {[
                `${product.img.split("?")[0]}?w=200&h=200&fit=crop`,
                `${product.img.split("?")[0]}?w=200&h=200&fit=crop&crop=top`,
                `${product.img.split("?")[0]}?w=200&h=200&fit=crop&crop=bottom`,
              ].map((src, i) => (
                <div key={i} className={`w-20 h-20 rounded-xl border-2 overflow-hidden cursor-pointer transition-all ${i === 0 ? "border-[#2563eb]" : "border-slate-200 hover:border-slate-400"}`}>
                  <img src={src} alt="" className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
          </div>

          {/* Details */}
          <div>
            <div className="text-xs font-bold uppercase tracking-widest text-[#2563eb] mb-2">{product.brand}</div>
            <h1 className="font-['Outfit',sans-serif] font-black text-3xl sm:text-4xl text-slate-900 leading-tight mb-4" style={{ fontWeight: 900 }}>
              {product.name}
            </h1>
            <StarRating rating={product.rating} reviews={product.reviews} />

            <div className="flex items-baseline gap-3 mt-5 mb-6">
              <span className="font-['Outfit',sans-serif] font-black text-4xl text-slate-900">${product.price}</span>
              {product.originalPrice && (
                <>
                  <span className="text-xl text-slate-400 line-through">${product.originalPrice}</span>
                  <span className="bg-red-100 text-red-600 text-sm font-bold px-2 py-0.5 rounded-lg">Save ${product.originalPrice - product.price}</span>
                </>
              )}
            </div>

            {/* Color selector */}
            <div className="mb-6">
              <div className="text-sm font-semibold text-slate-700 mb-3">
                Color: <span className="text-[#2563eb]">{selectedColor}</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {(product.colors || []).map((color: string) => (
                  <button
                    key={color}
                    onClick={() => setSelectedColor(color)}
                    className={`px-4 py-2 rounded-xl border-2 text-sm font-medium transition-all ${selectedColor === color
                      ? "border-[#2563eb] bg-blue-50 text-[#2563eb]"
                      : "border-slate-200 text-slate-600 hover:border-slate-400"
                      }`}
                  >
                    {color}
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity */}
            <div className="mb-8">
              <div className="text-sm font-semibold text-slate-700 mb-3">Quantity</div>
              <div className="flex items-center gap-3">
                <div className="flex items-center bg-slate-100 rounded-xl overflow-hidden">
                  <button onClick={() => setQty(q => Math.max(1, q - 1))} className="w-11 h-11 flex items-center justify-center text-slate-600 hover:bg-slate-200 transition-colors font-bold text-xl">
                    −
                  </button>
                  <span className="w-10 text-center font-semibold text-slate-800">{qty}</span>
                  <button onClick={() => setQty(q => q + 1)} className="w-11 h-11 flex items-center justify-center text-slate-600 hover:bg-slate-200 transition-colors font-bold text-xl">
                    +
                  </button>
                </div>
                <span className="text-sm text-slate-400">{product.inStock ? "✅ In Stock" : "❌ Out of Stock"}</span>
              </div>
            </div>

            {/* CTAs */}
            <div className="flex gap-3 mb-6">
              <button
                onClick={handleAddToCart}
                disabled={!product.inStock}
                className={`flex-1 py-4 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 ${added ? "bg-emerald-500 text-white" : "bg-[#2563eb] text-white hover:bg-[#1d4ed8] shadow-lg shadow-blue-200"
                  } disabled:opacity-50`}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" />
                  <line x1="3" y1="6" x2="21" y2="6" />
                  <path d="M16 10a4 4 0 0 1-8 0" />
                </svg>
                {added ? "✓ Added to Cart!" : "Add to Cart"}
              </button>
              <button
                onClick={() => toggleWishlist(product.id)}
                className={`w-14 rounded-xl border-2 flex items-center justify-center transition-all ${wishlisted ? "border-red-400 bg-red-50 text-red-500" : "border-slate-200 text-slate-400 hover:border-red-400 hover:text-red-400"
                  }`}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill={wishlisted ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2">
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                </svg>
              </button>
            </div>

            <button
              onClick={() => { handleAddToCart(); navigate("/cart"); }}
              className="w-full py-4 rounded-xl font-bold text-sm bg-slate-900 text-white hover:bg-slate-700 transition-colors"
            >
              Buy Now →
            </button>

            {/* Trust badges */}
            <div className="mt-6 grid grid-cols-3 gap-3 text-center">
              {[
                { icon: "🚚", label: "Free Delivery", sub: "Orders $99+" },
                { icon: "↩️", label: "30-Day Return", sub: "Hassle-free" },
                { icon: "🔒", label: "Secure Pay", sub: "SSL protected" },
              ].map(t => (
                <div key={t.label} className="bg-slate-50 rounded-xl p-3 border border-slate-200">
                  <div className="text-lg mb-1">{t.icon}</div>
                  <div className="text-xs font-semibold text-slate-700">{t.label}</div>
                  <div className="text-[10px] text-slate-400">{t.sub}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden mb-16">
          <div className="flex border-b border-slate-200">
            {(["description", "features", "reviews"] as const).map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 py-4 text-sm font-semibold capitalize transition-colors ${activeTab === tab ? "border-b-2 border-[#2563eb] text-[#2563eb]" : "text-slate-500 hover:text-slate-700"}`}
              >
                {tab === "reviews" ? `Reviews (${product.reviews.toLocaleString()})` : tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>
          <div className="p-8">
            {activeTab === "description" && (
              <p className="text-slate-600 leading-relaxed text-sm max-w-2xl">{product.description}</p>
            )}
            {activeTab === "features" && (
              <ul className="space-y-3 max-w-md">
                {(product.features || []).map((f: string) => (
                  <li key={f} className="flex items-start gap-3">
                    <span className="w-5 h-5 rounded-full bg-blue-100 text-[#2563eb] shrink-0 flex items-center justify-center mt-0.5">
                      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12" /></svg>
                    </span>
                    <span className="text-sm text-slate-700 font-medium">{f}</span>
                  </li>
                ))}
              </ul>
            )}
            {activeTab === "reviews" && (
              <div className="space-y-6 max-w-2xl">
                {/* Rating summary */}
                <div className="flex items-center gap-6 bg-blue-50 rounded-2xl p-5 border border-blue-100">
                  <div className="text-center">
                    <div className="font-['Outfit',sans-serif] font-black text-5xl text-slate-900">{product.rating}</div>
                    <div className="flex justify-center mt-1">
                      {[1, 2, 3, 4, 5].map(i => (
                        <svg key={i} width="14" height="14" viewBox="0 0 24 24" fill={i <= Math.round(product.rating) ? "#f59e0b" : "none"} stroke="#f59e0b" strokeWidth="1.5">
                          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                        </svg>
                      ))}
                    </div>
                    <div className="text-xs text-slate-500 mt-1">{product.reviews.toLocaleString()} reviews</div>
                  </div>
                  <div className="flex-1 space-y-1.5">
                    {[5, 4, 3, 2, 1].map(star => (
                      <div key={star} className="flex items-center gap-2">
                        <span className="text-xs w-3 text-slate-500">{star}</span>
                        <div className="flex-1 bg-slate-200 rounded-full h-2">
                          <div className="bg-amber-400 h-2 rounded-full" style={{ width: `${star === 5 ? 72 : star === 4 ? 18 : star === 3 ? 6 : star === 2 ? 2 : 2}%` }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {MOCK_REVIEWS.map(r => (
                  <div key={r.name} className="border-b border-slate-100 pb-6 last:border-0">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-9 h-9 rounded-full bg-[#2563eb] text-white font-bold text-sm flex items-center justify-center">
                        {r.avatar}
                      </div>
                      <div>
                        <div className="font-semibold text-sm text-slate-800">{r.name}</div>
                        <div className="text-xs text-slate-400">{r.date}</div>
                      </div>
                      <div className="ml-auto flex">
                        {[1, 2, 3, 4, 5].map(i => (
                          <svg key={i} width="12" height="12" viewBox="0 0 24 24" fill={i <= r.rating ? "#f59e0b" : "none"} stroke="#f59e0b" strokeWidth="1.5">
                            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                          </svg>
                        ))}
                      </div>
                    </div>
                    <p className="text-sm text-slate-600 leading-relaxed">{r.text}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Related products */}
        {related.length > 0 && (
          <div>
            <h2 className="font-['Outfit',sans-serif] font-bold text-2xl text-slate-900 mb-6">Related Products</h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {related.map(p => <ProductCard key={p.id} product={p} />)}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
