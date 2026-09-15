import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router";
import { useStore } from "../store";
// @ts-expect-error TS7016
import { placeOrder as placeOrderApi } from "../api/orderApi";

type Step = "info" | "shipping" | "payment" | "confirm";
const STEPS: Step[] = ["info", "shipping", "payment", "confirm"];
const STEP_LABELS = ["Contact", "Shipping", "Payment", "Review"];

const SHIPPING_OPTIONS = [
  { id: "standard", label: "Standard Shipping", desc: "5–7 business days", price: 0, badge: "FREE" },
  { id: "express", label: "Express Shipping", desc: "2–3 business days", price: 9.99, badge: null },
  { id: "overnight", label: "Overnight Shipping", desc: "Next business day", price: 24.99, badge: "Fastest" },
];

function StepIndicator({ current }: { current: Step }) {
  const idx = STEPS.indexOf(current);
  return (
    <div className="flex items-center justify-center gap-0 mb-8">
      {STEPS.map((s, i) => (
        <div key={s} className="flex items-center">
          <div className="flex flex-col items-center">
            <div
              className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold transition-all ${
                i < idx
                  ? "bg-emerald-500 text-white"
                  : i === idx
                  ? "bg-[#2563eb] text-white shadow-lg shadow-blue-200"
                  : "bg-slate-200 text-slate-400"
              }`}
            >
              {i < idx ? (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              ) : (
                i + 1
              )}
            </div>
            <span
              className={`text-[10px] mt-1 font-semibold ${
                i === idx ? "text-[#2563eb]" : i < idx ? "text-emerald-600" : "text-slate-400"
              }`}
            >
              {STEP_LABELS[i]}
            </span>
          </div>
          {i < STEPS.length - 1 && (
            <div
              className={`w-12 sm:w-20 h-0.5 mx-1 mb-5 transition-all ${
                i < idx ? "bg-emerald-400" : "bg-slate-200"
              }`}
            />
          )}
        </div>
      ))}
    </div>
  );
}

function Field({
  label,
  name,
  type = "text",
  value,
  onChange,
  placeholder,
  required,
}: {
  label: string;
  name: string;
  type?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  required?: boolean;
}) {
  return (
    <div>
      <label className="block text-xs font-semibold text-slate-700 mb-1.5 uppercase tracking-wide">
        {label}
        {required && <span className="text-red-500 ml-0.5">*</span>}
      </label>
      <input
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm text-slate-800 focus:outline-none focus:border-[#2563eb] focus:ring-2 focus:ring-blue-100 transition-all placeholder-slate-400"
      />
    </div>
  );
}

export default function Checkout() {
  const { cart, cartTotal, cartCount, user, isLoggedIn, clearCart } = useStore();
  const navigate = useNavigate();

  const [step, setStep] = useState<Step>("info");
  const [shippingOption, setShippingOption] = useState("standard");
  const [payMethod, setPayMethod] = useState<"card" | "paypal" | "apple">("card");
  const [placing, setPlacing] = useState(false);
  const [ordered, setOrdered] = useState(false);
  const [orderId, setOrderId] = useState<number | null>(null);
  const [error, setError] = useState("");

  // success screen ke liye totals freeze
  const [summary, setSummary] = useState({
    cartCount: 0,
    cartTotal: 0,
    shippingCost: 0,
    tax: 0,
    grandTotal: 0,
  });

  const [info, setInfo] = useState({ firstName: "", lastName: "", email: "", phone: "" });
  const [address, setAddress] = useState({
    line1: "",
    line2: "",
    city: "",
    state: "",
    zip: "",
    country: "United States",
  });
  const [card, setCard] = useState({ number: "", name: "", expiry: "", cvv: "" });

  const shippingCost = SHIPPING_OPTIONS.find((o) => o.id === shippingOption)?.price ?? 0;
  const tax = cartTotal * 0.08;
  const grandTotal = cartTotal + shippingCost + tax;

  // Login required
  useEffect(() => {
    if (!isLoggedIn) {
      navigate("/login", { state: { from: "/checkout" } });
    }
  }, [isLoggedIn, navigate]);

  // User se auto-fill
  useEffect(() => {
    if (!user) return;
    const fullName = user.user_metadata?.full_name || "";
    const parts = fullName.trim().split(" ");
    setInfo((p) => ({
      ...p,
      email: user.email || p.email,
      firstName: parts[0] || p.firstName,
      lastName: parts.slice(1).join(" ") || p.lastName,
    }));
  }, [user]);

  if (!isLoggedIn) {
    return (
      <div className="min-h-full flex items-center justify-center py-20 text-slate-500">
        Redirecting to login...
      </div>
    );
  }

  if (cart.length === 0 && !ordered) {
    return (
      <div className="min-h-full bg-[#f8fafc] flex items-center justify-center py-20 px-4">
        <div className="text-center">
          <div className="text-5xl mb-4">🛒</div>
          <h2 className="font-['Outfit',sans-serif] font-bold text-2xl text-slate-900 mb-3">
            Your cart is empty
          </h2>
          <Link to="/" className="text-[#2563eb] font-semibold hover:underline">
            Start shopping →
          </Link>
        </div>
      </div>
    );
  }

  function handleChange(setter: React.Dispatch<React.SetStateAction<any>>) {
    return (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
      setter((p: any) => ({ ...p, [e.target.name]: e.target.value }));
  }

  function next() {
    const idx = STEPS.indexOf(step);
    if (idx < STEPS.length - 1) setStep(STEPS[idx + 1]);
  }

  function back() {
    const idx = STEPS.indexOf(step);
    if (idx > 0) setStep(STEPS[idx - 1]);
  }

  async function placeOrder() {
    setPlacing(true);
    setError("");

    try {
      const result = await placeOrderApi({
        userId: user?.id || null,
        items: cart.map((item) => ({
          productId: item.id,
          name: item.name,
          img: item.img,
          selectedColor: item.selectedColor,
          price: item.price,
          quantity: item.quantity,
        })),
        subtotal: cartTotal,
        shippingCost,
        tax,
        total: grandTotal,
        shippingMethod: shippingOption,
        paymentMethod: payMethod,
        contact: info,
        address,
      });

      setSummary({
        cartCount,
        cartTotal,
        shippingCost,
        tax,
        grandTotal,
      });
      setOrderId(result.id);
      clearCart?.();
      setOrdered(true);
    } catch {
      setError("Order failed. Please try again.");
    } finally {
      setPlacing(false);
    }
  }

  if (ordered) {
    return (
      <div className="min-h-full bg-[#f8fafc] flex items-center justify-center py-20 px-4">
        <div className="max-w-md w-full text-center">
          <div className="w-20 h-20 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-6">
            <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2.5">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </div>
          <h1 className="font-['Outfit',sans-serif] font-black text-3xl text-slate-900 mb-2">
            Order Placed!
          </h1>
          <p className="text-slate-500 text-sm mb-2">
            Thank you, <strong>{info.firstName || "there"}</strong>! Your order has been confirmed.
          </p>
          {orderId && (
            <p className="text-slate-400 text-xs mb-1">Order ID: <strong>#{orderId}</strong></p>
          )}
          <p className="text-slate-400 text-xs mb-8">
            Confirmation sent to <strong>{info.email || "your inbox"}</strong>.
          </p>

          <div className="bg-white rounded-2xl border border-slate-200 p-6 text-left mb-6">
            <div className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">
              Order Summary
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between text-slate-600">
                <span>Items ({summary.cartCount})</span>
                <span>${summary.cartTotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Shipping</span>
                <span>
                  {summary.shippingCost === 0 ? "FREE" : `$${summary.shippingCost.toFixed(2)}`}
                </span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Tax</span>
                <span>${summary.tax.toFixed(2)}</span>
              </div>
              <div className="border-t border-slate-100 pt-2 flex justify-between font-bold text-slate-900">
                <span>Total Paid</span>
                <span className="text-[#2563eb]">${summary.grandTotal.toFixed(2)}</span>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              to="/"
              className="bg-[#2563eb] text-white px-6 py-3 rounded-xl font-semibold text-sm hover:bg-[#1d4ed8] transition-colors"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-full bg-[#f8fafc] py-8 sm:py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-8">
        <div className="flex items-center justify-between mb-6">
          <Link
            to="/cart"
            className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-[#2563eb] transition-colors"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="15 18 9 12 15 6" />
            </svg>
            Back to Cart
          </Link>
          <Link to="/" className="font-['Outfit',sans-serif] font-bold text-xl text-slate-900">
            Shop<span className="text-[#2563eb]">Hub</span>
          </Link>
          <div className="w-24" />
        </div>

        <StepIndicator current={step} />

        {error && (
          <div className="mb-4 bg-red-50 text-red-600 text-sm px-4 py-3 rounded-xl border border-red-100">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden">
              {step === "info" && (
                <div className="p-6 sm:p-8">
                  <h2 className="font-['Outfit',sans-serif] font-bold text-xl text-slate-900 mb-6">
                    Contact Information
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Field label="First Name" name="firstName" value={info.firstName} onChange={handleChange(setInfo)} placeholder="Jane" required />
                    <Field label="Last Name" name="lastName" value={info.lastName} onChange={handleChange(setInfo)} placeholder="Smith" required />
                    <div className="sm:col-span-2">
                      <Field label="Email Address" name="email" type="email" value={info.email} onChange={handleChange(setInfo)} placeholder="jane@example.com" required />
                    </div>
                    <div className="sm:col-span-2">
                      <Field label="Phone Number" name="phone" type="tel" value={info.phone} onChange={handleChange(setInfo)} placeholder="+1 (555) 000-0000" />
                    </div>
                  </div>
                </div>
              )}

              {step === "shipping" && (
                <div className="p-6 sm:p-8">
                  <h2 className="font-['Outfit',sans-serif] font-bold text-xl text-slate-900 mb-6">
                    Shipping Address
                  </h2>
                  <div className="grid grid-cols-1 gap-4 mb-6">
                    <Field label="Address Line 1" name="line1" value={address.line1} onChange={handleChange(setAddress)} placeholder="123 Main Street" required />
                    <Field label="Apartment, suite, etc. (optional)" name="line2" value={address.line2} onChange={handleChange(setAddress)} placeholder="Apt 4B" />
                    <div className="grid grid-cols-2 gap-4">
                      <Field label="City" name="city" value={address.city} onChange={handleChange(setAddress)} placeholder="New York" required />
                      <Field label="State / Province" name="state" value={address.state} onChange={handleChange(setAddress)} placeholder="NY" required />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <Field label="ZIP / Postal Code" name="zip" value={address.zip} onChange={handleChange(setAddress)} placeholder="10001" required />
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1.5 uppercase tracking-wide">
                          Country
                        </label>
                        <select
                          name="country"
                          value={address.country}
                          onChange={handleChange(setAddress)}
                          className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm text-slate-800 focus:outline-none focus:border-[#2563eb] bg-white"
                        >
                          {["United States", "Canada", "United Kingdom", "Australia", "Germany", "France"].map(
                            (c) => (
                              <option key={c}>{c}</option>
                            )
                          )}
                        </select>
                      </div>
                    </div>
                  </div>

                  <h3 className="font-['Outfit',sans-serif] font-bold text-base text-slate-900 mb-3">
                    Delivery Method
                  </h3>
                  <div className="space-y-3">
                    {SHIPPING_OPTIONS.map((opt) => (
                      <label
                        key={opt.id}
                        className={`flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                          shippingOption === opt.id
                            ? "border-[#2563eb] bg-blue-50"
                            : "border-slate-200 hover:border-slate-300"
                        }`}
                      >
                        <input
                          type="radio"
                          name="shipping"
                          value={opt.id}
                          checked={shippingOption === opt.id}
                          onChange={() => setShippingOption(opt.id)}
                          className="accent-[#2563eb] w-4 h-4 flex-shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-sm font-semibold text-slate-800">{opt.label}</span>
                            {opt.badge && (
                              <span
                                className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                                  opt.badge === "FREE"
                                    ? "bg-emerald-100 text-emerald-700"
                                    : "bg-amber-100 text-amber-700"
                                }`}
                              >
                                {opt.badge}
                              </span>
                            )}
                          </div>
                          <div className="text-xs text-slate-400 mt-0.5">{opt.desc}</div>
                        </div>
                        <span
                          className={`text-sm font-bold flex-shrink-0 ${
                            opt.price === 0 ? "text-emerald-600" : "text-slate-700"
                          }`}
                        >
                          {opt.price === 0 ? "FREE" : `$${opt.price.toFixed(2)}`}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
              )}

              {step === "payment" && (
                <div className="p-6 sm:p-8">
                  <h2 className="font-['Outfit',sans-serif] font-bold text-xl text-slate-900 mb-6">
                    Payment Method
                  </h2>
                  <div className="grid grid-cols-3 gap-3 mb-6">
                    {(
                      [
                        { id: "card", label: "Credit Card", icon: "💳" },
                        { id: "paypal", label: "PayPal", icon: "🅿️" },
                        { id: "apple", label: "Apple Pay", icon: "🍎" },
                      ] as const
                    ).map((m) => (
                      <button
                        key={m.id}
                        type="button"
                        onClick={() => setPayMethod(m.id)}
                        className={`flex flex-col items-center gap-1.5 py-4 px-2 rounded-xl border-2 transition-all text-xs font-semibold ${
                          payMethod === m.id
                            ? "border-[#2563eb] bg-blue-50 text-[#2563eb]"
                            : "border-slate-200 text-slate-500 hover:border-slate-300"
                        }`}
                      >
                        <span className="text-2xl">{m.icon}</span>
                        {m.label}
                      </button>
                    ))}
                  </div>

                  {payMethod === "card" && (
                    <div className="space-y-4">
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1.5 uppercase tracking-wide">
                          Card Number
                        </label>
                        <input
                          value={card.number}
                          onChange={(e) =>
                            setCard((c) => ({
                              ...c,
                              number: e.target.value
                                .replace(/\D/g, "")
                                .slice(0, 16)
                                .replace(/(.{4})/g, "$1 ")
                                .trim(),
                            }))
                          }
                          placeholder="1234 5678 9012 3456"
                          maxLength={19}
                          className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-[#2563eb] focus:ring-2 focus:ring-blue-100 font-mono tracking-wider"
                        />
                      </div>
                      <Field
                        label="Cardholder Name"
                        name="name"
                        value={card.name}
                        onChange={(e) => setCard((c) => ({ ...c, name: e.target.value }))}
                        placeholder="Jane Smith"
                      />
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-semibold text-slate-700 mb-1.5 uppercase tracking-wide">
                            Expiry
                          </label>
                          <input
                            value={card.expiry}
                            onChange={(e) =>
                              setCard((c) => ({
                                ...c,
                                expiry: e.target.value
                                  .replace(/\D/g, "")
                                  .slice(0, 4)
                                  .replace(/(.{2})(.+)/, "$1/$2"),
                              }))
                            }
                            placeholder="MM/YY"
                            maxLength={5}
                            className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-[#2563eb] font-mono"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-slate-700 mb-1.5 uppercase tracking-wide">
                            CVV
                          </label>
                          <input
                            value={card.cvv}
                            onChange={(e) =>
                              setCard((c) => ({
                                ...c,
                                cvv: e.target.value.replace(/\D/g, "").slice(0, 4),
                              }))
                            }
                            placeholder="•••"
                            maxLength={4}
                            className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-[#2563eb] font-mono"
                          />
                        </div>
                      </div>
                      <div className="p-3 bg-slate-50 rounded-xl text-xs text-slate-500 border border-slate-200">
                        🔒 Demo checkout — card is not charged or stored.
                      </div>
                    </div>
                  )}

                  {(payMethod === "paypal" || payMethod === "apple") && (
                    <div className="text-center py-10 bg-slate-50 rounded-2xl border border-slate-200">
                      <div className="text-4xl mb-3">{payMethod === "paypal" ? "🅿️" : "🍎"}</div>
                      <p className="text-sm font-semibold text-slate-700">
                        Demo mode — order will be saved without real payment.
                      </p>
                    </div>
                  )}
                </div>
              )}

              {step === "confirm" && (
                <div className="p-6 sm:p-8">
                  <h2 className="font-['Outfit',sans-serif] font-bold text-xl text-slate-900 mb-6">
                    Review Your Order
                  </h2>
                  <div className="space-y-3 mb-6">
                    {cart.map((item) => (
                      <div
                        key={`${item.id}-${item.selectedColor}`}
                        className="flex items-center gap-3 bg-slate-50 rounded-xl p-3 border border-slate-200"
                      >
                        <img src={item.img} alt={item.name} className="w-14 h-14 rounded-lg object-cover" />
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-semibold text-slate-800 truncate">{item.name}</div>
                          <div className="text-xs text-slate-400">
                            {item.selectedColor} · Qty {item.quantity}
                          </div>
                        </div>
                        <div className="font-bold text-sm text-slate-900">
                          ${(item.price * item.quantity).toFixed(2)}
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm">
                    <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
                      <div className="text-xs font-bold text-slate-400 uppercase mb-2">Contact</div>
                      <div className="text-slate-700 font-medium">
                        {info.firstName} {info.lastName}
                      </div>
                      <div className="text-slate-500 text-xs mt-0.5 break-all">{info.email}</div>
                    </div>
                    <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
                      <div className="text-xs font-bold text-slate-400 uppercase mb-2">Ship To</div>
                      <div className="text-slate-700 text-xs leading-relaxed">
                        {address.line1 || "—"}
                        {address.line2 ? `, ${address.line2}` : ""}
                        <br />
                        {address.city}
                        {address.state ? `, ${address.state}` : ""} {address.zip}
                      </div>
                    </div>
                    <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
                      <div className="text-xs font-bold text-slate-400 uppercase mb-2">Payment</div>
                      <div className="text-slate-700 text-sm font-medium capitalize">
                        {payMethod === "card"
                          ? `Card ···· ${card.number.replace(/\s/g, "").slice(-4) || "——"}`
                          : payMethod}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <div className="px-6 sm:px-8 pb-6 sm:pb-8 flex flex-col sm:flex-row gap-3 justify-between border-t border-slate-100 pt-5">
                {step !== "info" ? (
                  <button
                    type="button"
                    onClick={back}
                    className="flex items-center justify-center gap-1.5 text-sm font-semibold text-slate-600 hover:text-slate-900 px-5 py-3 rounded-xl hover:bg-slate-100 border border-slate-200"
                  >
                    Back
                  </button>
                ) : (
                  <div />
                )}

                {step !== "confirm" ? (
                  <button
                    type="button"
                    onClick={next}
                    className="flex-1 sm:flex-none sm:min-w-[160px] bg-[#2563eb] text-white py-3 px-8 rounded-xl font-bold text-sm hover:bg-[#1d4ed8] flex items-center justify-center gap-2"
                  >
                    Continue
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={placeOrder}
                    disabled={placing}
                    className="flex-1 sm:flex-none sm:min-w-[180px] bg-emerald-500 text-white py-3 px-8 rounded-xl font-bold text-sm hover:bg-emerald-600 disabled:opacity-70 flex items-center justify-center gap-2"
                  >
                    {placing ? "Placing Order…" : "Place Order"}
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Summary sidebar */}
          <div>
            <div className="bg-white rounded-3xl border border-slate-200 p-6 sticky top-24">
              <h3 className="font-['Outfit',sans-serif] font-bold text-base text-slate-900 mb-4">
                Order Summary
              </h3>
              <div className="space-y-3 mb-5 max-h-64 overflow-y-auto">
                {cart.map((item) => (
                  <div key={`${item.id}-${item.selectedColor}`} className="flex items-center gap-2.5">
                    <div className="relative flex-shrink-0">
                      <img src={item.img} alt={item.name} className="w-12 h-12 rounded-lg object-cover" />
                      <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-slate-700 text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                        {item.quantity}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-semibold text-slate-800 truncate">{item.name}</div>
                      <div className="text-[10px] text-slate-400">{item.selectedColor}</div>
                    </div>
                    <div className="text-xs font-bold text-slate-700">
                      ${(item.price * item.quantity).toFixed(2)}
                    </div>
                  </div>
                ))}
              </div>
              <div className="border-t border-slate-100 pt-4 space-y-2.5 text-sm">
                <div className="flex justify-between text-slate-500">
                  <span>Subtotal</span>
                  <span>${cartTotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-slate-500">
                  <span>Shipping</span>
                  <span className={shippingCost === 0 ? "text-emerald-600 font-semibold" : ""}>
                    {shippingCost === 0 ? "FREE" : `$${shippingCost.toFixed(2)}`}
                  </span>
                </div>
                <div className="flex justify-between text-slate-500">
                  <span>Tax (8%)</span>
                  <span>${tax.toFixed(2)}</span>
                </div>
                <div className="border-t border-slate-200 pt-3 flex justify-between font-bold text-slate-900">
                  <span>Total</span>
                  <span className="text-[#2563eb] text-lg">${grandTotal.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}