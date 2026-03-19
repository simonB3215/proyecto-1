import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

interface ProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  product?: any;
  onSaved: () => void;
}

export function ProductModal({ isOpen, onClose, product, onSaved }: ProductModalProps) {
  const { t } = useLanguage();
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    price: 0,
    stock: 0,
    description: '',
    image: ''
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name,
        category: product.category,
        price: product.price,
        stock: product.stock,
        description: product.description || '',
        image: product.image || ''
      });
    } else {
      setFormData({ name: '', category: '', price: 0, stock: 0, description: '', image: '' });
    }
  }, [product, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const url = import.meta.env.VITE_API_URL || 'http://localhost:3001';
      const method = product ? 'PUT' : 'POST';
      const endpoint = product ? `/api/products/${product.id}` : `/api/products`;
      
      const res = await fetch(`${url}${endpoint}`, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      
      if (res.ok) {
        onSaved();
        onClose();
      } else {
         console.error("Failed to save. Status:", res.status);
      }
    } catch (err) {
      console.error('Save failed', err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="glass w-full max-w-md rounded-2xl border border-white/10 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between p-6 border-b border-white/10">
          <h2 className="text-xl font-semibold text-white">
            {product ? t('products.modalEdit') : t('products.modalAdd')}
          </h2>
          <button onClick={onClose} className="p-2 text-textMuted hover:text-white transition-colors rounded-lg hover:bg-white/5">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-textMuted mb-1.5">{t('products.name')}</label>
            <input 
              required
              type="text" 
              value={formData.name}
              onChange={e => setFormData({...formData, name: e.target.value})}
              className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-2.5 text-white placeholder:text-textMuted/50 focus:outline-none focus:border-primary/50 transition-colors"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-textMuted mb-1.5">{t('products.category')}</label>
            <input 
              required
              type="text" 
              value={formData.category}
              onChange={e => setFormData({...formData, category: e.target.value})}
              className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-2.5 text-white placeholder:text-textMuted/50 focus:outline-none focus:border-primary/50 transition-colors"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-textMuted mb-1.5">{t('products.price')}</label>
              <input 
                required
                type="number" 
                step="0.01"
                min="0"
                value={formData.price}
                onChange={e => setFormData({...formData, price: parseFloat(e.target.value) || 0})}
                className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-primary/50 transition-colors"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-textMuted mb-1.5">{t('products.stock')}</label>
              <input 
                required
                type="number" 
                min="0"
                value={formData.stock}
                onChange={e => setFormData({...formData, stock: parseInt(e.target.value, 10) || 0})}
                className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-primary/50 transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-textMuted mb-1.5">{t('products.desc')}</label>
            <textarea 
              rows={3}
              value={formData.description}
              onChange={e => setFormData({...formData, description: e.target.value})}
              className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-2.5 text-white placeholder:text-textMuted/50 focus:outline-none focus:border-primary/50 transition-colors custom-scrollbar"
              placeholder={t('products.descPlaceholder')}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-textMuted mb-1.5">{t('products.image')}</label>
            <input 
              type="text" 
              value={formData.image}
              onChange={e => setFormData({...formData, image: e.target.value})}
              className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-2.5 text-white placeholder:text-textMuted/50 focus:outline-none focus:border-primary/50 transition-colors"
              placeholder={t('products.imagePlaceholder')}
            />
          </div>

          <div className="pt-4 flex items-center justify-end gap-3">
            <button 
              type="button" 
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl font-medium text-textMuted hover:text-white hover:bg-white/5 transition-colors"
            >
              {t('products.cancel')}
            </button>
            <button 
              type="submit" 
              disabled={saving}
              className="bg-gradient-to-r from-primary to-accent hover:opacity-90 text-white px-6 py-2.5 rounded-xl font-medium shadow-lg shadow-primary/20 transition-all hover-lift disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {saving ? t('products.saving') : t('products.save')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
