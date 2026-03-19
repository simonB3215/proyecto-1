import { supabase } from './supabase';

const seedDragon = async () => {
  console.log("Limpiando productos de software viejos (Y sus Órdenes)...");
  
  // Limpiar órdenes primero para romper llaves foráneas (Foreign Keys)
  const { data: orders } = await supabase.from('orders').select('id');
  if (orders && orders.length > 0) {
    for (const o of orders) {
      await supabase.from('orders').delete().eq('id', o.id);
    }
  }

  // Obtenemos todos los productos actuales
  const { data: products } = await supabase.from('products').select('id');
  if (products && products.length > 0) {
    for (const p of products) {
      await supabase.from('products').delete().eq('id', p.id);
    }
  }
  
  console.log("Insertando platos del Dragón Dorado...");
  const { error } = await supabase.from('products').insert([
    { name: 'Pato Pekín Tradicional', category: 'Especialidades al Wok', price: 35.99, stock: 10 },
    { name: 'Cerdo Char Siu', category: 'Especialidades al Wok', price: 22.50, stock: 15 },
    { name: 'Arroz Frito Especial', category: 'Arroces y Fideos', price: 14.50, stock: 40 },
    { name: 'Lo Mein de Ternera', category: 'Arroces y Fideos', price: 16.90, stock: 25 },
    { name: 'Dim Sum Mixto (6 unid.)', category: 'Entradas', price: 12.00, stock: 60 },
    { name: 'Sopa Wantán', category: 'Entradas', price: 9.50, stock: 45 },
    { name: 'Té Verde Oolong', category: 'Bebidas Tradicionales', price: 4.50, stock: 100 },
    
    // Nuevas Inyecciones: Entradas
    { name: 'Rollitos de Primavera Veganos', category: 'Entradas', price: 5.50, stock: 80 },
    { name: 'Ensalada de Medusa y Sésamo', category: 'Entradas', price: 8.50, stock: 30 },
    { name: 'Gyozas a la Plancha (Dumplings)', category: 'Entradas', price: 10.00, stock: 75 },
    { name: 'Tofu Frito Crujiente', category: 'Entradas', price: 7.50, stock: 40 },
    
    // Nuevas Inyecciones: Carnes y Wok
    { name: 'Pollo Kung Pao picante', category: 'Especialidades al Wok', price: 18.50, stock: 25 },
    { name: 'Cerdo Agridulce con Piña', category: 'Especialidades al Wok', price: 17.50, stock: 35 },
    { name: 'Res Estofada con Brócoli', category: 'Especialidades al Wok', price: 19.90, stock: 20 },
    { name: 'Tofu Mapo Tradicional', category: 'Especialidades al Wok', price: 15.50, stock: 40 },
    { name: 'Corvina al Vapor con Jengibre', category: 'Especialidades al Wok', price: 24.00, stock: 12 },
    { name: 'Langostinos a la Sal y Pimienta', category: 'Especialidades al Wok', price: 26.50, stock: 18 },
    { name: 'Pato Asado Cantones', category: 'Especialidades al Wok', price: 28.00, stock: 15 },
    
    // Nuevas Inyecciones: Arroces y Fideos
    { name: 'Chow Mein de Pollo', category: 'Arroces y Fideos', price: 13.50, stock: 50 },
    { name: 'Fideos de Arroz estilo Singapur', category: 'Arroces y Fideos', price: 16.00, stock: 35 },
    { name: 'Arroz Frito con Mix de Mariscos', category: 'Arroces y Fideos', price: 18.50, stock: 40 },
    { name: 'Sopa de Fideos con Carne Estofada', category: 'Arroces y Fideos', price: 15.00, stock: 30 },
    
    // Nuevas Inyecciones: Postres Asiáticos
    { name: 'Tarta de Huevo de Macao (Dan Tat)', category: 'Postres Asiáticos', price: 6.00, stock: 50 },
    { name: 'Bolas de Sésamo Dulce (Tangyuan)', category: 'Postres Asiáticos', price: 5.50, stock: 65 },
    { name: 'Helado Frito con Matcha', category: 'Postres Asiáticos', price: 7.00, stock: 40 },
    { name: 'Gelatina de Almendras Dulce', category: 'Postres Asiáticos', price: 4.50, stock: 45 },
    
    // Nuevas Inyecciones: Bebidas
    { name: 'Té de Jazmín Infusionado', category: 'Bebidas Tradicionales', price: 4.00, stock: 120 },
    { name: 'Cerveza Tsingtao Fieltro', category: 'Bebidas Tradicionales', price: 5.50, stock: 200 },
    { name: 'Licor de Ciruela (Macerado)', category: 'Bebidas Tradicionales', price: 12.00, stock: 45 },
    { name: 'Leche de Soya Casera', category: 'Bebidas Tradicionales', price: 3.50, stock: 80 }
  ]);

  if (error) {
    console.error("Error al actualizar menú:", error);
  } else {
    console.log("¡Menú Chino integrado con éxito en Supabase!");
  }
};

seedDragon().catch(console.error);
