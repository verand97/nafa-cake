import React from 'react';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { formatRupiah } from '../utils/formatters';

export default function ProductsView({ products, openProductModal, deleteProduct }) {
  return (
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
}
