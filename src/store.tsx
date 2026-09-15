import { createContext, useContext, useState, useEffect, ReactNode } from "react";
// auth.js currently has no TypeScript declaration file.
// @ts-expect-error The module is a JavaScript file without declarations.
import { onAuthStateChange, signOut as supabaseSignOut } from "./lib/auth";

export interface Product {
  id: number;
  name: string;
  brand: string;
  price: number;
  originalPrice: number | null;
  category: string;
  badge: string | null;
  img: string;
  rating: number;
  reviews: number;
  description: string;
  features: string[];
  colors: string[];
  inStock: boolean;
}

export interface CartItem extends Product {
  quantity: number;
  selectedColor: string;
}

interface StoreContext {
  cart: CartItem[];
  addToCart: (product: Product, color?: string) => void;
  removeFromCart: (id: number, color: string) => void;
  updateQty: (id: number, color: string, qty: number) => void;
  cartCount: number;
  cartTotal: number;
  clearCart: () => void;
  wishlist: number[];
  toggleWishlist: (id: number) => void;
  user: any;
  loadingUser: boolean;
  isLoggedIn: boolean;
  logout: () => Promise<void>;
}

const Ctx = createContext<StoreContext | null>(null);

export function StoreProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<number[]>([]);
  const [user, setUser] = useState<any>(null);
  const [loadingUser, setLoadingUser] = useState(true);

  // Auth state sunna
  useEffect(() => {
    const { data: { subscription } } = onAuthStateChange((currentUser: any) => {
      setUser(currentUser);
      setLoadingUser(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  async function logout() {
    await supabaseSignOut();
    setUser(null);
  }

  function addToCart(product: Product, color = product.colors?.[0] || "") {
    setCart((prev) => {
      const existing = prev.find(
        (i) => i.id === product.id && i.selectedColor === color
      );
      if (existing) {
        return prev.map((i) =>
          i.id === product.id && i.selectedColor === color
            ? { ...i, quantity: i.quantity + 1 }
            : i
        );
      }
      return [...prev, { ...product, quantity: 1, selectedColor: color }];
    });
  }

  function removeFromCart(id: number, color: string) {
    setCart((prev) =>
      prev.filter((i) => !(i.id === id && i.selectedColor === color))
    );
  }

  function updateQty(id: number, color: string, qty: number) {
    if (qty < 1) return removeFromCart(id, color);
    setCart((prev) =>
      prev.map((i) =>
        i.id === id && i.selectedColor === color ? { ...i, quantity: qty } : i
      )
    );
  }

  function clearCart() {
    setCart([]);
  }

  function toggleWishlist(id: number) {
    setWishlist((prev) =>
      prev.includes(id) ? prev.filter((w) => w !== id) : [...prev, id]
    );
  }

  const cartCount = cart.reduce((s, i) => s + i.quantity, 0);
  const cartTotal = cart.reduce((s, i) => s + i.price * i.quantity, 0);

  return (
    <Ctx.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQty,
        cartCount,
        cartTotal,
        wishlist,
        toggleWishlist,
        user,
        loadingUser,
        isLoggedIn: !!user,
        logout,
        clearCart,
      }}
    >
      {children}
    </Ctx.Provider>
  );
}

export function useStore() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useStore outside StoreProvider");
  return ctx;
}
