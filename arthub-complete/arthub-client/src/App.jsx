import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Gallery from './pages/Gallery';
import Login from './pages/Login';
import Register from './pages/Register';
import ArtworkDetail from './pages/ArtworkDetail';
import ArtworkAdd from './pages/ArtworkAdd';
import { ArtworkEdit } from './pages/ArtworkEdit';
import { Search, Checkout, Orders } from './pages/Pages';
import AdminDashboard from './pages/AdminDashboard';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Navbar />
        <main>
          <Routes>
            <Route path="/" element={<Gallery />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/search" element={<Search />} />
            <Route path="/artwork/:id" element={<ArtworkDetail />} />
            <Route path="/artwork/add" element={<ArtworkAdd />} />
            <Route path="/artwork/edit/:id" element={<ArtworkEdit />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/orders" element={<Orders />} />
            <Route path="/admin" element={<AdminDashboard />} />
          </Routes>
        </main>
        <Footer />
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
