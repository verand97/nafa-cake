import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  ShoppingCart, 
  Package, 
  Users, 
  Settings, 
  Search, 
  Plus, 
  Minus, 
  Trash2,
  ArrowRight,
  CakeSlice,
  Croissant,
  Coffee,
  CheckCircle2,
  UtensilsCrossed,
  ShoppingBag
} from 'lucide-react';
import './App.css';

const PRODUCTS = [
  { id: 1, name: 'Roti Sourdough', category: 'Roti', price: 35000, stock: 12, Icon: Package },
  { id: 2, name: 'Baguette Prancis', category: 'Roti', price: 25000, stock: 20, Icon: Package },
  { id: 3, name: 'Croissant Cokelat', category: 'Pastry', price: 28000, stock: 15, Icon: Croissant },
  { id: 4, name: 'Croissant Almond', category: 'Pastry', price: 32000, stock: 8, Icon: Croissant },
  { id: 5, name: 'Cheesecake Stroberi', category: 'Kue', price: 250000, stock: 3, Icon: CakeSlice },
  { id: 6, name: 'Black Forest', category: 'Kue', price: 280000, stock: 2, Icon: CakeSlice },
  { id: 7, name: 'Cinnamon Roll', category: 'Pastry', price: 22000, stock: 10, Icon: Croissant },
  { id: 8, name: 'Matcha Latte', category: 'Minuman', price: 35000, stock: 50, Icon: Coffee },
  { id: 9, name: 'Kopi Espresso', category: 'Minuman', price: 20000, stock: 100, Icon: Coffee },
  { id: 10, name: 'Muffin Blueberry', category: 'Pastry', price: 24000, stock: 18, Icon: CakeSlice },
  { id: 11, name: 'Pretzel Asin', category: 'Roti', price: 18000, stock: 25, Icon: Package },
  { id: 12, name: 'Pancake Sirup', category: 'Pastry', price: 30000, stock: 15, Icon: CakeSlice },
];

const CATEGORIES = ['Semua', 'Roti', 'Kue', 'Pastry', 'Minuman'];

// Dummy data untuk halaman lain
const DUMMY_ORDERS = [
  { id: '#ORD-1023', date: '25 Jun 2026 12:45', customer: 'Umum', total: 120000, status: 'Selesai' },
  { id: '#ORD-1024', date: '25 Jun 2026 13:10', customer: 'Bapak Budi', total: 340000, status: 'Selesai' },
  { id: '#ORD-1025', date: '25 Jun 2026 13:30', customer: 'Ibu Siti', total: 75000, status: 'Diproses' },
];

const DUMMY_CUSTOMERS = [
  { id: 'C001', name: 'Bapak Budi', phone: '0812-3456-7890', points: 120 },
  { id: 'C002', name: 'Ibu Siti', phone: '0813-9876-5432', points: 45 },
  { id: 'C003', name: 'Andi', phone: '0857-1111-2222', points: 300 },
];

const formatRupiah = (number) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(number);
};

