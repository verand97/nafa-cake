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
  ShoppingBag,
  ImagePlus,
  Edit,
  X
} from 'lucide-react';
import './App.css';

const INITIAL_PRODUCTS = [
  { id: 1, name: 'Roti Sourdough', category: 'Roti', price: 35000, stock: 12, Icon: Package, image: null },
  { id: 2, name: 'Baguette Prancis', category: 'Roti', price: 25000, stock: 20, Icon: Package, image: null },
  { id: 3, name: 'Croissant Cokelat', category: 'Pastry', price: 28000, stock: 15, Icon: Croissant, image: null },
  { id: 4, name: 'Croissant Almond', category: 'Pastry', price: 32000, stock: 8, Icon: Croissant, image: null },
  { id: 5, name: 'Cheesecake Stroberi', category: 'Kue', price: 250000, stock: 3, Icon: CakeSlice, image: null },
  { id: 6, name: 'Black Forest', category: 'Kue', price: 280000, stock: 2, Icon: CakeSlice, image: null },
  { id: 7, name: 'Cinnamon Roll', category: 'Pastry', price: 22000, stock: 10, Icon: Croissant, image: null },
  { id: 8, name: 'Matcha Latte', category: 'Minuman', price: 35000, stock: 50, Icon: Coffee, image: null },
  { id: 9, name: 'Kopi Espresso', category: 'Minuman', price: 20000, stock: 100, Icon: Coffee, image: null },
  { id: 10, name: 'Muffin Blueberry', category: 'Pastry', price: 24000, stock: 18, Icon: CakeSlice, image: null },
  { id: 11, name: 'Pretzel Asin', category: 'Roti', price: 18000, stock: 25, Icon: Package, image: null },
  { id: 12, name: 'Pancake Sirup', category: 'Pastry', price: 30000, stock: 15, Icon: CakeSlice, image: null },
];

const CATEGORIES = ['Semua', 'Roti', 'Kue', 'Pastry', 'Minuman'];

