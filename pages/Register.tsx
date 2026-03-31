
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { db } from '../services/db';
import { authService } from '../services/auth';
import { ShieldEllipsis, Copy, Check, Lock } from 'lucide-react';

const Register: React.FC = () => {
  const [formData, setFormData] = useState({ name: '', email: '', username: '' });
  const [error, setError] = useState('');
  const [isSent, setIsSent] = useState(false);
  const [generatedPassword, setGeneratedPassword] = useState('');
  const [copied, setCopied] = useState(false);

  const generateRandomPassword = () => {
    return Math.random().toString(36).slice(-8);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (db.findUserByUsername(formData.username)) {
      setError('Este nome de usuário já está em uso.');
      return;
    }

    const password = generateRandomPassword();
    setGeneratedPassword(password);

    const newUser = {
      id: Math.random().toString(36).substr(2, 9),
      name: formData.name,
      email: formData.email,
      username: formData.username.toLowerCase().replace(/[^a-z0-9_]/g, ''),
      passwordHash: password, 
      createdAt: new Date().toISOString(),
      status: 'ACTIVE'
    };

    db.saveUser(newUser as any);
    
    // Simulação de envio de e-mail com credenciais
    authService.sendMagicEmail(
      newUser.email, 
      `${window.location.origin}/#/login`, 
      'credentials',
      password
    );
    
    setIsSent(true);
  };

  const copyPassword = () => {
    navigator.clipboard.writeText(generatedPassword);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (isSent) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
        <div className="bg-white w-full max-w-md p-10 rounded-[2.5rem] shadow-2xl text-center">
          <div className="w-20 h-20 bg-green-50 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <Check size={40} />
          </div>
          <h2 className="text-2xl font-black text-gray-900 mb-2">Conta Criada!</h2>
          <p className="text-gray-500 font-medium mb-8">
            Seus dados de acesso foram enviados para <b>{formData.email}</b>.
          </p>

          <div className="bg-amber-50 border-2 border-amber-200 rounded-[2rem] p-6 mb-8 text-left relative overflow-hidden">
             <div className="absolute top-0 right-0 p-4 opacity-10">
                <Lock size={60} />
             </div>
             <h3 className="text-amber-800 font-black text-xs uppercase tracking-widest mb-4 flex items-center gap-2">
                <ShieldEllipsis size={16} /> Importante: Guarde sua Senha
             </h3>
             <div className="space-y-3 relative z-10">
                <div>
                   <p className="text-[10px] font-black text-amber-600/60 uppercase">E-mail de Login</p>
                   <p className="font-bold text-gray-900">{formData.email}</p>
                </div>
                <div>
                   <p className="text-[10px] font-black text-amber-600/60 uppercase">Senha Gerada</p>
                   <div className="flex items-center justify-between bg-white/50 p-3 rounded-xl border border-amber-200 mt-1">
                      <code className="font-black text-lg text-amber-900 tracking-wider">{generatedPassword}</code>
                      <button onClick={copyPassword} className="p-2 hover:bg-amber-100 rounded-lg transition-colors text-amber-600">
                         {copied ? <Check size={18} /> : <Copy size={18} />}
                      </button>
                   </div>
                </div>
             </div>
          </div>

          <Link to="/login" className="block w-full bg-gray-900 text-white py-5 rounded-2xl font-black uppercase tracking-widest shadow-xl hover:bg-black transition-all">
            Ir para o Login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <div className="bg-white w-full max-w-md p-8 rounded-[2.5rem] shadow-xl border border-gray-100">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-black bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent inline-block">BioLink</h1>
          <p className="text-gray-400 font-bold mt-2">Crie sua página profissional</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && <div className="p-4 bg-red-50 text-red-500 text-sm font-bold rounded-2xl border border-red-100">{error}</div>}
          
          <div>
            <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">Nome Completo</label>
            <input 
              required
              className="w-full px-5 py-3.5 bg-gray-50 border border-gray-200 rounded-2xl outline-none font-medium"
              value={formData.name}
              onChange={e => setFormData({ ...formData, name: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">E-mail</label>
            <input 
              type="email"
              required
              className="w-full px-5 py-3.5 bg-gray-50 border border-gray-200 rounded-2xl outline-none font-medium"
              value={formData.email}
              onChange={e => setFormData({ ...formData, email: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">URL da Bio</label>
            <div className="relative">
              <span className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-300 font-bold">@</span>
              <input 
                required
                className="w-full pl-10 pr-5 py-3.5 bg-gray-50 border border-gray-200 rounded-2xl outline-none font-bold text-blue-600"
                value={formData.username}
                onChange={e => setFormData({ ...formData, username: e.target.value })}
              />
            </div>
          </div>

          <button className="w-full bg-blue-600 text-white py-4 rounded-2xl font-black shadow-xl hover:bg-blue-700 transition-all">
            Começar Agora
          </button>
        </form>

        <p className="text-center mt-8 text-sm text-gray-400 font-bold">
          Já tem conta? <Link to="/login" className="text-blue-600">Entrar</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
