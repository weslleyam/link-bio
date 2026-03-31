
import { User, BioPage, BioLink, Product } from '@/types';

const STORAGE_KEYS = {
  USERS: 'biolink_users',
  PAGES: 'biolink_pages',
  LINKS: 'biolink_links',
  ANALYTICS: 'biolink_analytics',
  PRODUCTS: 'biolink_products'
};

// URL da ponte PHP no seu servidor Hostinger
// Substitua pela URL real após o upload, ex: https://seusite.com.br/db_bridge.php
const BRIDGE_URL = '/db_bridge.php';

async function remoteCall(action: string, method: 'GET' | 'POST' = 'POST', body?: any) {
  try {
    const url = method === 'GET' ? `${BRIDGE_URL}?action=${action}` : `${BRIDGE_URL}?action=${action}`;
    const response = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: body ? JSON.stringify(body) : undefined
    });
    return await response.json();
  } catch (e) {
    console.error(`Erro ao sincronizar com MySQL (${action}):`, e);
    return null;
  }
}

export const db = {
  // Sincroniza todo o banco de dados do MySQL para o LocalStorage ao iniciar
  syncWithServer: async () => {
    const data = await remoteCall('sync_all', 'GET');
    if (data && !data.error) {
      localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(data.users || []));
      localStorage.setItem(STORAGE_KEYS.PAGES, JSON.stringify(data.pages || []));
      localStorage.setItem(STORAGE_KEYS.LINKS, JSON.stringify(data.links || []));
      localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(data.products || []));
      console.log('Sincronização com MySQL Hostinger concluída com sucesso!');
    }
  },

  getUsers: (): User[] => {
    const users = JSON.parse(localStorage.getItem(STORAGE_KEYS.USERS) || '[]');
    const adminExists = users.find((u: any) => u.email === 'admin@teste.com');
    if (!adminExists) {
      const adminUser = {
        id: 'admin-id',
        name: 'Administrador Teste',
        email: 'admin@teste.com',
        username: 'admin',
        passwordHash: 'admin',
        createdAt: new Date().toISOString(),
        status: 'ACTIVE'
      };
      const updatedUsers = [...users, adminUser];
      localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(updatedUsers));
      remoteCall('save_user', 'POST', adminUser);
      return updatedUsers;
    }
    return users;
  },

  saveUser: (user: User) => {
    const users = db.getUsers().filter(u => u.id !== user.id);
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify([...users, user]));
    remoteCall('save_user', 'POST', user);
  },

  findUserByUsername: (username: string) => db.getUsers().find(u => u.username === username),
  
  getPages: (): BioPage[] => JSON.parse(localStorage.getItem(STORAGE_KEYS.PAGES) || '[]'),
  
  getPageByUsername: (username: string) => {
    const user = db.findUserByUsername(username);
    if (!user) return null;
    return db.getPages().find(p => p.userId === user.id);
  },

  savePage: (page: BioPage) => {
    const pages = db.getPages().filter(p => p.id !== page.id);
    localStorage.setItem(STORAGE_KEYS.PAGES, JSON.stringify([...pages, page]));
    remoteCall('save_page', 'POST', page);
  },

  getLinks: (pageId: string): BioLink[] => {
    const links = JSON.parse(localStorage.getItem(STORAGE_KEYS.LINKS) || '[]');
    return links.filter((l: BioLink) => l.bioPageId === pageId).sort((a: any, b: any) => a.position - b.position);
  },

  saveLink: (link: BioLink) => {
    const links = JSON.parse(localStorage.getItem(STORAGE_KEYS.LINKS) || '[]').filter((l: any) => l.id !== link.id);
    localStorage.setItem(STORAGE_KEYS.LINKS, JSON.stringify([...links, link]));
    remoteCall('save_link', 'POST', link);
  },

  deleteLink: (id: string) => {
    const links = JSON.parse(localStorage.getItem(STORAGE_KEYS.LINKS) || '[]').filter((l: any) => l.id !== id);
    localStorage.setItem(STORAGE_KEYS.LINKS, JSON.stringify(links));
    fetch(`${BRIDGE_URL}?action=delete_link&id=${id}`);
  },

  getProducts: (pageId: string): Product[] => {
    const products = JSON.parse(localStorage.getItem(STORAGE_KEYS.PRODUCTS) || '[]');
    return products.filter((p: Product) => p.bioPageId === pageId).sort((a: any, b: any) => a.position - b.position);
  },

  saveProduct: (product: Product) => {
    const allProducts = JSON.parse(localStorage.getItem(STORAGE_KEYS.PRODUCTS) || '[]');
    const filteredProducts = allProducts.filter((p: any) => p.id !== product.id);
    const updatedProducts = [...filteredProducts, product];
    localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(updatedProducts));
    remoteCall('save_product', 'POST', product);
  },

  deleteProduct: (id: string) => {
    const products = JSON.parse(localStorage.getItem(STORAGE_KEYS.PRODUCTS) || '[]').filter((p: any) => p.id !== id);
    localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(products));
    fetch(`${BRIDGE_URL}?action=delete_product&id=${id}`);
  }
};
