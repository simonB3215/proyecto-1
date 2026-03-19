import { useEffect, useState } from 'react'
import { Plus, Edit2, Trash2, Search, ChevronDown } from 'lucide-react'
import { ProductModal } from '../components/ProductModal'
import { useLanguage } from '../context/LanguageContext'

interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  stock: number;
  created_at: string;
  description?: string;
  image?: string;
}

const getImageFallback = (product: Product) => {
  if (product.image) return product.image;
  const name = product.name?.toLowerCase() || '';
  if (name.includes('pato')) return '/food/pato_pekin.png';
  if (name.includes('cerdo') || name.includes('char siu')) return '/food/cerdo_char_siu.png';
  if (name.includes('arroz')) return '/food/arroz_frito.png';
  if (name.includes('dim sum') || name.includes('wantán')) return '/food/dim_sum.png';
  return 'https://images.unsplash.com/photo-1541696432-82c6da8ce7bf?auto=format&fit=crop&q=80&w=200';
}

const getDescFallback = (product: Product, lang: string) => {
  if (product.description) return product.description;
  const name = product.name?.toLowerCase() || '';
  
  if (lang === 'en') {
    if (name.includes('pato')) return 'Authentic slow-roasted duck with crispy skin, served with steamed pancakes and homemade hoisin sauce.';
    if (name.includes('cerdo') || name.includes('char siu')) return 'Thinly sliced Chinese BBQ roasted pork, honey-glazed with traditional spices.';
    if (name.includes('arroz')) return 'Cantonese-style wok-fried rice with Char Siu pork, fresh vegetables, and dark sesame oil.';
    if (name.includes('dim sum')) return 'Premium selection of steamed dumplings served in traditional bamboo baskets.';
    if (name.includes('wantán')) return 'Traditional roasted chicken broth with pork and fresh shrimp wonton dumplings.';
    if (name.includes('té')) return 'Hot tea served in a traditional iron teapot, perfect for cleansing the palate.';
    return 'Traditional dish crafted under the highest standards of contemporary Cantonese cuisine.';
  }

  if (name.includes('pato')) return 'Auténtico pato horneado lentamente, servido con piel crujiente, panqueques al vapor y salsa hoisin casera.';
  if (name.includes('cerdo') || name.includes('char siu')) return 'Finas lonjas de cerdo asado a la barbacoa china, glaseado con miel y especias tradicionales.';
  if (name.includes('arroz')) return 'Arroz estilo cantonés salteado al wok con trozos de cerdo Char Siu, vegetales y un toque de aceite de sésamo oscuro.';
  if (name.includes('dim sum')) return 'Selección premium de dumplings cocinados al vapor en cestas de bambú tradicionales.';
  if (name.includes('wantán')) return 'Caldo tradicional de pollo asado con dumplings de wantán rellenos de cerdo y camarón fresco.';
  if (name.includes('té')) return 'Té caliente servido en tetera de hierro tradicional, ideal para limpiar el paladar después de una comida condimentada.';
  return 'Platillo tradicional elaborado bajo altos estándares de la cocina cantonesa contemporánea.';
}

