import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { getArtworks, getOrders, updateOrder, deleteArtwork } from '../services/api';
import { formatPrice, formatDate, statusColor, capitalize } from '../pipes/filters';
import { useAuth } from '../context/AuthContext';
import { Chart, BarController, BarElement, CategoryScale, LinearScale, Tooltip, Legend } from 'chart.js';

Chart.register(BarController, BarElement, CategoryScale, LinearScale, Tooltip, Legend);

const AdminDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [artworks, setArtworks] = useState([]);
  const [orders, setOrders] = useState([]);
  const chartRef = useRef(null);
  const chartInstance = useRef(null);

  useEffect(() => {
    if (!user || user.role !== 'admin') { navigate('/login'); return; }
    Promise.all([getArtworks(), getOrders()])
      .then(([a, o]) => { setArtworks(a.data); setOrders(o.data); })
      .catch(() => {});
  }, [user, navigate]);

  // Draw chart
  useEffect(() => {
    if (!chartRef.current || orders.length === 0) return;
    if (chartInstance.current) chartInstance.current.destroy();

    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const counts = Array(12).fill(0);
    orders.forEach(o => {
      const m = new Date(o.createdAt).getMonth();
      counts[m]++;
    });

    chartInstance.current = new Chart(chartRef.current, {
      type: 'bar',
      data: {
        labels: months,
        datasets: [{ label: 'Orders', data: counts, backgroundColor: '#6D1A2A', borderColor: '#6D1A2A', borderWidth: 1 }]
      },
      options: {
        responsive: true, maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: {
          y: { beginAtZero: true, ticks: { stepSize: 1, font: { size: 11 } }, grid: { color: '#f0f0f0' } },
          x: { ticks: { font: { size: 11 } }, grid: { display: false } }
        }
      }
    });
    return () => { if (chartInstance.current) chartInstance.current.destroy(); };
  }, [orders]);

  const handleStatusUpdate = async (orderId, newStatus) => {
    try {
      const res = await updateOrder(orderId, { status: newStatus });
      setOrders(orders.map(o => o._id === orderId ? res.data : o));
    } catch {}
  };

  const categories = artworks.reduce((acc, a) => {
    const name = a.category?.name || 'Other';
    acc[name] = (acc[name] || 0) + 1;
    return acc;
  }, {});

  const maxCat = Math.max(...Object.values(categories), 1);

  return (
    <div style={{ maxWidth: '1100px', margin: '32px auto', padding: '0 20px' }}>
      <h1 style={{ fontSize: '22px', marginBottom: '4px' }}>Dashboard</h1>
      <p style={{ fontSize: '13px', color: '#777', marginBottom: '24px' }}>Welcome back. Here's an overview of your gallery.</p>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '14px', marginBottom: '28px' }}>
        {[
          { num: artworks.length, label: 'Total Artworks' },
          { num: orders.length, label: 'Total Orders', color: '#6D1A2A' },
          { num: formatPrice(orders.reduce((s, o) => s + o.totalPrice, 0)), label: 'Total Revenue' },
          { num: artworks.filter(a => !a.available).length, label: 'Sold Out' },
        ].map((s, i) => (
          <div key={i} style={{ background: '#fff', border: '1px solid #ddd', padding: '18px 20px' }}>
            <div style={{ fontSize: '30px', fontWeight: 'bold', color: s.color || '#111', lineHeight: 1, marginBottom: '4px' }}>{s.num}</div>
            <div style={{ fontSize: '12px', color: '#aaa', textTransform: 'uppercase', letterSpacing: '1px' }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Chart + Categories */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '20px', marginBottom: '28px' }}>
        <div style={{ background: '#fff', border: '1px solid #ddd', padding: '20px' }}>
          <div style={{ fontSize: '14px', fontWeight: 'bold', marginBottom: '16px', paddingBottom: '10px', borderBottom: '1px solid #eee' }}>Orders per Month</div>
          <div style={{ position: 'relative', height: '220px' }}>
            <canvas ref={chartRef}></canvas>
          </div>
        </div>

        <div style={{ background: '#fff', border: '1px solid #ddd', padding: '20px' }}>
          <div style={{ fontSize: '14px', fontWeight: 'bold', marginBottom: '16px', paddingBottom: '10px', borderBottom: '1px solid #eee' }}>By Category</div>
          {Object.entries(categories).map(([name, count]) => (
            <div key={name} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '8px 0', borderBottom: '1px solid #f5f5f5', fontSize: '13px' }}>
              <span style={{ width: '70px', flexShrink: 0 }}>{name}</span>
              <div style={{ flex: 1, height: '6px', background: '#f0f0f0' }}>
                <div style={{ height: '100%', background: '#6D1A2A', width: `${(count / maxCat) * 100}%` }}></div>
              </div>
              <span style={{ fontSize: '12px', color: '#aaa', width: '20px', textAlign: 'right' }}>{count}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Artworks table */}
      <div style={{ background: '#fff', border: '1px solid #ddd', padding: '20px', marginBottom: '28px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '14px', fontWeight: 'bold', marginBottom: '16px', paddingBottom: '10px', borderBottom: '1px solid #eee' }}>
          My Artworks
          <a href="/artwork/add" style={{ padding: '8px 18px', background: '#6D1A2A', color: 'white', textDecoration: 'none', fontSize: '13px' }}>+ Add New</a>
        </div>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
          <thead>
            <tr>{['', 'Title', 'Category', 'Price', 'Status', ''].map((h, i) => (
              <th key={i} style={{ textAlign: 'left', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '1px', color: '#aaa', padding: '0 10px 10px 0', borderBottom: '1px solid #eee' }}>{h}</th>
            ))}</tr>
          </thead>
          <tbody>
            {artworks.map(a => (
              <tr key={a._id}>
                <td style={{ padding: '10px 10px 10px 0', borderBottom: '1px solid #f5f5f5' }}>
                  {a.image ? <img src={a.image} alt="" style={{ width: '36px', height: '44px', objectFit: 'cover' }} /> : <div style={{ width: '36px', height: '44px', background: 'linear-gradient(160deg, #222 0%, #666 100%)' }} />}
                </td>
                <td style={{ padding: '10px 10px 10px 0', borderBottom: '1px solid #f5f5f5' }}>{a.title}</td>
                <td style={{ padding: '10px 10px 10px 0', borderBottom: '1px solid #f5f5f5' }}>{a.category?.name}</td>
                <td style={{ padding: '10px 10px 10px 0', borderBottom: '1px solid #f5f5f5' }}>{formatPrice(a.price)}</td>
                <td style={{ padding: '10px 10px 10px 0', borderBottom: '1px solid #f5f5f5' }}>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '12px' }}>
                    <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: a.available ? '#2e7d32' : '#aaa' }}></div>
                    {a.available ? 'Available' : 'Sold Out'}
                  </span>
                </td>
                <td style={{ padding: '10px 0', borderBottom: '1px solid #f5f5f5' }}>
                  <button onClick={() => navigate(`/artwork/edit/${a._id}`)}
                    style={{ padding: '4px 10px', fontSize: '11px', background: 'none', border: '1px solid #ccc', cursor: 'pointer' }}>Edit</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Recent Orders */}
      <div style={{ background: '#fff', border: '1px solid #ddd', padding: '20px' }}>
        <div style={{ fontSize: '14px', fontWeight: 'bold', marginBottom: '16px', paddingBottom: '10px', borderBottom: '1px solid #eee' }}>Recent Orders</div>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
          <thead>
            <tr>{['Order', 'Artwork', 'Buyer', 'Amount', 'Status', 'Action'].map((h, i) => (
              <th key={i} style={{ textAlign: 'left', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '1px', color: '#aaa', padding: '0 10px 10px 0', borderBottom: '1px solid #eee' }}>{h}</th>
            ))}</tr>
          </thead>
          <tbody>
            {orders.slice(0, 10).map(o => (
              <tr key={o._id}>
                <td style={{ padding: '10px 10px 10px 0', borderBottom: '1px solid #f5f5f5' }}>#{o._id.slice(-6).toUpperCase()}</td>
                <td style={{ padding: '10px 10px 10px 0', borderBottom: '1px solid #f5f5f5' }}>{o.artwork?.title}</td>
                <td style={{ padding: '10px 10px 10px 0', borderBottom: '1px solid #f5f5f5' }}>{o.guestName}</td>
                <td style={{ padding: '10px 10px 10px 0', borderBottom: '1px solid #f5f5f5' }}>{formatPrice(o.totalPrice)}</td>
                <td style={{ padding: '10px 10px 10px 0', borderBottom: '1px solid #f5f5f5' }}>
                  <span style={{ padding: '2px 8px', fontSize: '10px', letterSpacing: '1px', textTransform: 'uppercase', fontWeight: 'bold', border: `1px solid ${statusColor(o.status)}`, color: statusColor(o.status) }}>
                    {capitalize(o.status)}
                  </span>
                </td>
                <td style={{ padding: '10px 0', borderBottom: '1px solid #f5f5f5' }}>
                  {o.status === 'pending' && <button onClick={() => handleStatusUpdate(o._id, 'confirmed')} style={{ padding: '4px 10px', fontSize: '11px', background: 'none', border: '1px solid #ccc', cursor: 'pointer' }}>Confirm</button>}
                  {o.status === 'confirmed' && <button onClick={() => handleStatusUpdate(o._id, 'completed')} style={{ padding: '4px 10px', fontSize: '11px', background: 'none', border: '1px solid #ccc', cursor: 'pointer' }}>Complete</button>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminDashboard;
