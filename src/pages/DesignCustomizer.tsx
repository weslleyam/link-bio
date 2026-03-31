
import React, { useState, useEffect, useRef } from 'react';
import { User, BioPage, BioLink } from '@/types';
import { db } from '@/services/db';
import { THEMES, FONTS, BACKGROUND_LIBRARY, PRESET_TEMPLATES } from '@/constants';
import { Check, Image as ImageIcon, Paintbrush, MoveRight, Upload, Camera, Eye, X, Palette, Sparkles, Layout } from 'lucide-react';

interface Props {
  user: User;
}

const GRADIENTS = [
  'linear-gradient(to bottom, #ff9a9e 0%, #fecfef 99%, #fecfef 100%)',
  'linear-gradient(120deg, #a1c4fd 0%, #c2e9fb 100%)',
  'linear-gradient(to top, #cfd9df 0%, #e2ebf0 100%)',
  'linear-gradient(to right, #fa709a 0%, #fee140 100%)',
  'linear-gradient(to top, #30cfd0 0%, #330867 100%)',
  'linear-gradient(to bottom, #000000 0%, #434343 100%)',
];

const DesignCustomizer: React.FC<Props> = ({ user }) => {
  const [page, setPage] = useState<BioPage | null>(null);
  const [links, setLinks] = useState<BioLink[]>([]);
  const [showMobilePreview, setShowMobilePreview] = useState(false);
  const [bgTab, setBgTab] = useState<'upload' | 'library'>('library');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const profileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const existing = db.getPageByUsername(user.username);
    if (existing) {
      setPage({
        ...existing,
        backgroundType: existing.backgroundType || 'color',
        backgroundColor: existing.backgroundColor || '#ffffff',
        backgroundGradient: existing.backgroundGradient || GRADIENTS[0],
      } as BioPage);
      setLinks(db.getLinks(existing.id).filter(l => l.isActive));
    } else {
      const newPage: BioPage = {
        id: Math.random().toString(36).substr(2, 9),
        userId: user.id,
        title: user.name,
        description: `Bem-vindo ao meu perfil!`,
        profileImageUrl: `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=random&size=200`,
        themeColor: THEMES[0].color,
        fontFamily: FONTS[0].family,
        isActive: true,
        backgroundType: 'color',
        backgroundColor: '#ffffff',
        backgroundGradient: GRADIENTS[0],
        catalogEnabled: false,
        catalogTitle: 'Meu Catálogo',
        catalogCtaText: 'Pedir via WhatsApp',
      };
      db.savePage(newPage);
      setPage(newPage);
      setLinks([]);
    }
  }, [user]);

  const updatePage = (updates: Partial<BioPage>) => {
    if (!page) return;
    const updated = { ...page, ...updates };
    setPage(updated);
    db.savePage(updated);
  };

  const applyPreset = (preset: typeof PRESET_TEMPLATES[0]) => {
    updatePage({
      themeColor: preset.themeColor,
      backgroundType: preset.backgroundType as any,
      backgroundImageUrl: preset.backgroundImageUrl,
      backgroundColor: preset.backgroundColor,
      backgroundGradient: preset.backgroundGradient,
    });
  };

  const handleProfileImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 1024 * 1024 * 2) {
        alert("A imagem deve ter no máximo 2MB.");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        updatePage({ profileImageUrl: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleBgImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        updatePage({ 
          backgroundImageUrl: reader.result as string,
          backgroundType: 'image'
        });
      };
      reader.readAsDataURL(file);
    }
  };

  if (!page) return null;

  const getBackgroundStyle = () => {
    if (page.backgroundType === 'color') return { backgroundColor: page.backgroundColor };
    if (page.backgroundType === 'gradient') return { backgroundImage: page.backgroundGradient };
    if (page.backgroundType === 'image') return { 
      backgroundImage: `url(${page.backgroundImageUrl})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center'
    };
    return { backgroundColor: '#ffffff' };
  };

  const PreviewMockup = () => (
    <div className="mx-auto w-[310px] h-[620px] border-[10px] border-gray-900 rounded-[3rem] shadow-2xl overflow-hidden relative bg-white">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-28 h-6 bg-gray-900 rounded-b-[1.25rem] z-20"></div>
      <div 
        className="w-full h-full overflow-y-auto pt-14 p-5 flex flex-col items-center transition-all duration-700"
        style={{ 
          fontFamily: page.fontFamily,
          ...getBackgroundStyle()
        }}
      >
         <div className="w-20 h-20 rounded-full border-4 border-white shadow-xl mb-4 overflow-hidden">
            <img src={page.profileImageUrl} className="w-full h-full object-cover" />
         </div>
         <h2 className={`font-black text-lg mb-1 text-center leading-tight ${page.backgroundColor === '#000000' || page.backgroundType === 'image' ? 'text-white drop-shadow-md' : 'text-gray-900'}`}>{page.title || user.name}</h2>
         <p className={`text-[10px] text-center mb-6 px-4 leading-relaxed font-semibold ${page.backgroundColor === '#000000' || page.backgroundType === 'image' ? 'text-gray-200 drop-shadow-sm' : 'text-gray-500'}`}>{page.description}</p>
         <div className="w-full space-y-3 px-1">
           {links.length > 0 ? (
             links.map(link => (
               <div 
                key={link.id} 
                className="w-full py-3 px-4 rounded-xl text-center text-xs font-black text-white shadow-md flex items-center justify-center min-h-[48px]"
                style={{ backgroundColor: page.themeColor }}
               >
                 {link.title}
               </div>
             ))
           ) : (
             <div className="w-full p-8 border-2 border-dashed border-gray-200/40 rounded-[1.5rem] text-center text-[10px] text-gray-400/60 font-black uppercase tracking-widest backdrop-blur-sm bg-white/10">
                Lista Vazia
             </div>
           )}
         </div>
         <div className="mt-auto pt-8 pb-4">
            <div className="px-3 py-1.5 bg-black/10 backdrop-blur-md rounded-full border border-white/10 text-[8px] font-black text-white/60 uppercase tracking-widest">
              BioLink Preview
            </div>
         </div>
      </div>
    </div>
  );

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 relative">
      <div className="space-y-8 pb-24 text-left">
        <div>
          <h1 className="text-2xl font-black text-gray-900">Personalizar Design</h1>
          <p className="text-gray-500 font-medium">Deixe a página com a sua cara.</p>
        </div>

        {/* Templates Rápidos */}
        <section className="bg-white p-6 md:p-8 rounded-[2rem] shadow-sm border border-gray-100 space-y-6">
          <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
            <Sparkles size={16} /> Temas Prontos
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 max-h-[250px] overflow-y-auto pr-2 scrollbar-hide">
             {PRESET_TEMPLATES.map(preset => (
               <button 
                 key={preset.id}
                 onClick={() => applyPreset(preset)}
                 className="group relative h-20 rounded-2xl overflow-hidden border-2 border-gray-100 hover:border-blue-500 transition-all shadow-sm flex flex-col items-center justify-center"
               >
                  {preset.backgroundType === 'image' ? (
                    <img src={preset.backgroundImageUrl} className="absolute inset-0 w-full h-full object-cover opacity-30 group-hover:opacity-60" />
                  ) : preset.backgroundType === 'gradient' ? (
                    <div className="absolute inset-0 w-full h-full opacity-30 group-hover:opacity-60" style={{ backgroundImage: preset.backgroundGradient }}></div>
                  ) : (
                    <div className="absolute inset-0 w-full h-full opacity-30 group-hover:opacity-60" style={{ backgroundColor: preset.backgroundColor }}></div>
                  )}
                  <div className="relative z-10 w-4 h-4 rounded-full mb-1 border border-white" style={{ backgroundColor: preset.themeColor }}></div>
                  <span className="relative z-10 text-[10px] font-black uppercase text-gray-900 bg-white/50 px-1 rounded">{preset.label}</span>
               </button>
             ))}
          </div>
        </section>

        {/* Informações Básicas */}
        <section className="bg-white p-6 md:p-8 rounded-[2rem] shadow-sm border border-gray-100 space-y-8">
          <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
            <Camera size={16} /> Perfil e Foto
          </h3>
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="relative group">
              <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-gray-50 shadow-xl">
                <img src={page.profileImageUrl} className="w-full h-full object-cover" alt="Profile" />
              </div>
              <button onClick={() => profileInputRef.current?.click()} className="absolute bottom-0 right-0 bg-blue-600 text-white p-2.5 rounded-full shadow-xl hover:scale-110 transition-all">
                <Upload size={14} />
              </button>
              <input type="file" ref={profileInputRef} className="hidden" accept="image/*" onChange={handleProfileImageUpload} />
            </div>
            <div className="flex-1 w-full space-y-4">
              <div>
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">Título</label>
                <input className="w-full px-6 py-3.5 bg-gray-50 border border-gray-100 rounded-2xl outline-none text-sm font-bold focus:ring-2 focus:ring-blue-500" value={page.title} onChange={(e) => updatePage({ title: e.target.value })} />
              </div>
              <div>
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">Bio</label>
                <textarea className="w-full px-6 py-3.5 bg-gray-50 border border-gray-100 rounded-2xl outline-none text-sm font-medium focus:ring-2 focus:ring-blue-500 h-20 resize-none" value={page.description} onChange={(e) => updatePage({ description: e.target.value })} />
              </div>
            </div>
          </div>
        </section>

        {/* Background Selector */}
        <section className="bg-white p-6 md:p-8 rounded-[2rem] shadow-sm border border-gray-100 space-y-6">
          <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest">Fundo da Página</h3>
          <div className="flex bg-gray-100 p-1.5 rounded-2xl">
            {(['color', 'gradient', 'image'] as const).map((type) => (
              <button key={type} onClick={() => updatePage({ backgroundType: type })} className={`flex-1 py-3 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all ${page.backgroundType === type ? 'bg-white shadow-md text-blue-600' : 'text-gray-400'}`}>
                {type === 'color' ? 'Cor' : type === 'gradient' ? 'Gradiente' : 'Foto'}
              </button>
            ))}
          </div>
          <div className="pt-2">
            {page.backgroundType === 'color' && (
              <div className="space-y-4">
                <div className="grid grid-cols-5 md:grid-cols-8 gap-3">
                  {['#ffffff', '#f8fafc', '#000000', '#ef4444', '#3b82f6', '#10b981', '#f59e0b', '#8b5cf6'].map(color => (
                    <button key={color} onClick={() => updatePage({ backgroundColor: color })} className="aspect-square rounded-xl border-2 border-gray-50 shadow-sm flex items-center justify-center" style={{ backgroundColor: color }}>
                      {page.backgroundColor === color && <Check size={16} className={color === '#ffffff' || color === '#f8fafc' ? 'text-black' : 'text-white'} />}
                    </button>
                  ))}
                  <label className="aspect-square rounded-xl border-2 border-gray-100 shadow-sm flex items-center justify-center cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors relative">
                     <Palette size={18} className="text-gray-400" />
                     <input 
                      type="color" 
                      className="absolute inset-0 opacity-0 cursor-pointer" 
                      value={page.backgroundColor} 
                      onChange={(e) => updatePage({ backgroundColor: e.target.value })} 
                     />
                  </label>
                </div>
                <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-xl border border-gray-100">
                   <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Cor Selecionada:</span>
                   <code className="text-xs font-bold text-gray-900">{page.backgroundColor}</code>
                </div>
              </div>
            )}
            {page.backgroundType === 'gradient' && (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {GRADIENTS.map((grad, i) => (
                  <button key={i} onClick={() => updatePage({ backgroundGradient: grad })} className="h-14 rounded-xl border-2 border-gray-100 shadow-sm transition-transform hover:scale-105" style={{ backgroundImage: grad }}>
                    {page.backgroundGradient === grad && <Check size={16} className="text-white mx-auto" />}
                  </button>
                ))}
              </div>
            )}
            {page.backgroundType === 'image' && (
              <div className="space-y-6">
                <div className="flex bg-gray-50 p-1 rounded-xl border border-gray-100">
                   <button onClick={() => setBgTab('library')} className={`flex-1 py-2 text-[9px] font-black uppercase tracking-wider rounded-lg transition-all ${bgTab === 'library' ? 'bg-white shadow-sm text-blue-600' : 'text-gray-400'}`}>Galeria</button>
                   <button onClick={() => setBgTab('upload')} className={`flex-1 py-2 text-[9px] font-black uppercase tracking-wider rounded-lg transition-all ${bgTab === 'upload' ? 'bg-white shadow-sm text-blue-600' : 'text-gray-400'}`}>Upload</button>
                </div>

                {bgTab === 'upload' ? (
                  <div className="space-y-4">
                    <button onClick={() => fileInputRef.current?.click()} className="w-full py-8 border-4 border-dashed border-gray-100 rounded-[1.5rem] flex flex-col items-center justify-center text-gray-300 bg-gray-50/50 hover:bg-gray-50 transition-colors">
                      {page.backgroundImageUrl && !BACKGROUND_LIBRARY.some(cat => cat.images.some(img => img.url === page.backgroundImageUrl)) ? (
                        <img src={page.backgroundImageUrl} className="h-20 w-32 object-cover rounded-xl shadow-lg" />
                      ) : (
                        <><Upload size={24} className="mb-2" /><span className="text-[10px] font-black uppercase tracking-widest">Enviar Foto</span></>
                      )}
                    </button>
                    <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleBgImageUpload} />
                  </div>
                ) : (
                  <div className="space-y-8 max-h-[450px] overflow-y-auto pr-2 scrollbar-hide">
                    {BACKGROUND_LIBRARY.map((cat) => (
                      <div key={cat.category} className="space-y-3">
                         <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2 sticky top-0 bg-white py-1 z-10">
                           <Layout size={12} /> {cat.category}
                         </h4>
                         <div className="grid grid-cols-3 gap-3">
                            {cat.images.map(img => (
                              <button 
                                key={img.id}
                                onClick={() => updatePage({ backgroundImageUrl: img.url, backgroundType: 'image' })}
                                className="relative aspect-[3/4] rounded-xl overflow-hidden border-2 transition-all hover:scale-105 group"
                                style={{ borderColor: page.backgroundImageUrl === img.url ? '#3b82f6' : '#f1f5f9' }}
                              >
                                 <img src={img.url} className="w-full h-full object-cover" loading="lazy" />
                                 {page.backgroundImageUrl === img.url && (
                                   <div className="absolute inset-0 bg-blue-600/40 flex items-center justify-center">
                                      <Check size={20} className="text-white" />
                                   </div>
                                 )}
                                 <div className="absolute bottom-0 left-0 right-0 p-1.5 bg-black/40 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity">
                                    <span className="text-[8px] font-black text-white uppercase">{img.label}</span>
                                 </div>
                              </button>
                            ))}
                         </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </section>

        {/* Cores */}
        <section className="bg-white p-6 md:p-8 rounded-[2rem] shadow-sm border border-gray-100 space-y-6">
          <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
             <Palette size={16} /> Cor dos Botões
          </h3>
          <div className="grid grid-cols-6 gap-4">
            {THEMES.map(theme => (
              <button key={theme.id} onClick={() => updatePage({ themeColor: theme.color })} className="aspect-square rounded-full border-4 border-white shadow-lg flex items-center justify-center transition-all hover:scale-110" style={{ backgroundColor: theme.color }}>
                {page.themeColor === theme.color && <Check size={18} className="text-white" />}
              </button>
            ))}
            <label className="aspect-square rounded-full border-4 border-white shadow-lg flex items-center justify-center cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors relative">
               <Palette size={20} className="text-gray-400" />
               <input 
                type="color" 
                className="absolute inset-0 opacity-0 cursor-pointer" 
                value={page.themeColor} 
                onChange={(e) => updatePage({ themeColor: e.target.value })} 
               />
            </label>
          </div>
        </section>
      </div>

      {/* Botão Flutuante Mobile */}
      <button 
        onClick={() => setShowMobilePreview(true)}
        className="lg:hidden fixed bottom-6 right-6 z-40 bg-gray-900 text-white p-4 rounded-full shadow-2xl flex items-center gap-2 font-black text-xs uppercase tracking-widest animate-bounce"
      >
        <Eye size={18} /> Preview
      </button>

      {/* Modal Preview Mobile */}
      {showMobilePreview && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex flex-col items-center justify-center p-4 lg:hidden">
          <button onClick={() => setShowMobilePreview(false)} className="absolute top-6 right-6 text-white p-2 bg-white/10 rounded-full hover:bg-white/20 transition-all">
            <X size={24} />
          </button>
          <div className="scale-90 sm:scale-100">
            <PreviewMockup />
          </div>
          <p className="text-white/40 text-[10px] font-black uppercase tracking-widest mt-6">Toque no X para fechar</p>
        </div>
      )}

      {/* Desktop View Sidebar */}
      <div className="sticky top-24 h-fit hidden lg:block">
        <p className="text-center text-[10px] font-black text-gray-300 uppercase tracking-[0.3em] mb-6">Visualização Desktop</p>
        <PreviewMockup />
      </div>
    </div>
  );
};

export default DesignCustomizer;
