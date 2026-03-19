import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

interface CustomerModalProps {
  isOpen: boolean;
  onClose: () => void;
  customer?: any;
  onSaved: () => void;
}

export function CustomerModal({ isOpen, onClose, customer, onSaved }: CustomerModalProps) {
  const { t } = useLanguage();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    status: 'ACTIVE'
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (customer) {
      setFormData({
        name: customer.name,
        email: customer.email,
        status: customer.status
      });
    } else {
      setFormData({ name: '', email: '', status: 'ACTIVE' });
    }
  }, [customer, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const url = import.meta.env.VITE_API_URL || 'http://localhost:3001';
      const method = customer ? 'PUT' : 'POST';
      const endpoint = customer ? `/api/customers/${customer.id}` : `/api/customers`;
      
      const res = await fetch(`${url}${endpoint}`, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      
      if (res.ok) {
        onSaved();
        onClose();
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
            {customer ? t('customers.modalEdit') : t('customers.modalAdd')}
          </h2>
          <button onClick={onClose} className="p-2 text-textMuted hover:text-white transition-colors rounded-lg hover:bg-white/5">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-textMuted mb-1.5">{t('customers.name')}</label>
            <input 
              required
              type="text" 
              value={formData.name}
              onChange={e => setFormData({...formData, name: e.target.value})}
              className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-primary/50 transition-colors"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-textMuted mb-1.5">{t('customers.email')}</label>
            <input 
              required
              type="email" 
              value={formData.email}
              onChange={e => setFormData({...formData, email: e.target.value})}
              className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-primary/50 transition-colors"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-textMuted mb-1.5">{t('customers.status')}</label>
            <select 
              value={formData.status}
              onChange={e => setFormData({...formData, status: e.target.value})}
              className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-primary/50 transition-colors appearance-none"
            >
              <option value="ACTIVE">{t('customers.statusActive')}</option>
              <option value="INACTIVE">{t('customers.statusInactive')}</option>
            </select>
          </div>

          <div className="pt-4 flex items-center justify-end gap-3">
            <button 
              type="button" 
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl font-medium text-textMuted hover:text-white hover:bg-white/5 transition-colors"
            >
              {t('customers.cancel')}
            </button>
            <button 
              type="submit" 
              disabled={saving}
              className="bg-gradient-to-r from-primary to-accent hover:opacity-90 text-white px-6 py-2.5 rounded-xl font-medium shadow-lg shadow-primary/20 transition-all hover-lift disabled:opacity-50"
            >
              {saving ? t('customers.saving') : t('customers.save')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
