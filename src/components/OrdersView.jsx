import React from 'react';
import { Download, Trash2 } from 'lucide-react';
import { formatRupiah } from '../utils/formatters';

export default function OrdersView({ orders, setOrders }) {
  
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

  return (
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
}
