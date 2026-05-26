import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { register } from '../services/api';
import { useAuth } from '../context/AuthContext';

const Register = () => {
  const [form, setForm] = useState({ firstName: '', lastName: '', email: '', password: '', confirmPassword: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { loginUser } = useAuth();
  const navigate = useNavigate();

  const update = (field) => (e) => setForm({ ...form, [field]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!form.firstName.trim()) { setError('First name is required.'); return; }
    if (!form.lastName.trim()) { setError('Last name is required.'); return; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) { setError('Please enter a valid email.'); return; }
    if (form.password.length < 6) { setError('Password must be at least 6 characters.'); return; }
    if (form.password !== form.confirmPassword) { setError('Passwords do not match.'); return; }

    setLoading(true);
    try {
      const res = await register({ firstName: form.firstName, lastName: form.lastName, email: form.email, password: form.password });
      loginUser(res.data.user, res.data.token);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.error || 'Registration failed.');
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = { width: '100%', padding: '9px 10px', border: '1px solid #ccc', fontFamily: 'Arial, sans-serif', fontSize: '14px', color: '#111', background: '#fff', boxSizing: 'border-box' };
  const labelStyle = { display: 'block', fontSize: '13px', color: '#555', marginBottom: '4px', marginTop: '14px' };
  const rowStyle = { display: 'flex', gap: '12px' };

  return (
    <div style={{ minHeight: 'calc(100vh - 64px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '3rem 1rem', background: '#f9f9f9' }}>
      <div style={{ width: '100%', maxWidth: '420px', border: '1px solid #ddd', padding: '2.5rem 2rem', background: '#fff' }}>
        <h2 style={{ fontFamily: 'Georgia, serif', fontSize: '1.8rem', fontWeight: 400, marginBottom: '0.3rem' }}>
          Create an <span style={{ color: '#6D1A2A', fontStyle: 'italic' }}>account</span>
        </h2>
        <p style={{ fontSize: '13px', color: '#777', marginBottom: '2rem' }}>
          Already have one? <Link to="/login" style={{ color: '#6D1A2A', textDecoration: 'none' }}>Sign in</Link>
        </p>

        {error && <div style={{ background: '#ffebee', border: '1px solid #f5c2c2', padding: '10px 14px', fontSize: '13px', color: '#b00020', marginBottom: '14px' }}>{error}</div>}

        <form onSubmit={handleSubmit}>
          <div style={rowStyle}>
            <div style={{ flex: 1 }}>
              <label style={labelStyle}>First name</label>
              <input value={form.firstName} onChange={update('firstName')} placeholder="Ana" style={inputStyle} />
            </div>
            <div style={{ flex: 1 }}>
              <label style={labelStyle}>Last name</label>
              <input value={form.lastName} onChange={update('lastName')} placeholder="Petrov" style={inputStyle} />
            </div>
          </div>

          <label style={labelStyle}>Email</label>
          <input type="email" value={form.email} onChange={update('email')} placeholder="you@email.com" style={inputStyle} />

          <label style={labelStyle}>Password</label>
          <input type="password" value={form.password} onChange={update('password')} placeholder="Min. 6 characters" style={inputStyle} />

          <label style={labelStyle}>Confirm password</label>
          <input type="password" value={form.confirmPassword} onChange={update('confirmPassword')} placeholder="Repeat password" style={inputStyle} />

          <button type="submit" disabled={loading}
            style={{ width: '100%', padding: '10px', background: '#6D1A2A', border: 'none', color: 'white', fontSize: '14px', cursor: loading ? 'not-allowed' : 'pointer', marginTop: '20px', opacity: loading ? 0.7 : 1 }}>
            {loading ? 'Creating account...' : 'Create Account'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Register;
