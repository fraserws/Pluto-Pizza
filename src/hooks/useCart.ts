import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { toast } from "sonner";
import { Pizza } from "@/types";

interface CartStore {
  items: Pizza[];
  addItem: (data: Pizza) => void;
  changeItemQuantity: (id: string, quantity: number) => void;
  removeItem: (id: string) => void;
  updateItem: (updatedItem: Pizza) => void;
  removeAll: () => void;
}

const useCart = create(
  persist<CartStore>(
    (set, get) => ({
      items: [],
      addItem: (data: Pizza) => {
        const currentItems = get().items;
        const existingItemIndex = currentItems.findIndex(
          (item) =>
            item.size === data.size &&
            JSON.stringify(item.toppings.sort()) ===
              JSON.stringify(data.toppings.sort()),
        );

        if (existingItemIndex !== -1) {
          const existingItem = currentItems[existingItemIndex];
          if (existingItem) {
            existingItem.quantity += 1;
            set({ items: [...currentItems] });
          }
        } else {
          const newItem: Pizza = { ...data };
          set({ items: [...currentItems, newItem] });
        }

        toast.success("Item added to cart.");
      },
      removeItem: (id: string) => {
        set({
          items: [
            ...get().items.filter(
              (item) => item.id.toString() !== id.toString(),
            ),
          ],
        });
        toast.error("Item removed from cart.");
      },
      updateItem: (updatedItem: Pizza) => {
        const currentItems = get().items;
        const existingItemIndex = currentItems.findIndex(
          (item) =>
            item.size === updatedItem.size &&
            JSON.stringify(item.toppings.sort()) ===
              JSON.stringify(updatedItem.toppings.sort()),
        );

        if (existingItemIndex !== -1) {
          const existingItem = currentItems[existingItemIndex];
          if (existingItem) {
            existingItem.quantity += updatedItem.quantity;
            set({ items: [...currentItems] });
            set({
              items: [
                ...get().items.filter(
                  (item) => item.id.toString() !== updatedItem.id.toString(),
                ),
              ],
            });
          }
        } else {
          set({
            items: get().items.map((item) => {
              if (item.id === updatedItem.id) {
                return updatedItem;
              }
              return item;
            }),
          });
        }
        toast.success("Item updated in cart.");
      },
      removeAll: () => set({ items: [] }),
      changeItemQuantity: (id: string, quantity: number) => {
        const currentItems = get().items;
        const existingItemIndex = currentItems.findIndex(
          (item) => item.id.toString() === id.toString(),
        );

        if (existingItemIndex !== -1) {
          const existingItem = currentItems[existingItemIndex];
          if (existingItem) {
            existingItem.quantity = quantity;
            set({ items: [...currentItems] });
          }
        }
      },
    }),
    {
      name: "cart-storage",
      storage: createJSONStorage(() => localStorage),
    },
  ),
);

export default useCart;
