import { useEffect, useState } from "react";
import {
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  // @ts-expect-error productApi is currently a JavaScript module without declarations.
} from "../../api/productApi";

type ProductForm = {
  name: string;
  brand: string;
  slug: string;
  price: string;
  originalPrice: string;
  categoryId: string;
  badge: string;
  img: string;
  description: string;
  features: string;
  colors: string;
  stock: string;
};

const emptyForm: ProductForm = {
  name: "",
  brand: "",
  slug: "",
  price: "",
  originalPrice: "",
  categoryId: "",
  badge: "",
  img: "",
  description: "",
  features: "",
  colors: "",
  stock: "0",
};

export default function AdminProducts() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState<ProductForm>(emptyForm);

  async function loadProducts() {
    try {
      setLoading(true);
      const data = await getProducts();
      setProducts(data);
    } catch {
      setError("Failed to load products");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadProducts();
  }, []);

  function openAdd() {
    setEditingId(null);
    setForm(emptyForm);
    setShowForm(true);
    setError("");
  }

  function openEdit(product: any) {
    setEditingId(product.id);
    setForm({
      name: product.name || "",
      brand: product.brand || "",
      slug: product.slug || "",
      price: String(product.price ?? ""),
      originalPrice: product.originalPrice != null ? String(product.originalPrice) : "",
      categoryId: product.categoryId != null ? String(product.categoryId) : "",
      badge: product.badge || "",
      img: product.img || "",
      description: product.description || "",
      features: Array.isArray(product.features) ? product.features.join(", ") : "",
      colors: Array.isArray(product.colors) ? product.colors.join(", ") : "",
      stock: String(product.stock ?? 0),
    });
    setShowForm(true);
    setError("");
  }

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError("");

    const payload = {
      name: form.name.trim(),
      brand: form.brand.trim(),
      slug: form.slug.trim() || form.name.toLowerCase().replace(/\s+/g, "-"),
      price: Number(form.price),
      originalPrice: form.originalPrice ? Number(form.originalPrice) : null,
      categoryId: form.categoryId ? Number(form.categoryId) : null,
      badge: form.badge.trim() || null,
      img: form.img.trim(),
      description: form.description.trim(),
      features: form.features
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
      colors: form.colors
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
      stock: Number(form.stock) || 0,
    };

    try {
      if (editingId) {
        await updateProduct(editingId, payload);
      } else {
        await createProduct(payload);
      }
      setShowForm(false);
      setForm(emptyForm);
      setEditingId(null);
      await loadProducts();
    } catch {
      setError("Save failed. Check fields and try again.");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: number) {
    if (!confirm("Delete this product?")) return;
    try {
      await deleteProduct(id);
      await loadProducts();
    } catch {
      setError("Delete failed");
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Products</h1>
          <p className="text-slate-500 text-sm mt-1">
            Add, edit, or remove store products
          </p>
        </div>
        <button
          onClick={openAdd}
          className="bg-[#2563eb] text-white px-4 py-2.5 rounded-xl text-sm font-semibold hover:bg-[#1d4ed8] transition"
        >
          + Add Product
        </button>
      </div>

      {error && (
        <div className="mb-4 bg-red-50 text-red-600 text-sm px-4 py-3 rounded-xl">
          {error}
        </div>
      )}

      {/* Form */}
      {showForm && (
        <div className="bg-white border border-slate-200 rounded-2xl p-6 mb-6">
          <h2 className="text-lg font-bold text-slate-900 mb-4">
            {editingId ? "Edit Product" : "Add Product"}
          </h2>

          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input name="name" value={form.name} onChange={handleChange} required placeholder="Name *" className="border border-slate-200 rounded-xl px-3 py-2.5 text-sm" />
            <input name="brand" value={form.brand} onChange={handleChange} required placeholder="Brand *" className="border border-slate-200 rounded-xl px-3 py-2.5 text-sm" />
            <input name="slug" value={form.slug} onChange={handleChange} placeholder="Slug (auto if empty)" className="border border-slate-200 rounded-xl px-3 py-2.5 text-sm" />
            <input name="img" value={form.img} onChange={handleChange} required placeholder="Image URL *" className="border border-slate-200 rounded-xl px-3 py-2.5 text-sm" />
            <input name="price" value={form.price} onChange={handleChange} required type="number" step="0.01" placeholder="Price *" className="border border-slate-200 rounded-xl px-3 py-2.5 text-sm" />
            <input name="originalPrice" value={form.originalPrice} onChange={handleChange} type="number" step="0.01" placeholder="Original Price" className="border border-slate-200 rounded-xl px-3 py-2.5 text-sm" />
            <input name="stock" value={form.stock} onChange={handleChange} type="number" placeholder="Stock" className="border border-slate-200 rounded-xl px-3 py-2.5 text-sm" />
            <input name="categoryId" value={form.categoryId} onChange={handleChange} type="number" placeholder="Category ID (1=Electronics, 2=Fashion, 3=Beauty, 4=Home)" className="border border-slate-200 rounded-xl px-3 py-2.5 text-sm" />
            <input name="badge" value={form.badge} onChange={handleChange} placeholder="Badge (Hot Deal, New, Sale...)" className="border border-slate-200 rounded-xl px-3 py-2.5 text-sm md:col-span-2" />
            <input name="colors" value={form.colors} onChange={handleChange} placeholder="Colors (comma separated)" className="border border-slate-200 rounded-xl px-3 py-2.5 text-sm md:col-span-2" />
            <input name="features" value={form.features} onChange={handleChange} placeholder="Features (comma separated)" className="border border-slate-200 rounded-xl px-3 py-2.5 text-sm md:col-span-2" />
            <textarea name="description" value={form.description} onChange={handleChange} placeholder="Description" rows={3} className="border border-slate-200 rounded-xl px-3 py-2.5 text-sm md:col-span-2" />

            <div className="md:col-span-2 flex gap-3">
              <button
                type="submit"
                disabled={saving}
                className="bg-[#2563eb] text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-[#1d4ed8] disabled:opacity-50"
              >
                {saving ? "Saving..." : editingId ? "Update" : "Create"}
              </button>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="bg-slate-100 text-slate-700 px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-slate-200"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* List */}
      {loading ? (
        <div className="text-center py-16 text-slate-500">Loading products...</div>
      ) : (
        <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="text-left px-4 py-3 font-semibold text-slate-600 w-12">#</th>
                  <th className="text-left px-4 py-3 font-semibold text-slate-600">Product</th>
                  <th className="text-left px-4 py-3 font-semibold text-slate-600">Brand</th>
                  <th className="text-left px-4 py-3 font-semibold text-slate-600">Price</th>
                  <th className="text-left px-4 py-3 font-semibold text-slate-600">Stock</th>
                  <th className="text-right px-4 py-3 font-semibold text-slate-600">Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map((p, index) => (
                  <tr key={p.id} className="border-b border-slate-100 hover:bg-slate-50">
                    <td className="px-4 py-3 text-slate-400 font-medium">{index + 1}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <img src={p.img} alt="" className="w-10 h-10 rounded-lg object-cover bg-slate-100" />
                        <div>
                          <div className="font-medium text-slate-900">{p.name}</div>
                          <div className="text-xs text-slate-400">{p.category}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-slate-600">{p.brand}</td>
                    <td className="px-4 py-3 text-slate-900 font-medium">${p.price}</td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex px-2 py-0.5 rounded-full text-xs font-semibold ${p.stock > 0
                            ? "bg-emerald-50 text-emerald-700"
                            : "bg-red-50 text-red-600"
                          }`}
                      >
                        {p.stock}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="inline-flex gap-2">
                        <button
                          onClick={() => openEdit(p)}
                          className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-blue-50 text-[#2563eb] hover:bg-blue-100 transition"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(p.id)}
                          className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-red-50 text-red-600 hover:bg-red-100 transition"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {products.length === 0 && (
            <div className="text-center py-12 text-slate-500">No products yet.</div>
          )}
        </div>
      )}
    </div>
  );
}