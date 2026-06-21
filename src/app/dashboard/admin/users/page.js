'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Users, Trash2, Shield, UserCog, Crown } from 'lucide-react';
import toast from 'react-hot-toast';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export default function AdminUsers() {
  const { authFetch, user: currentUser } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    try {
      const res = await authFetch(`${API_URL}/admin/users`);
      if (res.ok) {
        const data = await res.json();
        setUsers(data);
      } else {
        toast.error('Failed to load users list');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleRoleChange = async (userId, userName, currentRole, newRole) => {
    if (userId === currentUser.id) {
      toast.error('You cannot change your own admin role!');
      return;
    }

    if (!confirm(`Are you sure you want to change the role of "${userName}" from "${currentRole}" to "${newRole}"?`)) return;

    try {
      const res = await authFetch(`${API_URL}/admin/users/${userId}/role`, {
        method: 'PATCH',
        body: JSON.stringify({ role: newRole }),
      });

      if (res.ok) {
        toast.success(`Role of "${userName}" changed to "${newRole}" successfully!`);

        setUsers(users.map((u) => u._id === userId ? { ...u, role: newRole } : u));
      } else {
        const data = await res.json();
        toast.error(data.message || 'Failed to update user role');
      }
    } catch (err) {
      console.error(err);
      toast.error('Server error updating role');
    }
  };

  const handleDeleteUser = async (userId, userName) => {
    if (userId === currentUser.id) {
      toast.error('You cannot delete your own admin account!');
      return;
    }

    if (!confirm(`CAUTION: Are you sure you want to delete user "${userName}"? This will permanently wipe their profile and ebook library. This action cannot be undone.`)) return;

    try {
      const res = await authFetch(`${API_URL}/admin/users/${userId}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        toast.success(`User "${userName}" deleted successfully.`);
        setUsers(users.filter((u) => u._id !== userId));
      } else {
        const data = await res.json();
        toast.error(data.message || 'Failed to delete user');
      }
    } catch (err) {
      console.error(err);
      toast.error('Server error deleting user');
    }
  };

  if (loading) {
    return (
      <div className="spinner-container" style={{ minHeight: '60vh' }}>
        <div className="spinner" />
      </div>
    );
  }

  return (
    <div>
      <div style={{ marginBottom: '24px' }}>
        <h2 style={{ fontSize: '28px', fontWeight: '800', marginBottom: '6px', color: 'var(--text-primary)' }}>Manage Platform Users</h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>View, update roles, and manage all registered users.</p>
      </div>

      {users.length === 0 ? (
        <div className="glass" style={{ padding: '60px 20px', textAlign: 'center', color: 'var(--text-secondary)', borderRadius: 'var(--radius-md)', border: '1px solid var(--card-border)' }}>
          <Users size={48} style={{ color: 'var(--text-muted)', marginBottom: '16px', opacity: '0.5' }} />
          <h3 style={{ fontSize: '20px', fontWeight: '700', marginBottom: '8px', color: 'var(--text-primary)' }}>No Users Registered</h3>
          <p style={{ maxWidth: '360px', margin: '0 auto', fontSize: '14px', lineHeight: '1.6' }}>
            There are no user profiles registered in Fable database yet.
          </p>
        </div>
      ) : (
        <div className="glass table-container">
          <table className="custom-table">
              <thead>
                <tr style={{ background: 'var(--bg-tertiary)', borderBottom: '1px solid var(--card-border)' }}>
                  <th style={{ padding: '14px 20px', textAlign: 'left', fontSize: '12px', fontWeight: '700', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Profile</th>
                  <th style={{ padding: '14px 20px', textAlign: 'left', fontSize: '12px', fontWeight: '700', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Full Name</th>
                  <th style={{ padding: '14px 20px', textAlign: 'left', fontSize: '12px', fontWeight: '700', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Email Address</th>
                  <th style={{ padding: '14px 20px', textAlign: 'left', fontSize: '12px', fontWeight: '700', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Current Role</th>
                  <th style={{ padding: '14px 20px', textAlign: 'left', fontSize: '12px', fontWeight: '700', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Joined Date</th>
                  <th style={{ padding: '14px 20px', textAlign: 'right', fontSize: '12px', fontWeight: '700', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user._id} style={{ borderBottom: '1px solid var(--card-border)', transition: 'background var(--transition-fast) ease' }}>
                    <td style={{ padding: '16px 20px' }}>
                      {user.profilePicture ? (
                        <img
                          src={user.profilePicture}
                          referrerPolicy="no-referrer"
                          alt={user.name}
                          style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover', border: '2px solid var(--primary)', boxShadow: 'var(--shadow-sm)' }}
                        />
                      ) : (
                        <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'var(--primary-glow)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)', border: '2px solid var(--primary)' }}>
                          <Users size={18} />
                        </div>
                      )}
                    </td>
                    <td style={{ fontWeight: '600', color: 'var(--text-primary)', fontSize: '14px' }}>
                      {user.name} {user._id === currentUser.id && <Crown size={12} style={{ color: '#f59e0b', marginLeft: '4px', verticalAlign: 'middle' }} />}
                    </td>
                    <td style={{ color: 'var(--text-secondary)', fontSize: '13px' }}>{user.email}</td>
                    <td>
                      <span style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px',
                        padding: '6px 14px',
                        borderRadius: 'var(--radius-full)',
                        fontSize: '12px',
                        fontWeight: '600',
                        background: user.role === 'admin' ? 'rgba(239, 68, 68, 0.12)' : user.role === 'writer' ? 'var(--primary-glow)' : 'var(--secondary-glow)',
                        color: user.role === 'admin' ? 'var(--danger)' : user.role === 'writer' ? 'var(--primary)' : 'var(--secondary)',
                      }}>
                        {user.role === 'admin' && <Shield size={12} />}
                        {user.role}
                      </span>
                    </td>
                    <td style={{ color: 'var(--text-secondary)', fontSize: '13px' }}>{new Date(user.createdAt).toLocaleDateString()}</td>
                    <td>
                      <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                        <select
                          className="form-select"
                          style={{ padding: '8px 12px', fontSize: '13px', minWidth: '130px', height: 'auto', borderRadius: 'var(--radius-sm)' }}
                          value={user.role}
                          disabled={user._id === currentUser.id}
                          onChange={(e) => handleRoleChange(user._id, user.name, user.role, e.target.value)}
                        >
                          <option value="user">User (Reader)</option>
                          <option value="writer">Writer</option>
                          <option value="admin">Admin</option>
                        </select>

                        <button
                          onClick={() => handleDeleteUser(user._id, user.name)}
                          className="btn btn-outline"
                          style={{ padding: '8px 12px', borderRadius: 'var(--radius-sm)' }}
                          disabled={user._id === currentUser.id}
                          title="Delete User Profile"
                        >
                          <Trash2 size={14} style={{ color: user._id === currentUser.id ? 'var(--text-muted)' : 'var(--danger)' }} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
        </div>
      )}
    </div>
  );
}