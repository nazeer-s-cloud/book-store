'use client';

import { useEffect, useState } from 'react';

const API_URL = 'http://localhost:3000';

const products = [
  {
    id: 1,
    name: 'Laptop',
    price: 1000,
    image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8',
  },
  {
    id: 2,
    name: 'Phone',
    price: 500,
    image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9',
  },
  {
    id: 3,
    name: 'Headphones',
    price: 200,
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT61_SOUEXTBG6lLyJpZqoEk7uXSrA7gZDnrg&s',
  },
];

export default function Home() {
  const [orders, setOrders] = useState<any[]>([]);

  // load orders
  useEffect(() => {
    fetch(`${API_URL}/orders`)
      .then(res => res.json())
      .then(data => setOrders(data));
  }, []);

  // create order
  const createOrder = async (productId: number) => {
    const res = await fetch(`${API_URL}/orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ productId }),
    });

    const data = await res.json();
    setOrders(prev => [{ id: data.id, status: 'PENDING' }, ...prev]);
  };

  // polling
  useEffect(() => {
    const interval = setInterval(async () => {
      const res = await fetch(`${API_URL}/orders`, { cache: 'no-store' });
      const data = await res.json();
      setOrders(data);
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const getColor = (status: string) => {
    if (status === 'PENDING') return '#f59e0b';
    if (status === 'PROCESSING') return '#3b82f6';
    if (status === 'COMPLETED') return '#22c55e';
    if (status === 'FAILED') return '#ef4444';
    return '#aaa';
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>🛒 DevOps Store</h1>

      {/* PRODUCTS */}
      <div style={styles.products}>
        {products.map(p => (
          <div key={p.id} style={styles.card}>
            <img src={p.image} style={styles.image} />
            <h3>{p.name}</h3>
            <p>₹{p.price}</p>
            <button onClick={() => createOrder(p.id)} style={styles.button}>
              Buy Now
            </button>
          </div>
        ))}
      </div>

      {/* ORDERS */}
      <div style={styles.orders}>
        <h2>📦 Orders</h2>

        {orders.map(o => (
          <div key={o.id} style={styles.orderItem}>
            <span>Order #{o.id}</span>
            <span style={{ color: getColor(o.status) }}>
              {o.status}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

const styles: any = {
  container: {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #0f172a, #1e293b)',
    color: 'white',
    padding: 40,
    textAlign: 'center',
    fontFamily: 'sans-serif',
  },
  title: {
    fontSize: 32,
    marginBottom: 40,
  },
  products: {
    display: 'flex',
    justifyContent: 'center',
    gap: 30,
    flexWrap: 'wrap',
  },
  card: {
    background: 'rgba(255,255,255,0.05)',
    backdropFilter: 'blur(10px)',
    borderRadius: 15,
    padding: 20,
    width: 220,
    boxShadow: '0 10px 30px rgba(0,0,0,0.4)',
  },
  image: {
  width: '100%',
  height: 140,
  objectFit: 'cover',
  borderRadius: 10,
  marginBottom: 10,
},
  button: {
    marginTop: 10,
    padding: '10px 15px',
    borderRadius: 8,
    border: 'none',
    background: '#3b82f6',
    color: 'white',
    cursor: 'pointer',
    width: '100%',
  },
  orders: {
    marginTop: 50,
    maxWidth: 500,
    marginInline: 'auto',
  },
  orderItem: {
    display: 'flex',
    justifyContent: 'space-between',
    background: 'rgba(255,255,255,0.05)',
    padding: 12,
    borderRadius: 8,
    marginTop: 10,
  },
};