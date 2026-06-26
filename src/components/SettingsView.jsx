import React, { useState } from 'react';
import { User, Store, Upload, Save, Palette } from 'lucide-react';

export default function SettingsView({ appSettings, setAppSettings }) {
  const [settingsForm, setSettingsForm] = useState(appSettings);

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

  return (
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
        </div>
        
        <div className="settings-card" style={{ gridColumn: '1 / -1' }}>
          <h3><Palette size={24} /> Tampilan & Tema</h3>
          
          <div className="form-group" style={{ marginBottom: '24px' }}>
            <label>Pilih Tema</label>
            <div style={{ display: 'flex', gap: '16px' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                <input 
                  type="radio" 
                  name="themeType" 
                  value="dark" 
                  checked={settingsForm.themeType === 'dark'} 
                  onChange={() => setSettingsForm({...settingsForm, themeType: 'dark'})} 
                />
                Gelap (Dark Mode)
              </label>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                <input 
                  type="radio" 
                  name="themeType" 
                  value="light" 
                  checked={settingsForm.themeType === 'light'} 
                  onChange={() => setSettingsForm({...settingsForm, themeType: 'light'})} 
                />
                Terang (Light Mode)
              </label>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                <input 
                  type="radio" 
                  name="themeType" 
                  value="custom" 
                  checked={settingsForm.themeType === 'custom'} 
                  onChange={() => setSettingsForm({...settingsForm, themeType: 'custom'})} 
                />
                Kustom (Pilih Warna Sendiri)
              </label>
            </div>
          </div>

          {settingsForm.themeType === 'custom' && (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: '16px', background: 'var(--charcoal)', padding: '16px', borderRadius: 'var(--radius-md)' }}>
              <div className="form-group">
                <label>Background</label>
                <input 
                  type="color" 
                  style={{ width: '100%', height: '40px', cursor: 'pointer', border: 'none', padding: 0 }}
                  value={settingsForm.customColorBg || '#1F1F23'} 
                  onChange={e => setSettingsForm({...settingsForm, customColorBg: e.target.value})}
                />
              </div>
              <div className="form-group">
                <label>Warna Teks</label>
                <input 
                  type="color" 
                  style={{ width: '100%', height: '40px', cursor: 'pointer', border: 'none', padding: 0 }}
                  value={settingsForm.customColorText || '#FFFFFF'} 
                  onChange={e => setSettingsForm({...settingsForm, customColorText: e.target.value})}
                />
              </div>
              <div className="form-group">
                <label>Warna Utama (Aksen 1)</label>
                <input 
                  type="color" 
                  style={{ width: '100%', height: '40px', cursor: 'pointer', border: 'none', padding: 0 }}
                  value={settingsForm.customColorPrimary || '#8C66FF'} 
                  onChange={e => setSettingsForm({...settingsForm, customColorPrimary: e.target.value})}
                />
              </div>
              <div className="form-group">
                <label>Warna Sukses (Aksen 2)</label>
                <input 
                  type="color" 
                  style={{ width: '100%', height: '40px', cursor: 'pointer', border: 'none', padding: 0 }}
                  value={settingsForm.customColorAccent || '#75FB4C'} 
                  onChange={e => setSettingsForm({...settingsForm, customColorAccent: e.target.value})}
                />
              </div>
            </div>
          )}
          
          <div style={{ marginTop: '32px' }}>
            <button type="submit" className="btn-primary" style={{ width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px' }}>
              <Save size={18} /> Simpan Semua Pengaturan
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
