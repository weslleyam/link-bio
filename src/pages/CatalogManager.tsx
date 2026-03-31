
// Fix: Added missing React imports for hooks (useState, useEffect, useRef) and React namespace
import React, { useState, useEffect, useRef } from 'react';
import { User, Product, BioPage } from '@/types';
import { db } from '@/services/db';
import { Plus, Trash2, ShoppingBag, X, Upload, MessageSquare } from 'lucide-react';

interface Props {
  user: User;
}

const CatalogManager: React.FC<Props> = ({ user }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [page, setPage] = useState<BioPage | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    promoPrice: '',
    imageUrl: ''
  });

  const loadProducts = () => {
    const p = db.getPageByUsername(user.username);
    if (p) {
      setPage(p);
      const items = db.getProducts(p.id);
      setProducts([...items]);
    }
  };

  useEffect(() => {
    loadProducts();
  }, [user]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, imageUrl: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!page) return;

    // Converter valores para número tratando a vírgula brasileira
    const rawPrice = formData.price.replace(/\./g, '').replace(',', '.');
    const rawPromo = formData.promoPrice.replace(/\./g, '').replace(',', '.');

    const newProduct: Product = {
      id: `prod_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
      bioPageId: page.id,
      name: formData.name,
      description: formData.description,
      price: parseFloat(rawPrice) || 0,
      promoPrice: rawPromo ? parseFloat(rawPromo) : undefined,
      imageUrl: formData.imageUrl || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=400&auto=format&fit=crop',
      isActive: true,
      position: products.length
    };

    db.saveProduct(newProduct);
    
    // Reset e Recarregar lista completa
    setIsAdding(false);
    setFormData({ name: '', description: '', price: '', promoPrice: '', imageUrl: '' });
    loadProducts();
  };

  const handleDelete = (id: string) => {
    if (confirm("Remover este produto do catálogo?")) {
      db.deleteProduct(id);
      loadProducts();
    }
  };

  const updatePageConfig = (updates: Partial<BioPage>) => {
    if (!page) return;
    const updated = { ...page, ...updates };
    setPage(updated);
    db.savePage(updated);
  };

  if (!page) return null;

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-20 text-left">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-black text-gray-900">Catálogo de Produtos</h1>
          <p className="text-sm text-gray-500 font-medium">Transforme sua bio em uma vitrine de vendas.</p>
        </div>
        <button 
          onClick={() => setIsAdding(true)}
          className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-2xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-100"
        >
          <Plus size={20} /> Novo Produto
        </button>
      </div>

      <section className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm space-y-6">
        <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
          <MessageSquare size={16} /> Configurações de Venda
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">WhatsApp para Vendas</label>
            <input 
              className="w-full px-6 py-3.5 bg-gray-50 border border-gray-100 rounded-2xl outline-none font-bold focus:ring-2 focus:ring-green-500"
              placeholder="Ex: 5511999998888"
              value={page.catalogWhatsApp || ''}
              onChange={(e) => updatePageConfig({ catalogWhatsApp: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">Texto do Botão (CTA)</label>
            <input 
              className="w-full px-6 py-3.5 bg-gray-50 border border-gray-100 rounded-2xl outline-none font-bold focus:ring-2 focus:ring-blue-500"
              placeholder="Ex: Comprar no WhatsApp"
              value={page.catalogCtaText || ''}
              onChange={(e) => updatePageConfig({ catalogCtaText: e.target.value })}
            />
          </div>
        </div>
        <div className="flex items-center gap-3 p-4 bg-blue-50 rounded-2xl border border-blue-100">
           <div className={`w-12 h-6 rounded-full relative transition-all cursor-pointer ${page.catalogEnabled ? 'bg-blue-600' : 'bg-gray-300'}`} onClick={() => updatePageConfig({ catalogEnabled: !page.catalogEnabled })}>
              <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${page.catalogEnabled ? 'left-7' : 'left-1'}`}></div>
           </div>
           <span className="text-sm font-bold text-blue-900">Exibir catálogo na página pública</span>
        </div>
      </section>

      {isAdding && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-lg rounded-[2.5rem] p-8 shadow-2xl animate-in zoom-in duration-300 relative">
            <button onClick={() => setIsAdding(false)} className="absolute top-6 right-6 text-gray-400 hover:text-red-500"><X size={24} /></button>
            <h3 className="text-xl font-black mb-6">Adicionar Item</h3>
            <form onSubmit={handleSaveProduct} className="space-y-4 text-left">
              <div className="flex justify-center mb-4">
                <button 
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="w-32 h-32 rounded-3xl border-2 border-dashed border-gray-200 flex flex-col items-center justify-center overflow-hidden hover:border-blue-400 transition-all bg-gray-50"
                >
                  {formData.imageUrl ? (
                    <img src={formData.imageUrl} className="w-full h-full object-cover" />
                  ) : (
                    <><Upload size={24} className="text-gray-300 mb-1" /><span className="text-[10px] font-bold text-gray-400 uppercase">Foto do Produto</span></>
                  )}
                </button>
                <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleImageUpload} />
              </div>
              <div>
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">Nome do Produto</label>
                <input 
                  placeholder="Ex: Consultoria VIP" 
                  className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none font-bold"
                  value={formData.name}
                  onChange={e => setFormData({...formData, name: e.target.value})}
                  required
                />
              </div>
              <div>
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">Descrição</label>
                <textarea 
                  placeholder="Detalhes do que você está oferecendo" 
                  className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none font-medium h-24 resize-none"
                  value={formData.description}
                  onChange={e => setFormData({...formData, description: e.target.value})}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="relative">
                  <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">Preço (R$)</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold text-sm">R$</span>
                    <input 
                      type="text" placeholder="0,00" 
                      className="w-full pl-12 pr-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none font-bold"
                      value={formData.price}
                      onChange={e => setFormData({...formData, price: e.target.value})}
                      required
                    />
                  </div>
                </div>
                <div className="relative">
                  <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">Promo (R$)</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-green-600/50 font-bold text-sm">R$</span>
                    <input 
                      type="text" placeholder="Opcional" 
                      className="w-full pl-12 pr-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none font-bold text-green-600"
                      value={formData.promoPrice}
                      onChange={e => setFormData({...formData, promoPrice: e.target.value})}
                    />
                  </div>
                </div>
              </div>
              <button className="w-full py-5 bg-gray-900 text-white rounded-2xl font-black uppercase tracking-widest shadow-xl mt-4 hover:bg-black transition-all">
                Salvar Produto
              </button>
            </form>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {products.map((product) => (
          <div key={product.id} className="bg-white p-4 rounded-[2rem] border border-gray-100 shadow-sm flex gap-4 group hover:shadow-md transition-all">
            <div className="w-24 h-24 rounded-2xl overflow-hidden bg-gray-50 border border-gray-100 flex-shrink-0">
              <img src={product.imageUrl} className="w-full h-full object-cover" alt={product.name} />
            </div>
            <div className="flex-1 min-w-0 flex flex-col justify-center">
              <h4 className="font-bold text-gray-900 truncate">{product.name}</h4>
              <div className="flex items-center gap-2 mt-1">
                {product.promoPrice ? (
                  <>
                    <span className="text-green-600 font-black text-sm">R$ {product.promoPrice.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                    <span className="text-gray-300 font-bold text-xs line-through">R$ {product.price.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                  </>
                ) : (
                  <span className="text-gray-900 font-black text-sm">R$ {product.price.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                )}
              </div>
            </div>
            <div className="flex items-center pr-2">
              <button 
                onClick={() => handleDelete(product.id)}
                className="p-3 text-gray-200 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
              >
                <Trash2 size={18} />
              </button>
            </div>
          </div>
        ))}

        {products.length === 0 && !isAdding && (
          <div className="col-span-full py-16 text-center border-4 border-dashed border-gray-50 rounded-[3rem] bg-white">
            <ShoppingBag size={48} className="mx-auto text-gray-100 mb-4" />
            <p className="text-gray-300 font-black uppercase tracking-widest text-sm">Seu catálogo está vazio</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CatalogManager;
