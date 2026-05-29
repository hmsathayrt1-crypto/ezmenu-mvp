import { useState, useEffect, useMemo } from 'react';
import type { MenuItem as MenuItemType, Addon } from './types';
import { menuItems as staticItems, categories as staticCats, RESTAURANT as staticRest } from './data/menu';
import { useCartStore } from './stores/cartStore';
import { AuthProvider } from './admin/AuthContext';
import AdminApp from './admin/AdminApp';

const API = import.meta.env.VITE_API_BASE || 'https://ezmenu-backend.hmsathayrt1.workers.dev';

interface ApiCategory { id: string; name: string; icon: string; sort_order: number; }
interface ApiAddon { id: string; name: string; price_syp: number; price_usd: number; }
interface ApiItem { id: string; category_id: string; name: string; name_en: string; description: string; price_syp: number; price_usd: number; image_url: string; is_featured: number; is_available: number; addons: ApiAddon[]; }
interface ApiRestaurant { id: string; name: string; slug: string; whatsapp_number: string; description: string; }

/* ─── Hero Section ─── */
function HeroSection({ name, description }: { name: string; description?: string }) {
  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-emerald-700 via-emerald-800 to-emerald-900">
      {/* Decorative pattern */}
      <div className="absolute inset-0 opacity-10">
        <svg width="100%" height="100%"><defs><pattern id="dots" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse"><circle cx="2" cy="2" r="1" fill="white"/></pattern></defs><rect width="100%" height="100%" fill="url(#dots)"/></svg>
      </div>
      {/* Decorative circles */}
      <div className="absolute -top-20 -left-20 w-64 h-64 bg-emerald-500/20 rounded-full blur-3xl" />
      <div className="absolute -bottom-10 -right-10 w-48 h-48 bg-amber-400/10 rounded-full blur-2xl" />
      <div className="relative max-w-2xl mx-auto px-5 pt-10 pb-8 text-center">
        {/* Logo */}
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-white/15 backdrop-blur-sm border-2 border-white/30 mb-4 shadow-lg shadow-emerald-900/50">
          <span className="text-4xl">🍽️</span>
        </div>
        <h1 className="text-3xl font-extrabold text-white tracking-tight mb-2" style={{ fontFamily: "'Noto Kufi Arabic', 'Segoe UI', sans-serif" }}>{name}</h1>
        {description && <p className="text-emerald-100/80 text-sm max-w-md mx-auto leading-relaxed">{description}</p>}
        <div className="mt-4 inline-flex items-center gap-2 bg-white/15 backdrop-blur-sm rounded-full px-4 py-1.5 border border-white/20">
          <span className="relative flex h-2.5 w-2.5"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span><span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-400"></span></span>
          <span className="text-white/90 text-sm font-medium">مفتوح الآن · اطلب واتساب</span>
        </div>
      </div>
      {/* Bottom wave */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 40" fill="none"><path d="M0 40V20C360 0 720 40 1080 20C1260 10 1380 5 1440 0V40H0Z" fill="#f9fafb"/></svg>
      </div>
    </div>
  );
}

/* ─── Category Tabs ─── */
function CategoryTabs({ cats, active, onChange }: { cats: { id: string; name: string; icon: string }[]; active: string; onChange: (id: string) => void }) {
  const scrollRef = useState<HTMLDivElement | null>(null);
  return (
    <div className="sticky top-0 z-40 bg-white/95 backdrop-blur-lg shadow-sm border-b border-gray-100">
      <div className="max-w-2xl mx-auto px-4 py-2.5">
        <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1" style={{ scrollbarWidth: 'none' }}>
          <button onClick={() => onChange('all')}
            className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-bold transition-all duration-300 ${
              active === 'all'
                ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/30 scale-105'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}>
            الكل
          </button>
          {cats.map((cat) => (
            <button key={cat.id} onClick={() => onChange(cat.id)}
              className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-bold transition-all duration-300 flex items-center gap-1.5 ${
                active === cat.id
                  ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/30 scale-105'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}>
              <span>{cat.icon}</span>
              <span>{cat.name}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ─── Menu Item Card ─── */
function MenuCard({ item, onTap }: { item: MenuItemType; onTap: () => void }) {
  return (
    <button onClick={onTap}
      className="group bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden text-right border border-gray-100 hover:border-emerald-200/50 flex flex-col">
      {/* Image */}
      <div className="relative h-44 overflow-hidden">
        <img src={item.image} alt={item.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          loading="lazy" />
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
        {/* Featured badge */}
        {item.isFeatured && (
          <span className="absolute top-3 right-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white text-xs px-3 py-1 rounded-full font-bold shadow-lg shadow-amber-500/30 flex items-center gap-1">
            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>
            مميز
          </span>
        )}
        {/* Price tag */}
        <div className="absolute bottom-3 left-3 bg-white/95 backdrop-blur-sm rounded-xl px-3 py-1.5 shadow-lg">
          <span className="font-extrabold text-emerald-700 text-sm">{item.priceSYP.toLocaleString()}</span>
          <span className="text-emerald-700/50 text-xs mr-1">ل.س</span>
        </div>
      </div>
      {/* Content */}
      <div className="p-3.5 flex-1 flex flex-col">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-bold text-gray-900 text-[15px] leading-tight">{item.name}</h3>
          <span className="text-[11px] text-gray-400 flex-shrink-0 mt-0.5">{item.nameEn}</span>
        </div>
        <p className="text-xs text-gray-500 mt-1.5 line-clamp-2 leading-relaxed flex-1">{item.description}</p>
        <div className="mt-3 flex items-center justify-between">
          <span className="text-xs text-gray-400">${item.priceUSD.toFixed(2)}</span>
          <span className="bg-emerald-600 hover:bg-emerald-700 text-white w-8 h-8 rounded-full flex items-center justify-center text-xl font-bold shadow-md shadow-emerald-600/30 transition-all hover:scale-110 active:scale-95">+</span>
        </div>
      </div>
    </button>
  );
}

/* ─── Item Detail Modal ─── */
function ItemModal({ item, onClose, onAdd }: { item: MenuItemType; onClose: () => void; onAdd: (qty: number, addons: Addon[], notes: string) => void }) {
  const [qty, setQty] = useState(1);
  const [notes, setNotes] = useState('');
  const [selectedAddons, setSelectedAddons] = useState<Addon[]>([]);

  const totalPrice = (item.priceSYP + selectedAddons.reduce((s, a) => s + a.priceSYP, 0)) * qty;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-white w-full sm:max-w-md sm:rounded-2xl rounded-t-3xl max-h-[92vh] overflow-y-auto shadow-2xl" onClick={(e) => e.stopPropagation()}>
        {/* Image */}
        <div className="relative h-56 overflow-hidden sm:rounded-t-2xl">
          <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
          <button onClick={onClose} className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm w-9 h-9 rounded-full flex items-center justify-center text-gray-700 shadow-lg hover:bg-white transition-colors">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
          {item.isFeatured && (
            <span className="absolute top-4 right-4 bg-gradient-to-r from-amber-500 to-orange-500 text-white text-xs px-3 py-1 rounded-full font-bold shadow-lg">
              ⭐ مميز
            </span>
          )}
          <div className="absolute bottom-4 right-4">
            <h2 className="text-white text-xl font-extrabold drop-shadow-lg">{item.name}</h2>
            <p className="text-white/80 text-sm">{item.nameEn}</p>
          </div>
        </div>

        <div className="p-5 space-y-5">
          {/* Description */}
          <p className="text-gray-600 leading-relaxed">{item.description}</p>

          {/* Price display */}
          <div className="flex items-center gap-3 bg-emerald-50 rounded-xl px-4 py-3">
            <span className="text-2xl font-extrabold text-emerald-700">{item.priceSYP.toLocaleString()}</span>
            <span className="text-emerald-600 text-sm">ل.س</span>
            <span className="text-gray-300 mx-2">|</span>
            <span className="text-lg font-bold text-gray-700">${item.priceUSD.toFixed(2)}</span>
          </div>

          {/* Addons */}
          {item.addons.length > 0 && (
            <div>
              <h4 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
                <span className="w-1.5 h-5 bg-emerald-500 rounded-full"></span>
                إضافات
              </h4>
              <div className="space-y-2">
                {item.addons.map((addon) => {
                  const isSelected = selectedAddons.some((a) => a.id === addon.id);
                  return (
                    <button key={addon.id}
                      onClick={() => setSelectedAddons(prev => isSelected ? prev.filter(a => a.id !== addon.id) : [...prev, addon])}
                      className={`w-full flex items-center justify-between p-3.5 rounded-xl transition-all duration-200 ${
                        isSelected
                          ? 'bg-emerald-50 border-2 border-emerald-400 shadow-sm'
                          : 'bg-gray-50 border-2 border-transparent hover:bg-gray-100'
                      }`}>
                      <div className="flex items-center gap-3">
                        <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-colors ${
                          isSelected ? 'bg-emerald-500 border-emerald-500' : 'border-gray-300'
                        }`}>
                          {isSelected && <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>}
                        </div>
                        <span className="font-medium text-gray-800">{addon.name}</span>
                      </div>
                      <span className={`font-bold text-sm ${isSelected ? 'text-emerald-600' : 'text-gray-500'}`}>
                        +{addon.priceSYP.toLocaleString()} ل.س
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Notes */}
          <div>
            <h4 className="font-bold text-gray-800 mb-2 flex items-center gap-2">
              <span className="w-1.5 h-5 bg-amber-400 rounded-full"></span>
              ملاحظات
            </h4>
            <textarea value={notes} onChange={(e) => setNotes(e.target.value)}
              placeholder="مثال: بدون بصل، حار..."
              className="w-full border-2 border-gray-200 rounded-xl p-3.5 text-sm resize-none h-20 focus:outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/20 transition-all placeholder:text-gray-400" />
          </div>

          {/* Quantity + Add Button */}
          <div className="flex items-center gap-4 bg-gray-50 rounded-2xl p-4">
            <div className="flex items-center gap-3">
              <button onClick={() => setQty(Math.max(1, qty - 1))}
                className="w-10 h-10 rounded-full bg-white border-2 border-gray-200 flex items-center justify-center font-bold text-gray-700 hover:border-emerald-400 hover:text-emerald-600 transition-colors shadow-sm">
                −
              </button>
              <span className="font-extrabold text-xl w-8 text-center">{qty}</span>
              <button onClick={() => setQty(qty + 1)}
                className="w-10 h-10 rounded-full bg-white border-2 border-gray-200 flex items-center justify-center font-bold text-gray-700 hover:border-emerald-400 hover:text-emerald-600 transition-colors shadow-sm">
                +
              </button>
            </div>
            <button onClick={() => onAdd(qty, selectedAddons, notes)}
              className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white py-3 rounded-xl font-bold transition-all shadow-lg shadow-emerald-600/30 active:scale-[0.98]">
              أضف للسلة · {totalPrice.toLocaleString()} ل.س
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── Cart Drawer ─── */
function CartDrawer({ restaurant, onClose }: { restaurant: { name: string; whatsapp: string }; onClose: () => void }) {
  const { items, removeItem, updateQuantity, getTotalSYP, getTotalItems, getWhatsAppMessage } = useCartStore();
  const totalSYP = getTotalSYP();

  const openWhatsApp = () => {
    const msg = getWhatsAppMessage(restaurant.name);
    window.open(`https://wa.me/${restaurant.whatsapp}?text=${encodeURIComponent(msg)}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-white w-full sm:max-w-md sm:rounded-2xl rounded-t-3xl max-h-[90vh] flex flex-col shadow-2xl" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <h2 className="text-lg font-extrabold text-gray-900 flex items-center gap-2">
            <span className="bg-emerald-100 text-emerald-700 w-8 h-8 rounded-full flex items-center justify-center text-sm">🛒</span>
            سلة الطلبات
          </h2>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-gray-200 transition-colors">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-3">
          {items.length === 0 ? (
            <div className="text-center py-16">
              <span className="text-6xl block mb-4">🍽️</span>
              <p className="text-gray-400 font-medium">السلة فارغة</p>
              <p className="text-gray-300 text-sm mt-1">أضف أصناف من القائمة</p>
            </div>
          ) : items.map((c) => (
            <div key={c.menuItem.id} className="bg-gray-50 rounded-2xl p-3.5 flex gap-3 border border-gray-100">
              <img src={c.menuItem.image} alt={c.menuItem.name} className="w-16 h-16 rounded-xl object-cover shadow-sm" />
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-gray-900 text-sm truncate">{c.menuItem.name}</h3>
                {c.selectedAddons.length > 0 && (
                  <p className="text-xs text-emerald-600 mt-0.5 font-medium">+ {c.selectedAddons.map((a) => a.name).join(' · ')}</p>
                )}
                {c.notes && <p className="text-xs text-gray-400 italic mt-0.5">📝 {c.notes}</p>}
                <p className="text-emerald-700 font-extrabold text-sm mt-1">{(c.menuItem.priceSYP * c.quantity).toLocaleString()} ل.س</p>
              </div>
              <div className="flex flex-col items-center gap-1.5">
                <button onClick={() => updateQuantity(c.menuItem.id, 1)} className="w-7 h-7 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center text-sm font-bold hover:bg-emerald-200 transition-colors">+</button>
                <span className="font-bold text-sm">{c.quantity}</span>
                <button onClick={() => c.quantity === 1 ? removeItem(c.menuItem.id) : updateQuantity(c.menuItem.id, -1)}
                  className="w-7 h-7 rounded-full bg-gray-100 text-gray-500 flex items-center justify-center text-sm font-bold hover:bg-red-100 hover:text-red-500 transition-colors">
                  {c.quantity === 1 ? '🗑' : '−'}
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="px-5 py-4 border-t border-gray-100 space-y-3 bg-gray-50/50">
            <div className="flex items-center justify-between">
              <span className="text-gray-500 font-medium">الإجمالي ({getTotalItems()} صنف)</span>
              <span className="text-2xl font-extrabold text-emerald-700">{totalSYP.toLocaleString()} <span className="text-sm font-bold">ل.س</span></span>
            </div>
            <button onClick={openWhatsApp}
              className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white py-3.5 rounded-2xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-green-500/30 transition-all active:scale-[0.98] text-lg">
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
              اطلب عبر واتساب
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

/* ─── Floating Cart Button ─── */
function FloatingCart({ total, count, onTap }: { total: number; count: number; onTap: () => void }) {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 pointer-events-none">
      <div className="max-w-2xl mx-auto px-4 pb-4">
        <button onClick={onTap}
          className="pointer-events-auto w-full bg-gradient-to-r from-emerald-600 to-emerald-700 text-white py-4 rounded-2xl font-bold shadow-2xl shadow-emerald-700/40 flex items-center justify-between px-6 hover:from-emerald-700 hover:to-emerald-800 transition-all active:scale-[0.98]">
          <div className="flex items-center gap-2">
            <span className="bg-white/20 rounded-full px-2.5 py-0.5 text-sm font-bold">{count}</span>
            <span>🛒 عرض السلة</span>
          </div>
          <span className="text-lg">{total.toLocaleString()} ل.س</span>
        </button>
      </div>
    </div>
  );
}

/* ─── Main Customer App ─── */
function CustomerApp() {
  const [activeCategory, setActiveCategory] = useState('all');
  const [detailItem, setDetailItem] = useState<MenuItemType | null>(null);
  const [showCart, setShowCart] = useState(false);
  const { addItem, getTotalSYP, getTotalItems } = useCartStore();

  const [restaurant, setRestaurant] = useState(staticRest);
  const [cats, setCats] = useState(staticCats);
  const [menuData, setMenuData] = useState(staticItems);
  const [apiLoaded, setApiLoaded] = useState(false);

  const slug = window.location.pathname.split('/').filter(Boolean)[0] || '';

  useEffect(() => {
    if (!slug) { setApiLoaded(true); return; }
    fetch(`${API}/api/menu/${slug}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.restaurant) {
          setRestaurant({ name: data.restaurant.name, whatsapp: data.restaurant.whatsapp_number });
          setCats(data.categories.map((c: ApiCategory) => ({ id: c.id, name: c.name, icon: c.icon })));
          setMenuData(data.items.map((i: ApiItem) => ({
            id: i.id, categoryId: i.category_id, name: i.name, nameEn: i.name_en,
            description: i.description, priceSYP: i.price_syp, priceUSD: i.price_usd,
            image: i.image_url || 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400',
            isFeatured: !!i.is_featured, isAvailable: !!i.is_available,
            addons: (i.addons || []).map((a: ApiAddon) => ({ id: a.id, name: a.name, priceSYP: a.price_syp, priceUSD: a.price_usd })),
          })));
        }
        setApiLoaded(true);
      })
      .catch(() => setApiLoaded(true));
  }, [slug]);

  const filtered = useMemo(() => {
    if (activeCategory === 'all') return menuData;
    return menuData.filter((i) => i.categoryId === activeCategory);
  }, [activeCategory, menuData]);

  const handleAdd = (qty: number, addons: Addon[], notes: string) => {
    if (!detailItem) return;
    for (let i = 0; i < qty; i++) addItem(detailItem, addons, notes);
    setDetailItem(null);
  };

  if (!apiLoaded) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-gray-400 font-medium">جاري التحميل...</p>
        </div>
      </div>
    );
  }

  const totalSYP = getTotalSYP();
  const totalItems = getTotalItems();

  return (
    <div className="min-h-screen bg-gray-50" dir="rtl">
      <HeroSection name={restaurant.name} description={slug ? 'اطلب الآن عبر واتساب' : 'قائمة تجريبية — اطلب عبر واتساب'} />
      <CategoryTabs cats={cats} active={activeCategory} onChange={setActiveCategory} />

      {/* Featured items */}
      {activeCategory === 'all' && menuData.some(i => i.isFeatured) && (
        <section className="max-w-2xl mx-auto px-4 pt-5 pb-2">
          <h2 className="text-lg font-extrabold text-gray-900 mb-3 flex items-center gap-2">
            <span className="w-1.5 h-6 bg-gradient-to-b from-amber-400 to-orange-500 rounded-full" />
            الأكثر طلباً
          </h2>
          <div className="flex gap-3 overflow-x-auto pb-2" style={{ scrollbarWidth: 'none' }}>
            {menuData.filter(i => i.isFeatured).map(item => (
              <button key={item.id} onClick={() => setDetailItem(item)}
                className="flex-shrink-0 w-36 bg-white rounded-2xl shadow-sm hover:shadow-lg transition-all overflow-hidden border border-gray-100 hover:border-amber-200">
                <div className="h-24 overflow-hidden">
                  <img src={item.image} alt={item.name} className="w-full h-full object-cover hover:scale-110 transition-transform duration-500" loading="lazy" />
                </div>
                <div className="p-2.5">
                  <p className="font-bold text-gray-900 text-xs truncate">{item.name}</p>
                  <p className="text-emerald-700 font-extrabold text-xs mt-1">{item.priceSYP.toLocaleString()} ل.س</p>
                </div>
              </button>
            ))}
          </div>
        </section>
      )}

      {/* Menu grid */}
      <main className="max-w-2xl mx-auto px-4 py-4 grid grid-cols-2 gap-3 pb-32">
        {filtered.map((item) => (
          <MenuCard key={item.id} item={item} onTap={() => setDetailItem(item)} />
        ))}
      </main>

      {/* Floating cart */}
      {totalItems > 0 && !showCart && !detailItem && (
        <FloatingCart total={totalSYP} count={totalItems} onTap={() => setShowCart(true)} />
      )}

      {/* Detail modal */}
      {detailItem && (
        <ItemModal item={detailItem} onClose={() => setDetailItem(null)} onAdd={handleAdd} />
      )}

      {/* Cart drawer */}
      {showCart && (
        <CartDrawer restaurant={restaurant} onClose={() => setShowCart(false)} />
      )}
    </div>
  );
}

/* ─── Root App ─── */
export default function App() {
  const isAdmin = window.location.pathname.startsWith('/admin');
  if (isAdmin) return <AuthProvider apiBase={`${API}/api`}><AdminApp /></AuthProvider>;
  return <CustomerApp />;
}