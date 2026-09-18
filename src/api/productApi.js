const API_URL = import.meta.env.VITE_API_URL || "https://api.bonto.dev/git/shophub.git/api";

// Backend se aaye data ko frontend ke format mein convert karta hai
function transformProduct(product) {
  return {
    id: product.id,
    name: product.name,
    brand: product.brand,
    price: Number(product.price),
    originalPrice: product.original_price ? Number(product.original_price) : null,
    category: product.category,               // join se aa raha hai
    badge: product.badge,
    img: product.img,
    rating: Number(product.rating),
    reviews: product.reviews_count || 0,
    description: product.description,
    features: product.features || [],
    colors: product.colors || [],
    inStock: product.stock > 0,
    stock: product.stock,
  };
}

export async function getProducts(params = {}) {
  const searchParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== "") {
      searchParams.set(key, value);
    }
  });

  const response = await fetch(
    `${API_URL}/products?${searchParams.toString()}`
  );

  if (!response.ok) {
    throw new Error("Failed to fetch products");
  }

  const data = await response.json();
  return data.map(transformProduct);
}

export async function getProductById(id) {
  const response = await fetch(`${API_URL}/products/${id}`);

  if (!response.ok) {
    throw new Error("Product not found");
  }

  const data = await response.json();
  return transformProduct(data);
}

export async function createProduct(product) {
  const res = await fetch(`${API_URL}/products`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(product),
  });
  if (!res.ok) throw new Error("Failed to create product");
  return res.json();
}

export async function updateProduct(id, product) {
  const res = await fetch(`${API_URL}/products/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(product),
  });
  if (!res.ok) throw new Error("Failed to update product");
  return res.json();
}

export async function deleteProduct(id) {
  const res = await fetch(`${API_URL}/products/${id}`, {
    method: "DELETE",
  });
  if (!res.ok) throw new Error("Failed to delete product");
  return res.json();
}