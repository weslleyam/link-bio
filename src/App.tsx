
import React, { useState, useEffect } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from '@/pages/Login';
import Register from '@/pages/Register';
import DashboardLayout from '@/components/DashboardLayout';
import DashboardHome from '@/pages/DashboardHome';
import LinksManager from '@/pages/LinksManager';
import DesignCustomizer from '@/pages/DesignCustomizer';
import CatalogManager from '@/pages/CatalogManager';
import ProfileSettings from '@/pages/ProfileSettings';
import Analytics from '@/pages/Analytics';
import PublicBio from '@/pages/PublicBio';
import PasswordSetup from '@/pages/PasswordSetup';
import MagicLoginHandler from '@/pages/MagicLoginHandler';
import { AuthState, User } from '@/types';
import { db } from '@/services/db';

const App: React.FC = () => {
  const [auth, setAuth] = useState<AuthState>(() => {
    const saved = localStorage.getItem('auth');
    return saved ? JSON.parse(saved) : { user: null, token: null, isAuthenticated: false };
  });

  const [isHydrating, setIsHydrating] = useState(true);

  useEffect(() => {
    // Sincroniza os dados locais com o MySQL da Hostinger na inicialização
    const hydrate = async () => {
      await db.syncWithServer();
      setIsHydrating(false);
    };
    hydrate();
  }, []);

  useEffect(() => {
    localStorage.setItem('auth', JSON.stringify(auth));
  }, [auth]);

  const login = (user: User, token: string) => {
    setAuth({ user, token, isAuthenticated: true });
  };

  const logout = () => {
    setAuth({ user: null, token: null, isAuthenticated: false });
  };

  const updateUser = (updatedUser: User) => {
    setAuth(prev => ({ ...prev, user: updatedUser }));
  };

  if (isHydrating) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-500 font-bold uppercase tracking-widest text-[10px]">Conectando ao Banco de Dados...</p>
        </div>
      </div>
    );
  }

  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={auth.isAuthenticated ? <Navigate to="/dashboard" /> : <Navigate to="/login" />} />
        
        <Route path="/login" element={<Login onLogin={login} />} />
        <Route path="/register" element={<Register />} />
        <Route path="/definir-senha" element={<PasswordSetup />} />
        <Route path="/login-magico" element={<MagicLoginHandler onLogin={login} />} />

        <Route path="/dashboard" element={auth.isAuthenticated ? <DashboardLayout user={auth.user!} onLogout={logout} /> : <Navigate to="/login" />}>
          <Route index element={<DashboardHome user={auth.user!} />} />
          <Route path="links" element={<LinksManager user={auth.user!} />} />
          <Route path="design" element={<DesignCustomizer user={auth.user!} />} />
          <Route path="catalog" element={<CatalogManager user={auth.user!} />} />
          <Route path="settings" element={<ProfileSettings user={auth.user!} onUpdateUser={updateUser} />} />
          <Route path="analytics" element={<Analytics user={auth.user!} />} />
        </Route>

        <Route path="/:username" element={<PublicBio />} />

        <Route path="*" element={<div className="p-10 text-center font-bold">404 - Página não encontrada</div>} />
      </Routes>
    </HashRouter>
  );
};

export default App;
