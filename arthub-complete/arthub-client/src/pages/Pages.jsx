import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getArtworks, getCategories, createOrder, getOrders, updateOrder } from '../services/api';
import { formatPrice, formatDate, statusColor, capitalize } from '../pipes/filters';
import { useAuth } from '../context/AuthContext';
import ArtworkCard from '../components/ArtworkCard';

// ===== SEARCH PAGE =====
export const Search = () => {
  const [artworks, setArtworks] = useState([]);
  const [categories, setCategories] = useState([]);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [availability, setAvailability] = useState('all');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');

  useEffect(() => {
    Promise.all([getArtworks(), getCategories()]).then(([a, c]) => { setArtworks(a.data); setCategories(c.data); });
  }, []);

  const filtered = artworks.filter(a => {
    const s = !search || a.title.toLowerCase().includes(search.toLowerCase());
    const c = !category || a.category?._id === category;
    const av = availability === 'all' || (availability === 'available' ? a.available : !a.available);
    const mn = !minPrice || a.price >= parseFloat(minPrice);
    const mx = !maxPrice || a.price <= parseFloat(maxPrice);
    return s && c && av && mn && mx;
  });

  const inputStyle = { width: '100%', padding: '8px 10px', border: '1px solid #ccc', fontFamily: 'Arial, sans-serif', fontSize: '13px', color: '#111', background: '#fff', boxSizing: 'border-box' };

  return (
    <div>
      <div style={{ background: '#111', padding: '36px 20px', textAlign: 'center' }}>
        <h1 style={{ color: '#fff', fontSize: '24px', marginBottom: '16px', fontWeight: 'normal' }}>
          Browse <em style={{ color: '#6D1A2A' }}>original</em> artworks
        </h1>
        <div style={{ display: 'flex', maxWidth: '560px', margin: '0 auto' }}>
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by title..."
            style={{ flex: 1, padding: '11px 14px', border: 'none', fontSize: '14px', outline: 'none' }} />
          <button style={{ padding: '11px 20px', background: '#6D1A2A', color: 'white', border: 'none', fontSize: '14px', cursor: 'pointer' }}>Search</button>
        </div>
      </div>

      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '28px 20px', display: 'flex', gap: '28px' }}>

        {/* Sidebar */}
        <div style={{ width: '220px', flexShrink: 0 }}>
          <div style={{ background: '#fff', border: '1px solid #ddd', padding: '16px', marginBottom: '14px' }}>
            <h3 style={{ fontSize: '13px', textTransform: 'uppercase', letterSpacing: '1px', color: '#555', marginBottom: '12px', paddingBottom: '8px', borderBottom: '1px solid #eee' }}>Category</h3>
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', marginBottom: '8px', cursor: 'pointer' }}>
              <input type="radio" name="cat" checked={!category} onChange={() => setCategory('')} style={{ accentColor: '#6D1A2A' }} /> All
            </label>
            {categories.map(c => (
              <label key={c._id} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', marginBottom: '8px', cursor: 'pointer' }}>
                <input type="radio" name="cat" checked={category === c._id} onChange={() => setCategory(c._id)} style={{ accentColor: '#6D1A2A' }} /> {c.name}
              </label>
            ))}
          </div>

          <div style={{ background: '#fff', border: '1px solid #ddd', padding: '16px', marginBottom: '14px' }}>
            <h3 style={{ fontSize: '13px', textTransform: 'uppercase', letterSpacing: '1px', color: '#555', marginBottom: '12px', paddingBottom: '8px', borderBottom: '1px solid #eee' }}>Availability</h3>
            {['all', 'available', 'sold'].map(v => (
              <label key={v} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', marginBottom: '8px', cursor: 'pointer' }}>
                <input type="radio" name="avail" checked={availability === v} onChange={() => setAvailability(v)} style={{ accentColor: '#6D1A2A' }} />
                {capitalize(v === 'all' ? 'All' : v === 'available' ? 'Available only' : 'Sold out')}
              </label>
            ))}
          </div>

          <div style={{ background: '#fff', border: '1px solid #ddd', padding: '16px', marginBottom: '14px' }}>
            <h3 style={{ fontSize: '13px', textTransform: 'uppercase', letterSpacing: '1px', color: '#555', marginBottom: '12px', paddingBottom: '8px', borderBottom: '1px solid #eee' }}>Price (EUR)</h3>
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              <input type="number" placeholder="Min" value={minPrice} onChange={e => setMinPrice(e.target.value)} style={{ ...inputStyle, width: '80px' }} />
              <span style={{ fontSize: '13px', color: '#888' }}>—</span>
              <input type="number" placeholder="Max" value={maxPrice} onChange={e => setMaxPrice(e.target.value)} style={{ ...inputStyle, width: '80px' }} />
            </div>
          </div>

          <button onClick={() => { setSearch(''); setCategory(''); setAvailability('all'); setMinPrice(''); setMaxPrice(''); }}
            style={{ width: '100%', padding: '8px', background: 'none', border: '1px solid #ddd', fontSize: '12px', cursor: 'pointer', color: '#777' }}>
            Clear all filters
          </button>
        </div>

        {/* Results */}
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
            <span style={{ fontSize: '13px', color: '#777' }}>{filtered.length} result{filtered.length !== 1 ? 's' : ''}</span>
          </div>
          {filtered.length === 0 && <div style={{ textAlign: 'center', padding: '60px', color: '#aaa' }}>No artworks found.</div>}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
            {filtered.map(a => <ArtworkCard key={a._id} artwork={a} />)}
          </div>
        </div>
      </div>
    </div>
  );
};

