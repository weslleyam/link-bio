
import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { db } from '@/services/db';
import { BioPage, BioLink, Product } from '@/types';
import { AlertCircle, ArrowRight, ShoppingBag, MessageCircle, ArrowLeft } from 'lucide-react';

const PublicBio: React.FC = () => {
  const { username } = useParams<{ username: string }>();
  const [page, setPage] = useState<BioPage | null>(null);
  const [links, setLinks] = useState<BioLink[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [notFound, setNotFound] = useState(false);
  const [view, setView] = useState<'main' | 'catalog'>('main');

  useEffect(() => {
    if (username) {
      const p = db.getPageByUsername(username);
      if (p) {
        setPage(p);
        setLinks(db.getLinks(p.id).filter(l => l.isActive));
        setProducts(db.getProducts(p.id).filter(prod => prod.isActive));
      } else {
        setNotFound(true);
      }
    }
  }, [username]);

  const handleLinkClick = (link: BioLink) => {
    const updatedLink = { ...link, clicks: link.clicks + 1 };
    db.saveLink(updatedLink);
  };

  const generateWhatsAppLink = (productName: string) => {
    if (!page?.catalogWhatsApp) return '#';
    const cleanPhone = page.catalogWhatsApp.replace(/\D/g, '');
    const message = encodeURIComponent(`Olá! Vi no seu BioLink e gostaria de mais informações sobre: ${productName}`);
    return `https://wa.me/${cleanPhone}?text=${message}`;
  };

  if (notFound) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6 text-center">
        <AlertCircle size={64} className="text-gray-300 mb-4" />
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Página não encontrada</h1>
        <p className="text-gray-500 mb-6 max-w-sm">O perfil @{username} ainda não foi criado ou está desativado.</p>
        <Link to="/register" className="bg-blue-600 text-white px-8 py-3 rounded-2xl font-bold shadow-lg hover:shadow-xl transition-all">
          Criar minha página grátis
        </Link>
      </div>
    );
  }

  if (!page) return null;

  const getBackgroundStyle = () => {
    if (page.backgroundType === 'color') return { backgroundColor: page.backgroundColor };
    if (page.backgroundType === 'gradient') return { backgroundImage: page.backgroundGradient };
    if (page.backgroundType === 'image') return { 
      backgroundImage: `url(${page.backgroundImageUrl})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundAttachment: 'fixed'
    };
    return { backgroundColor: '#ffffff' };
  };

  const isDarkBackground = (page.backgroundType === 'color' && page.backgroundColor === '#000000') || (page.backgroundType === 'image');

  if (view === 'catalog') {
    return (
      <div 
        className="min-h-screen flex flex-col items-center pt-8 pb-24 px-6 transition-all duration-500"
        style={{ fontFamily: page.fontFamily, ...getBackgroundStyle() }}
      >
        <div className="max-w-xl w-full">
          <button 
            onClick={() => setView('main')}
            className={`flex items-center gap-2 mb-8 px-4 py-2 rounded-full backdrop-blur-md border transition-all ${isDarkBackground ? 'bg-white/10 border-white/20 text-white hover:bg-white/20' : 'bg-black/5 border-black/10 text-gray-900 hover:bg-black/10'}`}
          >
            <ArrowLeft size={18} />
            <span className="text-sm font-bold">Voltar</span>
          </button>

          <div className="flex items-center gap-3 mb-8">
            <div className="p-3 bg-white rounded-2xl shadow-lg text-blue-600">
              <ShoppingBag size={24} />
            </div>
            <div>
              <h2 className={`text-2xl font-black ${isDarkBackground ? 'text-white' : 'text-gray-900'}`}>
                {page.catalogTitle || 'Produtos e Serviços'}
              </h2>
              <p className={`text-xs font-bold uppercase tracking-widest ${isDarkBackground ? 'text-gray-400' : 'text-gray-500'}`}>
                {products.length} itens disponíveis
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {products.map((product) => (
              <a 
                key={product.id}
                href={generateWhatsAppLink(product.name)}
                target="_blank"
                className="bg-white rounded-[1.5rem] overflow-hidden shadow-lg flex flex-col group active:scale-95 transition-all"
              >
                <div className="aspect-square relative overflow-hidden">
                  <img src={product.imageUrl} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                  {product.promoPrice && (
                    <div className="absolute top-2 left-2 bg-green-500 text-white text-[10px] font-black px-2 py-1 rounded-full uppercase">Oferta</div>
                  )}
                </div>
                <div className="p-4 flex-1 flex flex-col">
                  <h4 className="text-gray-900 font-bold text-sm leading-tight mb-2 line-clamp-2">{product.name}</h4>
                  <div className="mt-auto">
                    {product.promoPrice ? (
                      <div className="flex flex-col">
                        <span className="text-green-600 font-black text-base">R$ {product.promoPrice.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                        <span className="text-gray-300 font-bold text-[10px] line-through">R$ {product.price.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                      </div>
                    ) : (
                      <span className="text-gray-900 font-black text-base">R$ {product.price.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                    )}
                  </div>
                  <div className="mt-3 py-2 bg-gray-900 rounded-xl flex items-center justify-center gap-2 text-[10px] text-white font-black uppercase tracking-wider group-hover:bg-blue-600 transition-colors">
                    <MessageCircle size={12} />
                    {page.catalogCtaText || 'Pedir'}
                  </div>
                </div>
              </a>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div 
      className="min-h-screen flex flex-col items-center pt-16 pb-24 px-6 transition-all duration-700"
      style={{ 
        fontFamily: page.fontFamily,
        ...getBackgroundStyle()
      }}
    >
      <div className="max-w-xl w-full flex flex-col items-center">
        <div className="relative mb-6">
          <div className="absolute inset-0 rounded-full blur-3xl opacity-30" style={{ backgroundColor: page.themeColor }}></div>
          <img 
            src={page.profileImageUrl} 
            className="w-28 h-28 rounded-full border-4 border-white shadow-2xl relative z-10 object-cover" 
            alt={page.title}
          />
        </div>
        
        <h1 className={`text-2xl font-black mb-2 tracking-tight ${isDarkBackground ? 'text-white' : 'text-gray-900'}`}>
          {page.title}
        </h1>
        
        <p className={`text-center mb-8 max-w-sm leading-relaxed font-medium ${isDarkBackground ? 'text-gray-300' : 'text-gray-500'}`}>
          {page.description}
        </p>

        <div className="w-full space-y-4">
          {page.catalogEnabled && products.length > 0 && (
            <button
              onClick={() => setView('catalog')}
              className="group w-full p-5 rounded-2xl shadow-xl flex items-center justify-between transition-all hover:scale-[1.03] active:scale-95 bg-white mb-6 border-2"
              style={{ borderColor: page.themeColor }}
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white shadow-lg" style={{ backgroundColor: page.themeColor }}>
                  <ShoppingBag size={20} />
                </div>
                <div className="text-left">
                  <span className="block text-base font-black text-gray-900 leading-none">
                    Produtos e Serviços
                  </span>
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                    Veja nossa vitrine completa
                  </span>
                </div>
              </div>
              <div className="w-8 h-8 rounded-full flex items-center justify-center bg-gray-100 group-hover:bg-gray-200 transition-colors">
                <ArrowRight size={16} className="text-gray-400" />
              </div>
            </button>
          )}

          <div className="flex items-center gap-2 mb-2 px-2">
             <h3 className={`text-[10px] font-black uppercase tracking-[0.2em] ${isDarkBackground ? 'text-gray-400' : 'text-gray-400'}`}>
                Links Úteis
             </h3>
          </div>
          
          {links.map((link) => (
            <a
              key={link.id}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => handleLinkClick(link)}
              className="group w-full p-5 rounded-2xl shadow-lg flex items-center justify-between transition-all hover:scale-[1.03] active:scale-95 text-white"
              style={{ backgroundColor: page.themeColor }}
            >
              <span className="w-6"></span>
              <span className="text-base font-bold tracking-wide">
                {link.title}
              </span>
              <div className="w-8 h-8 rounded-full flex items-center justify-center bg-white/20 group-hover:bg-white/40 transition-colors">
                <ArrowRight size={16} />
              </div>
            </a>
          ))}
        </div>

        <footer className="mt-24">
          <Link to="/register" className="flex items-center gap-2 px-5 py-2.5 bg-white/10 backdrop-blur-md rounded-full border border-white/20 shadow-xl text-xs font-bold text-gray-800 hover:bg-white/20 transition-all">
            <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
            Crie seu BioLink grátis
          </Link>
        </footer>
      </div>
    </div>
  );
};

export default PublicBio;
