type CartItem = {
  bookId: number;
  title: string;
  price: number;
  quantity: number;
  imageUrl?: string;
};

const KEY = 'pv_cart_v1';

export function getCart(): CartItem[] {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return [];
    return JSON.parse(raw) as CartItem[];
  } catch {
    return [];
  }
}

export function saveCart(items: CartItem[]) {
  localStorage.setItem(KEY, JSON.stringify(items));
}

export function addToCart(item: CartItem) {
  const cart = getCart();
  const found = cart.find(c => c.bookId === item.bookId);
  if (found) {
    found.quantity += item.quantity;
  } else {
    cart.push(item);
  }
  saveCart(cart);
}

export function removeFromCart(bookId: number) {
  const cart = getCart().filter(c => c.bookId !== bookId);
  saveCart(cart);
}

export function updateQuantity(bookId: number, qty: number) {
  const cart = getCart();
  const found = cart.find(c => c.bookId === bookId);
  if (found) {
    found.quantity = qty;
  }
  saveCart(cart);
}

export function clearCart() { localStorage.removeItem(KEY); }

export type { CartItem };
