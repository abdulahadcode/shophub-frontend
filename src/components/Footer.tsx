import { Link } from "react-router";

export default function Footer() {
  return (
    <footer className="bg-[#0f172a] text-white mt-auto">
      {/* Trust strip */}
      <div className="border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 py-8 grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
            { icon: "🚚", title: "Free Shipping", desc: "On orders over $99" },
            { icon: "↩️", title: "Easy Returns", desc: "30-day hassle-free" },
            { icon: "🔒", title: "Secure Checkout", desc: "SSL encrypted payments" },
            { icon: "⭐", title: "Top Rated", desc: "4.8/5 from 50k+ reviews" },
          ].map(f => (
            <div key={f.title} className="flex items-start gap-3">
              <span className="text-2xl leading-none mt-0.5">{f.icon}</span>
              <div>
                <div className="font-['Outfit',sans-serif] font-semibold text-sm">{f.title}</div>
                <div className="text-slate-400 text-xs mt-0.5">{f.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-12 grid grid-cols-2 md:grid-cols-5 gap-8">
        {/* Brand */}
        <div className="col-span-2 md:col-span-2">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 bg-[#2563eb] rounded-lg flex items-center justify-center">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
                <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/>
                <line x1="3" y1="6" x2="21" y2="6"/>
                <path d="M16 10a4 4 0 0 1-8 0"/>
              </svg>
            </div>
            <span className="font-['Outfit',sans-serif] font-bold text-xl">Shop<span className="text-[#2563eb]">Hub</span></span>
          </div>
          <p className="text-slate-400 text-sm leading-relaxed max-w-xs mb-6">
            Your one-stop destination for electronics, fashion, beauty, and home essentials. Quality products, unbeatable prices.
          </p>
          <div className="flex gap-3">
            {["facebook", "twitter", "instagram", "youtube"].map(s => (
              <a key={s} href="#" className="w-9 h-9 rounded-full bg-white/10 hover:bg-[#2563eb] transition-colors flex items-center justify-center text-xs font-bold uppercase">
                {s[0].toUpperCase()}
              </a>
            ))}
          </div>
        </div>

        {/* Links */}
        {[
          { title: "Shop", links: ["Electronics", "Fashion", "Beauty", "Home & Office", "All Products"] },
          { title: "Support", links: ["Help Center", "Track Order", "Returns", "Size Guide", "Contact Us"] },
          { title: "Company", links: ["About Us", "Careers", "Press", "Sustainability", "Affiliate Program"] },
        ].map(col => (
          <div key={col.title}>
            <div className="font-['Outfit',sans-serif] font-bold text-sm mb-4 text-white">{col.title}</div>
            <ul className="space-y-2.5">
              {col.links.map(l => (
                <li key={l}>
                  <a href="#" className="text-sm text-slate-400 hover:text-white transition-colors">{l}</a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 py-5 flex flex-col sm:flex-row justify-between items-center gap-3 text-xs text-slate-500">
          <span>© 2024 ShopHub Inc. All rights reserved.</span>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5">
              <span>Accepted payments:</span>
              {["VISA", "MC", "AMEX", "PayPal"].map(p => (
                <span key={p} className="bg-white/10 rounded px-1.5 py-0.5 text-white font-semibold">{p}</span>
              ))}
            </span>
          </div>
          <div className="flex gap-4">
            <a href="#" className="hover:text-white transition-colors">Privacy</a>
            <a href="#" className="hover:text-white transition-colors">Terms</a>
            <a href="#" className="hover:text-white transition-colors">Cookies</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
