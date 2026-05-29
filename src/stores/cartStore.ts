import { create } from 'zustand';
import type { CartItem, MenuItem, Addon } from '../types';

interface CartStore {
  items: CartItem[];
  addItem: (item: MenuItem, addons: Addon[], notes: string) => void;
  removeItem: (itemId: string) => void;
  updateQuantity: (itemId: string, delta: number) => void;
  clearCart: () => void;
  getTotalSYP: () => number;
  getTotalUSD: () => number;
  getTotalItems: () => number;
  getWhatsAppMessage: (restaurantName: string) => string;
}

export const useCartStore = create<CartStore>((set, get) => ({
  items: [],

  addItem: (item, addons, notes) => {
    set((state) => {
      const existing = state.items.find(
        (c) =>
          c.menuItem.id === item.id &&
          JSON.stringify(c.selectedAddons.map((a) => a.id).sort()) ===
            JSON.stringify(addons.map((a) => a.id).sort()) &&
          c.notes === notes
      );
      if (existing) {
        return {
          items: state.items.map((c) =>
            c === existing ? { ...c, quantity: c.quantity + 1 } : c
          ),
        };
      }
      return {
        items: [...state.items, { menuItem: item, quantity: 1, selectedAddons: addons, notes }],
      };
    });
  },

  removeItem: (itemId) => {
    set((state) => ({ items: state.items.filter((c) => c.menuItem.id !== itemId) }));
  },

  updateQuantity: (itemId, delta) => {
    set((state) => ({
      items: state.items
        .map((c) =>
          c.menuItem.id === itemId ? { ...c, quantity: c.quantity + delta } : c
        )
        .filter((c) => c.quantity > 0),
    }));
  },

  clearCart: () => set({ items: [] }),

  getTotalSYP: () => {
    return get().items.reduce(
      (sum, c) =>
        sum +
        (c.menuItem.priceSYP + c.selectedAddons.reduce((s, a) => s + a.priceSYP, 0)) *
          c.quantity,
      0
    );
  },

  getTotalUSD: () => {
    return get().items.reduce(
      (sum, c) =>
        sum +
        (c.menuItem.priceUSD + c.selectedAddons.reduce((s, a) => s + a.priceUSD, 0)) *
          c.quantity,
      0
    );
  },

  getTotalItems: () => {
    return get().items.reduce((sum, c) => sum + c.quantity, 0);
  },

  getWhatsAppMessage: (restaurantName) => {
    const items = get().items;
    let msg = `🛒 طلب جديد من ${restaurantName}\n`;
    msg += '━━━━━━━━━━━\n';
    items.forEach((c, i) => {
      const addonsText = c.selectedAddons.length > 0
        ? ` (+${c.selectedAddons.map((a) => a.name).join(', ')})`
        : '';
      msg += `${i + 1}× ${c.menuItem.name}${addonsText} — ${(c.menuItem.priceSYP * c.quantity).toLocaleString()} ل.س\n`;
    });
    msg += '━━━━━━━━━━━\n';
    msg += `💰 الإجمالي: ${get().getTotalSYP().toLocaleString()} ل.س`;
    return msg;
  },
}));
