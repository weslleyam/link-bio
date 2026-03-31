
import React, { useState } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { User } from '@/types';
import { LayoutGrid, Link as LinkIcon, Palette, BarChart3, LogOut, ExternalLink, Copy, Check, Menu, X, ShoppingBag, Settings } from 'lucide-react';

interface Props {
  user: User;
  onLogout: () => void;
}

const DashboardLayout: React.FC<Props> = ({ user, onLogout }) => {
  const location = useLocation();
  const [copied, setCopied] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = [
    { label: 'Visão Geral', path: '/dashboard', icon: <LayoutGrid size={20} /> },
    { label: 'Meus Links', path: '/dashboard/links', icon: <LinkIcon size={20} /> },
    { label: 'Catálogo', path: '/dashboard/catalog', icon: <ShoppingBag size={20} /> },
    { label: 'Design', path: '/dashboard/design', icon: <Palette size={20} /> },
    { label: 'Relatórios', path: '/dashboard/analytics', icon: <BarChart3 size={20} /> },
    { label: 'Configurações', path: '/dashboard/settings', icon: <Settings size={20} /> },
  ];

  const publicUrl = `${window.location.origin}/#/${user.username}`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(publicUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

  const SidebarContent = () => (
    <>
      <div className="p-8 border-b border-gray-100 flex justify-between items-center">
        <h1 className="text-2xl font-black bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
          BioLink
        </h1>
        <button className="md:hidden text-gray-400" onClick={toggleMobileMenu}>
          <X size={24} />
        </button>
      </div>
      
      <nav className="flex-1 p-4 space-y-2">
        {navItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            onClick={() => setIsMobileMenuOpen(false)}
            className={`flex items-center gap-3 px-4 py-3.5 rounded-2xl transition-all ${
              location.pathname === item.path 
              ? 'bg-blue-600 text-white font-bold shadow-lg shadow-blue-100' 
              : 'text-gray-500 hover:bg-gray-50 font-semibold'
            }`}
          >
            {item.icon}
            {item.label}
          </Link>
        ))}
      </nav>

      <div className="p-4 mx-4 mb-4 bg-gray-50 rounded-[2rem] border border-gray-100">
        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3 ml-2 text-center">Meu Link Público</p>
        <div className="bg-white p-3 rounded-2xl border border-gray-100 flex items-center justify-between gap-2 overflow-hidden">
          <span className="text-xs font-bold text-gray-400 truncate">/{user.username}</span>
          <button 
            onClick={copyToClipboard}
            className={`p-2 rounded-xl transition-all ${copied ? 'bg-green-500 text-white' : 'bg-blue-600 text-white hover:bg-blue-700'}`}
          >
            {copied ? <Check size={14} /> : <Copy size={14} />}
          </button>
        </div>
      </div>

      <div className="p-4 border-t border-gray-100">
        <div className="flex items-center gap-3 px-4 py-3 mb-4">
          <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold overflow-hidden border-2 border-white shadow-sm">
            {user.name.charAt(0)}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold text-gray-900 truncate">{user.name}</p>
            <p className="text-xs text-gray-400 truncate font-semibold">@{user.username}</p>
          </div>
        </div>
        <button 
          onClick={onLogout}
          className="w-full flex items-center gap-3 px-4 py-3 text-gray-400 font-bold hover:text-red-500 hover:bg-red-50 rounded-2xl transition-all"
        >
          <LogOut size={20} />
          Sair
        </button>
      </div>
    </>
  );

  return (
    <div className="flex min-h-screen bg-gray-50">
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-50 md:hidden backdrop-blur-sm"
          onClick={toggleMobileMenu}
        />
      )}

      <aside className={`fixed inset-y-0 left-0 w-72 bg-white border-r border-gray-200 z-50 transform transition-transform duration-300 md:hidden ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'} flex flex-col`}>
        <SidebarContent />
      </aside>

      <aside className="w-72 bg-white border-r border-gray-200 hidden md:flex flex-col">
        <SidebarContent />
      </aside>

      <main className="flex-1 overflow-y-auto">
        <header className="bg-white/80 backdrop-blur-md border-b border-gray-200 p-4 sticky top-0 z-10 flex justify-between items-center px-4 md:px-8">
          <div className="flex items-center gap-4">
             <button 
               onClick={toggleMobileMenu}
               className="p-2 bg-gray-100 rounded-xl md:hidden text-gray-600"
             >
               <Menu size={20} />
             </button>
             <h2 className="text-xl font-black md:hidden">BioLink</h2>
             <span className="hidden md:block text-xs font-black text-gray-300 uppercase tracking-widest">Painel de Controle / {navItems.find(n => n.path === location.pathname)?.label || 'Visão Geral'}</span>
          </div>
          
          <div className="flex items-center gap-3">
             <a 
              href={publicUrl}
              target="_blank" 
              className="flex items-center gap-2 bg-gray-900 text-white px-4 md:px-5 py-2.5 rounded-xl text-[10px] md:text-xs font-black uppercase tracking-widest transition-all hover:bg-gray-800 shadow-xl shadow-gray-200"
             >
               <span className="hidden sm:inline">Ver Página</span> <ExternalLink size={14} />
             </a>
          </div>
        </header>

        <div className="p-4 md:p-8 max-w-6xl mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default DashboardLayout;