export function Products() {
  const { t, lang } = useLanguage()
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const fetchProducts = async () => {
    try {
      const url = import.meta.env.VITE_API_URL || 'http://localhost:3001'
      const res = await fetch(`${url}/api/products`);
      if (res.ok) {
        const data = await res.json();
        setProducts(data);
      }
    } catch (err) {
      console.error("Failed to fetch products", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
    if (window.location.hash === '#menu-interactivo') {
      setTimeout(() => {
        document.getElementById('menu-interactivo')?.scrollIntoView({ behavior: 'smooth' });
      }, 300);
    }
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm(t('products.deleteConfirm'))) return;
    try {
      const url = import.meta.env.VITE_API_URL || 'http://localhost:3001'
      const res = await fetch(`${url}/api/products/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setProducts(products.filter(p => p.id !== id));
      }
    } catch (err) {
      console.error('Failed to delete', err);
    }
  };

  const openCreateModal = () => {
    setEditingProduct(null);
    setIsModalOpen(true);
  };

  const openEditModal = (product: Product) => {
    setEditingProduct(product);
    setIsModalOpen(true);
  };

  if (loading) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center text-white h-[60vh]">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4"></div>
        <h2 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">Loading...</h2>
      </div>
    );
  }

  const scrollToMenu = () => {
    document.getElementById('menu-interactivo')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <>
      {/* Hero Section */}
      <div className="relative -mx-8 -mt-8 mb-12 h-[100vh] min-h-[600px] flex flex-col items-center justify-center overflow-hidden border-b border-accent/20 shadow-[0_10px_30px_rgba(0,0,0,0.5)]">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1552566626-52f8b828add9?auto=format&fit=crop&q=80&w=2000" 
            alt="Interior Restaurant" 
            className="w-full h-full object-cover opacity-60 mix-blend-overlay"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#111111] via-black/60 to-[#111111]/90"></div>
          <div className="absolute inset-0 bg-primary/10 mix-blend-color"></div>
        </div>
        
        <div className="relative z-10 text-center animate-in fade-in zoom-in-95 duration-1000 flex flex-col items-center">
          <div className="w-48 h-48 mb-6 rounded-full shadow-[0_0_60px_rgba(212,175,55,0.4)] overflow-hidden border-[3px] border-accent/40 bg-black flex items-center justify-center">
            <img src="/food/logo.png" alt="Logo de El Dragón Dorado" className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" />
          </div>
          <h1 className="text-6xl md:text-8xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-200 via-accent to-yellow-600 mb-6 drop-shadow-[0_5px_15px_rgba(0,0,0,0.9)] tracking-tight pb-4 leading-tight">
            El Dragón Dorado
          </h1>
          <p className="text-xl md:text-2xl text-white/90 font-medium tracking-widest uppercase drop-shadow-md mb-12">
            Alta Cocina China
          </p>
          
          <button 
            onClick={scrollToMenu}
            className="group flex flex-col items-center gap-3 text-accent hover:text-white transition-colors duration-300"
          >
            <span className="text-sm tracking-widest uppercase font-bold opacity-80 group-hover:opacity-100">{t('nav.menu')}</span>
            <div className="w-12 h-12 rounded-full border border-accent/30 flex items-center justify-center group-hover:bg-accent/20 group-hover:scale-110 transition-all shadow-[0_0_15px_rgba(212,175,55,0.2)] group-hover:shadow-[0_0_25px_rgba(212,175,55,0.4)]">
              <ChevronDown className="w-6 h-6 animate-bounce" />
            </div>
          </button>
        </div>
      </div>

      {/* Menu Interactivo */}
      <div id="menu-interactivo" className="scroll-mt-8 max-w-7xl mx-auto w-full">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8">
          <div>
            <h2 className="text-3xl font-bold text-white mb-2 tracking-tight">{t('products.title')}</h2>
            <p className="text-textMuted text-sm">{t('products.subtitle')}</p>
          </div>
          <button 
            onClick={openCreateModal}
            className="w-full md:w-auto bg-gradient-to-r from-primary to-accent hover:opacity-90 text-white px-6 py-2.5 rounded-xl font-medium shadow-lg shadow-primary/20 transition-all hover-lift flex items-center justify-center gap-2"
          >
            <Plus className="w-5 h-5" />
            {t('products.addBtn')}
          </button>
        </div>

        <div className="glass rounded-xl border border-white/10 shadow-lg mb-8">
        <div className="p-4 flex items-center gap-4 bg-white/5">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-textMuted" />
            <input 
              type="text" 
              placeholder={t('products.search')} 
              className="w-full bg-white/5 border border-white/10 rounded-lg pl-10 pr-4 py-2 text-sm text-white placeholder:text-textMuted focus:outline-none focus:border-primary/50 transition-colors"
            />
          </div>
        </div>
        </div>

        <div className="space-y-12">
           {Array.from(new Set(products.map(p => p.category))).sort((a, b) => {
              const order = ['Entradas', 'Especialidades al Wok', 'Arroces y Fideos', 'Postres Asiáticos', 'Bebidas Tradicionales'];
              const iA = order.indexOf(a);
              const iB = order.indexOf(b);
              return (iA === -1 ? 99 : iA) - (iB === -1 ? 99 : iB) || a.localeCompare(b);
           }).map(category => {
              const categoryProducts = products.filter(p => p.category === category).sort((a,b) => a.name.localeCompare(b.name));
              return (
                 <div key={category} className="glass rounded-xl border border-white/10 overflow-hidden shadow-2xl">
                    <div className="bg-gradient-to-r from-black/80 to-transparent p-4 border-b border-white/10 border-l-4 border-l-primary flex items-center gap-3">
                       <h3 className="text-xl font-bold text-accent tracking-widest uppercase">{category}</h3>
                       <span className="text-xs font-bold text-white/50 bg-white/10 px-3 py-1 rounded-full">{categoryProducts.length} Platos</span>
                    </div>
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-sm text-textMuted">
                        <thead className="text-xs uppercase bg-white/5 border-b border-white/10 text-textMain">
                          <tr>
                            <th className="px-6 py-4 font-medium">{t('products.tableDish')}</th>
                            <th className="px-6 py-4 font-medium">{t('products.tablePrice')}</th>
                            <th className="px-6 py-4 font-medium">{t('products.tableStock')}</th>
                            <th className="px-6 py-4 font-medium text-right">{t('products.tableActions')}</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                          {categoryProducts.map(product => (
                            <tr key={product.id} className="hover:bg-white/5 transition-colors group">
                              <td className="px-6 py-4">
                                <div className="flex items-center gap-5">
                                  <img src={getImageFallback(product)} alt={product.name} className="w-20 h-20 rounded-xl object-cover border border-white/10 shadow-lg shadow-black/50 shrink-0" />
                                  <div className="flex flex-col max-w-sm">
                                    <span className="font-bold text-lg text-white mb-0.5">{product.name}</span>
                                    <span className="text-xs text-textMuted line-clamp-2 leading-relaxed mt-1">{getDescFallback(product, lang)}</span>
                                  </div>
                                </div>
                              </td>
                              <td className="px-6 py-4 font-black tracking-tight text-white text-base">
                                ${Number(product.price).toFixed(2)}
                              </td>
                              <td className="px-6 py-4">
                                <span className={`px-3 py-1.5 rounded-full text-[10px] font-black tracking-widest uppercase ${product.stock > 20 ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                                  {product.stock} {t('products.inStock')}
                                </span>
                              </td>
                              <td className="px-6 py-4 text-right">
                                <button 
                                  onClick={() => openEditModal(product)}
                                  className="p-2 text-textMuted hover:text-white transition-colors opacity-0 group-hover:opacity-100"
                                  title={t('products.editTitle')}
                                >
                                  <Edit2 className="w-4 h-4" />
                                </button>
                                <button 
                                  onClick={() => handleDelete(product.id)}
                                  className="p-2 text-textMuted hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100 ml-1"
                                  title={t('products.deleteTitle')}
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                 </div>
              );
           })}
           {products.length === 0 && !loading && (
             <div className="glass p-12 text-center text-textMuted rounded-xl border border-white/10 mt-8">
               {t('products.empty')}
             </div>
           )}
        </div>
      </div>

      <ProductModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        product={editingProduct} 
        onSaved={fetchProducts}
      />
    </>
  );
}
