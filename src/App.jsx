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
  ShoppingBag,
  ImagePlus,
  Edit,
  X,
  LogOut,
  Lock,
  User,
  Printer,
  Download,
  Store,
  Upload,
  Save,
  Palette
} from 'lucide-react';
import './App.css';
import CustomersView from './components/CustomersView';
import SettingsView from './components/SettingsView';
import OrdersView from './components/OrdersView';
import ProductsView from './components/ProductsView';
import DashboardView from './components/DashboardView';
import { formatRupiah } from './utils/formatters';

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



const getIconForCategory = (category) => {
  if (category === 'Pastry') return Croissant;
  if (category === 'Kue') return CakeSlice;
  if (category === 'Minuman') return Coffee;
  return Package;
};





function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    return localStorage.getItem('nafa_bakery_auth') === 'true';
  });
  const [loginForm, setLoginForm] = useState({ username: '', password: '' });
  const [loginError, setLoginError] = useState('');

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

  const [categories, setCategories] = useState(() => {
    const saved = localStorage.getItem('nafa_bakery_categories');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return ['Roti', 'Kue', 'Pastry', 'Minuman'];
      }
    }
    return ['Roti', 'Kue', 'Pastry', 'Minuman'];
  });

  const [orders, setOrders] = useState(() => {
    const saved = localStorage.getItem('nafa_bakery_orders');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return [];
      }
    }
    return [];
  });
  
  const [appSettings, setAppSettings] = useState(() => {
    const saved = localStorage.getItem('nafa_bakery_settings');
    if (saved) {
      try { 
        const parsed = JSON.parse(saved);
        if (parsed.shopAddress && !parsed.shopAddressStreet) {
          parsed.shopAddressStreet = parsed.shopAddress;
          parsed.shopAddressDistrict = '';
          parsed.shopAddressCity = '';
        }
        return parsed; 
      } catch(e) {}
    }
    return {
      shopName: 'Nafa Bakery',
      shopAddressStreet: 'Jl. Contoh Desa, RT 01/RW 02',
      shopAddressDistrict: 'Kecamatan Maju',
      shopAddressCity: 'Kabupaten Makmur',
      userName: 'Admin',
      userAvatar: null,
      themeType: 'dark', // dark, light, custom
      customColorBg: '#1F1F23',
      customColorPrimary: '#8C66FF',
      customColorAccent: '#75FB4C',
      customColorText: '#FFFFFF'
    };
  });
  const [settingsForm, setSettingsForm] = useState(appSettings);

  const [currentView, setCurrentView] = useState('dashboard'); // 'dashboard', 'orders', 'products', 'customers', 'settings'
  const [activeCategory, setActiveCategory] = useState('Semua');
  const [searchQuery, setSearchQuery] = useState('');
  const [cart, setCart] = useState([]);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [showCheckoutModal, setShowCheckoutModal] = useState(false);
  const [completedOrder, setCompletedOrder] = useState(null);
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

  useEffect(() => {
    localStorage.setItem('nafa_bakery_categories', JSON.stringify(categories));
  }, [categories]);

  useEffect(() => {
    localStorage.setItem('nafa_bakery_orders', JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem('nafa_bakery_settings', JSON.stringify(appSettings));
    
    // Terapkan Tema
    const root = document.documentElement;
    if (appSettings.themeType === 'dark') {
      root.style.setProperty('--charcoal', '#1F1F23');
      root.style.setProperty('--charcoal-lighter', '#2D2D33');
      root.style.setProperty('--charcoal-darker', '#141417');
      root.style.setProperty('--neon-purple', '#8C66FF');
      root.style.setProperty('--lime-green', '#75FB4C');
      root.style.setProperty('--text-primary', '#FFFFFF');
      root.style.setProperty('--text-secondary', '#E0E0E0');
      root.style.setProperty('--text-muted', '#9E9E9E');
      root.style.setProperty('--border-subtle', 'rgba(255, 255, 255, 0.1)');
      root.style.setProperty('--surface-hover', 'rgba(140, 102, 255, 0.15)');
    } else if (appSettings.themeType === 'light') {
      root.style.setProperty('--charcoal', '#F5F5F5');
      root.style.setProperty('--charcoal-lighter', '#FFFFFF');
      root.style.setProperty('--charcoal-darker', '#E0E0E0');
      root.style.setProperty('--neon-purple', '#6200EA');
      root.style.setProperty('--lime-green', '#00C853');
      root.style.setProperty('--text-primary', '#212121');
      root.style.setProperty('--text-secondary', '#424242');
      root.style.setProperty('--text-muted', '#757575');
      root.style.setProperty('--border-subtle', 'rgba(0, 0, 0, 0.1)');
      root.style.setProperty('--surface-hover', 'rgba(98, 0, 234, 0.08)');
    } else if (appSettings.themeType === 'custom') {
      const bg = appSettings.customColorBg || '#1F1F23';
      const text = appSettings.customColorText || '#FFFFFF';
      
      root.style.setProperty('--charcoal', bg);
      root.style.setProperty('--charcoal-lighter', `color-mix(in srgb, ${bg} 85%, white)`);
      root.style.setProperty('--charcoal-darker', `color-mix(in srgb, ${bg} 85%, black)`);
      root.style.setProperty('--neon-purple', appSettings.customColorPrimary || '#8C66FF');
      root.style.setProperty('--lime-green', appSettings.customColorAccent || '#75FB4C');
      root.style.setProperty('--text-primary', text);
      root.style.setProperty('--text-secondary', `color-mix(in srgb, ${text} 80%, ${bg})`);
      root.style.setProperty('--text-muted', `color-mix(in srgb, ${text} 50%, ${bg})`);
      root.style.setProperty('--border-subtle', `color-mix(in srgb, ${text} 15%, transparent)`);
      root.style.setProperty('--surface-hover', `color-mix(in srgb, ${appSettings.customColorPrimary} 15%, transparent)`);
    }
  }, [appSettings]);

  const handleLogin = (e) => {
    e.preventDefault();
    if (loginForm.username === 'admin' && loginForm.password === 'admin123') {
      setIsLoggedIn(true);
      setLoginError('');
      localStorage.setItem('nafa_bakery_auth', 'true');
    } else {
      setLoginError('Username atau password tidak valid!');
    }
  };

  const handleLogout = () => {
    if(window.confirm('Apakah Anda yakin ingin keluar dari sistem?')) {
      setIsLoggedIn(false);
      setLoginForm({ username: '', password: '' });
      localStorage.removeItem('nafa_bakery_auth');
    }
  };

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
    
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const newOrder = {
      id: `#ORD-${Math.floor(1000 + Math.random() * 9000)}`,
      items: [...cart],
      total: subtotal,
      date: new Date().toISOString(),
      customer: 'Umum',
      status: 'Selesai',
      cashierName: appSettings.userName,
      shopName: appSettings.shopName,
      shopAddress: `${appSettings.shopAddressStreet}, ${appSettings.shopAddressDistrict}, ${appSettings.shopAddressCity}`
    };

    setCompletedOrder(newOrder);
    setOrders(prev => [newOrder, ...prev]);
    
    // Kurangi stok produk
    setProducts(prevProducts => prevProducts.map(p => {
      const cartItem = cart.find(item => item.id === p.id);
      if (cartItem) {
        return { ...p, stock: Math.max(0, p.stock - cartItem.quantity) };
      }
      return p;
    }));
    
    setShowCheckoutModal(true);
  };

  const closeCheckoutAndReset = () => {
    setShowCheckoutModal(false);
    setCart([]);
    setCompletedOrder(null);
  };

  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const total = subtotal;

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



  const renderView = () => {
    const commonProps = {
      categories,
      activeCategory,
      setActiveCategory,
      filteredProducts,
      cart,
      addToCart,
      updateQuantity,
      removeFromCart,
      clearCart,
      handleCheckout,
      subtotal,
      total
    };

    switch(currentView) {
      case 'dashboard': return <DashboardView {...commonProps} />;
      case 'orders': return <OrdersView orders={orders} setOrders={setOrders} />;
      case 'products': return <ProductsView products={products} openProductModal={openProductModal} deleteProduct={deleteProduct} />;
      case 'customers': return <CustomersView />;
      case 'settings': return <SettingsView appSettings={appSettings} setAppSettings={setAppSettings} />;
      default: return <DashboardView {...commonProps} />;
    }
  };

  // Halaman: Login
  const renderLogin = () => (
    <div className="login-container">
      <div className="login-bg-decoration"></div>
      <div className="login-bg-decoration-2"></div>
      
      <div className="login-card">
        <div className="login-header">
          <div className="login-logo">
            <CakeSlice size={36} />
          </div>
          <h1>Nafa Bakery POS</h1>
          <p>Sistem Manajemen Penjualan Terpadu</p>
        </div>

        {loginError && (
          <div className="login-error">
            {loginError}
          </div>
        )}

        <form className="login-form" onSubmit={handleLogin}>
          <div className="input-with-icon">
            <User size={20} />
            <input 
              type="text" 
              placeholder="Username" 
              value={loginForm.username}
              onChange={(e) => setLoginForm({...loginForm, username: e.target.value})}
              required
            />
          </div>
          <div className="input-with-icon">
            <Lock size={20} />
            <input 
              type="password" 
              placeholder="Password" 
              value={loginForm.password}
              onChange={(e) => setLoginForm({...loginForm, password: e.target.value})}
              required
            />
          </div>
          <button type="submit" className="login-btn">
            Masuk ke Sistem
          </button>
        </form>
      </div>
    </div>
  );

  if (!isLoggedIn) {
    return renderLogin();
  }

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
            <h1>Kasir {appSettings.shopName}</h1>
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
              <div className="avatar" style={{ padding: appSettings.userAvatar ? 0 : '', overflow: 'hidden' }}>
                {appSettings.userAvatar ? (
                  <img src={appSettings.userAvatar} alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  appSettings.userName.charAt(0).toUpperCase()
                )}
              </div>
              <span className="user-name">{appSettings.userName}</span>
              <button className="logout-btn" title="Keluar Sistem" onClick={handleLogout}>
                <LogOut size={16} />
              </button>
            </div>
          </div>
        </header>

        {/* Konten Dinamis Berdasarkan Tab yang Aktif */}
        {renderView()}
      </div>

      {/* Checkout Success Modal */}
      {showCheckoutModal && completedOrder && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ width: '450px' }}>
            <div className="modal-icon" style={{ marginBottom: '16px' }}>
              <CheckCircle2 size={40} />
            </div>
            <h2 style={{ marginBottom: '24px' }}>Pembayaran Berhasil!</h2>
            
            <div className="receipt-container">
              <div className="receipt-header">
                <h3>{completedOrder.shopName?.toUpperCase() || appSettings.shopName.toUpperCase()}</h3>
                <p>{completedOrder.shopAddress || appSettings.shopAddress}</p>
                <p>{new Date(completedOrder.date).toLocaleString('id-ID')}</p>
                <p>Order ID: <strong>{completedOrder.id}</strong></p>
                <p>Kasir: {completedOrder.cashierName || appSettings.userName}</p>
              </div>
              
              <div className="receipt-items">
                {completedOrder.items.map(item => (
                  <div key={item.id} className="receipt-item">
                    <div className="receipt-item-name">{item.name}</div>
                    <div className="receipt-item-qty">{item.quantity}x</div>
                    <div className="receipt-item-price">{formatRupiah(item.price * item.quantity)}</div>
                  </div>
                ))}
              </div>
              
              <div className="receipt-divider"></div>
              
              <div className="receipt-total">
                <span>TOTAL</span>
                <span>{formatRupiah(completedOrder.total)}</span>
              </div>
              
              <div style={{ textAlign: 'center', marginTop: '24px', fontSize: '0.85rem' }}>
                Terima kasih atas kunjungan Anda!
              </div>
            </div>

            <div className="modal-actions">
              <button className="btn-print" onClick={() => window.print()}>
                <Printer size={18} /> Cetak Struk
              </button>
              <button className="modal-btn" onClick={closeCheckoutAndReset} style={{ flex: 1 }}>
                Buat Pesanan Baru
              </button>
            </div>
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
                    onChange={(e) => {
                      if (e.target.value === 'ADD_NEW') {
                        const newCat = window.prompt('Masukkan nama kategori baru:');
                        if (newCat && newCat.trim() !== '') {
                          const trimmed = newCat.trim();
                          if (!categories.includes(trimmed)) {
                            setCategories(prev => [...prev, trimmed]);
                          }
                          setProductForm({...productForm, category: trimmed});
                        }
                      } else {
                        setProductForm({...productForm, category: e.target.value});
                      }
                    }}
                  >
                    {categories.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                    <option value="ADD_NEW" style={{ fontWeight: 'bold', color: 'var(--neon-purple)' }}>+ Tambah Kategori Baru...</option>
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
