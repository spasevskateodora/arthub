// ===== ARTWORK EDIT =====
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getArtwork, updateArtwork, deleteArtwork, getCategories } from '../services/api';
import { useAuth } from '../context/AuthContext';

export const ArtworkEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [form, setForm] = useState({ title: '', description: '', category: '', medium: '', dimensions: '', year: '', price: '', available: true });
  const [categories, setCategories] = useState([]);
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  useEffect(() => {
    if (!user || user.role !== 'admin') { navigate('/login'); return; }
    Promise.all([getArtwork(id), getCategories()]).then(([artRes, catRes]) => {
      const a = artRes.data;
      setForm({ title: a.title, description: a.description || '', category: a.category?._id || '', medium: a.medium || '', dimensions: a.dimensions || '', year: a.year || '', price: a.price, available: a.available });
      setPreview(a.image || null);
      setCategories(catRes.data);
    });
  }, [id, user, navigate]);

  const update = (field) => (e) => setForm({ ...form, [field]: field === 'available' ? e.target.checked : e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!form.title.trim()) { setError('Title is required.'); return; }
    if (!form.price || parseFloat(form.price) <= 0) { setError('Valid price is required.'); return; }
    const formData = new FormData();
    if (image) formData.append('image', image);
    Object.entries(form).forEach(([k, v]) => formData.append(k, v));
    try {
      await updateArtwork(id, formData);
      setSuccess(true);
      setTimeout(() => navigate('/'), 1500);
    } catch (err) {
      setError(err.response?.data?.error || 'Update failed.');
    }
  };

  const handleDelete = async () => {
    try { await deleteArtwork(id); navigate('/'); } catch {}
  };

  const inputStyle = { width: '100%', padding: '9px 10px', border: '1px solid #ccc', fontFamily: 'Arial, sans-serif', fontSize: '14px', color: '#111', background: '#fff', boxSizing: 'border-box' };
  const labelStyle = { display: 'block', fontSize: '13px', color: '#555', marginBottom: '5px', marginTop: '16px' };

  if (success) return <div style={{ textAlign: 'center', padding: '80px' }}><div style={{ fontSize: '32px' }}>✓</div><h2 style={{ fontFamily: 'Georgia, serif', fontWeight: 400 }}>Updated successfully!</h2></div>;

  return (
    <div style={{ maxWidth: '680px', margin: '40px auto', padding: '0 20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div><h1 style={{ fontSize: '22px', marginBottom: '4px' }}>Edit Artwork</h1><p style={{ fontSize: '13px', color: '#777' }}>Update the details for this artwork.</p></div>
        <button onClick={() => setShowDeleteModal(true)} style={{ padding: '8px 16px', background: 'none', border: '1px solid #ccc', color: '#b00020', fontSize: '13px', cursor: 'pointer' }}>🗑 Delete</button>
      </div>

      {error && <div style={{ background: '#ffebee', border: '1px solid #f5c2c2', padding: '12px', fontSize: '13px', color: '#b00020', marginBottom: '16px' }}>{error}</div>}

      <div style={{ background: '#fff', border: '1px solid #ddd', padding: '28px' }}>
        <form onSubmit={handleSubmit}>
          <label style={labelStyle}>Artwork Image</label>
          <div style={{ border: `2px dashed ${preview ? '#111' : '#ccc'}`, padding: preview ? 0 : '24px', textAlign: 'center', position: 'relative', cursor: 'pointer' }}>
            <input type="file" accept="image/*" onChange={e => { setImage(e.target.files[0]); setPreview(URL.createObjectURL(e.target.files[0])); }}
              style={{ position: 'absolute', inset: 0, opacity: 0, cursor: 'pointer', width: '100%', height: '100%' }} />
            {preview ? <img src={preview} alt="Preview" style={{ width: '100%', maxHeight: '280px', objectFit: 'contain', display: 'block', background: '#f2f2f2' }} />
              : <p style={{ fontSize: '13px', color: '#888', margin: 0 }}>Click to change image</p>}
          </div>

          <label style={labelStyle}>Title *</label>
          <input value={form.title} onChange={update('title')} style={inputStyle} />

          <label style={labelStyle}>Description</label>
          <textarea value={form.description} onChange={update('description')} rows={3} style={{ ...inputStyle, resize: 'vertical' }} />

          <div style={{ display: 'flex', gap: '16px' }}>
            <div style={{ flex: 1 }}>
              <label style={labelStyle}>Category</label>
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

          <div style={{ display: 'flex', gap: '16px' }}>
            <div style={{ flex: 1 }}>
              <label style={labelStyle}>Dimensions (cm)</label>
              <input value={form.dimensions} onChange={update('dimensions')} placeholder="e.g. 60 × 80" style={inputStyle} />
            </div>
            <div style={{ flex: 1 }}>
              <label style={labelStyle}>Year</label>
              <input type="number" value={form.year} onChange={update('year')} min="1900" max="2099" style={inputStyle} />
            </div>
          </div>

          <label style={labelStyle}>Price (EUR) *</label>
          <input type="number" value={form.price} onChange={update('price')} min="1" style={inputStyle} />

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: '16px' }}>
            <input type="checkbox" id="available" checked={form.available} onChange={update('available')} style={{ width: '16px', height: '16px', accentColor: '#6D1A2A' }} />
            <label htmlFor="available" style={{ fontSize: '14px', cursor: 'pointer' }}>Available for purchase</label>
          </div>

          <div style={{ display: 'flex', gap: '12px', marginTop: '28px', paddingTop: '20px', borderTop: '1px solid #eee' }}>
            <button type="submit" style={{ padding: '10px 28px', background: '#6D1A2A', color: 'white', border: 'none', fontSize: '14px', cursor: 'pointer' }}>Save Changes</button>
            <button type="button" onClick={() => navigate('/')} style={{ padding: '10px 28px', background: 'none', color: '#555', border: '1px solid #ccc', fontSize: '14px', cursor: 'pointer' }}>Cancel</button>
          </div>
        </form>
      </div>

      {showDeleteModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 999, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ background: '#fff', padding: '28px', width: '360px', border: '1px solid #ddd' }}>
            <h3 style={{ fontSize: '18px', marginBottom: '10px' }}>Delete Artwork?</h3>
            <p style={{ fontSize: '13px', color: '#555', marginBottom: '20px' }}>This action cannot be undone.</p>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button onClick={() => setShowDeleteModal(false)} style={{ flex: 1, padding: '10px', border: '1px solid #ccc', background: 'none', cursor: 'pointer' }}>Cancel</button>
              <button onClick={handleDelete} style={{ flex: 1, padding: '10px', background: '#b00020', color: 'white', border: 'none', cursor: 'pointer' }}>Yes, Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
