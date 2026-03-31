
import { User } from '../types';
import { db } from './db';

// Simulação de Hashing (Em produção usar crypto.createHash('sha256'))
const hashToken = (token: string) => {
  return btoa(token); // Simulação de hash para ambiente client-side demo
};

export const authService = {
  generateToken: (userId: string, type: 'PASSWORD_SETUP' | 'MAGIC_LOGIN', expiresMinutes: number) => {
    const rawToken = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    const expiresAt = new Date();
    expiresAt.setMinutes(expiresAt.getMinutes() + expiresMinutes);

    const tokenData = {
      id: Math.random().toString(36).substr(2, 9),
      userId,
      tokenHash: hashToken(rawToken),
      type,
      expiresAt: expiresAt.toISOString(),
      usedAt: null
    };

    // Salva no localStorage (Simulando AuthToken table do Prisma)
    const tokens = JSON.parse(localStorage.getItem('biolink_auth_tokens') || '[]');
    localStorage.setItem('biolink_auth_tokens', JSON.stringify([...tokens, tokenData]));

    return rawToken;
  },

  validateToken: (rawToken: string, type: 'PASSWORD_SETUP' | 'MAGIC_LOGIN') => {
    const tokens = JSON.parse(localStorage.getItem('biolink_auth_tokens') || '[]');
    const hashed = hashToken(rawToken);
    
    const tokenRecord = tokens.find((t: any) => 
      t.tokenHash === hashed && 
      t.type === type && 
      !t.usedAt && 
      new Date(t.expiresAt) > new Date()
    );

    if (!tokenRecord) return null;

    // Marcar como usado
    const updatedTokens = tokens.map((t: any) => 
      t.id === tokenRecord.id ? { ...t, usedAt: new Date().toISOString() } : t
    );
    localStorage.setItem('biolink_auth_tokens', JSON.stringify(updatedTokens));

    return tokenRecord.userId;
  },

  sendMagicEmail: (email: string, link: string, type: 'setup' | 'magic' | 'credentials', password?: string) => {
    let subject = '';
    if (type === 'setup') subject = 'Defina sua senha no BioLink';
    else if (type === 'magic') subject = 'Seu link de acesso rápido';
    else if (type === 'credentials') subject = 'Sua conta BioLink está pronta!';

    console.log(`--- EMAIL TRANSACIONAL ---`);
    console.log(`Para: ${email}`);
    console.log(`Assunto: ${subject}`);
    if (password) {
      console.log(`E-mail de Login: ${email}`);
      console.log(`Sua Senha: ${password}`);
    }
    console.log(`Link de Acesso: ${link}`);
    console.log(`---------------------------`);
  }
};
