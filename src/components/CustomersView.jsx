import React from 'react';

const DUMMY_CUSTOMERS = [
  { id: 'C001', name: 'Bapak Budi', phone: '0812-3456-7890', points: 120 },
  { id: 'C002', name: 'Ibu Siti', phone: '0813-9876-5432', points: 45 },
  { id: 'C003', name: 'Andi', phone: '0857-1111-2222', points: 300 },
];

export default function CustomersView() {
  return (
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
}
