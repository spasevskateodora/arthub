import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getArtwork, getReviews, createReview, deleteArtwork } from '../services/api';
import { formatPrice, formatDate, capitalize } from '../pipes/filters';
import { useAuth } from '../context/AuthContext';

const ArtworkDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [artwork, setArtwork] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([getArtwork(id), getReviews(id)])
      .then(([artRes, revRes]) => {
        setArtwork(artRes.data);
        setReviews(revRes.data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [id]);

  const handleReview = async (e) => {
    e.preventDefault();
    if (!comment.trim()) return;
    try {
      const res = await createReview({ artworkId: id, rating, comment, guestName: user?.firstName || 'Guest' });
      setReviews([res.data, ...reviews]);
      setComment('');
    } catch {}
  };

  const handleDelete = async () => {
    try {
      await deleteArtwork(id);
      navigate('/');
    } catch {}
  };

  const inputStyle = { width: '100%', padding: '9px 10px', border: '1px solid #ccc', fontFamily: 'Arial, sans-serif', fontSize: '14px', color: '#111', background: '#fff', boxSizing: 'border-box' };

  if (loading) return <div style={{ textAlign: 'center', padding: '60px', color: '#5A5A5A' }}>Loading...</div>;
  if (!artwork) return <div style={{ textAlign: 'center', padding: '60px', color: '#5A5A5A' }}>Artwork not found.</div>;

  return (
    <div style={{ maxWidth: '960px', margin: '40px auto', padding: '0 20px' }}>

      {/* Back */}
      <a href="/" style={{ fontSize: '13px', color: '#777', textDecoration: 'none', display: 'inline-block', marginBottom: '20px' }}>← Back to gallery</a>

      {/* Main layout */}
      <div style={{ display: 'flex', gap: '40px', alignItems: 'flex-start', marginBottom: '40px' }}>

        {/* Image */}
        <div style={{ flex: 1, position: 'relative' }}>
          {artwork.image
            ? <img src={artwork.image} alt={artwork.title} style={{ width: '100%', aspectRatio: '3/4', objectFit: 'cover', display: 'block' }} />
            : <div style={{ width: '100%', aspectRatio: '3/4', background: 'linear-gradient(160deg, #222 0%, #666 50%, #aaa 100%)' }} />
          }
          {!artwork.available && (
            <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <div style={{ border: '2px solid rgba(255,255,255,0.8)', color: 'white', padding: '8px 20px', fontSize: '13px', letterSpacing: '3px', textTransform: 'uppercase', transform: 'rotate(-8deg)' }}>Sold Out</div>
            </div>
          )}
        </div>

        {/* Info */}
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: '12px', color: '#6D1A2A', textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '8px' }}>
            {artwork.category?.name}
          </div>
          <h1 style={{ fontFamily: 'Georgia, serif', fontSize: '28px', fontWeight: 'bold', marginBottom: '6px' }}>{artwork.title}</h1>
          <p style={{ fontSize: '14px', color: '#555', marginBottom: '20px' }}>{artwork.description}</p>

          {/* Price */}
          <div style={{ border: '1px solid #ddd', padding: '16px', marginBottom: '20px', background: '#fff' }}>
            <div style={{ fontFamily: 'Georgia, serif', fontSize: '26px', fontWeight: 'bold', color: artwork.available ? '#111' : '#aaa', textDecoration: artwork.available ? 'none' : 'line-through' }}>
              {formatPrice(artwork.price)}
            </div>
          </div>

          {/* Stock */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px', fontSize: '13px', color: '#555' }}>
            <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: artwork.available ? '#2e7d32' : '#aaa' }}></div>
            <span>{artwork.available ? 'Available' : 'Sold out'}</span>
          </div>

          {/* Details */}
          <ul style={{ listStyle: 'none', padding: 0, marginBottom: '20px', fontSize: '14px' }}>
            {artwork.medium && <li style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #eee' }}><span style={{ color: '#888' }}>Medium</span><span>{capitalize(artwork.medium)}</span></li>}
            {artwork.dimensions && <li style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #eee' }}><span style={{ color: '#888' }}>Dimensions</span><span>{artwork.dimensions}</span></li>}
            {artwork.year && <li style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #eee' }}><span style={{ color: '#888' }}>Year</span><span>{artwork.year}</span></li>}
          </ul>

          {/* Buy button */}
          <button
            disabled={!artwork.available}
            onClick={() => { localStorage.setItem('buyArtworkId', id); navigate('/checkout'); }}
            style={{ width: '100%', padding: '12px', background: artwork.available ? '#6D1A2A' : '#ccc', color: artwork.available ? 'white' : '#888', border: 'none', fontSize: '14px', cursor: artwork.available ? 'pointer' : 'not-allowed', marginBottom: '10px' }}>
            {artwork.available ? `Buy Original — ${formatPrice(artwork.price)}` : 'Sold Out'}
          </button>

          {/* Admin buttons */}
          {user?.role === 'admin' && (
            <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
              <button onClick={() => navigate(`/artwork/edit/${id}`)}
                style={{ flex: 1, padding: '9px', background: 'none', border: '1px solid #ccc', fontSize: '13px', cursor: 'pointer' }}>
                ✏️ Edit
              </button>
              <button onClick={() => setShowDeleteModal(true)}
                style={{ flex: 1, padding: '9px', background: 'none', border: '1px solid #b00020', color: '#b00020', fontSize: '13px', cursor: 'pointer' }}>
                🗑 Delete
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Reviews */}
      <div style={{ borderTop: '2px solid #6D1A2A', paddingTop: '8px', display: 'inline-block', fontSize: '18px', fontWeight: 'bold', marginBottom: '16px' }}>Reviews</div>

      <div style={{ marginBottom: '30px' }}>
        {reviews.length === 0 && <p style={{ fontSize: '14px', color: '#aaa' }}>No reviews yet. Be the first!</p>}
        {reviews.map((r, i) => (
          <div key={i} style={{ background: '#fff', border: '1px solid #ddd', padding: '16px', marginBottom: '12px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
              <div>
                <span style={{ fontWeight: 'bold', fontSize: '14px' }}>{r.guestName || 'Anonymous'}</span>
                <span style={{ color: '#6D1A2A', fontSize: '14px', marginLeft: '8px' }}>{'★'.repeat(r.rating)}{'☆'.repeat(5 - r.rating)}</span>
              </div>
              <span style={{ fontSize: '12px', color: '#aaa' }}>{formatDate(r.createdAt)}</span>
            </div>
            <p style={{ fontSize: '13px', color: '#555', margin: 0 }}>{r.comment}</p>
          </div>
        ))}
      </div>

      {/* Add review */}
      <div style={{ background: '#fff', border: '1px solid #ddd', padding: '20px', marginBottom: '40px' }}>
        <h3 style={{ fontSize: '15px', marginBottom: '14px' }}>Leave a review</h3>
        <form onSubmit={handleReview}>
          <label style={{ display: 'block', fontSize: '13px', color: '#555', marginBottom: '4px' }}>Rating</label>
          <select value={rating} onChange={e => setRating(Number(e.target.value))} style={inputStyle}>
            <option value={5}>★★★★★ — Excellent</option>
            <option value={4}>★★★★☆ — Good</option>
            <option value={3}>★★★☆☆ — Average</option>
            <option value={2}>★★☆☆☆ — Poor</option>
            <option value={1}>★☆☆☆☆ — Terrible</option>
          </select>
          <label style={{ display: 'block', fontSize: '13px', color: '#555', marginBottom: '4px', marginTop: '12px' }}>Your review</label>
          <textarea value={comment} onChange={e => setComment(e.target.value)} placeholder="Write your review here..." rows={3}
            style={{ ...inputStyle, resize: 'vertical' }} />
          <button type="submit" style={{ marginTop: '12px', padding: '9px 20px', background: '#6D1A2A', color: 'white', border: 'none', fontSize: '13px', cursor: 'pointer' }}>
            Submit Review
          </button>
        </form>
      </div>

      {/* Delete Modal */}
      {showDeleteModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 999, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ background: '#fff', padding: '28px', width: '360px', border: '1px solid #ddd', position: 'relative' }}>
            <button onClick={() => setShowDeleteModal(false)} style={{ position: 'absolute', top: '12px', right: '14px', background: 'none', border: 'none', fontSize: '18px', cursor: 'pointer', color: '#888' }}>✕</button>
            <h3 style={{ fontSize: '18px', marginBottom: '10px' }}>Delete Artwork?</h3>
            <p style={{ fontSize: '13px', color: '#555', marginBottom: '20px' }}>Are you sure you want to delete <strong>{artwork.title}</strong>? This cannot be undone.</p>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button onClick={() => setShowDeleteModal(false)} style={{ flex: 1, padding: '10px', border: '1px solid #ccc', background: 'none', cursor: 'pointer', fontSize: '13px' }}>Cancel</button>
              <button onClick={handleDelete} style={{ flex: 1, padding: '10px', background: '#b00020', color: 'white', border: 'none', cursor: 'pointer', fontSize: '13px' }}>Yes, Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ArtworkDetail;
