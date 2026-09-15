import { createBrowserRouter } from "react-router";
import Root from "./pages/Root";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Cart from "./pages/Cart";
import ProductDetail from "./pages/ProductDetail";
import Checkout from "./pages/Checkout";
import Products from "./pages/Products";
import CategoryProducts from "./pages/CategoryProducts";
import Deals from "./pages/Deals";
import AdminRoute from "./components/AdminRoute";
import AdminLayout from "./pages/admin/AdminLayout";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminProducts from "./pages/admin/AdminProducts";
import AdminOrders from "./pages/admin/AdminOrders";
import MyOrders from "./pages/MyOrders";

export const router = createBrowserRouter([
  // ===== Normal store (Navbar + Footer) =====
  {
    path: "/",
    element: <Root />,
    children: [
      { index: true, element: <Home /> },
      { path: "products", element: <Products /> },
      {
        path: "products/electronics",
        element: <CategoryProducts category="Electronics" />,
      },
      {
        path: "products/fashion",
        element: <CategoryProducts category="Fashion" />,
      },
      {
        path: "products/beauty",
        element: <CategoryProducts category="Beauty" />,
      },
      {
        path: "products/home-office",
        element: <CategoryProducts category="Home & Office" />,
      },
      { path: "deals", element: <Deals /> },
      { path: "login", element: <Login /> },
      { path: "register", element: <Register /> },
      { path: "cart", element: <Cart /> },
      { path: "checkout", element: <Checkout /> },
      { path: "product/:id", element: <ProductDetail /> },
      { path: "orders", element: <MyOrders /> },
    ],
  },

  // ===== Admin panel (NO store Navbar) =====
  {
  path: "/admin",
  element: (
    <AdminRoute>
      <AdminLayout />
    </AdminRoute>
  ),
  children: [
    { index: true, element: <AdminDashboard /> },
    { path: "products", element: <AdminProducts /> },
    { path: "orders", element: <AdminOrders /> },   // ← yeh line
  ],
},
]);