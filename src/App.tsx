import { useState, useMemo } from 'react';
import type { MenuItem, Addon } from './types';
import { categories, menuItems, RESTAURANT } from './data/menu';
import { useCartStore } from './stores/cartStore';
import { AuthProvider } from './admin/AuthContext';
import AdminApp from './admin/AdminApp';

// Customer Menu App
function CustomerApp() {
  const [activeCategory, setActiveCategory] = useState('all');
  const [detailItem, setDetailItem] = useState<MenuItem | null>(null);
  const [showCart, setShowCart] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [notes, setNotes] = useState('');
  const [selectedAddons, setSelectedAddons] = useState<Addon[]>([]);
  const { items, addItem, removeItem, updateQuantity, getTotalSYP, getTotalItems, getWhatsAppMessage } = useCartStore();

  const filtered = useMemo(() => {
    if (activeCategory === 'all') return menuItems;
    return menuItems.filter((i) => i.categoryId === activeCategory);
  }, [activeCategory]);

  const handleAdd = () => {
    if (!detailItem) return;
    for (let i = 0; i < quantity; i++) addItem(detailItem, selectedAddons, notes);
    setDetailItem(null); setQuantity(1); setNotes(''); setSelectedAddons([]);
  };

  const openWhatsApp = () => {
    const msg = getWhatsAppMessage(RESTAURANT.name);
    window.open(`https://wa.me/${RESTAURANT.whatsapp}?text=${encodeURIComponent(msg)}`, '_blank');
  };

  const totalSYP = getTotalSYP();

  return (
    <div className="min-h-screen bg-gray-50" dir="rtl">
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md shadow-sm">
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center justify-between">
          <div><h1 className="text-xl font-bold text-gray-900">{RESTAURANT.name}</h1><p className="text-xs text-emerald-600 flex items-center gap-1"><span className="w-2 h-2 bg-emerald-500 rounded-full inline-block" />مفتوح الآن</p></div>
          <button onClick={() => setShowCart(true)} className="relative bg-emerald-500 text-white px-4 py-2 rounded-xl font-bold text-sm hover:bg-emerald-600 transition-colors">
            🛒 السلة
            {getTotalItems() > 0 && <span className="absolute -top-2 -left-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">{getTotalItems()}</span>}
          </button>
        </div>
        <div className="max-w-2xl mx-auto px-4 pb-3 flex gap-2 overflow-x-auto">
          <button onClick={() => setActiveCategory('all')} className={`whitespace-nowrap px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${activeCategory === 'all' ? 'bg-emerald-500 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>الكل</button>
          {categories.map((cat) => (
            <button key={cat.id} onClick={() => setActiveCategory(cat.id)} className={`whitespace-nowrap px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${activeCategory === cat.id ? 'bg-emerald-500 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>{cat.icon} {cat.name}</button>
          ))}
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-4 grid grid-cols-1 sm:grid-cols-2 gap-3 pb-28">
        {filtered.map((item) => (
          <button key={item.id} onClick={() => { setDetailItem(item); setQuantity(1); setNotes(''); setSelectedAddons([]); }} className="bg-white rounded-2xl shadow-sm hover:shadow-md transition-all overflow-hidden text-right flex flex-col">
            <div className="relative h-44 overflow-hidden">
              <img src={item.image} alt={item.name} className="w-full h-full object-cover hover:scale-105 transition-transform duration-300" />
              {item.isFeatured && <span className="absolute top-2 right-2 bg-amber-500 text-white text-xs px-2 py-1 rounded-full font-bold">⭐ مميز</span>}
            </div>
            <div className="p-3 flex-1 flex flex-col">
              <div className="flex justify-between items-start"><h3 className="font-bold text-gray-900">{item.name}</h3><span className="text-xs text-gray-400">{item.nameEn}</span></div>
              <p className="text-xs text-gray-500 mt-1 line-clamp-2 flex-1">{item.description}</p>
              <div className="flex items-center justify-between mt-2">
                <div><span className="font-bold text-emerald-600">{item.priceSYP.toLocaleString()} ل.س</span><span className="text-xs text-gray-400 mr-2">${item.priceUSD}</span></div>
                <span className="bg-emerald-500 text-white w-8 h-8 rounded-full flex items-center justify-center text-lg font-bold hover:bg-emerald-600 transition-colors">+</span>
              </div>
            </div>
          </button>
        ))}
      </main>

      {getTotalItems() > 0 && !showCart && !detailItem && (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg z-40">
          <div className="max-w-2xl mx-auto px-4 py-3">
            <button onClick={() => setShowCart(true)} className="w-full bg-emerald-500 text-white py-3 rounded-xl font-bold text-lg hover:bg-emerald-600 transition-colors flex items-center justify-between px-6">
              <span>🛒 عرض السلة ({getTotalItems()})</span><span>{totalSYP.toLocaleString()} ل.س</span>
            </button>
          </div>
        </div>
      )}

      {detailItem && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50" onClick={() => setDetailItem(null)}>
          <div className="bg-white w-full sm:max-w-md sm:rounded-2xl rounded-t-2xl max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            {detailItem.image && (
              <div className="relative h-56 overflow-hidden sm:rounded-t-2xl">
                <img src={detailItem.image} alt={detailItem.name} className="w-full h-full object-cover" />
                <button onClick={() => setDetailItem(null)} className="absolute top-3 left-3 bg-white/80 backdrop-blur-sm w-8 h-8 rounded-full flex items-center justify-center text-lg">✕</button>
              </div>
            )}
            <div className="p-5">
              <h2 className="text-xl font-bold text-gray-800">{detailItem.name}</h2>
              <p className="text-sm text-gray-400">{detailItem.nameEn}</p>
              <p className="text-gray-600 mt-2 leading-relaxed">{detailItem.description}</p>
              {detailItem.addons.length > 0 && (
                <div className="mt-4">
                  <h4 className="font-semibold text-gray-700 mb-2">إضافات</h4>
                  <div className="space-y-2">
                    {detailItem.addons.map((addon) => (
                      <label key={addon.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl cursor-pointer hover:bg-gray-100 transition-colors">
                        <div className="flex items-center gap-2">
                          <input type="checkbox" checked={selectedAddons.some((a) => a.id === addon.id)} onChange={() => setSelectedAddons((prev) => prev.some((a) => a.id === addon.id) ? prev.filter((a) => a.id !== addon.id) : [...prev, addon])} className="w-4 h-4 accent-emerald-500" />
                          <span className="text-gray-700">{addon.name}</span>
                        </div>
                        <span className="text-sm text-gray-500">{addon.priceSYP.toLocaleString()} ل.س</span>
                      </label>
                    ))}
                  </div>
                </div>
              )}
              <div className="mt-4">
                <h4 className="font-semibold text-gray-700 mb-2">ملاحظات</h4>
                <textarea value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="أي طلبات خاصة..." className="w-full border border-gray-200 rounded-xl p-3 text-sm resize-none h-20 focus:outline-none focus:ring-2 focus:ring-emerald-500/30" />
              </div>
              <div className="flex items-center justify-between bg-gray-50 rounded-xl p-3 mt-4">
                <div className="flex items-center gap-3">
                  <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="w-8 h-8 rounded-full bg-white border border-gray-200 flex items-center justify-center font-bold">−</button>
                  <span className="font-bold text-lg w-6 text-center">{quantity}</span>
                  <button onClick={() => setQuantity(quantity + 1)} className="w-8 h-8 rounded-full bg-white border border-gray-200 flex items-center justify-center font-bold">+</button>
                </div>
                <button onClick={handleAdd} className="bg-emerald-500 text-white px-6 py-2 rounded-xl font-bold hover:bg-emerald-600 transition-colors">
                  أضف · {((detailItem.priceSYP + selectedAddons.reduce((s, a) => s + a.priceSYP, 0)) * quantity).toLocaleString()} ل.س
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showCart && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50" onClick={() => setShowCart(false)}>
          <div className="bg-white w-full sm:max-w-md sm:rounded-2xl rounded-t-2xl max-h-[90vh] flex flex-col" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between p-4 border-b"><h2 className="text-lg font-bold">🛒 السلة</h2><button onClick={() => setShowCart(false)} className="p-2 hover:bg-gray-100 rounded-full">✕</button></div>
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {items.length === 0 ? (<div className="text-center py-12 text-gray-400"><p className="text-4xl mb-2">🍽️</p><p>السلة فارغة</p></div>) : (
                items.map((c) => (
                  <div key={c.menuItem.id} className="bg-gray-50 rounded-xl p-3 flex gap-3">
                    <img src={c.menuItem.image} alt={c.menuItem.name} className="w-16 h-16 rounded-lg object-cover" />
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-900 text-sm truncate">{c.menuItem.name}</h3>
                      {c.selectedAddons.length > 0 && <p className="text-xs text-emerald-600 mt-0.5">+ {c.selectedAddons.map((a) => a.name).join(', ')}</p>}
                      {c.notes && <p className="text-xs text-gray-400 italic">{c.notes}</p>}
                      <p className="text-emerald-600 font-bold text-sm mt-1">{(c.menuItem.priceSYP * c.quantity).toLocaleString()} ل.س</p>
                    </div>
                    <div className="flex flex-col items-center gap-1">
                      <button onClick={() => updateQuantity(c.menuItem.id, 1)} className="w-7 h-7 rounded-full bg-emerald-500 text-white flex items-center justify-center text-sm font-bold">+</button>
                      <span className="text-sm font-bold">{c.quantity}</span>
                      <button onClick={() => c.quantity === 1 ? removeItem(c.menuItem.id) : updateQuantity(c.menuItem.id, -1)} className="w-7 h-7 rounded-full bg-gray-200 text-gray-600 flex items-center justify-center text-sm font-bold">{c.quantity === 1 ? '🗑' : '−'}</button>
                    </div>
                  </div>
                ))
              )}
            </div>
            {items.length > 0 && (
              <div className="p-4 border-t space-y-3">
                <div className="flex items-center justify-between"><span className="text-gray-600 font-medium">الإجمالي</span><span className="text-xl font-bold text-emerald-600">{totalSYP.toLocaleString()} ل.س</span></div>
                <button onClick={openWhatsApp} className="w-full bg-green-500 hover:bg-green-600 text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-colors text-lg">📱 اطلب عبر واتساب</button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// Root App — routes /admin to Admin, everything else to Customer
export default function App() {
  const isAdmin = window.location.pathname.startsWith('/admin');

  if (isAdmin) {
    return (
      <AuthProvider apiBase={import.meta.env.VITE_API_BASE || '/api'}>
        <AdminApp />
      </AuthProvider>
    );
  }

  return <CustomerApp />;
}
