import { useState, useEffect, createContext, useContext } from 'react';

interface User {
  id: string;
  email: string;
  role: string;
  restaurantId: string;
  restaurantName: string;
  restaurantSlug: string;
}

interface AuthCtx {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  api: (path: string, opts?: RequestInit) => Promise<any>;
}

const Ctx = createContext<AuthCtx>(null!);

export const useAuth = () => useContext(Ctx);

export function AuthProvider({ children, apiBase }: { children: React.ReactNode; apiBase: string }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const t = localStorage.getItem('ezmenu_token');
    const u = localStorage.getItem('ezmenu_user');
    if (t && u) { setToken(t); setUser(JSON.parse(u)); }
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const res = await fetch(`${apiBase}/auth/login`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      if (!res.ok) return false;
      const data = await res.json();
      setToken(data.token);
      setUser(data.user);
      localStorage.setItem('ezmenu_token', data.token);
      localStorage.setItem('ezmenu_user', JSON.stringify(data.user));
      return true;
    } catch { return false; }
  };

  const logout = () => {
    setUser(null); setToken(null);
    localStorage.removeItem('ezmenu_token');
    localStorage.removeItem('ezmenu_user');
  };

  const api = async (path: string, opts: RequestInit = {}) => {
    const res = await fetch(`${apiBase}${path}`, {
      ...opts,
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}`, ...opts.headers },
    });
    return res.json();
  };

  return <Ctx.Provider value={{ user, token, login, logout, api }}>{children}</Ctx.Provider>;
}
