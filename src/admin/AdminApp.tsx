import { useAuth } from './AuthContext';
import LoginPage from './LoginPage';
import DashboardPage from './DashboardPage';
import CategoriesPage from './CategoriesPage';
import ItemsPage from './ItemsPage';
import { useState } from 'react';

const API_BASE = import.meta.env.VITE_API_BASE || '/api';

const NAV = [
  { id: 'dashboard', label: 'الرئيسية', icon: '📊' },
  { id: 'categories', label: 'التصنيفات', icon: '📂' },
  { id: 'items', label: 'الأصناف', icon: '🍽️' },
];

export default function AdminApp() {
  const [page, setPage] = useState('dashboard');
  const { user, logout } = useAuth();

  if (!user) return <LoginPage />;

  return (
    <div className="min-h-screen bg-gray-100 flex" dir="rtl">
      {/* Sidebar */}
      <aside className="w-56 bg-white border-l shadow-sm flex flex-col">
        <div className="p-4 border-b">
          <h1 className="font-bold text-gray-900 text-lg">🍽️ EZMenu</h1>
          <p className="text-xs text-gray-500 mt-0.5">{user.restaurantName}</p>
        </div>
        <nav className="flex-1 p-2 space-y-1">
          {NAV.map((n) => (
            <button key={n.id} onClick={() => setPage(n.id)}
              className={`w-full flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium transition-colors ${page === n.id ? 'bg-emerald-50 text-emerald-700' : 'text-gray-600 hover:bg-gray-50'}`}>
              <span>{n.icon}</span> {n.label}
            </button>
          ))}
        </nav>
        <div className="p-3 border-t">
          <button onClick={logout} className="w-full text-right text-sm text-red-400 hover:text-red-600 py-2">تسجيل الخروج ←</button>
        </div>
      </aside>

      {/* Content */}
      <main className="flex-1 p-6 max-w-4xl">
        {page === 'dashboard' && <DashboardPage />}
        {page === 'categories' && <CategoriesPage />}
        {page === 'items' && <ItemsPage />}
      </main>
    </div>
  );
}
