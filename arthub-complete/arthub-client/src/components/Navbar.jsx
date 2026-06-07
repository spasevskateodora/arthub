import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const styles = {
  nav: { background: '#fff', borderBottom: '1px solid #E0E0E0', padding: '0 3rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '64px', position: 'sticky', top: 0, zIndex: 100 },
  logo: { fontFamily: 'Georgia, serif', fontSize: '1.6rem', fontWeight: 'bold', textDecoration: 'none', color: '#0D0D0D' },
  logoSpan: { color: '#6D1A2A' },
  links: { display: 'flex', gap: '2rem', listStyle: 'none', margin: 0, padding: 0 },
  link: { textDecoration: 'none', color: '#5A5A5A', fontSize: '0.8rem', letterSpacing: '0.1em', textTransform: 'uppercase' },
  actions: { display: 'flex', gap: '1rem', alignItems: 'center' },
  btnSolid: { background: '#6D1A2A', border: '1px solid #6D1A2A', color: 'white', padding: '0.45rem 1.2rem', fontSize: '0.78rem', letterSpacing: '0.07em', textTransform: 'uppercase', cursor: 'pointer', textDecoration: 'none' },
  btnGhost: { background: 'none', border: '1px solid #0D0D0D', color: '#0D0D0D', padding: '0.45rem 1.2rem', fontSize: '0.78rem', letterSpacing: '0.07em', textTransform: 'uppercase', cursor: 'pointer', textDecoration: 'none' },
  signIn: { fontSize: '0.78rem', color: '#5A5A5A', textDecoration: 'none' },
  adminBadge: { fontSize: '11px', background: '#6D1A2A', color: 'white', padding: '2px 8px' },
};

const Navbar = () => {
  const { user, logoutUser } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logoutUser();
    navigate('/');
  };

  return (
    <nav style={styles.nav}>
      <Link to="/" style={styles.logo}>Art<span style={styles.logoSpan}>Hub</span></Link>

      <ul style={styles.links}>
        <li><Link to="/" style={styles.link}>Gallery</Link></li>
        <li><Link to="/search" style={styles.link}>Browse</Link></li>

      </ul>

      <div style={styles.actions}>
        {!user && (
          <>
            <Link to="/login" style={styles.signIn}>Sign in</Link>
            <Link to="/register" style={styles.btnSolid}>Register</Link>
          </>
        )}
        {user?.role === 'admin' && (
          <>
            <span style={styles.adminBadge}>Admin</span>
            <Link to="/artwork/add" style={styles.signIn}>Add Artwork</Link>
            <Link to="/admin" style={styles.btnSolid}>Dashboard</Link>
            <button onClick={handleLogout} style={{ ...styles.signIn, background: 'none', border: 'none', cursor: 'pointer' }}>Sign out</button>
          </>
        )}
        {user?.role === 'buyer' && (
          <>
            <span style={styles.signIn}>Hi, {user.firstName}</span>
            <Link to="/orders" style={styles.btnGhost}>My Orders</Link>
            <button onClick={handleLogout} style={{ ...styles.signIn, background: 'none', border: 'none', cursor: 'pointer' }}>Sign out</button>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