// ===== CHECKOUT PAGE =====
export const Checkout = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [artwork, setArtwork] = useState(null);
  const [form, setForm] = useState({ 
    firstName: user?.firstName || '', 
    lastName: user?.lastName || '', 
    email: user?.email || '', 
    phone: '', 
    address: '', 
    city: '', 
    country: '', 
    note: '' 
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const id = localStorage.getItem('buyArtworkId');
    if (!id) { navigate('/'); return; }
    import('../services/api').then(({ getArtwork }) => getArtwork(id).then(res => setArtwork(res.data)));
  }, [navigate]);

  const update = (field) => (e) => setForm({ ...form, [field]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!form.firstName.trim()) { setError('First name is required.'); return; }
    if (!form.lastName.trim()) { setError('Last name is required.'); return; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) { setError('Valid email is required.'); return; }
    if (!form.address.trim()) { setError('Address is required.'); return; }
    if (!form.city.trim()) { setError('City is required.'); return; }
    if (!form.country.trim()) { setError('Country is required.'); return; }

    setLoading(true);
    try {
      await createOrder({ artworkId: artwork._id, guestName: `${form.firstName} ${form.lastName}`, guestEmail: form.email, guestPhone: form.phone, address: form.address, city: form.city, country: form.country, note: form.note });
      localStorage.removeItem('buyArtworkId');
      setSuccess(true);
    } catch (err) {
      setError(err.response?.data?.error || 'Order failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = { width: '100%', padding: '9px 10px', border: '1px solid #ccc', fontFamily: 'Arial, sans-serif', fontSize: '14px', color: '#111', background: '#fff', boxSizing: 'border-box' };
  const labelStyle = { display: 'block', fontSize: '13px', color: '#555', marginBottom: '4px', marginTop: '14px' };

  if (success) return (
    <div style={{ textAlign: 'center', padding: '80px 20px' }}>
      <div style={{ fontSize: '48px', marginBottom: '16px' }}>✓</div>
      <h2 style={{ fontSize: '24px', marginBottom: '8px' }}>Order placed successfully!</h2>
      <p style={{ fontSize: '14px', color: '#777', marginBottom: '20px', lineHeight: 1.7 }}>
        Thank you! A confirmation has been sent to your email.<br />The artist will contact you shortly.
      </p>
      <a href="/" style={{ display: 'inline-block', padding: '11px 28px', background: '#6D1A2A', color: 'white', textDecoration: 'none', fontSize: '13px' }}>Back to Gallery</a>
    </div>
  );

  if (!artwork) return <div style={{ textAlign: 'center', padding: '60px', color: '#5A5A5A' }}>Loading...</div>;

  return (
    <div style={{ maxWidth: '900px', margin: '40px auto', padding: '0 20px', display: 'grid', gridTemplateColumns: '1fr 340px', gap: '28px' }}>
      <div>
        <h1 style={{ fontSize: '22px', marginBottom: '4px' }}>Complete your order</h1>
        <p style={{ fontSize: '13px', color: '#777', marginBottom: '24px' }}>Fill in your details to purchase this artwork.</p>

        {error && <div style={{ background: '#ffebee', border: '1px solid #f5c2c2', padding: '12px', fontSize: '13px', color: '#b00020', marginBottom: '16px' }}>{error}</div>}

        <div style={{ background: '#fff', border: '1px solid #ddd', padding: '24px' }}>
          <h2 style={{ fontSize: '15px', marginBottom: '16px', paddingBottom: '10px', borderBottom: '1px solid #eee' }}>Your Details</h2>
          <form onSubmit={handleSubmit}>
            <div style={{ display: 'flex', gap: '12px' }}>
              <div style={{ flex: 1 }}><label style={labelStyle}>First Name *</label><input value={form.firstName} onChange={update('firstName')} placeholder="Ana" style={inputStyle} /></div>
              <div style={{ flex: 1 }}><label style={labelStyle}>Last Name *</label><input value={form.lastName} onChange={update('lastName')} placeholder="Petrov" style={inputStyle} /></div>
            </div>
            <label style={labelStyle}>Email *</label>
            <input type="email" value={form.email} onChange={update('email')} placeholder="you@email.com" style={inputStyle} />
            <label style={labelStyle}>Phone</label>
            <input value={form.phone} onChange={update('phone')} placeholder="+389 70 000 000" style={inputStyle} />
            <label style={labelStyle}>Address *</label>
            <input value={form.address} onChange={update('address')} placeholder="Street and number" style={inputStyle} />
            <div style={{ display: 'flex', gap: '12px' }}>
              <div style={{ flex: 1 }}><label style={labelStyle}>City *</label><input value={form.city} onChange={update('city')} placeholder="Skopje" style={inputStyle} /></div>
              <div style={{ flex: 1 }}><label style={labelStyle}>Country *</label><input value={form.country} onChange={update('country')} placeholder="North Macedonia" style={inputStyle} /></div>
            </div>
            <label style={labelStyle}>Note (optional)</label>
            <textarea value={form.note} onChange={update('note')} placeholder="Any special instructions..." rows={3} style={{ ...inputStyle, resize: 'vertical' }} />
            <button type="submit" disabled={loading}
              style={{ width: '100%', padding: '13px', background: '#6D1A2A', color: 'white', border: 'none', fontSize: '14px', cursor: loading ? 'not-allowed' : 'pointer', marginTop: '20px', opacity: loading ? 0.7 : 1 }}>
              {loading ? 'Placing order...' : 'Place Order'}
            </button>
          </form>
        </div>
      </div>

      {/* Summary */}
      <div style={{ background: '#fff', border: '1px solid #ddd', padding: '20px', alignSelf: 'flex-start', position: 'sticky', top: '80px' }}>
        <h2 style={{ fontSize: '15px', marginBottom: '16px', paddingBottom: '10px', borderBottom: '1px solid #eee' }}>Order Summary</h2>
        {artwork.image
          ? <img src={artwork.image} alt={artwork.title} style={{ width: '100%', aspectRatio: '3/4', objectFit: 'cover', marginBottom: '14px' }} />
          : <div style={{ width: '100%', aspectRatio: '3/4', background: 'linear-gradient(160deg, #222 0%, #666 100%)', marginBottom: '14px' }} />
        }
        <div style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: '2px' }}>{artwork.title}</div>
        <div style={{ fontSize: '13px', color: '#777', marginBottom: '14px' }}>{artwork.category?.name}</div>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '15px', fontWeight: 'bold', paddingTop: '10px', borderTop: '1px solid #eee' }}>
          <span>Total</span>
          <span style={{ color: '#6D1A2A' }}>{formatPrice(artwork.price)}</span>
        </div>
        <p style={{ fontSize: '11px', color: '#aaa', textAlign: 'center', marginTop: '10px' }}>🔒 Your details are kept private</p>
      </div>
    </div>
  );
};

