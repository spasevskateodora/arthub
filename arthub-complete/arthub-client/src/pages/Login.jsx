import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { login } from '../services/api';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { loginUser } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { setError('Please enter a valid email.'); return; }
    if (password.length < 6) { setError('Password must be at least 6 characters.'); return; }

    setLoading(true);
    try {
      const res = await login({ email, password });
      loginUser(res.data.user, res.data.token);
      res.data.user.role === 'admin' ? navigate('/admin') : navigate('/');
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed.');
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = { width: '100%', padding: '9px 10px', border: '1px solid #ccc', fontFamily: 'Arial, sans-serif', fontSize: '14px', color: '#111', background: '#fff', boxSizing: 'border-box' };
  const labelStyle = { display: 'block', fontSize: '13px', color: '#555', marginBottom: '4px', marginTop: '14px' };

  return (
    <div style={{ minHeight: 'calc(100vh - 64px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '3rem 1rem', background: '#f9f9f9' }}>
      <div style={{ width: '100%', maxWidth: '400px', border: '1px solid #ddd', padding: '2.5rem 2rem', background: '#fff' }}>
        <h2 style={{ fontFamily: 'Georgia, serif', fontSize: '1.8rem', fontWeight: 400, marginBottom: '0.3rem' }}>
          Sign in to <span style={{ color: '#6D1A2A', fontStyle: 'italic' }}>ArtHub</span>
        </h2>
        <p style={{ fontSize: '13px', color: '#777', marginBottom: '2rem' }}>
          New here? <Link to="/register" style={{ color: '#6D1A2A', textDecoration: 'none' }}>Create an account</Link>
        </p>

        {error && <div style={{ background: '#ffebee', border: '1px solid #f5c2c2', padding: '10px 14px', fontSize: '13px', color: '#b00020', marginBottom: '14px' }}>{error}</div>}

        <form onSubmit={handleSubmit}>
          <label style={labelStyle}>Email</label>
          <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="your@email.com" style={inputStyle} />

          <label style={labelStyle}>Password</label>
          <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" style={inputStyle} />

          <button type="submit" disabled={loading}
            style={{ width: '100%', padding: '10px', background: '#6D1A2A', border: 'none', color: 'white', fontSize: '14px', cursor: loading ? 'not-allowed' : 'pointer', marginTop: '20px', opacity: loading ? 0.7 : 1 }}>
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', margin: '1rem 0' }}>
          <hr style={{ flex: 1, border: 'none', borderTop: '1px solid #ddd' }} />
          <span style={{ fontSize: '12px', color: '#ccc' }}>or</span>
          <hr style={{ flex: 1, border: 'none', borderTop: '1px solid #ddd' }} />
        </div>

        <Link to="/" style={{ display: 'block', textAlign: 'center', fontSize: '13px', color: '#777', textDecoration: 'none', padding: '9px', border: '1px solid #ddd' }}>
          Continue as guest
        </Link>
      </div>
    </div>
  );
};

export default Login;