function App() {
  const [currentView, setCurrentView] = useState('dashboard'); // 'dashboard', 'orders', 'products', 'customers', 'settings'
  const [activeCategory, setActiveCategory] = useState('Semua');
  const [searchQuery, setSearchQuery] = useState('');
  const [cart, setCart] = useState([]);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [orderType, setOrderType] = useState('Dine In');
  const [showCheckoutModal, setShowCheckoutModal] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const filteredProducts = PRODUCTS.filter(p => {
    const matchesCategory = activeCategory === 'Semua' || p.category === activeCategory;
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const addToCart = (product) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item => 
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const updateQuantity = (id, delta) => {
    setCart(prev => prev.map(item => {
      if (item.id === id) {
        const newQuantity = item.quantity + delta;
        return newQuantity > 0 ? { ...item, quantity: newQuantity } : item;
      }
      return item;
    }));
  };

  const removeFromCart = (id) => {
    setCart(prev => prev.filter(item => item.id !== id));
  };

  const clearCart = () => {
    if(window.confirm('Apakah Anda yakin ingin mengosongkan keranjang?')) {
      setCart([]);
    }
  };

  const handleCheckout = () => {
    if (cart.length === 0) return;
    setShowCheckoutModal(true);
  };

  const closeCheckoutAndReset = () => {
    setShowCheckoutModal(false);
    setCart([]);
  };

  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const tax = subtotal * 0.1;
  const total = subtotal + tax;
  const orderId = `#ORD-${Math.floor(1000 + Math.random() * 9000)}`;

  // Rendering Layout Utama (Dashboard / Kasir)
  const renderDashboard = () => (
    <div className="shop-layout">
      {/* Daftar Produk */}
      <div className="product-section">
        <div className="categories-wrapper">
          {CATEGORIES.map(cat => (
            <button 
              key={cat}
              className={`category-btn ${activeCategory === cat ? 'active' : ''}`}
              onClick={() => setActiveCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>
        
        <div className="products-grid">
          {filteredProducts.map(product => {
            const IconComponent = product.Icon;
            return (
              <div key={product.id} className="product-card" onClick={() => addToCart(product)}>
                <div className="product-icon-container">
                  <IconComponent size={64} strokeWidth={1.5} />
                </div>
                <div className="product-info">
                  <div className="product-name">{product.name}</div>
                  <div className="product-stock">{product.stock} tersisa</div>
                  <div className="product-bottom">
                    <div className="product-price format-currency">{formatRupiah(product.price)}</div>
                    <button className="add-button">
                      <Plus size={18} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Area Keranjang Belanja */}
      <div className="cart-section">
        <div className="cart-header">
          <div className="cart-title-row">
            <h2>Pesanan Saat Ini</h2>
            <span className="format-currency" style={{ color: 'var(--neon-purple)' }}>{orderId}</span>
          </div>
          
          <div className="order-type-toggle">
            <button 
              className={`order-type-btn ${orderType === 'Dine In' ? 'active' : ''}`}
              onClick={() => setOrderType('Dine In')}
            >
              <UtensilsCrossed size={16} style={{ display: 'inline', marginRight: '6px', verticalAlign: 'text-bottom' }}/>
              Makan di Tempat
            </button>
            <button 
              className={`order-type-btn ${orderType === 'Takeaway' ? 'active' : ''}`}
              onClick={() => setOrderType('Takeaway')}
            >
              <ShoppingBag size={16} style={{ display: 'inline', marginRight: '6px', verticalAlign: 'text-bottom' }}/>
              Bawa Pulang
            </button>
          </div>
        </div>
        
        {cart.length === 0 ? (
          <div className="empty-state">
            <ShoppingCart size={56} />
            <p>Belum ada produk yang<br/>ditambahkan ke keranjang</p>
          </div>
        ) : (
          <div className="cart-items">
            {cart.map(item => {
              const IconComponent = item.Icon;
              return (
                <div key={item.id} className="cart-item">
                  <div className="cart-item-icon">
                    <IconComponent size={24} />
                  </div>
                  <div className="cart-item-details">
                    <div className="cart-item-name" title={item.name}>{item.name}</div>
                    <div className="cart-item-price format-currency">{formatRupiah(item.price)}</div>
                  </div>
                  <div className="cart-item-actions">
                    <div className="cart-item-total format-currency">{formatRupiah(item.price * item.quantity)}</div>
                    <div className="qty-controls">
                      {item.quantity > 1 ? (
                        <button className="qty-btn" onClick={() => updateQuantity(item.id, -1)}><Minus size={14} /></button>
                      ) : (
                        <button className="qty-btn delete" onClick={() => removeFromCart(item.id)}><Trash2 size={14} /></button>
                      )}
                      <span className="qty-value">{item.quantity}</span>
                      <button className="qty-btn" onClick={() => updateQuantity(item.id, 1)}><Plus size={14} /></button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
        
        <div className="cart-summary">
          {cart.length > 0 && (
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '16px' }}>
              <button className="clear-cart-btn" onClick={clearCart}>
                <Trash2 size={14} /> Kosongkan
              </button>
            </div>
          )}
          
          <div className="summary-row">
            <span>Subtotal</span>
            <span className="format-currency">{formatRupiah(subtotal)}</span>
          </div>
          <div className="summary-row">
            <span>Pajak (10%)</span>
            <span className="format-currency">{formatRupiah(tax)}</span>
          </div>
          <div className="summary-row total">
            <span>Total Bayar</span>
            <span className="format-currency">{formatRupiah(total)}</span>
          </div>
          
          <button className="checkout-btn" disabled={cart.length === 0} onClick={handleCheckout}>
            <span>Proses Pembayaran</span>
            <ArrowRight size={20} />
          </button>
        </div>
      </div>
    </div>
  );

  // Halaman: Pesanan
  const renderOrders = () => (
    <div className="page-container">
      <div className="page-header">
        <h2>Riwayat Pesanan</h2>
        <p>Kelola dan pantau semua transaksi yang telah selesai.</p>
      </div>
      <table className="data-table">
        <thead>
          <tr>
            <th>ID Pesanan</th>
            <th>Tanggal & Waktu</th>
            <th>Pelanggan</th>
            <th>Total Bayar</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {DUMMY_ORDERS.map(order => (
            <tr key={order.id}>
              <td style={{ fontWeight: 600, color: 'var(--neon-purple)' }}>{order.id}</td>
              <td>{order.date}</td>
              <td>{order.customer}</td>
              <td className="format-currency">{formatRupiah(order.total)}</td>
              <td>
                <span className={`status-badge ${order.status === 'Selesai' ? 'success' : 'pending'}`}>
                  {order.status}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  // Halaman: Inventaris Produk
  const renderProducts = () => (
    <div className="page-container">
      <div className="page-header">
        <h2>Inventaris Produk</h2>
        <p>Kelola ketersediaan stok dan harga produk Anda.</p>
      </div>
      <table className="data-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Nama Produk</th>
            <th>Kategori</th>
            <th>Harga</th>
            <th>Stok Tersisa</th>
          </tr>
        </thead>
        <tbody>
          {PRODUCTS.map(product => (
            <tr key={product.id}>
              <td>PRD-{product.id.toString().padStart(3, '0')}</td>
              <td style={{ fontWeight: 600 }}>{product.name}</td>
              <td>{product.category}</td>
              <td className="format-currency">{formatRupiah(product.price)}</td>
              <td>{product.stock}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  // Halaman: Pelanggan
  const renderCustomers = () => (
    <div className="page-container">
      <div className="page-header">
        <h2>Manajemen Pelanggan</h2>
        <p>Daftar member dan poin loyalitas pelanggan setia Anda.</p>
      </div>
      <table className="data-table">
        <thead>
          <tr>
            <th>ID Member</th>
            <th>Nama Lengkap</th>
            <th>No. Telepon</th>
            <th>Poin Loyalitas</th>
          </tr>
        </thead>
        <tbody>
          {DUMMY_CUSTOMERS.map(customer => (
            <tr key={customer.id}>
              <td>{customer.id}</td>
              <td style={{ fontWeight: 600 }}>{customer.name}</td>
              <td>{customer.phone}</td>
              <td style={{ color: 'var(--lime-green)', fontWeight: 600 }}>{customer.points} Poin</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  // Halaman: Pengaturan
  const renderSettings = () => (
    <div className="page-container">
      <div className="page-header">
        <h2>Pengaturan Sistem</h2>
        <p>Konfigurasi aplikasi kasir Nafa Bakery.</p>
      </div>
      <div style={{ backgroundColor: 'var(--charcoal-lighter)', padding: '24px', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-subtle)' }}>
        <h3 style={{ marginBottom: '16px', color: 'var(--neon-purple)' }}>Informasi Toko</h3>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '8px' }}><strong>Nama Toko:</strong> Nafa Bakery</p>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '8px' }}><strong>Alamat:</strong> Jl. Raya Utama No. 123</p>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '24px' }}><strong>Pajak Default:</strong> 10%</p>
        
        <h3 style={{ marginBottom: '16px', color: 'var(--neon-purple)' }}>Versi Aplikasi</h3>
        <p style={{ color: 'var(--text-secondary)' }}>Nafa POS v1.0.0 (BETA)</p>
      </div>
    </div>
  );

  const renderView = () => {
    switch(currentView) {
      case 'dashboard': return renderDashboard();
      case 'orders': return renderOrders();
      case 'products': return renderProducts();
      case 'customers': return renderCustomers();
      case 'settings': return renderSettings();
      default: return renderDashboard();
    }
  };

  return (
    <div className="app-container">
      {/* Sidebar Navigasi */}
      <div className="sidebar">
        <div className="logo-container">
          <CakeSlice size={28} />
        </div>
        
        <button className={`nav-item ${currentView === 'dashboard' ? 'active' : ''}`} title="Dashboard Kasir" onClick={() => setCurrentView('dashboard')}><LayoutDashboard size={22} /></button>
        <button className={`nav-item ${currentView === 'orders' ? 'active' : ''}`} title="Riwayat Pesanan" onClick={() => setCurrentView('orders')}><ShoppingCart size={22} /></button>
        <button className={`nav-item ${currentView === 'products' ? 'active' : ''}`} title="Inventaris Produk" onClick={() => setCurrentView('products')}><Package size={22} /></button>
        <button className={`nav-item ${currentView === 'customers' ? 'active' : ''}`} title="Pelanggan" onClick={() => setCurrentView('customers')}><Users size={22} /></button>
        <div style={{ flex: 1 }}></div>
        <button className={`nav-item ${currentView === 'settings' ? 'active' : ''}`} title="Pengaturan" onClick={() => setCurrentView('settings')}><Settings size={22} /></button>
      </div>

      {/* Area Konten Utama */}
      <div className="main-content">
        {/* Header Atas */}
        <header className="header">
          <div className="header-title">
            <h1>Kasir Nafa Bakery</h1>
            <p>Sistem Manajemen Penjualan</p>
          </div>
          
          <div className="search-bar" style={{ opacity: currentView === 'dashboard' ? 1 : 0.3, pointerEvents: currentView === 'dashboard' ? 'auto' : 'none' }}>
            <Search size={18} color="var(--text-muted)" />
            <input 
              type="text" 
              placeholder="Cari nama produk..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              disabled={currentView !== 'dashboard'}
            />
          </div>
          
          <div className="header-actions">
            <div className="time-display">
              <span className="date">{currentTime.toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long' })}</span>
              <span className="time">{currentTime.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}</span>
            </div>
            <div className="user-profile">
              <div className="avatar">A</div>
              <span className="user-name">Admin</span>
            </div>
          </div>
        </header>

        {/* Konten Dinamis Berdasarkan Tab yang Aktif */}
        {renderView()}
      </div>

      {/* Checkout Success Modal */}
      {showCheckoutModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-icon">
              <CheckCircle2 size={40} />
            </div>
            <h2>Pembayaran Berhasil!</h2>
            <p>Pesanan <strong>{orderId}</strong> sejumlah <strong>{formatRupiah(total)}</strong> telah selesai diproses.</p>
            <button className="modal-btn" onClick={closeCheckoutAndReset}>
              Buat Pesanan Baru
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