// ===== ORDERS PAGE =====
export const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [tab, setTab] = useState('all');
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) { navigate('/login'); return; }
    getOrders().then(res => setOrders(res.data)).catch(() => {});
  }, [user, navigate]);

  const filtered = tab === 'all' ? orders : orders.filter(o => o.status === tab);

  const tabs = ['all', 'pending', 'confirmed', 'completed', 'cancelled'];

  return (
    <div style={{ maxWidth: '860px', margin: '40px auto', padding: '0 20px' }}>
      <h1 style={{ fontSize: '22px', marginBottom: '4px' }}>My Orders</h1>
      <p style={{ fontSize: '13px', color: '#777', marginBottom: '24px' }}>Track and manage your artwork purchases.</p>

      {/* Summary */}
      <div style={{ background: '#fff', border: '1px solid #ddd', padding: '20px', marginBottom: '28px', display: 'flex', gap: '40px' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '28px', fontWeight: 'bold' }}>{orders.length}</div>
          <div style={{ fontSize: '12px', color: '#aaa', textTransform: 'uppercase', letterSpacing: '1px', marginTop: '4px' }}>Total Orders</div>
        </div>
        <div style={{ width: '1px', background: '#eee', alignSelf: 'stretch' }}></div>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#6D1A2A' }}>{orders.filter(o => o.status === 'pending').length}</div>
          <div style={{ fontSize: '12px', color: '#aaa', textTransform: 'uppercase', letterSpacing: '1px', marginTop: '4px' }}>Pending</div>
        </div>
        <div style={{ width: '1px', background: '#eee', alignSelf: 'stretch' }}></div>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '28px', fontWeight: 'bold' }}>{orders.filter(o => o.status === 'confirmed').length}</div>
          <div style={{ fontSize: '12px', color: '#aaa', textTransform: 'uppercase', letterSpacing: '1px', marginTop: '4px' }}>Confirmed</div>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', borderBottom: '2px solid #ddd', marginBottom: '24px' }}>
        {tabs.map(t => (
          <button key={t} onClick={() => setTab(t)}
            style={{ padding: '10px 20px', background: 'none', border: 'none', fontSize: '13px', cursor: 'pointer', color: tab === t ? '#6D1A2A' : '#777', borderBottom: tab === t ? '2px solid #6D1A2A' : '2px solid transparent', marginBottom: '-2px', fontWeight: tab === t ? 'bold' : 'normal' }}>
            {capitalize(t)}
          </button>
        ))}
      </div>

      {filtered.length === 0 && <div style={{ textAlign: 'center', padding: '60px', color: '#aaa' }}>No orders found.</div>}

      {filtered.map(o => (
        <div key={o._id} style={{ background: '#fff', border: '1px solid #ddd', padding: '20px', marginBottom: '14px', display: 'flex', gap: '20px' }}>
          {o.artwork?.image
            ? <img src={o.artwork.image} alt={o.artwork.title} style={{ width: '80px', height: '100px', objectFit: 'cover', flexShrink: 0 }} />
            : <div style={{ width: '80px', height: '100px', background: 'linear-gradient(160deg, #222 0%, #666 100%)', flexShrink: 0 }} />
          }
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
              <div>
                <div style={{ fontSize: '16px', fontWeight: 'bold' }}>{o.artwork?.title}</div>
                <div style={{ fontSize: '13px', color: '#777' }}>{o.artwork?.category?.name}</div>
              </div>
              <div style={{ fontSize: '17px', fontWeight: 'bold', textAlign: 'right' }}>
                {formatPrice(o.totalPrice)}
              </div>
            </div>
            <div style={{ fontSize: '12px', color: '#aaa', marginBottom: '8px' }}>
              <span style={{ marginRight: '16px' }}>Order #{o._id.slice(-6).toUpperCase()}</span>
              <span>Placed: {formatDate(o.createdAt)}</span>
            </div>
            <span style={{ display: 'inline-block', padding: '3px 10px', fontSize: '11px', letterSpacing: '1px', textTransform: 'uppercase', fontWeight: 'bold', border: `1px solid ${statusColor(o.status)}`, color: statusColor(o.status), background: `${statusColor(o.status)}15` }}>
              {capitalize(o.status)}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
};
