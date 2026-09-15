import { Link, useNavigate } from "react-router";
import { useEffect, useState } from "react";
import { useStore } from "../store";
import ProductCard from "../components/ProductCard";
// @ts-expect-error TS7016: productApi.js is intentionally consumed here.
import { getProducts } from "../api/productApi";

export default function Cart() {
  const { cart, removeFromCart, updateQty, cartTotal, cartCount, isLoggedIn } = useStore();
  const navigate = useNavigate();
  const shipping = cartTotal >= 99 ? 0 : 9.99;
  const tax = cartTotal * 0.08;
  const grandTotal = cartTotal + shipping + tax;
  const [suggestions, setSuggestions] = useState<any[]>([]);

  useEffect(() => {
    getProducts()
      .then((products: any[]) => setSuggestions(products.filter((product) => !cart.some((item) => item.id === product.id)).slice(0, 4)))
      .catch(() => setSuggestions([]));
  }, [cart]);

  if (cart.length === 0) {
    return (
      <div className="min-h-full bg-[#f8fafc] flex items-center justify-center py-20 px-4">
        <div className="text-center max-w-sm">
          <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="1.5">
              <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/>
              <line x1="3" y1="6" x2="21" y2="6"/>
              <path d="M16 10a4 4 0 0 1-8 0"/>
            </svg>
          </div>
          <h2 className="font-['Outfit',sans-serif] font-bold text-2xl text-slate-900 mb-2">Your cart is empty</h2>
          <p className="text-slate-500 text-sm mb-8">Looks like you haven't added anything yet. Start shopping to fill it up!</p>
          <Link to="/" className="bg-[#2563eb] text-white px-8 py-3.5 rounded-xl font-semibold text-sm hover:bg-[#1d4ed8] transition-colors inline-block">
            Browse Products
          </Link>

          {/* Suggestions */}
          <div className="mt-16 text-left">
            <h3 className="font-['Outfit',sans-serif] font-bold text-lg text-slate-900 mb-5">You might like</h3>
            <div className="grid grid-cols-2 gap-4">
              {suggestions.slice(0, 4).map(p => <ProductCard key={p.id} product={p} />)}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-full bg-[#f8fafc] py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        <div className="flex items-center gap-3 mb-8">
          <h1 className="font-['Outfit',sans-serif] font-black text-3xl text-slate-900" style={{ fontWeight: 900 }}>
            Shopping Cart
          </h1>
          <span className="bg-[#2563eb] text-white text-xs font-bold px-2.5 py-1 rounded-full">{cartCount}</span>
        </div>

        {/* Free shipping progress */}
        {cartTotal < 99 && (
          <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4 mb-6 flex items-center gap-4">
            <span className="text-2xl">🚚</span>
            <div className="flex-1">
              <div className="text-sm font-semibold text-blue-800 mb-1.5">
                Add <span className="text-[#2563eb]">${(99 - cartTotal).toFixed(2)}</span> more for free shipping!
              </div>
              <div className="bg-blue-200 rounded-full h-2">
                <div className="bg-[#2563eb] h-2 rounded-full transition-all" style={{ width: `${Math.min((cartTotal / 99) * 100, 100)}%` }} />
              </div>
            </div>
          </div>
        )}
        {cartTotal >= 99 && (
          <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 mb-6 flex items-center gap-3 text-emerald-700">
            <span className="text-xl">🎉</span>
            <span className="text-sm font-semibold">You qualify for free shipping!</span>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart items */}
          <div className="lg:col-span-2 space-y-4">
            {cart.map(item => (
              <div key={`${item.id}-${item.selectedColor}`} className="bg-white rounded-2xl border border-slate-200 p-5 flex gap-4 hover:shadow-md transition-shadow">
                <Link to={`/product/${item.id}`} className="flex-shrink-0">
                  <img src={item.img} alt={item.name} className="w-24 h-24 rounded-xl object-cover bg-slate-100"/>
                </Link>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between gap-2">
                    <div>
                      <div className="text-[10px] font-bold uppercase tracking-widest text-[#2563eb] mb-0.5">{item.brand}</div>
                      <Link to={`/product/${item.id}`} className="font-['Outfit',sans-serif] font-semibold text-slate-900 hover:text-[#2563eb] transition-colors line-clamp-1">
                        {item.name}
                      </Link>
                      <div className="text-xs text-slate-500 mt-1">Color: {item.selectedColor}</div>
                    </div>
                    <button onClick={() => removeFromCart(item.id, item.selectedColor)} className="text-slate-400 hover:text-red-500 transition-colors flex-shrink-0 p-1">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <polyline points="3 6 5 6 21 6"/><path d="m19 6-.867 12.142A2 2 0 0 1 16.138 20H7.862a2 2 0 0 1-1.995-1.858L5 6m5 0V4a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v2"/>
                      </svg>
                    </button>
                  </div>

                  <div className="flex items-center justify-between mt-4">
                    {/* Qty */}
                    <div className="flex items-center gap-1 bg-slate-100 rounded-xl overflow-hidden">
                      <button onClick={() => updateQty(item.id, item.selectedColor, item.quantity - 1)} className="w-9 h-9 flex items-center justify-center text-slate-600 hover:bg-slate-200 transition-colors font-bold text-lg">
                        −
                      </button>
                      <span className="w-8 text-center text-sm font-semibold text-slate-800">{item.quantity}</span>
                      <button onClick={() => updateQty(item.id, item.selectedColor, item.quantity + 1)} className="w-9 h-9 flex items-center justify-center text-slate-600 hover:bg-slate-200 transition-colors font-bold text-lg">
                        +
                      </button>
                    </div>
                    <div className="text-right">
                      <div className="font-['Outfit',sans-serif] font-bold text-lg text-slate-900">${(item.price * item.quantity).toFixed(2)}</div>
                      {item.quantity > 1 && <div className="text-xs text-slate-400">${item.price} each</div>}
                    </div>
                  </div>
                </div>
              </div>
            ))}

            <Link to="/" className="flex items-center gap-2 text-sm text-[#2563eb] font-semibold hover:underline mt-2">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="15 18 9 12 15 6"/></svg>
              Continue Shopping
            </Link>
          </div>

          {/* Order summary */}
          <div className="space-y-4">
            <div className="bg-white rounded-2xl border border-slate-200 p-6">
              <h2 className="font-['Outfit',sans-serif] font-bold text-lg text-slate-900 mb-5">Order Summary</h2>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between text-slate-600">
                  <span>Subtotal ({cartCount} items)</span>
                  <span className="font-semibold">${cartTotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Shipping</span>
                  <span className={`font-semibold ${shipping === 0 ? "text-emerald-600" : ""}`}>
                    {shipping === 0 ? "FREE" : `$${shipping.toFixed(2)}`}
                  </span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Estimated Tax</span>
                  <span className="font-semibold">${tax.toFixed(2)}</span>
                </div>
                <div className="border-t border-slate-200 pt-3 flex justify-between text-slate-900 font-bold text-base">
                  <span>Total</span>
                  <span className="text-[#2563eb] text-xl font-['Outfit',sans-serif]">${grandTotal.toFixed(2)}</span>
                </div>
              </div>

              {/* Promo code */}
              <div className="mt-5">
                <label className="text-xs font-semibold text-slate-700 uppercase tracking-wide block mb-2">Promo Code</label>
                <div className="flex gap-2">
                  <input placeholder="e.g. SAVE15" className="flex-1 border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#2563eb]"/>
                  <button className="bg-slate-100 text-slate-700 font-semibold text-xs px-3 py-2 rounded-lg hover:bg-slate-200 transition-colors">Apply</button>
                </div>
              </div>

              <button
                onClick={() => navigate(isLoggedIn ? "/checkout" : "/login")}
                className="w-full mt-6 bg-[#2563eb] text-white py-4 rounded-xl font-bold text-sm hover:bg-[#1d4ed8] transition-colors flex items-center justify-center gap-2 shadow-lg shadow-blue-200"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="1" y="4" width="22" height="16" rx="2" ry="2"/><line x1="1" y1="10" x2="23" y2="10"/>
                </svg>
                {isLoggedIn ? "Proceed to Checkout →" : "Sign In to Checkout"}
              </button>

              {/* Trust */}
              <div className="mt-5 space-y-2">
                {["🔒 Secure SSL Checkout", "↩️ Free 30-Day Returns", "📦 Ships within 24 hours"].map(t => (
                  <div key={t} className="flex items-center gap-2 text-xs text-slate-500">{t}</div>
                ))}
              </div>

              {/* Payment icons */}
              <div className="mt-4 flex flex-wrap gap-1.5">
                {["VISA", "MC", "AMEX", "PayPal", "Apple Pay"].map(p => (
                  <span key={p} className="bg-slate-100 text-slate-600 text-[10px] font-bold px-2 py-1 rounded border border-slate-200">{p}</span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* You might also like */}
        {suggestions.length > 0 && (
          <div className="mt-16">
            <h2 className="font-['Outfit',sans-serif] font-bold text-2xl text-slate-900 mb-6">You might also like</h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {suggestions.map(p => <ProductCard key={p.id} product={p} />)}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
