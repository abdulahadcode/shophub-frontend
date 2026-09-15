const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export async function placeOrder(orderData) {
  const res = await fetch(`${API_URL}/orders`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(orderData),
  });
  if (!res.ok) throw new Error("Failed to place order");
  return res.json();
}

export async function getOrders() {
  const res = await fetch(`${API_URL}/orders`);
  if (!res.ok) throw new Error("Failed to fetch orders");
  return res.json();
}

export async function updateOrderStatus(id, status) {
  const res = await fetch(`${API_URL}/orders/${id}/status`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ status }),
  });
  if (!res.ok) throw new Error("Failed to update status");
  return res.json();
}

export async function getMyOrders(userId) {
  const res = await fetch(`${API_URL}/orders/user/${userId}`);
  if (!res.ok) throw new Error("Failed to fetch orders");
  return res.json();
}