import { useState, useEffect } from 'react';
import { getArtworks, getCategories } from '../services/api';
import { getDecor } from '../services/unsplash';
import ArtworkCard from '../components/ArtworkCard';
console.log("DECOR:", getDecor);

const Gallery = () => {
  const [artworks, setArtworks] = useState([]);
  const [categories, setCategories] = useState([]);
  const [decor, setDecor] = useState([]);
  const [activeCategory, setActiveCategory] = useState('');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([getArtworks(), getCategories()])
      .then(([artRes, catRes]) => {
        setArtworks(artRes.data);
        setCategories(catRes.data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  
    getDecor().then(setDecor);
  }, []);

  const filtered = artworks.filter(a => {
    const catOk = !activeCategory || a.category?._id === activeCategory;
    const searchOk = !search || a.title.toLowerCase().includes(search.toLowerCase());
    return catOk && searchOk;
  });

  return (
    <div>
      {/* Hero */}
      <section style={{ padding: '5rem 3rem 3rem', maxWidth: '1200px', margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4rem', alignItems: 'center' }}>
        <div style={{ position: 'relative' }}>
          <div style={{ width: '3px', height: '60px', background: '#6D1A2A', position: 'absolute', left: '-20px', top: '8px' }}></div>
          <h1 style={{ fontFamily: 'Georgia, serif', fontSize: 'clamp(2.5rem, 5vw, 4rem)', fontWeight: 300, lineHeight: 1.08, marginBottom: '1.5rem' }}>
          Discover <em style={{ fontStyle: 'italic', color: '#6D1A2A' }}>unique</em><br />and original art
          </h1>
          <p style={{ color: '#5A5A5A', fontSize: '0.95rem', lineHeight: 1.85, marginBottom: '2rem', maxWidth: '400px' }}>
            Browse one-of-a-kind original artworks. Register to purchase directly from the collection.
          </p>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <a href="/search" style={{ background: '#6D1A2A', color: 'white', padding: '0.75rem 2rem', textDecoration: 'none', fontSize: '0.8rem', letterSpacing: '0.07em', textTransform: 'uppercase' }}>Browse Gallery</a>
            <a href="/register" style={{ background: 'none', border: '1px solid #0D0D0D', color: '#0D0D0D', padding: '0.75rem 2rem', textDecoration: 'none', fontSize: '0.8rem', letterSpacing: '0.07em', textTransform: 'uppercase' }}>Create Account</a>
          </div>
          <div style={{ display: 'flex', gap: '3rem', marginTop: '3rem', paddingTop: '2rem', borderTop: '1px solid #E0E0E0' }}>
            <div>
              <div style={{ fontFamily: 'Georgia, serif', fontSize: '2.2rem', fontWeight: 'bold' }}>{artworks.length}</div>
              <div style={{ fontSize: '0.72rem', color: '#5A5A5A', letterSpacing: '0.08em', textTransform: 'uppercase' }}>Artworks</div>
            </div>
            <div>
              <div style={{ fontFamily: 'Georgia, serif', fontSize: '2.2rem', fontWeight: 'bold' }}>{artworks.filter(a => a.available).length}</div>
              <div style={{ fontSize: '0.72rem', color: '#5A5A5A', letterSpacing: '0.08em', textTransform: 'uppercase' }}>Available</div>
            </div>
          </div>
        </div>
    
      </section>

      {/* Filters */}
      <section style={{ padding: '2rem 3rem', maxWidth: '1200px', margin: '0 auto', borderTop: '1px solid #E0E0E0' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
          <span style={{ fontSize: '0.72rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: '#5A5A5A', marginRight: '0.5rem' }}>Category</span>
          <button onClick={() => setActiveCategory('')}
            style={{ padding: '0.38rem 1rem', border: '1px solid', borderColor: !activeCategory ? '#6D1A2A' : '#E0E0E0', background: !activeCategory ? '#6D1A2A' : 'none', color: !activeCategory ? 'white' : '#5A5A5A', fontSize: '0.78rem', cursor: 'pointer', textTransform: 'uppercase' }}>
            All
          </button>
          {categories.map(c => (
            <button key={c._id} onClick={() => setActiveCategory(c._id)}
              style={{ padding: '0.38rem 1rem', border: '1px solid', borderColor: activeCategory === c._id ? '#6D1A2A' : '#E0E0E0', background: activeCategory === c._id ? '#6D1A2A' : 'none', color: activeCategory === c._id ? 'white' : '#5A5A5A', fontSize: '0.78rem', cursor: 'pointer', textTransform: 'uppercase' }}>
              {c.name}
            </button>
          ))}
          <div style={{ marginLeft: 'auto', display: 'flex', border: '1px solid #E0E0E0', overflow: 'hidden' }}>
            <input value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Search artworks..."
              style={{ padding: '0.42rem 1rem', border: 'none', fontFamily: 'Arial, sans-serif', fontSize: '0.85rem', outline: 'none', width: '240px' }} />
            <button style={{ padding: '0.42rem 0.9rem', background: '#0D0D0D', border: 'none', color: 'white', cursor: 'pointer' }}>🔍</button>
          </div>
        </div>
      </section>

      {/* Gallery Grid */}
      <section style={{ padding: '1.5rem 3rem 5rem', maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: '2rem' }}>
          <h2 style={{ fontFamily: 'Georgia, serif', fontSize: '1.9rem', fontWeight: 400 }}>Available Works</h2>
          <span style={{ fontSize: '0.78rem', color: '#5A5A5A' }}>{filtered.length} work{filtered.length !== 1 ? 's' : ''}</span>
        </div>

        {loading && <div style={{ textAlign: 'center', padding: '40px', color: '#5A5A5A' }}>Loading...</div>}

        {!loading && filtered.length === 0 && (
          <div style={{ textAlign: 'center', padding: '60px', color: '#aaa' }}>No artworks found.</div>
        )}

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.5rem' }}>
          {filtered.map(a => <ArtworkCard key={a._id} artwork={a} />)}
        </div>
      </section>
      <section style={{ background: '#0D0D0D', color: '#FAFAFA', padding: '5rem 3rem' }}>
  <div style={{ maxWidth: '1200px', margin: '0 auto' }}>

    <h2 style={{ fontFamily: 'Georgia, serif', fontSize: '2rem', fontWeight: 300 }}>
      Home Decor Inspiration
    </h2>

    <p style={{ fontSize: '0.85rem', color: '#888', marginBottom: '2.5rem' }}>
      Ideas from Unsplash
    </p>

    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem' }}>

      {decor.length === 0 && (
        <div style={{ color: '#666', gridColumn: '1/-1' }}>
          Loading...
        </div>
      )}

      {decor.map(item => (
        <a
          key={item.id}
          href={item.links.html}
          target="_blank"
          rel="noreferrer"
          style={{ border: '1px solid #2a2a2a', display: 'block', textDecoration: 'none' }}
        >
          <img
            src={item.urls.small}
            alt={item.alt_description}
            style={{ width: '100%', aspectRatio: '4/3', objectFit: 'cover' }}
          />

          <div style={{ padding: '1rem', borderTop: '1px solid #2a2a2a' }}>
            <h4 style={{ fontFamily: 'Georgia, serif', fontSize: '1rem', color: '#FAFAFA' }}>
              {item.alt_description || 'Interior Design'}
            </h4>
            <p style={{ fontSize: '0.73rem', color: '#666' }}>
              Photo by {item.user.name}
            </p>
          </div>
        </a>
      ))}

    </div>
  </div>
</section>
      
    </div>
  );
};

export default Gallery;
