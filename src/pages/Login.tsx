
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { db } from '@/services/db';
import { authService } from '@/services/auth';
import { User } from '@/types';
import { Mail, Wand2, ArrowLeft } from 'lucide-react';

interface Props {
  onLogin: (user: User, token: string) => void;
}

const Login: React.FC<Props> = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isMagicMode, setIsMagicMode] = useState(false);
  const [magicSent, setMagicSent] = useState(false);
  const navigate = useNavigate();

  const handlePasswordLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const users = db.getUsers();
    // Verifica email e senha (compara com passwordHash salvo)
    const user = users.find(u => 
      u.email.toLowerCase() === email.toLowerCase() && 
      ((u as any).passwordHash === password)
    );
    
    if (user) {
      onLogin(user, 'mock-jwt-token');
      navigate('/dashboard');
    } else {
      setError('Credenciais inválidas. Verifique seu e-mail e senha.');
    }
  };

  const handleMagicRequest = (e: React.FormEvent) => {
    e.preventDefault();
    const users = db.getUsers();
    const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());
    
    if (user) {
      const token = authService.generateToken(user.id, 'MAGIC_LOGIN', 15);
      const link = `${window.location.origin}/#/login-magico?token=${token}`;
      authService.sendMagicEmail(email, link, 'magic');
    }
    setMagicSent(true);
  };

  if (magicSent) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6 text-left">
        <div className="bg-white w-full max-w-md p-10 rounded-[2.5rem] shadow-xl border border-gray-100 text-center">
          <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <Mail size={32} />
          </div>
          <h2 className="text-xl font-black mb-2">E-mail Enviado!</h2>
          <p className="text-gray-500 font-medium mb-8 text-sm">Se o e-mail <b>{email}</b> estiver cadastrado, você receberá um link de acesso em instantes.</p>
          <button onClick={() => setMagicSent(false)} className="w-full py-4 bg-gray-900 text-white rounded-2xl font-bold">
            Entendi
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6 text-left">
      <div className="bg-white w-full max-w-md p-8 rounded-3xl shadow-xl border border-gray-100">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-black bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent inline-block">BioLink</h1>
          <p className="text-gray-500 font-medium mt-2">Acesse seu painel de controle</p>
        </div>

        {!isMagicMode ? (
          <>
            <div className="mb-6 p-4 bg-blue-50 border border-blue-100 rounded-2xl">
              <p className="text-xs font-bold text-blue-600 uppercase tracking-wider mb-1">Acesso de Teste:</p>
              <p className="text-sm text-blue-800">Email: <span className="font-mono font-bold">admin@teste.com</span></p>
              <p className="text-sm text-blue-800">Senha: <span className="font-mono font-bold">admin</span></p>
            </div>

            <form onSubmit={handlePasswordLogin} className="space-y-5">
              {error && <div className="p-3 bg-red-50 text-red-500 text-sm rounded-xl border border-red-100 font-bold">{error}</div>}
              
              <div>
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">Email</label>
                <input 
                  type="email" 
                  required
                  className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition-all font-bold"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="seu@email.com"
                />
              </div>

              <div>
                <div className="flex justify-between items-center mb-2 ml-1">
                  <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest">Senha</label>
                  <button type="button" onClick={() => setIsMagicMode(true)} className="text-[10px] font-black text-blue-600 uppercase tracking-widest hover:underline flex items-center gap-1">
                    <Wand2 size={10} /> Entrar sem senha?
                  </button>
                </div>
                <input 
                  type="password" 
                  required
                  className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition-all font-bold"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                />
              </div>

              <button className="w-full bg-blue-600 text-white py-5 rounded-2xl font-black uppercase tracking-widest shadow-xl shadow-blue-100 hover:bg-blue-700 active:scale-[0.98] transition-all">
                Entrar no Painel
              </button>
            </form>
          </>
        ) : (
          <form onSubmit={handleMagicRequest} className="space-y-5 animate-in fade-in duration-300">
            <button onClick={() => setIsMagicMode(false)} className="flex items-center gap-2 text-gray-400 font-bold text-[10px] uppercase tracking-widest mb-4 hover:text-blue-600 transition-colors">
              <ArrowLeft size={14} /> Voltar para Senha
            </button>
            
            <h2 className="text-xl font-black mb-2">Link Mágico</h2>
            <p className="text-gray-500 font-medium text-sm mb-4">Enviaremos um link de acesso rápido para o seu e-mail.</p>

            <div>
              <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">E-mail Cadastrado</label>
              <input 
                type="email" 
                required
                className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition-all font-bold"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="seu@email.com"
              />
            </div>

            <button className="w-full bg-gray-900 text-white py-5 rounded-2xl font-black uppercase tracking-widest shadow-xl hover:bg-black active:scale-[0.98] transition-all flex items-center justify-center gap-3">
              <Wand2 size={18} /> Receber Link de Acesso
            </button>
          </form>
        )}

        <p className="text-center mt-8 text-sm text-gray-500 font-bold">
          Ainda não tem conta? <Link to="/register" className="text-blue-600 font-bold hover:underline">Cadastre-se grátis</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
