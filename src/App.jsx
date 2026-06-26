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
  Save
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



const getIconForCategory = (category) => {
  if (category === 'Pastry') return Croissant;
  if (category === 'Kue') return CakeSlice;
  if (category === 'Minuman') return Coffee;
  return Package;
};



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
      userAvatar: null
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

  const deleteOrder = (id) => {
    if(window.confirm('Hapus riwayat pesanan ini?')) {
      setOrders(prev => prev.filter(o => o.id !== id));
    }
  };

  const exportToCSV = () => {
    let csvContent = "data:text/csv;charset=utf-8,";
    csvContent += "ID Pesanan,Tanggal,Pelanggan,Total Item,Total Bayar,Status\n";
    
    orders.forEach(order => {
      const dateObj = new Date(order.date);
      const dateStr = `${dateObj.toLocaleDateString('id-ID')} ${dateObj.toLocaleTimeString('id-ID')}`;
      const totalItems = order.items ? order.items.reduce((sum, item) => sum + item.quantity, 0) : 0;
      const row = `${order.id},"${dateStr}","${order.customer}",${totalItems},${order.total},${order.status}`;
      csvContent += row + "\n";
    });
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Rekap_Pesanan_Nafa_Bakery_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Rendering Layout Utama (Dashboard / Kasir)
  const renderDashboard = () => (
    <div className="shop-layout">
      {/* Daftar Produk */}
      <div className="product-section">
        <div className="categories-wrapper">
          {['Semua', ...categories].map(cat => (
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
          </div>
          
          <div style={{ backgroundColor: 'var(--charcoal-lighter)', padding: '10px 16px', borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', color: 'var(--text-primary)', border: '1px dashed var(--border-subtle)' }}>
            <ShoppingBag size={16} color="var(--lime-green)" />
            <span style={{ fontSize: '0.9rem', fontWeight: 500 }}>Pesanan Siap Dibawa Pulang (Takeaway)</span>
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
      <div className="page-header flex-center-between">
        <div>
          <h2>Riwayat Pesanan</h2>
          <p>Kelola dan pantau semua transaksi yang telah selesai.</p>
        </div>
        <button className="add-product-btn" onClick={exportToCSV}>
          <Download size={18} /> Export ke Excel (CSV)
        </button>
      </div>
      <table className="data-table">
        <thead>
          <tr>
            <th>ID Pesanan</th>
            <th>Tanggal & Waktu</th>
            <th>Pelanggan</th>
            <th>Total Item</th>
            <th>Total Bayar</th>
            <th>Status</th>
            <th style={{ textAlign: 'right' }}>Aksi</th>
          </tr>
        </thead>
        <tbody>
          {orders.map(order => {
            const dateObj = new Date(order.date);
            const totalItems = order.items ? order.items.reduce((sum, item) => sum + item.quantity, 0) : 0;
            return (
              <tr key={order.id}>
                <td style={{ fontWeight: 600, color: 'var(--neon-purple)' }}>{order.id}</td>
                <td>
                  {dateObj.toLocaleDateString('id-ID')} <br/>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                    {dateObj.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </td>
                <td>{order.customer}</td>
                <td>{totalItems} item</td>
                <td className="format-currency">{formatRupiah(order.total)}</td>
                <td>
                  <span className={`status-badge ${order.status === 'Selesai' ? 'success' : 'pending'}`}>
                    {order.status}
                  </span>
                </td>
                <td style={{ textAlign: 'right' }}>
                  <button className="action-btn delete" title="Hapus Riwayat" onClick={() => deleteOrder(order.id)}>
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            );
          })}
          {orders.length === 0 && (
            <tr>
              <td colSpan="7" style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '32px' }}>
                Belum ada riwayat transaksi.
              </td>
            </tr>
          )}
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
  const handleSettingsSave = (e) => {
    e.preventDefault();
    setAppSettings(settingsForm);
    alert('Pengaturan berhasil disimpan!');
  };

  const handleAvatarUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSettingsForm(prev => ({ ...prev, userAvatar: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const renderSettings = () => (
    <div className="page-container">
      <div className="page-header">
        <h2>Pengaturan Sistem</h2>
        <p>Konfigurasi profil pengguna dan informasi toko Anda.</p>
      </div>
      
      <form onSubmit={handleSettingsSave} className="settings-grid">
        <div className="settings-card">
          <h3><User size={24} /> Profil Kasir</h3>
          
          <div className="avatar-upload-section">
            <div className="avatar-preview">
              {settingsForm.userAvatar ? (
                <img src={settingsForm.userAvatar} alt="Preview" />
              ) : (
                <User size={32} />
              )}
            </div>
            <div className="avatar-upload-btn">
              <Upload size={16} /> Unggah Foto
              <input type="file" accept="image/*" onChange={handleAvatarUpload} />
            </div>
          </div>
          
          <div className="form-group">
            <label>Nama Kasir / Admin</label>
            <input 
              type="text" 
              className="form-control" 
              value={settingsForm.userName} 
              onChange={e => setSettingsForm({...settingsForm, userName: e.target.value})}
              required
            />
          </div>
        </div>
        
        <div className="settings-card">
          <h3><Store size={24} /> Informasi Toko</h3>
          
          <div className="form-group">
            <label>Nama Toko</label>
            <input 
              type="text" 
              className="form-control" 
              value={settingsForm.shopName} 
              onChange={e => setSettingsForm({...settingsForm, shopName: e.target.value})}
              required
            />
          </div>
          
          <div className="form-group">
            <label>Jalan / Desa, RT / RW</label>
            <input 
              type="text" 
              className="form-control" 
              value={settingsForm.shopAddressStreet || ''} 
              onChange={e => setSettingsForm({...settingsForm, shopAddressStreet: e.target.value})}
              placeholder="Contoh: Jl. Sudirman / Desa Maju RT 01 RW 02"
              required
            />
          </div>
          
          <div className="form-group">
            <label>Kecamatan</label>
            <input 
              type="text" 
              className="form-control" 
              value={settingsForm.shopAddressDistrict || ''} 
              onChange={e => setSettingsForm({...settingsForm, shopAddressDistrict: e.target.value})}
              placeholder="Contoh: Kecamatan Sukamaju"
              required
            />
          </div>
          
          <div className="form-group">
            <label>Kabupaten / Kota</label>
            <input 
              type="text" 
              className="form-control" 
              value={settingsForm.shopAddressCity || ''} 
              onChange={e => setSettingsForm({...settingsForm, shopAddressCity: e.target.value})}
              placeholder="Contoh: Kabupaten Sejahtera"
              required
            />
          </div>
          
          <div style={{ marginTop: '32px' }}>
            <button type="submit" className="btn-primary" style={{ width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px' }}>
              <Save size={18} /> Simpan Pengaturan
            </button>
          </div>
        </div>
      </form>
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
