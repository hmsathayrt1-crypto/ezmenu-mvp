import type { Category, MenuItem } from '../types';

export const RESTAURANT = {
  name: 'مطعم الذوق',
  nameEn: 'Al-Thawq Restaurant',
  whatsapp: '963999123456',
  isOpen: true,
};

export const categories: Category[] = [
  { id: 'pizza', name: 'بيتزا', icon: '🍕' },
  { id: 'burger', name: 'برغر', icon: '🍔' },
  { id: 'salad', name: 'سلطات', icon: '🥗' },
  { id: 'pasta', name: 'باستا', icon: '🍝' },
  { id: 'drinks', name: 'مشروبات', icon: '🥤' },
  { id: 'desserts', name: 'حلويات', icon: '🍰' },
];

export const menuItems: MenuItem[] = [
  {
    id: 'p1', categoryId: 'pizza', name: 'مارغريتا سبيشيال', nameEn: 'Margherita Special',
    description: 'بيتزا كلاسيكية مع جبنة موزاريلا وطماطم طازجة وريحان',
    priceSYP: 35000, priceUSD: 5.99,
    image: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=400&h=300&fit=crop',
    isFeatured: true,
    addons: [
      { id: 'a1', name: 'جبنة إضافية', priceSYP: 5000, priceUSD: 1 },
      { id: 'a2', name: 'فطر', priceSYP: 4000, priceUSD: 0.8 },
    ],
  },
  {
    id: 'p2', categoryId: 'pizza', name: 'بيتزا بيبروني', nameEn: 'Pepperoni Pizza',
    description: 'بيتزا مع شرائح بيبروني وجبنة موزاريلا',
    priceSYP: 40000, priceUSD: 6.99,
    image: 'https://images.unsplash.com/photo-1628840042765-356208da3652?w=400&h=300&fit=crop',
    isFeatured: false, addons: [],
  },
  {
    id: 'p3', categoryId: 'pizza', name: 'بيتزا خضار', nameEn: 'Veggie Pizza',
    description: 'بيتزا غنية بالخضروات الطازجة والجبن',
    priceSYP: 30000, priceUSD: 4.99,
    image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400&h=300&fit=crop',
    isFeatured: false, addons: [],
  },
  {
    id: 'b1', categoryId: 'burger', name: 'برغر الشيف', nameEn: 'Chef Burger',
    description: 'برغر أنغوس مع جبنة شيدر وخس وطماطم وصلصة خاصة',
    priceSYP: 48000, priceUSD: 7.99,
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&h=300&fit=crop',
    isFeatured: true,
    addons: [
      { id: 'a3', name: 'بطاطس مقلية', priceSYP: 8000, priceUSD: 1.5 },
      { id: 'a4', name: 'مشروب كولا', priceSYP: 3000, priceUSD: 0.5 },
    ],
  },
  {
    id: 'b2', categoryId: 'burger', name: 'برغر دجاج مقرمش', nameEn: 'Crispy Chicken Burger',
    description: 'برغر دجاج مقرمش مع مايونيز وخس طازج',
    priceSYP: 38000, priceUSD: 6.49,
    image: 'https://images.unsplash.com/photo-1606755962773-d329e0a8f870?w=400&h=300&fit=crop',
    isFeatured: false, addons: [],
  },
  {
    id: 's1', categoryId: 'salad', name: 'سلطة قيصر', nameEn: 'Caesar Salad',
    description: 'خس روماني مع صلصة قيصر وقطع خبز محمصة وجبنة بارميزان',
    priceSYP: 22000, priceUSD: 3.99,
    image: 'https://images.unsplash.com/photo-1546793665-c74683f337c5?w=400&h=300&fit=crop',
    isFeatured: true, addons: [],
  },
  {
    id: 's2', categoryId: 'salad', name: 'سلطة يونانية', nameEn: 'Greek Salad',
    description: 'طماطم وخيار وزيتون مع جبنة فيتا وزيت زيتون',
    priceSYP: 18000, priceUSD: 3.49,
    image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=400&h=300&fit=crop',
    isFeatured: false, addons: [],
  },
  {
    id: 'pa1', categoryId: 'pasta', name: 'سباغيتي كاربونارا', nameEn: 'Spaghetti Carbonara',
    description: 'سباغيتي مع صلصة كريمة وبانشيتا وجبنة بارميزان',
    priceSYP: 35000, priceUSD: 5.99,
    image: 'https://images.unsplash.com/photo-1612874742237-6526221588e3?w=400&h=300&fit=crop',
    isFeatured: false,
    addons: [
      { id: 'a5', name: 'ثوم بودرة', priceSYP: 1000, priceUSD: 0.2 },
    ],
  },
  {
    id: 'pa2', categoryId: 'pasta', name: 'باستا ألفريدو', nameEn: 'Pasta Alfredo',
    description: 'باستا بصلصة كريمة غنية مع الدجاج',
    priceSYP: 32000, priceUSD: 5.49,
    image: 'https://images.unsplash.com/photo-1645112411341-6c4fd023714a?w=400&h=300&fit=crop',
    isFeatured: false, addons: [],
  },
  {
    id: 'd1', categoryId: 'drinks', name: 'عصير برتقال طازج', nameEn: 'Fresh Orange Juice',
    description: 'عصير برتقال طازج 100% بدون سكر مضاف',
    priceSYP: 10000, priceUSD: 1.99,
    image: 'https://images.unsplash.com/photo-1621506289939-18f5f21c5896?w=400&h=300&fit=crop',
    isFeatured: false, addons: [],
  },
  {
    id: 'd2', categoryId: 'drinks', name: 'ميلك شيك شوكولاتة', nameEn: 'Chocolate Milkshake',
    description: 'ميلك شيك كريمي بنكهة الشوكولاتة الغنية',
    priceSYP: 15000, priceUSD: 2.99,
    image: 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=400&h=300&fit=crop',
    isFeatured: true, addons: [],
  },
  {
    id: 'ds1', categoryId: 'desserts', name: 'تيرايميسو', nameEn: 'Tiramisu',
    description: 'حلوى إيطالية كلاسيكية مع قهوة وماسكاربوني',
    priceSYP: 25000, priceUSD: 4.49,
    image: 'https://images.unsplash.com/photo-1571877227200-a0d98ea60705?w=400&h=300&fit=crop',
    isFeatured: true, addons: [],
  },
  {
    id: 'ds2', categoryId: 'desserts', name: 'تشيز كيك توت', nameEn: 'Berry Cheesecake',
    description: 'تشيز كيك كريمي مع صلصة التوت الطازجة',
    priceSYP: 20000, priceUSD: 3.99,
    image: 'https://images.unsplash.com/photo-1533134242443-d4fd215305ad?w=400&h=300&fit=crop',
    isFeatured: false, addons: [],
  },
];
