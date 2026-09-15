import { useEffect, useState } from "react";
import { Link } from "react-router";
import ProductCard from "../components/ProductCard";
// @ts-expect-error TS7016: productApi.js is intentionally consumed here.
import { getProducts } from "../api/productApi";

const HERO_SLIDES = [
  {
    tag: "New Drop",
    title: "Tech That\nMoves You",
    sub: "Laptops, headphones, and smart devices at prices that make sense.",
    cta: "Shop Electronics",
    path: "/products/electronics",
    bg: "from-[#1e3a5f] to-[#2563eb]",
    img: "https://images.unsplash.com/photo-1491933382434-500287f9b54b?w=700&h=500&fit=crop&auto=format",
  },
  {
    tag: "Summer Edit",
    title: "Style That\nSpeaks Loud",
    sub: "Fresh collections in fashion and accessories. Discover looks that turn heads.",
    cta: "Shop Fashion",
    path: "/products/fashion",
    bg: "from-[#7c3aed] to-[#db2777]",
    img: "https://images.unsplash.com/photo-1540221652346-e5dd6b50f3e7?w=700&h=500&fit=crop&auto=format",
  },
  {
    tag: "Best Sellers",
    title: "Glow Up\nThis Season",
    sub: "Clinically tested skincare and professional-grade makeup. Your routine, elevated.",
    cta: "Shop Beauty",
    path: "/products/beauty",
    bg: "from-[#be185d] to-[#f59e0b]",
    img: "https://images.unsplash.com/photo-1580870069867-74c57ee1bb07?w=700&h=500&fit=crop&auto=format",
  },
];

const CATEGORY_META = [
  {
    label: "Electronics",
    emoji: "💻",
    path: "/products/electronics",
    bg: "bg-blue-50",
    border: "border-blue-200",
    text: "text-blue-700",
  },
  {
    label: "Fashion",
    emoji: "👗",
    path: "/products/fashion",
    bg: "bg-purple-50",
    border: "border-purple-200",
    text: "text-purple-700",
  },
  {
    label: "Beauty",
    emoji: "✨",
    path: "/products/beauty",
    bg: "bg-pink-50",
    border: "border-pink-200",
    text: "text-pink-700",
  },
  {
    label: "Home & Office",
    emoji: "🏠",
    path: "/products/home-office",
    bg: "bg-amber-50",
    border: "border-amber-200",
    text: "text-amber-700",
  },
];

