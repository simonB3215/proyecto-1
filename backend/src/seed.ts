import { supabase } from './supabase';

export const seedData = async () => {
  // Check if customers already exist
  const { count } = await supabase.from('customers').select('*', { count: 'exact', head: true });
  
  if (count && count > 0) {
    return "Database already seeded";
  }

  console.log("Seeding example data for dashboard...");

  // Generate Customers
  const { data: customers } = await supabase.from('customers').insert([
    { name: 'Alice Smith', email: 'alice@example.com', status: 'ACTIVE' },
    { name: 'Bob Johnson', email: 'bob@example.com', status: 'INACTIVE' },
    { name: 'Charlie Davis', email: 'charlie@example.com', status: 'ACTIVE' },
    { name: 'Diana Prince', email: 'diana@example.com', status: 'ACTIVE' }
  ]).select();

  // Generate Products
  const { data: products } = await supabase.from('products').insert([
    { name: 'Premium Analytics Dashboard', category: 'Software', price: 99.99, stock: 100 },
    { name: 'Data Visualization Pro', category: 'Software', price: 149.99, stock: 50 },
    { name: 'Enterprise API Access', category: 'Service', price: 499.00, stock: 10 }
  ]).select();

  if (!customers || !products) return "Failed to generate base data";

  // Generate Orders
  const orderStatuses = ['COMPLETED', 'PENDING', 'CANCELLED'];
  const orders = [];
  for (let i = 0; i < 15; i++) {
    const customer = customers[Math.floor(Math.random() * customers.length)];
    const product = products[Math.floor(Math.random() * products.length)];
    orders.push({
      customer_id: customer.id,
      product_id: product.id,
      amount: product.price,
      status: orderStatuses[Math.floor(Math.random() * orderStatuses.length)]
    });
  }
  await supabase.from('orders').insert(orders);

  // Generate Revenue Metrics (Last 7 days)
  const revenueMetrics = [];
  for (let i = 6; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    revenueMetrics.push({
      date: date.toISOString().split('T')[0],
      revenue: Math.floor(Math.random() * 500) + 100,
      visitors: Math.floor(Math.random() * 1000) + 200
    });
  }
  await supabase.from('revenue_metrics').insert(revenueMetrics);

  return "Seeded example data successfully";
};
