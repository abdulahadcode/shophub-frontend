import { Link } from "react-router";
import { useStore, Product } from "../store";
import { useState } from "react";

const BADGE_STYLE: Record<string, string> = {
  "Hot Deal": "bg-red-500 text-white",
  "Best Seller": "bg-amber-500 text-white",
  "New": "bg-emerald-500 text-white",
  "Sale": "bg-red-600 text-white",
  "Trending": "bg-violet-600 text-white",
};

function StarRating({ rating, reviews }: { rating: number; reviews: number }) {
  return (
    <div className="flex items-center gap-1">
      <div className="flex">
        {[1, 2, 3, 4, 5].map(i => (
          <svg key={i} width="12" height="12" viewBox="0 0 24 24" fill={i <= Math.round(rating) ? "#f59e0b" : "none"} stroke="#f59e0b" strokeWidth="1.5">
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
          </svg>
        ))}
      </div>
      <span className="text-xs text-slate-500 font-medium">{rating} ({reviews.toLocaleString()})</span>
    </div>
  );
}

export default function ProductCard({ product }: { product: Product }) {
  const { addToCart, wishlist, toggleWishlist } = useStore();
  const [added, setAdded] = useState(false);
  const wishlisted = wishlist.includes(product.id);
  const discount = product.originalPrice
    ? Math.round((1 - product.price / product.originalPrice) * 100)
    : null;

  function handleAdd(e: React.MouseEvent) {
    e.preventDefault();
    addToCart(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 1400);
  }

  return (
    <Link to={`/product/${product.id}`} className="group block bg-white rounded-2xl border border-slate-200 overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
      {/* Image */}
      <div className="relative bg-slate-50 aspect-square overflow-hidden">
        <img
          src={product.img}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        {product.badge && (
          <span className={`absolute top-3 left-3 text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full ${BADGE_STYLE[product.badge] || "bg-slate-700 text-white"}`}>
            {product.badge}
          </span>
        )}
        {discount && (
          <span className="absolute top-3 right-3 bg-white text-red-600 font-bold text-xs px-2 py-0.5 rounded-full shadow-sm">
            -{discount}%
          </span>
        )}
        {/* Wishlist */}
        <button
          onClick={e => { e.preventDefault(); toggleWishlist(product.id); }}
          className={`absolute bottom-3 right-3 w-9 h-9 rounded-full shadow-md flex items-center justify-center transition-all ${wishlisted ? "bg-red-500 text-white" : "bg-white text-slate-400 hover:text-red-500"}`}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill={wishlisted ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
          </svg>
        </button>
      </div>

      {/* Info */}
      <div className="p-4">
        <div className="text-[11px] font-semibold uppercase tracking-widest text-[#2563eb] mb-1">{product.brand}</div>
        <h3 className="font-['Outfit',sans-serif] font-semibold text-slate-900 text-sm leading-snug mb-2 line-clamp-2">{product.name}</h3>
        <StarRating rating={product.rating} reviews={product.reviews} />

        <div className="flex items-center justify-between mt-3">
          <div className="flex items-baseline gap-2">
            <span className="font-['Outfit',sans-serif] font-bold text-lg text-slate-900">${product.price}</span>
            {product.originalPrice && (
              <span className="text-sm text-slate-400 line-through">${product.originalPrice}</span>
            )}
          </div>
          <button
            onClick={handleAdd}
            className={`text-xs font-semibold px-3 py-2 rounded-lg transition-all ${added ? "bg-emerald-500 text-white" : "bg-[#2563eb] text-white hover:bg-[#1d4ed8]"}`}
          >
            {added ? "✓ Added" : "+ Cart"}
          </button>
        </div>

        {!product.inStock && (
          <div className="mt-2 text-xs text-red-500 font-medium">Out of stock</div>
        )}
      </div>
    </Link>
  );
}
