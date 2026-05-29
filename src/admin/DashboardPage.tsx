import { useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

interface Stat { totalViews: number; totalOrders: number; totalCategories: number; totalItems: number; dailyViews: { date: string; count: number }[]; }

export default function DashboardPage() {
  const { api } = useAuth();
  const [stats, setStats] = useState<Stat | null>(null);

  useEffect(() => { api('/admin/stats').then(setStats); }, []);

  if (!stats) return <div className="flex items-center justify-center h-64"><div className="animate-spin w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full" /></div>;

  const cards = [
    { label: 'المشاهدات', value: stats.totalViews, icon: '👁️', color: 'bg-blue-50 text-blue-600' },
    { label: 'طلبات واتساب', value: stats.totalOrders, icon: '📱', color: 'bg-green-50 text-green-600' },
    { label: 'التصنيفات', value: stats.totalCategories, icon: '📂', color: 'bg-purple-50 text-purple-600' },
    { label: 'الأصناف', value: stats.totalItems, icon: '🍽️', color: 'bg-amber-50 text-amber-600' },
  ];

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold text-gray-900">لوحة التحكم</h2>
      <div className="grid grid-cols-2 gap-3">
        {cards.map((c) => (
          <div key={c.label} className={`${c.color} rounded-2xl p-4`}>
            <div className="text-2xl mb-1">{c.icon}</div>
            <div className="text-2xl font-bold">{c.value}</div>
            <div className="text-sm opacity-70">{c.label}</div>
          </div>
        ))}
      </div>
      {stats.dailyViews.length > 0 && (
        <div className="bg-white rounded-2xl p-4 shadow-sm">
          <h3 className="font-bold text-gray-700 mb-3">المشاهدات (آخر 7 أيام)</h3>
          <div className="space-y-2">
            {stats.dailyViews.map((d) => (
              <div key={d.date} className="flex items-center gap-3">
                <span className="text-xs text-gray-500 w-20">{d.date}</span>
                <div className="flex-1 bg-gray-100 rounded-full h-6 overflow-hidden">
                  <div className="bg-emerald-500 h-full rounded-full flex items-center pr-2" style={{ width: `${Math.max(10, (d.count / Math.max(...stats.dailyViews.map((x) => x.count), 1)) * 100)}%` }}>
                    <span className="text-xs text-white font-bold">{d.count}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
