"use client";

import {
  createContext,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";

export type CartItem = {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
};

type CartContextValue = {
  cart: { items: CartItem[] };
  getItemCount: () => number;
};

const CartContext = createContext<CartContextValue>({
  cart: { items: [] },
  getItemCount: () => 0,
});

export function CartProvider({ children }: { children: ReactNode }) {
  const [items] = useState<CartItem[]>([]);
  const value = useMemo(
    () => ({
      cart: { items },
      getItemCount: () =>
        items.reduce((count, item) => count + item.quantity, 0),
    }),
    [items]
  );

  return (
    <CartContext.Provider value={value}>{children}</CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}
