
import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { authService } from '@/services/auth';
import { db } from '@/services/db';
import { Loader2, ShieldCheck, AlertCircle } from 'lucide-react';
import { User } from '@/types';

interface Props {
  onLogin: (user: User, token: string) => void;
}

const MagicLoginHandler: React.FC<Props> = ({ onLogin }) => {
  const [searchParams] = useSearchParams();
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const token = searchParams.get('token');
    if (token) {
      const userId = authService.validateToken(token, 'MAGIC_LOGIN');
      if (userId) {
        const users = db.getUsers();
        const user = users.find((u: any) => u.id === userId);
        if (user) {
          onLogin(user as any, 'mock-jwt-token');
          navigate('/dashboard');
        } else {
          setError('Usuário não encontrado.');
        }
      } else {
        setError('Este link de login expirou ou já foi utilizado.');
      }
    } else {
      setError('Link de login inválido.');
    }
  }, [searchParams]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6 text-center">
      <div className="bg-white w-full max-w-md p-10 rounded-[2.5rem] shadow-xl">
        {!error ? (
          <>
            <Loader2 className="animate-spin text-blue-600 mx-auto mb-6" size={48} />
            <h1 className="text-2xl font-black mb-2">Autenticando...</h1>
            <p className="text-gray-500 font-medium">Validando seu link mágico de acesso.</p>
          </>
        ) : (
          <>
            <AlertCircle size={48} className="text-red-500 mx-auto mb-4" />
            <h1 className="text-2xl font-black mb-2">Falha no Acesso</h1>
            <p className="text-gray-500 mb-8">{error}</p>
            <button onClick={() => navigate('/login')} className="w-full py-4 bg-gray-900 text-white rounded-2xl font-bold">Voltar ao Login</button>
          </>
        )}
      </div>
    </div>
  );
};

export default MagicLoginHandler;
