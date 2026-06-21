'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/context/AuthContext';
import { User, Mail, Phone, Image as ImageIcon, Save, Loader, Camera } from 'lucide-react';
import toast from 'react-hot-toast';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
const IMGBB_API_KEY = process.env.NEXT_PUBLIC_IMGBB_API_KEY || 'd7d07c067a99f1fa023a1d953ee24f9f';

export default function AdminProfile() {
  const { user, authFetch, setUser } = useAuth();
  const fileInputRef = useRef(null);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [profilePicture, setProfilePicture] = useState('');
  const [uploadingImage, setUploadingImage] = useState(false);
  const [saving, setSaving] = useState(false);


  useEffect(() => {
    if (user) {
      setName(user.name || '');
      setEmail(user.email || '');
      setPhone(user.phone || '');
      setProfilePicture(user.profilePicture || '');
    }
  }, [user]);


  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploadingImage(true);
    const formData = new FormData();
    formData.append('image', file);

    try {
      const res = await fetch(`https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`, {
        method: 'POST',
        body: formData,
      });
      const result = await res.json();

      if (res.ok && result.data && result.data.url) {
        setProfilePicture(result.data.url);
        toast.success('Avatar image uploaded successfully to imgBB!');
      } else {
        throw new Error('Image upload failed');
      }
    } catch (err) {
      console.error(err);
      toast.error('Failed to upload image. Try pasting a direct image URL below.');
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name.trim()) {
      toast.error('Name cannot be empty.');
      return;
    }
    if (!email.trim()) {
      toast.error('Email cannot be empty.');
      return;
    }

    setSaving(true);
    try {
      const res = await authFetch(`${API_URL}/user/profile`, {
        method: 'PUT',
        body: JSON.stringify({
          name,
          email,
          phone,
          profilePicture,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        toast.success('Profile updated successfully!');

        setUser({
          ...user,
          name: data.name,
          email: data.email,
          phone: data.phone,
          profilePicture: data.profilePicture,
        });
      } else {
        throw new Error(data.message || 'Failed to update profile');
      }
    } catch (err) {
      toast.error(err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '32px' }}>
      <div>
        <h2 style={{ fontSize: '28px', fontWeight: '800', marginBottom: '6px' }}>Profile Settings</h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>Manage your profile information and settings</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '30px', alignItems: 'start' }}>
        <div className="glass" style={{ padding: '40px 30px', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', borderRadius: 'var(--radius-md)', gap: '24px' }}>
          <div 
            style={{ 
              position: 'relative', 
              width: '130px', 
              height: '130px', 
              borderRadius: '50%', 
              cursor: 'pointer',
              border: '3px solid var(--primary)', 
              boxShadow: '0 0 20px var(--primary-glow)', 
              overflow: 'hidden',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
            onClick={() => fileInputRef.current?.click()}
          >
            {profilePicture ? (
              <img
                src={profilePicture}
                referrerPolicy="no-referrer"
                alt={name || 'Admin'}
                style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform var(--transition-normal) ease' }}
              />
            ) : (
              <div style={{ width: '100%', height: '100%', background: 'var(--primary-glow)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)' }}>
                <User size={48} />
              </div>
            )}
            
            
            <div 
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: 'rgba(0, 0, 0, 0.6)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexDirection: 'column',
                gap: '4px',
                opacity: 0,
                transition: 'opacity var(--transition-fast) ease',
                color: '#fff',
                fontSize: '11px',
                fontWeight: '600'
              }}
              onMouseEnter={(e) => { e.currentTarget.style.opacity = '1'; }}
              onMouseLeave={(e) => { e.currentTarget.style.opacity = '0'; }}
            >
              <Camera size={20} style={{ marginBottom: '2px' }} />
              <span>Change Photo</span>
            </div>
          </div>

          <input
            type="file"
            ref={fileInputRef}
            onChange={handleImageUpload}
            accept="image/*"
            style={{ display: 'none' }}
          />

          <div style={{ width: '100%', borderTop: '1px solid var(--card-border)', paddingTop: '20px', display: 'flex', flexDirection: 'column', gap: '14px', textAlign: 'left' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Status:</span>
              <span style={{ color: '#10b981', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#10b981', display: 'inline-block' }} />
                Active
              </span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Phone:</span>
              <span style={{ color: 'var(--text-primary)', fontWeight: '500' }}>{phone || 'Not Configured'}</span>
            </div>
          </div>
        </div>

        <div className="glass" style={{ padding: '40px', borderRadius: 'var(--radius-md)' }}>
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div className="form-group">
              <label className="form-label" htmlFor="name-input">Full Name</label>
              <div style={{ position: 'relative' }}>
                <User size={16} style={{ position: 'absolute', left: '16px', top: '16px', color: 'var(--text-muted)' }} />
                <input
                  id="name-input"
                  type="text"
                  placeholder="Enter full name"
                  className="form-input"
                  style={{ paddingLeft: '44px' }}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="email-input">Email Address</label>
              <div style={{ position: 'relative' }}>
                <Mail size={16} style={{ position: 'absolute', left: '16px', top: '16px', color: 'var(--text-muted)' }} />
                <input
                  id="email-input"
                  type="email"
                  placeholder="Enter email address"
                  className="form-input"
                  style={{ paddingLeft: '44px' }}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="phone-input">Phone Number</label>
              <div style={{ position: 'relative' }}>
                <Phone size={16} style={{ position: 'absolute', left: '16px', top: '16px', color: 'var(--text-muted)' }} />
                <input
                  id="phone-input"
                  type="tel"
                  placeholder="e.g. +1 555-0199"
                  className="form-input"
                  style={{ paddingLeft: '44px' }}
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="avatar-file-upload">Profile Picture</label>
              <div style={{ display: 'flex', gap: '14px', alignItems: 'center' }}>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="btn btn-outline"
                  style={{ flex: '1', display: 'flex', gap: '8px', height: '48px', justifyContent: 'center' }}
                  disabled={uploadingImage}
                >
                  {uploadingImage ? <Loader size={16} className="animate-spin" /> : <ImageIcon size={16} />}
                  <span>{uploadingImage ? 'Uploading Image...' : 'Choose Image File'}</span>
                </button>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="avatar-url-input">Or Paste Direct Image URL</label>
              <div style={{ position: 'relative' }}>
                <ImageIcon size={16} style={{ position: 'absolute', left: '16px', top: '16px', color: 'var(--text-muted)' }} />
                <input
                  id="avatar-url-input"
                  type="url"
                  placeholder="Paste image URL here"
                  className="form-input"
                  style={{ paddingLeft: '44px' }}
                  value={profilePicture}
                  onChange={(e) => setProfilePicture(e.target.value)}
                />
              </div>
            </div>

            <button
              type="submit"
              className="btn btn-primary"
              style={{
                alignSelf: 'flex-start',
                padding: '14px 28px',
                marginTop: '10px',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px'
              }}
              disabled={saving || uploadingImage}
            >
              {saving ? <Loader size={16} className="animate-spin" /> : <Save size={16} />}
              <span>{saving ? 'Saving Details...' : 'Save Profile'}</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
