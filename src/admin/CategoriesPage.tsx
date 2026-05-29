import { useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

interface Category { id: string; name: string; icon: string; sort_order: number; is_active: number; }

export default function CategoriesPage() {
  const { api } = useAuth();
  const [cats, setCats] = useState<Category[]>([]);
  const [name, setName] = useState('');
  const [icon, setIcon] = useState('🍽️');
  const [editing, setEditing] = useState<Category | null>(null);

  const load = () => api('/admin/categories').then((r) => setCats(r));
  useEffect(() => { load(); }, []);

  const addCat = async () => {
    if (!name.trim()) return;
    await api('/admin/categories', { method: 'POST', body: JSON.stringify({ name, icon, sort_order: cats.length }) });
    setName(''); setIcon('🍽️'); load();
  };

  const saveEdit = async () => {
    if (!editing) return;
    await api(`/admin/categories/${editing.id}`, { method: 'PUT', body: JSON.stringify(editing) });
    setEditing(null); load();
  };

  const deleteCat = async (id: string) => {
    if (!confirm('حذف التصنيف؟')) return;
    await api(`/admin/categories/${id}`, { method: 'DELETE' });
    load();
  };

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold text-gray-900">التصنيفات</h2>

      {/* إضافة */}
      <div className="bg-white rounded-2xl p-4 shadow-sm flex gap-2 items-end">
        <div className="flex-1">
          <label className="block text-xs text-gray-500 mb-1">الاسم</label>
          <input value={name} onChange={(e) => setName(e.target.value)}
            className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/30" placeholder="اسم التصنيف" />
        </div>
        <div className="w-16">
          <label className="block text-xs text-gray-500 mb-1">أيقونة</label>
          <input value={icon} onChange={(e) => setIcon(e.target.value)}
            className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm text-center" />
        </div>
        <button onClick={addCat} className="bg-emerald-500 text-white px-4 py-2 rounded-xl text-sm font-bold hover:bg-emerald-600">إضافة</button>
      </div>

      {/* القائمة */}
      <div className="space-y-2">
        {cats.map((cat) => (
          <div key={cat.id} className="bg-white rounded-2xl p-4 shadow-sm flex items-center justify-between">
            {editing?.id === cat.id ? (
              <div className="flex gap-2 flex-1 items-center">
                <input value={editing.icon} onChange={(e) => setEditing({ ...editing, icon: e.target.value })} className="w-12 border rounded-xl px-2 py-1 text-sm text-center" />
                <input value={editing.name} onChange={(e) => setEditing({ ...editing, name: e.target.value })} className="flex-1 border rounded-xl px-3 py-1 text-sm" />
                <button onClick={saveEdit} className="bg-emerald-500 text-white px-3 py-1 rounded-xl text-xs font-bold">حفظ</button>
                <button onClick={() => setEditing(null)} className="text-gray-400 text-xs">إلغاء</button>
              </div>
            ) : (
              <>
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{cat.icon}</span>
                  <span className="font-medium text-gray-900">{cat.name}</span>
                  {!cat.is_active && <span className="text-xs text-red-400 bg-red-50 px-2 py-0.5 rounded-full">معطل</span>}
                </div>
                <div className="flex gap-2">
                  <button onClick={() => setEditing(cat)} className="text-blue-500 text-sm hover:underline">تعديل</button>
                  <button onClick={() => deleteCat(cat.id)} className="text-red-400 text-sm hover:underline">حذف</button>
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
