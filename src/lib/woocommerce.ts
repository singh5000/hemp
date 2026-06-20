const WC_URL = process.env.NEXT_PUBLIC_WC_URL;

export async function getProducts(page = 1, perPage = 12, category?: string) {
  let url = `${WC_URL}/products?page=${page}&per_page=${perPage}`;
  if (category) url += `&category=${category}`;
  const res = await fetch(url, { next: { revalidate: 60 } });
  return res.json();
}

export async function getSingleProduct(id: number) {
  const res = await fetch(`${WC_URL}/products/${id}`, {
    next: { revalidate: 60 },
  });
  return res.json();
}

export async function getCart() {
  const res = await fetch(`${WC_URL}/cart`, {
    credentials: "include",
    headers: { "Content-Type": "application/json" },
  });
  return res.json();
}

export async function addToCart(productId: number, quantity: number) {
  const res = await fetch(`${WC_URL}/cart/add-item`, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id: productId, quantity }),
  });
  return res.json();
}

export async function updateCartItem(key: string, quantity: number) {
  const res = await fetch(`${WC_URL}/cart/update-item`, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ key, quantity }),
  });
  return res.json();
}

export async function removeCartItem(key: string) {
  const res = await fetch(`${WC_URL}/cart/remove-item`, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ key }),
  });
  return res.json();
}
