import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { Pizza } from "@/types";

interface CartStore {
  items: Pizza[];
  addItem: (data: Pizza) => void;
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

        const newItem: Pizza = { ...data, quantity: 1 };
        set({ items: [...currentItems, newItem] });
      },
      removeItem: (id: string) => {
        set({
          items: [
            ...get().items.filter(
              (item) => item.id.toString() !== id.toString(),
            ),
          ],
        });
      },
      updateItem: (updatedItem: Pizza) => {
        set({
          items: get().items.map((item) => {
            if (item.id === updatedItem.id) {
              return updatedItem;
            }
            return item;
          }),
        });
      },
      removeAll: () => set({ items: [] }),
    }),
    {
      name: "cart-storage",
      storage: createJSONStorage(() => localStorage),
    },
  ),
);

export default useCart;
