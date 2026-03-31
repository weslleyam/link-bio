
import React, { useState } from 'react';
import { User } from '../types';
import { db } from '../services/db';
import { User as UserIcon, Mail, Shield, Check, AlertCircle, Lock, Eye, EyeOff, Copy } from 'lucide-react';

interface Props {
  user: User;
  onUpdateUser: (updatedUser: User) => void;
}

const ProfileSettings: React.FC<Props> = ({ user, onUpdateUser }) => {
  const [formData, setFormData] = useState({
    name: user.name,
    email: user.email,
    username: user.username,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [copied, setCopied] = useState(false);

  // Senha armazenada (passwordHash está sendo usado como texto plano na demo conforme solicitado)
  const userPassword = (user as any).passwordHash || 'admin';

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    setErrorMessage('');

    const users = db.getUsers();
    
    const usernameExists = users.find(u => u.username === formData.username && u.id !== user.id);
    if (usernameExists) {
      setStatus('error');
      setErrorMessage('Este nome de usuário já está sendo usado por outra pessoa.');
      return;
    }

    const updatedUser: User = {
      ...user,
      name: formData.name,
      email: formData.email,
      username: formData.username.toLowerCase().replace(/[^a-z0-9_]/g, ''),
    };

    db.saveUser(updatedUser);
    onUpdateUser(updatedUser);
    
    setStatus('success');
    setTimeout(() => setStatus('idle'), 3000);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8 pb-20 text-left">
      <div>
        <h1 className="text-2xl font-black text-gray-900">Configurações de Conta</h1>
        <p className="text-sm text-gray-500 font-medium">Gerencie seus dados pessoais e de acesso.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-8">
          <form onSubmit={handleSave} className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm space-y-6">
            <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
              <UserIcon size={16} /> Dados Pessoais
            </h3>

            {status === 'success' && (
              <div className="flex items-center gap-3 p-4 bg-green-50 border border-green-100 rounded-2xl text-green-700 animate-in fade-in zoom-in duration-300">
                <Check size={20} className="shrink-0" />
                <span className="text-sm font-bold">Perfil atualizado com sucesso!</span>
              </div>
            )}

            {status === 'error' && (
              <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-100 rounded-2xl text-red-700">
                <AlertCircle size={20} className="shrink-0" />
                <span className="text-sm font-bold">{errorMessage}</span>
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">Nome Completo</label>
                <div className="relative">
                  <UserIcon size={18} className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-300" />
                  <input 
                    className="w-full pl-12 pr-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none font-bold focus:ring-2 focus:ring-blue-500"
                    value={formData.name}
                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">E-mail de Acesso</label>
                <div className="relative">
                  <Mail size={18} className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-300" />
                  <input 
                    type="email"
                    className="w-full pl-12 pr-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none font-bold focus:ring-2 focus:ring-blue-500"
                    value={formData.email}
                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">Nome de Usuário (URL)</label>
                <div className="relative">
                  <span className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-300 font-bold">@</span>
                  <input 
                    className="w-full pl-10 pr-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none font-bold text-blue-600 focus:ring-2 focus:ring-blue-500"
                    value={formData.username}
                    onChange={e => setFormData({ ...formData, username: e.target.value.toLowerCase() })}
                    required
                  />
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-gray-50 flex items-center justify-end">
               <button 
                 type="submit"
                 disabled={status === 'loading'}
                 className="px-10 py-4 bg-gray-900 text-white rounded-2xl font-black uppercase tracking-widest text-xs shadow-xl hover:bg-black active:scale-95 transition-all disabled:opacity-50"
               >
                 {status === 'loading' ? 'Salvando...' : 'Salvar Alterações'}
               </button>
            </div>
          </form>
        </div>

        <div className="space-y-6">
          <div className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm space-y-6">
            <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
              <Shield size={16} /> Credenciais de Acesso
            </h3>
            
            <div className="space-y-4">
              <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">E-mail</p>
                <p className="text-sm font-bold text-gray-900 truncate">{user.email}</p>
              </div>

              <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100 relative">
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Senha</p>
                <div className="flex items-center justify-between">
                  <p className="text-sm font-bold text-gray-900 tracking-wider">
                    {showPassword ? userPassword : '••••••••'}
                  </p>
                  <div className="flex gap-1">
                    <button 
                      onClick={() => setShowPassword(!showPassword)}
                      className="p-1.5 text-gray-400 hover:text-blue-600 transition-colors"
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                    <button 
                      onClick={() => copyToClipboard(userPassword)}
                      className={`p-1.5 transition-colors ${copied ? 'text-green-500' : 'text-gray-400 hover:text-blue-600'}`}
                    >
                      {copied ? <Check size={16} /> : <Copy size={16} />}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-4 bg-blue-50 border border-blue-100 rounded-2xl flex items-start gap-3">
              <Lock size={16} className="text-blue-600 shrink-0 mt-0.5" />
              <p className="text-[10px] text-blue-800 font-bold leading-relaxed">
                Esta é a sua senha gerada automaticamente. Recomendamos que você a guarde em um gerenciador de senhas.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileSettings;
