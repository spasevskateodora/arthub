import { useNavigate } from 'react-router-dom';
import { formatPrice, truncate } from '../pipes/filters';

const ArtworkCard = ({ artwork }) => {
  const navigate = useNavigate();

  return (
    <div style={{ background: '#fff', border: '1px solid #E0E0E0', transition: 'transform 0.2s', cursor: 'pointer' }}
      onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-4px)'}
      onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
    >
      {/* Image */}
      <div style={{ position: 'relative', aspectRatio: '3/4', overflow: 'hidden' }}
        onClick={() => navigate(`/artwork/${artwork._id}`)}>
        {artwork.image
          ? <img src={artwork.image} alt={artwork.title} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
          : <div style={{ width: '100%', height: '100%', background: 'linear-gradient(160deg, #222 0%, #666 50%, #aaa 100%)' }} />
        }
        {!artwork.available && (
          <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ border: '2px solid rgba(255,255,255,0.8)', color: 'white', padding: '6px 16px', fontSize: '11px', letterSpacing: '3px', textTransform: 'uppercase', transform: 'rotate(-8deg)' }}>
              Sold Out
            </div>
          </div>
        )}
      </div>

      {/* Info */}
      <div style={{ padding: '0.9rem 1rem', borderTop: '1px solid #E0E0E0' }}
        onClick={() => navigate(`/artwork/${artwork._id}`)}>
        <div style={{ fontSize: '0.62rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: '#6D1A2A', marginBottom: '0.3rem', fontWeight: 500 }}>
          {artwork.category?.name || ''}
        </div>
        <div style={{ fontFamily: 'Georgia, serif', fontSize: '1.1rem', marginBottom: '0.2rem' }}>
          {artwork.title}
        </div>
        <div style={{ fontSize: '0.75rem', color: '#5A5A5A', marginBottom: '0.6rem' }}>
          {truncate(artwork.description, 50)}
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '0.6rem', borderTop: '1px solid #F2F2F2' }}>
          <span style={{ fontFamily: 'Georgia, serif', fontSize: '1.1rem', fontWeight: 'bold', color: artwork.available ? '#0D0D0D' : '#aaa', textDecoration: artwork.available ? 'none' : 'line-through' }}>
            {formatPrice(artwork.price)}
          </span>
        </div>
      </div>

      {/* Buy button */}
      <div style={{ padding: '0 1rem 1rem' }}>
        <button
          disabled={!artwork.available}
          onClick={() => { localStorage.setItem('buyArtworkId', artwork._id); navigate('/checkout'); }}
          style={{
            width: '100%', padding: '0.5rem',
            background: artwork.available ? '#6D1A2A' : '#E0E0E0',
            color: artwork.available ? 'white' : '#aaa',
            border: 'none', fontSize: '0.75rem', letterSpacing: '0.08em',
            textTransform: 'uppercase', cursor: artwork.available ? 'pointer' : 'not-allowed'
          }}>
          {artwork.available ? 'Buy Original' : 'Sold Out'}
        </button>
      </div>
    </div>
  );
};

export default ArtworkCard;
