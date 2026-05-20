import type { CartItem } from "@/hooks/use-cart";

export function calculateCartSummary(items: CartItem[]) {
  return {
    subtotal: items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    ),
  };
}
