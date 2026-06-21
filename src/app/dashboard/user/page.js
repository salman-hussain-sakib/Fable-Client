'use client';

import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { User, Mail, Shield, Save, Image as ImageIcon } from 'lucide-react';
import toast from 'react-hot-toast';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export default function UserProfile() {
  const { user, authFetch, login } = useAuth();
  const [name, setName] = useState(user?.name || '');
  const [profilePicture, setProfilePicture] = useState(user?.profilePicture || '');
  const [updating, setUpdating] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name) {
      toast.error('Name cannot be empty.');
      return;
    }

    setUpdating(true);
    try {
      const res = await authFetch(`${API_URL}/user/profile`, {
        method: 'PUT',
        body: JSON.stringify({ name, profilePicture }),
      });

      const data = await res.json();

      if (res.ok) {
        toast.success('Profile updated successfully!');

        window.location.reload();
      } else {
        throw new Error(data.message || 'Failed to update profile');
      }
    } catch (err) {
      toast.error(err.message);
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div style={{ maxWidth: '600px' }}>
      <h2 style={{ fontSize: '28px', fontWeight: '800', marginBottom: '24px' }}>Profile Management</h2>

      <div className="glass" style={{ padding: '30px', display: 'flex', flexDirection: 'column', gap: '30px', borderRadius: 'var(--radius-md)' }}>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px', paddingBottom: '20px', borderBottom: '1px solid var(--card-border)' }}>
          {profilePicture ? (
            <img
              src={profilePicture}
              referrerPolicy="no-referrer"
              alt={name}
              style={{ width: '80px', height: '80px', borderRadius: '50%', objectFit: 'cover', border: '3px solid var(--primary)', boxShadow: 'var(--shadow-md)' }}
            />
          ) : (
            <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'var(--primary-glow)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)', border: '2px dashed var(--primary)' }}>
              <User size={36} />
            </div>
          )}
          <div>
            <h3 style={{ fontSize: '22px', fontWeight: '700' }}>{user.name}</h3>
            <span className="badge badge-primary" style={{ marginTop: '6px' }}>{user.role}</span>
          </div>
        </div>

        
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div className="form-group">
            <label className="form-label" htmlFor="full-name-input">Full Name</label>
            <div style={{ position: 'relative' }}>
              <User size={16} style={{ position: 'absolute', left: '16px', top: '16px', color: 'var(--text-muted)' }} />
              <input
                id="full-name-input"
                type="text"
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
                className="form-input"
                style={{ paddingLeft: '44px', opacity: '0.6', cursor: 'not-allowed' }}
                value={user.email}
                disabled
              />
            </div>
            <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Email address cannot be changed.</span>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="avatar-url-input">Avatar Image URL (imgBB URL)</label>
            <div style={{ position: 'relative' }}>
              <ImageIcon size={16} style={{ position: 'absolute', left: '16px', top: '16px', color: 'var(--text-muted)' }} />
              <input
                id="avatar-url-input"
                type="url"
                placeholder="https://i.ibb.co/..."
                className="form-input"
                style={{ paddingLeft: '44px' }}
                value={profilePicture}
                onChange={(e) => setProfilePicture(e.target.value)}
              />
            </div>
          </div>

          <button type="submit" className="btn btn-primary" style={{ alignSelf: 'flex-start', padding: '12px 24px' }} disabled={updating}>
            <Save size={16} />
            <span>{updating ? 'Saving Changes...' : 'Save Profile'}</span>
          </button>
        </form>
      </div>
    </div>
  );
}
