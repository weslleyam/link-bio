
import React, { useState, useEffect } from 'react';
import { User, BioLink, BioPage } from '@/types';
import { db } from '@/services/db';
import { THEMES, FONTS } from '@/constants';
import { Plus, Trash2, GripVertical, ToggleLeft, ToggleRight, MessageCircle, X, Check } from 'lucide-react';

interface Props {
  user: User;
}

const LinksManager: React.FC<Props> = ({ user }) => {
  const [links, setLinks] = useState<BioLink[]>([]);
  const [newLinkTitle, setNewLinkTitle] = useState('');
  const [newLinkUrl, setNewLinkUrl] = useState('');
  const [whatsappPhone, setWhatsappPhone] = useState('');
  const [whatsappMessage, setWhatsappMessage] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [isWhatsappMode, setIsWhatsappMode] = useState(false);

  // Função para obter ou criar a página de forma segura
  const getOrCreatePage = (): BioPage => {
    let page = db.getPageByUsername(user.username);
    if (!page) {
      // Cria uma página padrão caso o usuário tenha ido direto para Links sem passar por Design
      // Fix: Add missing catalog properties to comply with BioPage interface
      const newPage: BioPage = {
        id: `page_${Math.random().toString(36).substr(2, 9)}`,
        userId: user.id,
        title: user.name,
        description: `Bem-vindo ao meu BioLink!`,
        profileImageUrl: `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=random&size=200`,
        themeColor: THEMES[0].color,
        fontFamily: FONTS[0].family,
        isActive: true,
        backgroundType: 'color',
        backgroundColor: '#ffffff',
        backgroundGradient: 'linear-gradient(120deg, #a1c4fd 0%, #c2e9fb 100%)',
        catalogEnabled: false,
        catalogTitle: 'Meu Catálogo',
        catalogCtaText: 'Pedir via WhatsApp',
      };
      db.savePage(newPage);
      return newPage;
    }
    return page;
  };

  const loadLinks = () => {
    const page = db.getPageByUsername(user.username);
    if (page) {
      const storedLinks = db.getLinks(page.id);
      setLinks([...storedLinks]);
    }
  };

  useEffect(() => {
    loadLinks();
  }, [user.username]);

  const resetForm = () => {
    setNewLinkTitle('');
    setNewLinkUrl('');
    setWhatsappPhone('');
    setWhatsappMessage('');
    setIsAdding(false);
    setIsWhatsappMode(false);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    
    // 1. Garante que a página existe antes de prosseguir
    const currentPage = getOrCreatePage();

    let finalUrl = '';
    let finalTitle = newLinkTitle.trim();

    if (isWhatsappMode) {
      const cleanPhone = whatsappPhone.replace(/\D/g, '');
      if (!cleanPhone || cleanPhone.length < 10) {
        alert("Digite um WhatsApp válido (ex: 11999998888)");
        return;
      }
      const encodedMsg = encodeURIComponent(whatsappMessage);
      finalUrl = `https://wa.me/${cleanPhone}${encodedMsg ? `?text=${encodedMsg}` : ''}`;
      if (!finalTitle) finalTitle = 'WhatsApp';
    } else {
      let urlInput = newLinkUrl.trim();
      if (!urlInput) {
        alert("A URL é obrigatória.");
        return;
      }
      if (!urlInput.startsWith('http')) {
        urlInput = `https://${urlInput}`;
      }
      finalUrl = urlInput;
      if (!finalTitle) finalTitle = 'Novo Link';
    }

    const newLinkObj: BioLink = {
      id: `link_${Date.now()}`,
      bioPageId: currentPage.id,
      title: finalTitle,
      url: finalUrl,
      position: links.length,
      clicks: 0,
      isActive: true,
    };

    try {
      db.saveLink(newLinkObj);
      setLinks(prev => [...prev, newLinkObj]);
      resetForm();
    } catch (err) {
      console.error(err);
      alert("Erro ao salvar link.");
    }
  };

  const toggleLinkStatus = (id: string) => {
    const updated = links.map(l => {
      if (l.id === id) {
        const up = { ...l, isActive: !l.isActive };
        db.saveLink(up);
        return up;
      }
      return l;
    });
    setLinks(updated);
  };

  const handleDelete = (id: string) => {
    if (confirm("Excluir este botão?")) {
      db.deleteLink(id);
      setLinks(prev => prev.filter(l => l.id !== id));
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-20 text-left">
      <div className="flex justify-between items-center mb-2">
        <div>
          <h1 className="text-2xl font-black text-gray-900">Meus Links</h1>
          <p className="text-sm text-gray-400 font-medium">Gerencie os botões da sua página pública.</p>
        </div>
        {!isAdding && (
          <button 
            onClick={() => setIsAdding(true)}
            className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-2xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-100"
          >
            <Plus size={20} /> Novo Botão
          </button>
        )}
      </div>

      {isAdding && (
        <div className="bg-white p-8 rounded-[2.5rem] shadow-2xl border border-gray-100 animate-in fade-in slide-in-from-top-2">
          <form onSubmit={handleSave} className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="font-black text-xl text-gray-800">Criar Novo</h3>
              <button type="button" onClick={resetForm} className="text-gray-400 hover:text-red-500">
                <X size={24} />
              </button>
            </div>

            <div className="flex p-1 bg-gray-100 rounded-2xl">
              <button 
                type="button"
                onClick={() => setIsWhatsappMode(false)}
                className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${!isWhatsappMode ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-400'}`}
              >
                Link Comum
              </button>
              <button 
                type="button"
                onClick={() => setIsWhatsappMode(true)}
                className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${isWhatsappMode ? 'bg-white text-green-600 shadow-sm' : 'text-gray-400'}`}
              >
                WhatsApp
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">Título do Botão</label>
                <input 
                  type="text" 
                  autoFocus
                  placeholder="Ex: Meu Portfólio"
                  value={newLinkTitle}
                  onChange={e => setNewLinkTitle(e.target.value)}
                  className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none font-bold focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {isWhatsappMode ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">Número</label>
                    <input 
                      type="tel" 
                      placeholder="11999998888"
                      value={whatsappPhone}
                      onChange={e => setWhatsappPhone(e.target.value)}
                      className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none font-bold"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">Mensagem</label>
                    <input 
                      type="text" 
                      placeholder="Olá!"
                      value={whatsappMessage}
                      onChange={e => setWhatsappMessage(e.target.value)}
                      className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none font-bold"
                    />
                  </div>
                </div>
              ) : (
                <div>
                  <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">URL / Link</label>
                  <input 
                    type="text" 
                    placeholder="www.google.com"
                    value={newLinkUrl}
                    onChange={e => setNewLinkUrl(e.target.value)}
                    className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none font-bold"
                  />
                </div>
              )}
            </div>

            <button 
              type="submit"
              className="w-full py-5 bg-gray-900 text-white rounded-2xl font-black text-sm uppercase tracking-[0.2em] shadow-xl hover:bg-black active:scale-[0.98] transition-all"
            >
              Confirmar e Salvar
            </button>
          </form>
        </div>
      )}

      <div className="space-y-4">
        {links.length > 0 ? (
          links.map((link) => (
            <div key={link.id} className="bg-white p-5 rounded-[2rem] border border-gray-100 flex items-center gap-4 group">
              <div className="text-gray-200"><GripVertical size={20} /></div>
              <div className="flex-1 min-w-0">
                <h4 className={`font-bold text-gray-900 truncate ${!link.isActive && 'opacity-40'}`}>{link.title}</h4>
                <p className="text-[10px] text-gray-400 font-bold truncate">{link.url}</p>
              </div>
              <div className="flex items-center gap-1">
                <button 
                  onClick={() => toggleLinkStatus(link.id)}
                  className={`p-1 transition-all ${link.isActive ? 'text-blue-600' : 'text-gray-200'}`}
                >
                  {link.isActive ? <ToggleRight size={36} /> : <ToggleLeft size={36} />}
                </button>
                <button 
                  onClick={() => handleDelete(link.id)}
                  className="p-3 text-gray-200 hover:text-red-500 transition-colors"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          ))
        ) : (
          !isAdding && (
            <div className="py-20 text-center bg-white rounded-[3rem] border-2 border-dashed border-gray-100">
               <p className="font-bold text-gray-300 uppercase tracking-widest text-xs">Nenhum link criado</p>
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default LinksManager;