export default function Home() {
  const [heroIdx, setHeroIdx] = useState(0);
  const [products, setProducts] = useState<any[]>([]);

  const hero = HERO_SLIDES[heroIdx];

const [loading, setLoading] = useState(true);

useEffect(() => {
  setLoading(true);
  getProducts()
    .then((data: any[]) => setProducts(data))
    .catch(() => setProducts([]))
    .finally(() => setLoading(false));
}, []);

  const featuredProducts = products.slice(0, 8);

  return (
    <div className="min-h-full bg-[#f8fafc]">

      {/* ================= HERO ================= */}
      <section className={`bg-gradient-to-br ${hero.bg} text-white`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-8 py-10 sm:py-14 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">

          <div>
            <span className="inline-block bg-white/20 backdrop-blur-sm text-white text-xs font-bold uppercase tracking-widest px-3 py-1.5 rounded-full mb-4 sm:mb-5">
              {hero.tag}
            </span>

            <h1
              className="font-['Outfit',sans-serif] font-black text-4xl sm:text-5xl lg:text-6xl leading-tight tracking-tight mb-4 sm:mb-5 whitespace-pre-line"
              style={{ fontWeight: 900 }}
            >
              {hero.title}
            </h1>

            <p className="text-white/80 text-sm sm:text-base leading-relaxed max-w-sm mb-7">
              {hero.sub}
            </p>

            <div className="flex flex-wrap gap-3">

              <Link
                to={hero.path}
                className="bg-white text-slate-900 font-bold px-6 py-3 rounded-xl text-sm hover:bg-slate-100 transition-colors shadow-lg"
              >
                {hero.cta}
              </Link>

              <Link
                to="/login"
                className="bg-white/20 text-white font-semibold px-6 py-3 rounded-xl text-sm hover:bg-white/30 transition-colors border border-white/30"
              >
                Sign up for Deals
              </Link>

            </div>

            <div className="flex flex-wrap gap-2 mt-7">
              {[
                "Free Shipping $99+",
                "30-Day Returns",
                "4.8★ Rating",
              ].map((text) => (
                <span
                  key={text}
                  className="bg-white/15 text-white/90 text-xs font-medium px-3 py-1.5 rounded-full border border-white/20"
                >
                  {text}
                </span>
              ))}
            </div>
          </div>

          {/* Hero Image */}
          <div className="relative hidden md:block">

            <div className="rounded-2xl overflow-hidden shadow-2xl aspect-[4/3]">
              <img
                src={hero.img}
                alt="Featured"
                className="w-full h-full object-cover"
              />
            </div>

            <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
              {HERO_SLIDES.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setHeroIdx(index)}
                  className={`rounded-full transition-all ${index === heroIdx
                    ? "w-6 h-2.5 bg-white"
                    : "w-2.5 h-2.5 bg-white/40 hover:bg-white/70"
                    }`}
                />
              ))}
            </div>

          </div>
        </div>

        {/* Mobile hero dots */}
        <div className="flex justify-center gap-2 pb-5 md:hidden">
          {HERO_SLIDES.map((_, index) => (
            <button
              key={index}
              onClick={() => setHeroIdx(index)}
              className={`rounded-full transition-all ${index === heroIdx
                ? "w-6 h-2.5 bg-white"
                : "w-2.5 h-2.5 bg-white/40"
                }`}
            />
          ))}
        </div>
      </section>


      {/* ================= CATEGORIES ================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8 pt-10 pb-4">

        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="font-['Outfit',sans-serif] font-bold text-xl text-slate-900">
              Shop by Category
            </h2>

            <p className="text-sm text-slate-500 mt-1">
              Find exactly what you're looking for.
            </p>
          </div>

          <Link
            to="/products"
            className="text-sm text-[#2563eb] font-semibold hover:underline"
          >
            View All
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">

          {CATEGORY_META.map((category) => {

            const itemCount = products.filter(
              (product) => product.category === category.label
            ).length;

            return (
              <Link
                key={category.label}
                to={category.path}
                className={`${category.bg} ${category.border} border rounded-2xl p-4 sm:p-5 flex flex-col items-center gap-2 text-center transition-all hover:shadow-md hover:scale-[1.02]`}
              >
                <span className="text-2xl sm:text-3xl">
                  {category.emoji}
                </span>

                <span
                  className={`font-['Outfit',sans-serif] font-bold text-xs sm:text-sm ${category.text}`}
                >
                  {category.label}
                </span>

                <span className="text-[10px] sm:text-xs text-slate-500">
                  {itemCount} items
                </span>
              </Link>
            );
          })}

        </div>
      </section>


      {/* ================= FEATURED PRODUCTS ================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8 py-10 pb-16">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="font-['Outfit',sans-serif] font-bold text-xl sm:text-2xl text-slate-900">
              Featured Products
            </h2>
            <p className="text-sm text-slate-500 mt-1">
              Hand-picked products you might love.
            </p>
          </div>

          <Link
            to="/products"
            className="text-sm text-[#2563eb] font-semibold hover:underline"
          >
            View All
          </Link>
        </div>

        {loading ? (
          <div className="text-center py-16">
            <div className="inline-block w-8 h-8 border-4 border-[#2563eb] border-t-transparent rounded-full animate-spin"></div>
            <p className="text-slate-500 mt-4">Loading products...</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-5">
            {products.slice(0, 8).map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>
      {/* ================= DEALS CTA ================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8 pb-16">

        <div className="rounded-3xl bg-gradient-to-r from-red-500 to-orange-500 text-white p-7 sm:p-10 flex flex-col md:flex-row items-center justify-between gap-6">

          <div>
            <span className="text-3xl">🔥</span>

            <h2 className="font-['Outfit',sans-serif] font-black text-2xl sm:text-3xl mt-2">
              Don't Miss Today's Deals
            </h2>

            <p className="text-white/80 text-sm mt-2">
              Save more on selected products before they're gone.
            </p>
          </div>

          <Link
            to="/deals"
            className="bg-white text-red-600 font-bold px-7 py-3 rounded-xl text-sm hover:bg-slate-100 transition-colors shadow-lg whitespace-nowrap"
          >
            Shop Deals
          </Link>

        </div>

      </section>


      {/* ================= TRUST SECTION ================= */}
      <section className="bg-white border-t border-slate-200 py-12 sm:py-16">

        <div className="max-w-7xl mx-auto px-4 sm:px-8 text-center">

          <h2
            className="font-['Outfit',sans-serif] font-black text-2xl sm:text-3xl text-slate-900 mb-2"
            style={{ fontWeight: 900 }}
          >
            Why 50,000+ Customers Choose ShopHub
          </h2>

          <p className="text-slate-500 text-sm mb-8 sm:mb-10">
            Trusted by buyers across 30+ countries
          </p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">

            {[
              {
                val: "50K+",
                label: "Happy Customers",
                icon: "😊",
              },
              {
                val: "4.8★",
                label: "Average Rating",
                icon: "⭐",
              },
              {
                val: "99%",
                label: "Satisfaction Rate",
                icon: "✅",
              },
              {
                val: "$0",
                label: "Returns if Unhappy",
                icon: "↩️",
              },
            ].map((stat) => (

              <div
                key={stat.label}
                className="bg-slate-50 rounded-2xl p-4 sm:p-6 border border-slate-200"
              >

                <div className="text-2xl sm:text-3xl mb-2">
                  {stat.icon}
                </div>

                <div className="font-['Outfit',sans-serif] font-black text-2xl sm:text-3xl text-[#2563eb]">
                  {stat.val}
                </div>

                <div className="text-xs sm:text-sm text-slate-500 mt-1">
                  {stat.label}
                </div>

              </div>

            ))}

          </div>
        </div>
      </section>


      {/* ================= NEWSLETTER ================= */}
      <section className="bg-gradient-to-br from-[#1e3a5f] to-[#2563eb] text-white py-12 sm:py-16">

        <div className="max-w-xl mx-auto px-4 text-center">

          <div className="text-3xl mb-4">
            📬
          </div>

          <h2
            className="font-['Outfit',sans-serif] font-black text-2xl sm:text-3xl mb-2"
            style={{ fontWeight: 900 }}
          >
            Get Exclusive Deals
          </h2>

          <p className="text-white/70 text-sm mb-7">
            Subscribe and get 15% off your first order + early access to sales.
          </p>

          <div className="flex flex-col sm:flex-row rounded-xl overflow-hidden shadow-xl">

            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-3.5 text-sm text-slate-800 outline-none"
            />

            <button
              className="bg-[#f59e0b] text-white font-semibold px-6 py-3.5 text-sm hover:bg-amber-600 transition-colors whitespace-nowrap"
            >
              Get 15% Off
            </button>

          </div>

          <p className="text-white/40 text-xs mt-3">
            No spam. Unsubscribe anytime.
          </p>

        </div>
      </section>

    </div>
  );
}