import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Product } from "@/types/product";

export interface CartItem extends Product {
  quantity: number;
}

interface CartStore {
  cart: CartItem[];
  isOpen: boolean;

  openCart: () => void;
  closeCart: () => void;

  addToCart: (product: Product) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, delta: number) => void;

  clearCart: () => void;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set) => ({
      cart: [],
      isOpen: false,

      openCart: () =>
        set({
          isOpen: true,
        }),

      closeCart: () =>
        set({
          isOpen: false,
        }),

      addToCart: (product) =>
        set((state) => {
          const existing = state.cart.find(
            (item) => item.id === product.id
          );

          // Product is out of stock
          if (product.stock <= 0) {
            return {
              cart: state.cart,
              isOpen: true,
            };
          }

          // Product already exists in cart
          if (existing) {
            // Don't allow quantity above stock
            if (existing.quantity >= product.stock) {
              return {
                cart: state.cart,
                isOpen: true,
              };
            }

            return {
              cart: state.cart.map((item) =>
                item.id === product.id
                  ? {
                      ...item,
                      quantity: item.quantity + 1,
                    }
                  : item
              ),
              isOpen: true,
            };
          }

          // Add new product
          return {
            cart: [
              ...state.cart,
              {
                ...product,
                quantity: 1,
              },
            ],
            isOpen: true,
          };
        }),

      removeFromCart: (id) =>
        set((state) => ({
          cart: state.cart.filter(
            (item) => item.id !== id
          ),
        })),

      updateQuantity: (id, delta) =>
        set((state) => ({
          cart: state.cart
            .map((item) => {
              if (item.id !== id) {
                return item;
              }

              const newQuantity =
                item.quantity + delta;

              // Remove item if quantity reaches zero
              if (newQuantity <= 0) {
                return null;
              }

              // Don't exceed available stock
              if (newQuantity > item.stock) {
                return item;
              }

              return {
                ...item,
                quantity: newQuantity,
              };
            })
            .filter(Boolean) as CartItem[],
        })),

      clearCart: () =>
        set({
          cart: [],
        }),
    }),

    {
      name: "loreon-cart",

      partialize: (state) => ({
        cart: state.cart,
      }),
    }
  )
);