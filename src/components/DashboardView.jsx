import React from 'react';
import { Plus, Minus, Trash2, ArrowRight, ShoppingBag, ShoppingCart } from 'lucide-react';
import { formatRupiah } from '../utils/formatters';

export default function DashboardView({
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
}) {
  return (
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
}
