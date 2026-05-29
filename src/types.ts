export interface Addon {
  id: string;
  name: string;
  priceSYP: number;
  priceUSD: number;
}

export interface MenuItem {
  id: string;
  categoryId: string;
  name: string;
  nameEn: string;
  description: string;
  priceSYP: number;
  priceUSD: number;
  image: string;
  isFeatured: boolean;
  addons: Addon[];
}

export interface Category {
  id: string;
  name: string;
  icon: string;
}

export interface CartItem {
  menuItem: MenuItem;
  quantity: number;
  selectedAddons: Addon[];
  notes: string;
}
