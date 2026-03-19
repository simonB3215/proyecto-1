-- Ejecuta este código en el SQL Editor de tu panel de Supabase
ALTER TABLE products 
ADD COLUMN IF NOT EXISTS description TEXT,
ADD COLUMN IF NOT EXISTS image TEXT;
