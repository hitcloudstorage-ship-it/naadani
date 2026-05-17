import type { CartItem } from "@/types";
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface CartState {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (productId: bigint) => void;
  updateQty: (productId: bigint, quantity: number) => void;
  clearCart: () => void;
  totalItems: () => number;
  totalPaisa: () => bigint;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (incoming) => {
        set((state) => {
          const existing = state.items.find(
            (i) => i.productId === incoming.productId,
          );
          if (existing) {
            return {
              items: state.items.map((i) =>
                i.productId === incoming.productId
                  ? { ...i, quantity: i.quantity + incoming.quantity }
                  : i,
              ),
            };
          }
          return { items: [...state.items, incoming] };
        });
      },

      removeItem: (productId) => {
        set((state) => ({
          items: state.items.filter((i) => i.productId !== productId),
        }));
      },

      updateQty: (productId, quantity) => {
        if (quantity <= 0) {
          get().removeItem(productId);
          return;
        }
        set((state) => ({
          items: state.items.map((i) =>
            i.productId === productId ? { ...i, quantity } : i,
          ),
        }));
      },

      clearCart: () => set({ items: [] }),

      totalItems: () => get().items.reduce((sum, i) => sum + i.quantity, 0),

      totalPaisa: () =>
        get().items.reduce(
          (sum, i) => sum + i.price * BigInt(i.quantity),
          BigInt(0),
        ),
    }),
    {
      name: "naadani-cart",
      partialize: (state) => ({ items: state.items }),
    },
  ),
);
