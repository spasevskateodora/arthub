import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { createArtwork, getCategories } from '../services/api';
import { useAuth } from '../context/AuthContext';

const ArtworkAdd = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState({ title: '', description: '', category: '', medium: '', dimensions: '', year: '', price: '', available: true });
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!user || user.role !== 'admin') { navigate('/login'); return; }
    getCategories().then(res => setCategories(res.data));
  }, [user, navigate]);

  const update = (field) => (e) => setForm({ ...form, [field]: field === 'available' ? e.target.checked : e.target.value });

  const handleImage = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImage(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!image) { setError('Please upload an image.'); return; }
    if (!form.title.trim()) { setError('Title is required.'); return; }
    if (!form.category) { setError('Category is required.'); return; }
    if (!form.price || parseFloat(form.price) <= 0) { setError('Please enter a valid price.'); return; }

    const formData = new FormData();
    formData.append('image', image);
    Object.entries(form).forEach(([k, v]) => formData.append(k, v));

    setLoading(true);
    try {
      await createArtwork(formData);
      setSuccess(true);
      setTimeout(() => navigate('/'), 2000);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to publish artwork.');
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = { width: '100%', padding: '9px 10px', border: '1px solid #ccc', fontFamily: 'Arial, sans-serif', fontSize: '14px', color: '#111', background: '#fff', boxSizing: 'border-box' };
  const labelStyle = { display: 'block', fontSize: '13px', color: '#555', marginBottom: '5px', marginTop: '16px' };

  if (success) return (
    <div style={{ textAlign: 'center', padding: '80px 20px' }}>
      <div style={{ fontSize: '32px', marginBottom: '12px' }}>✓</div>
      <h2 style={{ fontFamily: 'Georgia, serif', fontSize: '1.8rem', fontWeight: 400 }}>Artwork published!</h2>
      <p style={{ color: '#777', marginTop: '8px' }}>Redirecting to gallery...</p>
    </div>
  );

  return (
    <div style={{ maxWidth: '680px', margin: '40px auto', padding: '0 20px' }}>
      <h1 style={{ fontSize: '22px', marginBottom: '4px' }}>Add New Artwork</h1>
      <p style={{ fontSize: '13px', color: '#777', marginBottom: '24px' }}>Fill in the details to publish a new artwork.</p>

      {error && <div style={{ background: '#ffebee', border: '1px solid #f5c2c2', padding: '12px', fontSize: '13px', color: '#b00020', marginBottom: '16px' }}>{error}</div>}

      <div style={{ background: '#fff', border: '1px solid #ddd', padding: '28px' }}>
        <form onSubmit={handleSubmit}>

          {/* Image upload */}
          <label style={labelStyle}>Artwork Image *</label>
          <div style={{ border: `2px dashed ${preview ? '#111' : '#ccc'}`, padding: preview ? 0 : '30px', textAlign: 'center', cursor: 'pointer', position: 'relative' }}>
            <input type="file" accept="image/*" onChange={handleImage}
              style={{ position: 'absolute', inset: 0, opacity: 0, cursor: 'pointer', width: '100%', height: '100%' }} />
            {preview
              ? <img src={preview} alt="Preview" style={{ width: '100%', maxHeight: '320px', objectFit: 'contain', display: 'block', background: '#f2f2f2' }} />
              : <div><div style={{ fontSize: '32px', marginBottom: '8px' }}>🖼️</div><p style={{ fontSize: '13px', color: '#888', margin: 0 }}>Click or drag to upload</p></div>
            }
          </div>

          {/* Title */}
          <label style={labelStyle}>Title *</label>
          <input value={form.title} onChange={update('title')} placeholder="e.g. Silence in Blue" style={inputStyle} />

          {/* Description */}
          <label style={labelStyle}>Description</label>
          <textarea value={form.description} onChange={update('description')} placeholder="Describe the artwork..." rows={3}
            style={{ ...inputStyle, resize: 'vertical' }} />

          {/* Category + Medium */}
          <div style={{ display: 'flex', gap: '16px' }}>
            <div style={{ flex: 1 }}>
              <label style={labelStyle}>Category *</label>
              <select value={form.category} onChange={update('category')} style={inputStyle}>
                <option value="">— Select —</option>
                {categories.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
              </select>
            </div>
            <div style={{ flex: 1 }}>
              <label style={labelStyle}>Medium</label>
              <select value={form.medium} onChange={update('medium')} style={inputStyle}>
                <option value="">— Select —</option>
                <option value="oil">Oil on canvas</option>
                <option value="acrylic">Acrylic on canvas</option>
                <option value="watercolor">Watercolor</option>
                <option value="pencil">Pencil / Charcoal</option>
                <option value="digital">Digital</option>
                <option value="mixed">Mixed media</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>

          {/* Dimensions + Year */}
          <div style={{ display: 'flex', gap: '16px' }}>
            <div style={{ flex: 1 }}>
              <label style={labelStyle}>Dimensions (cm)</label>
              <input value={form.dimensions} onChange={update('dimensions')} placeholder="e.g. 60 × 80" style={inputStyle} />
            </div>
            <div style={{ flex: 1 }}>
              <label style={labelStyle}>Year</label>
              <input type="number" value={form.year} onChange={update('year')} placeholder="e.g. 2024" min="1900" max="2099" style={inputStyle} />
            </div>
          </div>

          {/* Price */}
          <label style={labelStyle}>Price (EUR) *</label>
          <input type="number" value={form.price} onChange={update('price')} placeholder="e.g. 480" min="1" style={inputStyle} />

          {/* Available */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: '16px' }}>
            <input type="checkbox" id="available" checked={form.available} onChange={update('available')} style={{ width: '16px', height: '16px', accentColor: '#6D1A2A' }} />
            <label htmlFor="available" style={{ fontSize: '14px', cursor: 'pointer' }}>Available for purchase</label>
          </div>

          {/* Buttons */}
          <div style={{ display: 'flex', gap: '12px', marginTop: '28px', paddingTop: '20px', borderTop: '1px solid #eee' }}>
            <button type="submit" disabled={loading}
              style={{ padding: '10px 28px', background: '#6D1A2A', color: 'white', border: 'none', fontSize: '14px', cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.7 : 1 }}>
              {loading ? 'Publishing...' : 'Publish Artwork'}
            </button>
            <button type="button" onClick={() => navigate('/')}
              style={{ padding: '10px 28px', background: 'none', color: '#555', border: '1px solid #ccc', fontSize: '14px', cursor: 'pointer' }}>
              Cancel
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};

export default ArtworkAdd;
