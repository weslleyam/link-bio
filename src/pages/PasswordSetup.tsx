
import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { authService } from '@/services/auth';
import { db } from '@/services/db';
import { ShieldCheck, Lock, Eye, EyeOff, AlertTriangle } from 'lucide-react';

const PasswordSetup: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState('');
  const [userId, setUserId] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = searchParams.get('token');
    if (token) {
      const uid = authService.validateToken(token, 'PASSWORD_SETUP');
      if (uid) setUserId(uid);
      else setError('Este link expirou ou é inválido.');
    } else {
      setError('Token não fornecido.');
    }
  }, [searchParams]);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 6) return setError('A senha deve ter no mínimo 6 caracteres.');
    if (password !== confirmPassword) return setError('As senhas não coincidem.');

    const users = db.getUsers();
    const updatedUsers = users.map((u: any) => 
      u.id === userId ? { ...u, passwordHash: password, status: 'ACTIVE' } : u
    );
    localStorage.setItem('biolink_users', JSON.stringify(updatedUsers));
    
    alert('Senha definida com sucesso! Agora você pode entrar.');
    navigate('/login');
  };

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
        <div className="bg-white w-full max-w-md p-10 rounded-[2.5rem] shadow-xl text-center">
          <AlertTriangle size={48} className="text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-black text-gray-900 mb-2">Ops! Link Inválido</h2>
          <p className="text-gray-500 mb-8">{error}</p>
          <button onClick={() => navigate('/login')} className="w-full py-4 bg-gray-900 text-white rounded-2xl font-bold">Voltar ao Login</button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6 text-left">
      <div className="bg-white w-full max-w-md p-8 rounded-[2.5rem] shadow-xl">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl"><ShieldCheck /></div>
          <div>
            <h1 className="text-xl font-black">Definir Senha</h1>
            <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">Proteja sua conta BioLink</p>
          </div>
        </div>

        <form onSubmit={handleSave} className="space-y-4">
          <div className="relative">
            <label className="block text-[10px] font-black text-gray-400 uppercase mb-2 ml-1">Nova Senha</label>
            <input 
              type={showPass ? "text" : "password"}
              required
              className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none font-bold"
              value={password}
              onChange={e => setPassword(e.target.value)}
            />
            <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-5 top-11 text-gray-300">
              {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          <div>
            <label className="block text-[10px] font-black text-gray-400 uppercase mb-2 ml-1">Confirmar Senha</label>
            <input 
              type="password"
              required
              className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none font-bold"
              value={confirmPassword}
              onChange={e => setConfirmPassword(e.target.value)}
            />
          </div>

          <button className="w-full py-5 bg-blue-600 text-white rounded-2xl font-black uppercase tracking-widest shadow-xl shadow-blue-100 hover:bg-blue-700 transition-all">
            Salvar e Continuar
          </button>
        </form>
      </div>
    </div>
  );
};

export default PasswordSetup;
