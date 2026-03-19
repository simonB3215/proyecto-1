import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { supabase } from './supabase';
import { seedData } from './seed';

dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// API: Dashboard Stats (KPIs)
app.get('/api/dashboard/stats', async (req, res) => {
  try {
    const { count: customersCount } = await supabase.from('customers').select('*', { count: 'exact', head: true });
    const { count: ordersCount } = await supabase.from('orders').select('*', { count: 'exact', head: true });
    const { data: revenueData } = await supabase.from('revenue_metrics').select('revenue');
    
    const totalRevenue = revenueData?.reduce((acc, curr) => acc + Number(curr.revenue), 0) || 0;
    
    res.json({
      customers: customersCount || 0,
      orders: ordersCount || 0,
      totalRevenue,
      growth: '+12.5%' // Mock growth for dashboard wow effect
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch stats' });
  }
});

// API: Recent Orders
app.get('/api/dashboard/recent-orders', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('orders')
      .select(`
        id,
        amount,
        status,
        created_at,
        customers ( name, email ),
        products ( name )
      `)
      .order('created_at', { ascending: false })
      .limit(5);

    if (error) throw error;
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch recent orders' });
  }
});

// API: Revenue Chart Data
app.get('/api/dashboard/chart-data', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('revenue_metrics')
      .select('date, revenue, visitors')
      .order('date', { ascending: true })
      .limit(30);

    if (error) throw error;
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch chart data' });
  }
});

// API: List Products
app.get('/api/products', async (req, res) => {
  try {
    const { data, error } = await supabase.from('products').select('*').order('created_at', { ascending: false });
    if (error) throw error;
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch products' });
  }
});

// API: Create Product
app.post('/api/products', async (req, res) => {
  try {
    const { data, error } = await supabase.from('products').insert([req.body]).select();
    if (error) throw error;
    res.status(201).json(data[0]);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create product' });
  }
});

// API: Update Product
app.put('/api/products/:id', async (req, res) => {
  try {
    const { data, error } = await supabase.from('products').update(req.body).eq('id', req.params.id).select();
    if (error) throw error;
    res.json(data[0]);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update product' });
  }
});

// API: Delete Product
app.delete('/api/products/:id', async (req, res) => {
  try {
    const { error } = await supabase.from('products').delete().eq('id', req.params.id);
    if (error) throw error;
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete product' });
  }
});

// API: List Customers
app.get('/api/customers', async (req, res) => {
  try {
    const { data, error } = await supabase.from('customers').select('*').order('created_at', { ascending: false });
    if (error) throw error;
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch customers' });
  }
});

// API: Create Customer
app.post('/api/customers', async (req, res) => {
  try {
    const { name, email, status } = req.body;
    const { data, error } = await supabase.from('customers').insert([{ name, email, status }]).select();
    if (error) throw error;
    res.status(201).json(data[0]);
  } catch (error) {
    console.error("Create customer error:", error);
    res.status(500).json({ error: 'Failed to create customer' });
  }
});

// API: Update Customer
app.put('/api/customers/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, status } = req.body;
    const { data, error } = await supabase.from('customers').update({ name, email, status }).eq('id', id).select();
    if (error) throw error;
    res.json(data[0]);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update customer' });
  }
});

// API: Delete Customer
app.delete('/api/customers/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { error } = await supabase.from('customers').delete().eq('id', id);
    if (error) throw error;
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete customer' });
  }
});

// --- DRAGON DORADO RESTAURANT MOCK APIs ---

// API: Dragon KPIs
app.get('/api/dragon/kpis', (req, res) => {
  res.json({
    plato_top: "Pato Pekín Exclusivo",
    pedidos_plato_top: 42,
    tiempo_wok1: 8.5,
    tiempo_wok2: 15.2,
    caja_diaria: 4850.50,
    propinas: 320.00
  });
});

// API: Dragon Inventory Alerts
app.get('/api/dragon/inventory-alerts', (req, res) => {
  res.json([
    { id: 1, item: "Salsa Hoisin (Importada)", stock_porcentaje: 12, urgencia: "CRITICO" },
    { id: 2, item: "Soya Oscura Premium", stock_porcentaje: 8, urgencia: "CRITICO" },
    { id: 3, item: "Polvo de 5 Especias", stock_porcentaje: 14, urgencia: "ADVERTENCIA" }
  ]);
});

// API: Dragon Active Orders (Wok Queue)
app.get('/api/dragon/active-orders', (req, res) => {
  res.json([
    { id: "TK-081", mesa: "Mesa 4", tipo: "Salón", minutos: 18, estado: "RETRASADO", items: "Cerdo Char Siu x2" },
    { id: "TK-082", mesa: "Delivery", tipo: "Reparto", minutos: 7, estado: "EN WOK 1", items: "Lo Mein de Ternera, Wantán" },
    { id: "TK-083", mesa: "Mesa 12", tipo: "Salón", minutos: 3, estado: "NUEVO", items: "Arroz Frito Especial" },
    { id: "TK-084", mesa: "Takeout", tipo: "Para Llevar", minutos: 10, estado: "EN WOK 2", items: "Pato Pekín (Mitad)" }
  ]);
});

// API: Trigger Seed Data manually if needed
app.post('/api/seed', async (req, res) => {
  try {
    const msg = await seedData();
    res.json({ message: msg });
  } catch (error) {
    res.status(500).json({ error: 'Failed to seed data' });
  }
});

// Also try to seed automatically on startup (will only insert if tables are empty)
seedData().then(msg => console.log(msg)).catch(console.error);

app.listen(port, () => {
  console.log(`Backend running on http://localhost:${port}`);
});