const getIconForCategory = (category) => {
  if (category === 'Pastry') return Croissant;
  if (category === 'Kue') return CakeSlice;
  if (category === 'Minuman') return Coffee;
  return Package;
};

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
  const [products, setProducts] = useState(() => {
    const saved = localStorage.getItem('nafa_bakery_products');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return parsed.map(p => ({
          ...p,
          Icon: getIconForCategory(p.category)
        }));
      } catch (e) {
        return INITIAL_PRODUCTS;
      }
    }
    return INITIAL_PRODUCTS;
  });
  
  const [currentView, setCurrentView] = useState('dashboard'); // 'dashboard', 'orders', 'products', 'customers', 'settings'
  const [activeCategory, setActiveCategory] = useState('Semua');
  const [searchQuery, setSearchQuery] = useState('');
  const [cart, setCart] = useState([]);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [orderType, setOrderType] = useState('Dine In');
  const [showCheckoutModal, setShowCheckoutModal] = useState(false);
  const [showProductModal, setShowProductModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [productForm, setProductForm] = useState({ name: '', category: 'Roti', price: '', stock: '', image: null });

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    localStorage.setItem('nafa_bakery_products', JSON.stringify(products));
  }, [products]);

  const filteredProducts = products.filter(p => {
    const matchesCategory = activeCategory === 'Semua' || p.category === activeCategory;
    
    // Hapus spasi untuk pencarian yang lebih fleksibel (misal "Hu Tao" tetap ketemu kalau dicari "hutao")
    const normalizedName = p.name.toLowerCase().replace(/\s+/g, '');
    const normalizedSearch = searchQuery.toLowerCase().replace(/\s+/g, '');
    const matchesSearch = normalizedName.includes(normalizedSearch);
    
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

  // Product CRUD Handlers
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProductForm(prev => ({ ...prev, image: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const openProductModal = (product = null) => {
    if (product) {
      setEditingProduct(product);
      setProductForm({
        name: product.name,
        category: product.category,
        price: product.price,
        stock: product.stock,
        image: product.image
      });
    } else {
      setEditingProduct(null);
      setProductForm({ name: '', category: 'Roti', price: '', stock: '', image: null });
    }
    setShowProductModal(true);
  };

  const closeProductModal = () => {
    setShowProductModal(false);
    setEditingProduct(null);
  };

  const saveProduct = (e) => {
    e.preventDefault();
    if (!productForm.name || !productForm.price || !productForm.stock) return;

    // Determine default icon based on category if no image is uploaded
    let defaultIcon = getIconForCategory(productForm.category);

    if (editingProduct) {
      setProducts(prev => prev.map(p => 
        p.id === editingProduct.id 
          ? { ...p, ...productForm, price: parseInt(productForm.price), stock: parseInt(productForm.stock), Icon: defaultIcon }
          : p
      ));
    } else {
      const newProduct = {
        id: Date.now(),
        ...productForm,
        price: parseInt(productForm.price),
        stock: parseInt(productForm.stock),
        Icon: defaultIcon
      };
      setProducts(prev => [...prev, newProduct]);
    }
    closeProductModal();
  };

  const deleteProduct = (id) => {
    if(window.confirm('Apakah Anda yakin ingin menghapus produk ini?')) {
      setProducts(prev => prev.filter(p => p.id !== id));
      // Remove from cart if it's there
      setCart(prev => prev.filter(item => item.id !== id));
    }
  };

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
                <div className="product-icon-container" style={{ padding: product.image ? '0' : '16px', overflow: 'hidden' }}>
                  {product.image ? (
                    <img src={product.image} alt={product.name} className="product-image-large" />
                  ) : (
                    <IconComponent size={64} strokeWidth={1.5} />
                  )}
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
                  <div className="cart-item-icon" style={{ padding: item.image ? '0' : '12px', overflow: 'hidden' }}>
                    {item.image ? (
                      <img src={item.image} alt={item.name} className="product-image-large" />
                    ) : (
                      <IconComponent size={24} />
                    )}
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
      <div className="page-header flex-center-between">
        <div>
          <h2>Inventaris Produk</h2>
          <p>Kelola ketersediaan stok dan harga produk Anda.</p>
        </div>
        <button className="add-product-btn" onClick={() => openProductModal()}>
          <Plus size={18} /> Tambah Produk
        </button>
      </div>
      <table className="data-table">
        <thead>
          <tr>
            <th>Produk</th>
            <th>Kategori</th>
            <th>Harga</th>
            <th>Stok</th>
            <th style={{ textAlign: 'right' }}>Aksi</th>
          </tr>
        </thead>
        <tbody>
          {products.map(product => {
            const IconComponent = product.Icon;
            return (
            <tr key={product.id}>
              <td>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  {product.image ? (
                    <img src={product.image} alt={product.name} className="product-image-small" />
                  ) : (
                    <div className="product-icon-small">
                      <IconComponent size={20} />
                    </div>
                  )}
                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <span style={{ fontWeight: 600 }}>{product.name}</span>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>PRD-{product.id.toString().substring(0,4)}</span>
                  </div>
                </div>
              </td>
              <td>{product.category}</td>
              <td className="format-currency">{formatRupiah(product.price)}</td>
              <td>
                <span className={`status-badge ${product.stock <= 5 ? 'pending' : 'success'}`}>
                  {product.stock} Tersisa
                </span>
              </td>
              <td style={{ textAlign: 'right' }}>
                <button className="action-btn" title="Edit Produk" onClick={() => openProductModal(product)}>
                  <Edit size={18} />
                </button>
                <button className="action-btn delete" title="Hapus Produk" onClick={() => deleteProduct(product.id)}>
                  <Trash2 size={18} />
                </button>
              </td>
            </tr>
          )})}
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

      {/* Product CRUD Modal */}
      {showProductModal && (
        <div className="modal-overlay">
          <div className="form-modal-content">
            <div className="form-header">
              <h2>{editingProduct ? 'Edit Produk' : 'Tambah Produk Baru'}</h2>
              <button className="close-btn" onClick={closeProductModal}>
                <X size={24} />
              </button>
            </div>
            <form onSubmit={saveProduct}>
              <div className="form-group">
                <label>Gambar Produk (Opsional)</label>
                <div className="image-upload-container">
                  <input type="file" accept="image/*" onChange={handleImageUpload} className="file-input" />
                  {productForm.image ? (
                    <img src={productForm.image} alt="Preview" className="image-preview" />
                  ) : (
                    <div className="upload-placeholder">
                      <ImagePlus size={32} />
                      <span>Klik untuk unggah gambar</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="form-group">
                <label>Nama Produk</label>
                <input 
                  type="text" 
                  className="form-control" 
                  placeholder="Mis. Croissant Original" 
                  value={productForm.name} 
                  onChange={(e) => setProductForm({...productForm, name: e.target.value})}
                  required
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Kategori</label>
                  <select 
                    className="form-control" 
                    value={productForm.category}
                    onChange={(e) => setProductForm({...productForm, category: e.target.value})}
                  >
                    <option value="Roti">Roti</option>
                    <option value="Pastry">Pastry</option>
                    <option value="Kue">Kue</option>
                    <option value="Minuman">Minuman</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Stok Awal</label>
                  <input 
                    type="number" 
                    className="form-control" 
                    placeholder="Mis. 20" 
                    min="0"
                    value={productForm.stock} 
                    onChange={(e) => setProductForm({...productForm, stock: e.target.value})}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Harga (Rp)</label>
                <input 
                  type="number" 
                  className="form-control" 
                  placeholder="Mis. 25000" 
                  min="0"
                  value={productForm.price} 
                  onChange={(e) => setProductForm({...productForm, price: e.target.value})}
                  required
                />
              </div>

              <div className="form-actions">
                <button type="button" className="btn-secondary" onClick={closeProductModal}>Batal</button>
                <button type="submit" className="btn-primary">
                  {editingProduct ? 'Simpan Perubahan' : 'Tambah Produk'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
