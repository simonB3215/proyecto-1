async function fixMenu() {
  const baseUrl = 'http://localhost:3001/api/products';
  
  try {
    const res = await fetch(baseUrl);
    const products = await res.json();
    
    let hasPato = false;
    
    // Eliminar productos que no son del restaurante
    for (const p of products) {
      const cat = (p.category || '').toLowerCase();
      const isSoftware = cat.includes('software') || cat.includes('service') || cat.includes('analytics');
      
      const name = (p.name || '').toLowerCase();
      if (name.includes('pato')) {
        hasPato = true;
      }
      
      if (isSoftware) {
        console.log('Eliminando producto genérico:', p.name);
        await fetch(`${baseUrl}/${p.id}`, { method: 'DELETE' });
      }
    }
    
    // Insertar platos reales si no están
    if (!hasPato) {
       console.log("Los platos reales no estaban. Insertándolos...");
       const plates = [
          { name: 'Pato Pekín Tradicional', category: 'Especialidades al Wok', price: 35.99, stock: 10 },
          { name: 'Cerdo Char Siu', category: 'Especialidades al Wok', price: 22.50, stock: 15 },
          { name: 'Arroz Frito Especial', category: 'Arroces y Fideos', price: 14.50, stock: 40 },
          { name: 'Lo Mein de Ternera', category: 'Arroces y Fideos', price: 16.90, stock: 25 },
          { name: 'Dim Sum Mixto (6 unid.)', category: 'Entradas', price: 12.00, stock: 60 },
          { name: 'Sopa Wantán', category: 'Entradas', price: 9.50, stock: 45 },
          { name: 'Té Verde Oolong', category: 'Bebidas Tradicionales', price: 4.50, stock: 100 }
       ];
       
       for (const plate of plates) {
          console.log('Insertando:', plate.name);
          await fetch(baseUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(plate)
          });
       }
    }
    
    console.log('¡Catálogo arreglado!');
  } catch (err) {
    console.error('Error:', err);
  }
}

fixMenu();
