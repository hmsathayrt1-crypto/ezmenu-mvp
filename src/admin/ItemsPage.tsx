import { useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

interface Category { id: string; name: string; icon: string; }
interface Item {
  id: string; category_id: string; name: string; name_en: string; description: string;
  price_syp: number; price_usd: number; image_url: string; is_featured: number; is_available: number; sort_order: number;
}

export default function ItemsPage() {
  const { api } = useAuth();
  const [items, setItems] = useState<Item[]>([]);
  const [cats, setCats] = useState<Category[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Item | null>(null);
  const [form, setForm] = useState({ name: '', name_en: '', description: '', price_syp: 0, price_usd: 0, image_url: '', category_id: '', is_featured: false, is_available: true, sort_order: 0 });

  const load = async () => {
    const [i, c] = await Promise.all([api('/admin/items'), api('/admin/categories')]);
    setItems(i); setCats(c);
  };
  useEffect(() => { load(); }, []);

  const save = async () => {
    const body = { ...form, is_featured: form.is_featured ? 1 : 0, is_available: form.is_available ? 1 : 0 };
    if (editing) {
      await api(`/admin/items/${editing.id}`, { method: 'PUT', body: JSON.stringify(body) });
    } else {
      await api('/admin/items', { method: 'POST', body: JSON.stringify(body) });
    }
    setShowForm(false); setEditing(null); resetForm(); load();
  };

  const resetForm = () => setForm({ name: '', name_en: '', description: '', price_syp: 0, price_usd: 0, image_url: '', category_id: cats[0]?.id || '', is_featured: false, is_available: true, sort_order: 0 });

  const editItem = (item: Item) => {
    setEditing(item);
    setForm({ name: item.name, name_en: item.name_en, description: item.description, price_syp: item.price_syp, price_usd: item.price_usd, image_url: item.image_url, category_id: item.category_id, is_featured: !!item.is_featured, is_available: !!item.is_available, sort_order: item.sort_order });
    setShowForm(true);
  };

  const deleteItem = async (id: string) => {
    if (!confirm('حذف الصنف؟')) return;
    await api(`/admin/items/${id}`, { method: 'DELETE' }); load();
  };

  const catName = (id: string) => cats.find((c) => c.id === id)?.name || '—';

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-gray-900">الأصناف</h2>
        <button onClick={() => { resetForm(); setEditing(null); setShowForm(true); }}
          className="bg-emerald-500 text-white px-4 py-2 rounded-xl text-sm font-bold hover:bg-emerald-600">+ صنف جديد</button>
      </div>

      {/* نموذج */}
      {showForm && (
        <div className="bg-white rounded-2xl p-4 shadow-sm space-y-3">
          <h3 className="font-bold text-gray-700">{editing ? 'تعديل صنف' : 'صنف جديد'}</h3>
          <div className="grid grid-cols-2 gap-3">
            <div><label className="block text-xs text-gray-500 mb-1">الاسم (عربي)</label><input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full border rounded-xl px-3 py-2 text-sm" /></div>
            <div><label className="block text-xs text-gray-500 mb-1">الاسم (إنجليزي)</label><input value={form.name_en} onChange={(e) => setForm({ ...form, name_en: e.target.value })} className="w-full border rounded-xl px-3 py-2 text-sm" /></div>
          </div>
          <div><label className="block text-xs text-gray-500 mb-1">الوصف</label><textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="w-full border rounded-xl px-3 py-2 text-sm h-16 resize-none" /></div>
          <div className="grid grid-cols-2 gap-3">
            <div><label className="block text-xs text-gray-500 mb-1">السعر (ل.س)</label><input type="number" value={form.price_syp} onChange={(e) => setForm({ ...form, price_syp: +e.target.value })} className="w-full border rounded-xl px-3 py-2 text-sm" /></div>
            <div><label className="block text-xs text-gray-500 mb-1">السعر ($)</label><input type="number" step="0.01" value={form.price_usd} onChange={(e) => setForm({ ...form, price_usd: +e.target.value })} className="w-full border rounded-xl px-3 py-2 text-sm" /></div>
          </div>
          <div><label className="block text-xs text-gray-500 mb-1">رابط الصورة</label><input value={form.image_url} onChange={(e) => setForm({ ...form, image_url: e.target.value })} className="w-full border rounded-xl px-3 py-2 text-sm" placeholder="https://..." /></div>
          <div><label className="block text-xs text-gray-500 mb-1">التصنيف</label>
            <select value={form.category_id} onChange={(e) => setForm({ ...form, category_id: e.target.value })} className="w-full border rounded-xl px-3 py-2 text-sm">
              <option value="">اختر تصنيف</option>
              {cats.map((c) => <option key={c.id} value={c.id}>{c.icon} {c.name}</option>)}
            </select>
          </div>
          <div className="flex gap-4">
            <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={form.is_featured} onChange={(e) => setForm({ ...form, is_featured: e.target.checked })} /> مميز ⭐</label>
            <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={form.is_available} onChange={(e) => setForm({ ...form, is_available: e.target.checked })} /> متوفر ✅</label>
          </div>
          <div className="flex gap-2">
            <button onClick={save} className="bg-emerald-500 text-white px-6 py-2 rounded-xl text-sm font-bold">حفظ</button>
            <button onClick={() => { setShowForm(false); setEditing(null); }} className="text-gray-500 text-sm">إلغاء</button>
          </div>
        </div>
      )}

      {/* القائمة */}
      <div className="space-y-2">
        {items.map((item) => (
          <div key={item.id} className="bg-white rounded-2xl p-3 shadow-sm flex gap-3 items-center">
            {item.image_url && <img src={item.image_url} alt={item.name} className="w-14 h-14 rounded-xl object-cover" />}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="font-medium text-gray-900 truncate">{item.name}</span>
                {item.is_featured && <span className="text-xs bg-amber-100 text-amber-600 px-1.5 py-0.5 rounded-full">⭐</span>}
                {!item.is_available && <span className="text-xs bg-red-100 text-red-500 px-1.5 py-0.5 rounded-full">غير متوفر</span>}
              </div>
              <div className="text-xs text-gray-400">{catName(item.category_id)} · {item.price_syp.toLocaleString()} ل.س</div>
            </div>
            <div className="flex gap-2">
              <button onClick={() => editItem(item)} className="text-blue-500 text-xs hover:underline">تعديل</button>
              <button onClick={() => deleteItem(item.id)} className="text-red-400 text-xs hover:underline">حذف</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
