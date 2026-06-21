'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';
import { Edit, Trash2, Eye, EyeOff, PlusCircle, BookOpen, TrendingUp, DollarSign, FileText } from 'lucide-react';
import toast from 'react-hot-toast';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export default function WriterManageEbooks() {
  const { authFetch } = useAuth();
  const [ebooks, setEbooks] = useState([]);
  const [stats, setStats] = useState({ total: 0, published: 0, sold: 0, revenue: 0 });
  const [loading, setLoading] = useState(true);

  const fetchOwnEbooks = async () => {
    try {
      const res = await authFetch(`${API_URL}/user/writer/ebooks`);
      if (res.ok) {
        const data = await res.json();
        setEbooks(data);
        setStats({
          total: data.length,
          published: data.filter(e => e.status === 'published').length,
          sold: data.filter(e => e.isSold).length,
          revenue: data.reduce((sum, e) => sum + (e.isSold ? e.price : 0), 0),
        });
      } else {
        toast.error('Failed to load ebooks');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOwnEbooks();
  }, []);

  const handleToggleStatus = async (id, currentStatus) => {
    const nextStatus = currentStatus === 'published' ? 'unpublished' : 'published';
    try {
      const res = await authFetch(`${API_URL}/ebooks/${id}/status`, {
        method: 'PATCH',
        body: JSON.stringify({ status: nextStatus }),
      });
      if (res.ok) {
        toast.success(`Ebook ${nextStatus === 'published' ? 'published' : 'unpublished'} successfully!`);
        setEbooks(ebooks.map(e => e._id === id ? { ...e, status: nextStatus } : e));
      } else {
        toast.error('Failed to change publication status');
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id, title) => {
    if (!confirm(`Are you sure you want to delete "${title}"? This action cannot be undone.`)) return;
    try {
      const res = await authFetch(`${API_URL}/ebooks/${id}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        toast.success(`Ebook "${title}" deleted successfully.`);
        setEbooks(ebooks.filter((e) => e._id !== id));
      } else {
        toast.error('Failed to delete ebook');
      }
    } catch (err) {
      console.error(err);
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
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h2 style={{ fontSize: '28px', fontWeight: '800', marginBottom: '6px', color: 'var(--text-primary)' }}>Manage My Ebooks</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>Track, update, and manage your published works.</p>
        </div>
        <Link href="/dashboard/writer/add-ebook" className="btn btn-primary" style={{ boxShadow: 'var(--shadow-md)' }}>
          <PlusCircle size={16} />
          <span>Upload Ebook</span>
        </Link>
      </div>

      <div className="dashboard-stats-grid">
        {[
          { label: 'Total Ebooks', value: stats.total, icon: <FileText size={20} />, color: 'var(--primary)', bg: 'var(--primary-glow)' },
          { label: 'Published', value: stats.published, icon: <Eye size={20} />, color: '#10b981', bg: 'rgba(16, 185, 129, 0.15)' },
          { label: 'Copies Sold', value: stats.sold, icon: <TrendingUp size={20} />, color: '#f59e0b', bg: 'rgba(245, 158, 11, 0.15)' },
          { label: 'Total Revenue', value: `$${stats.revenue.toFixed(2)}`, icon: <DollarSign size={20} />, color: 'var(--secondary)', bg: 'var(--secondary-glow)' },
        ].map((stat, idx) => (
          <div key={idx} className="glass glass-hover" style={{ padding: '20px', borderRadius: 'var(--radius-md)', border: '1px solid var(--card-border)', boxShadow: 'var(--shadow-md)', display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: stat.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', color: stat.color, flexShrink: 0 }}>
              {stat.icon}
            </div>
            <div>
              <span style={{ fontSize: '12px', color: 'var(--text-secondary)', display: 'block', marginBottom: '2px' }}>{stat.label}</span>
              <div style={{ fontSize: '20px', fontWeight: '800', color: 'var(--text-primary)' }}>{stat.value}</div>
            </div>
          </div>
        ))}
      </div>

      {ebooks.length === 0 ? (
        <div className="glass" style={{ padding: '60px 20px', textAlign: 'center', color: 'var(--text-secondary)', borderRadius: 'var(--radius-md)', border: '1px solid var(--card-border)' }}>
          <BookOpen size={48} style={{ color: 'var(--text-muted)', marginBottom: '16px', opacity: '0.5' }} />
          <h3 style={{ fontSize: '20px', fontWeight: '700', marginBottom: '8px', color: 'var(--text-primary)' }}>No Ebooks Uploaded</h3>
          <p style={{ maxWidth: '420px', margin: '0 auto 20px auto', fontSize: '14px', lineHeight: '1.6' }}>
            You haven't uploaded any ebooks yet. Start sharing your creations with Fable's reader network today!
          </p>
          <Link href="/dashboard/writer/add-ebook" className="btn btn-primary" style={{ boxShadow: 'var(--shadow-md)' }}>
            Upload Your First Book
          </Link>
        </div>
      ) : (
        <div className="glass table-container">
          <table className="custom-table">
              <thead>
                <tr style={{ background: 'var(--bg-tertiary)', borderBottom: '1px solid var(--card-border)' }}>
                  <th style={{ padding: '14px 20px', textAlign: 'left', fontSize: '12px', fontWeight: '700', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Cover</th>
                  <th style={{ padding: '14px 20px', textAlign: 'left', fontSize: '12px', fontWeight: '700', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Title</th>
                  <th style={{ padding: '14px 20px', textAlign: 'left', fontSize: '12px', fontWeight: '700', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Genre</th>
                  <th style={{ padding: '14px 20px', textAlign: 'left', fontSize: '12px', fontWeight: '700', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Price</th>
                  <th style={{ padding: '14px 20px', textAlign: 'left', fontSize: '12px', fontWeight: '700', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Availability</th>
                  <th style={{ padding: '14px 20px', textAlign: 'left', fontSize: '12px', fontWeight: '700', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Status</th>
                  <th style={{ padding: '14px 20px', textAlign: 'right', fontSize: '12px', fontWeight: '700', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {ebooks.map((book) => (
                  <tr key={book._id} style={{ borderBottom: '1px solid var(--card-border)', transition: 'background var(--transition-fast) ease' }}>
                    <td style={{ padding: '16px 20px' }}>
                      <img
                        src={book.coverImage}
                        alt={book.title}
                        style={{ width: '42px', height: '56px', objectFit: 'cover', borderRadius: 'var(--radius-sm)', boxShadow: 'var(--shadow-sm)' }}
                      />
                    </td>
                    <td style={{ fontWeight: '600', color: 'var(--text-primary)', fontSize: '14px', maxWidth: '260px' }}>{book.title}</td>
                    <td>
                      <span className="badge badge-primary" style={{ fontSize: '11px', padding: '5px 12px' }}>{book.genre}</span>
                    </td>
                    <td style={{ fontWeight: '700', color: 'var(--text-primary)', fontSize: '14px' }}>${book.price.toFixed(2)}</td>
                    <td>
                      <span style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px',
                        padding: '5px 12px',
                        borderRadius: 'var(--radius-full)',
                        fontSize: '12px',
                        fontWeight: '600',
                        background: book.isSold ? 'rgba(239, 68, 68, 0.12)' : 'rgba(16, 185, 129, 0.12)',
                        color: book.isSold ? 'var(--danger)' : 'var(--success)',
                      }}>
                        {book.isSold ? 'Sold' : 'In Stock'}
                      </span>
                    </td>
                    <td>
                      <span style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px',
                        padding: '5px 12px',
                        borderRadius: 'var(--radius-full)',
                        fontSize: '12px',
                        fontWeight: '600',
                        background: book.status === 'published' ? 'rgba(16, 185, 129, 0.12)' : 'rgba(100, 116, 139, 0.12)',
                        color: book.status === 'published' ? 'var(--success)' : 'var(--text-muted)',
                      }}>
                        {book.status}
                      </span>
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                        <Link href={`/ebook/${book._id}`} className="btn btn-outline" style={{ padding: '8px 10px', borderRadius: 'var(--radius-sm)' }} title="View Details">
                          <Eye size={14} />
                        </Link>

                        <button
                          onClick={() => handleToggleStatus(book._id, book.status)}
                          className="btn btn-outline"
                          style={{ padding: '8px 10px', borderRadius: 'var(--radius-sm)' }}
                          title={book.status === 'published' ? 'Unpublish' : 'Publish'}
                        >
                          {book.status === 'published' ? <EyeOff size={14} /> : <Eye size={14} />}
                        </button>

                        <Link href={`/dashboard/writer/edit/${book._id}`} className="btn btn-outline" style={{ padding: '8px 10px', borderRadius: 'var(--radius-sm)' }} title="Edit">
                          <Edit size={14} style={{ color: 'var(--primary)' }} />
                        </Link>

                        <button
                          onClick={() => handleDelete(book._id, book.title)}
                          className="btn btn-outline"
                          style={{ padding: '8px 10px', borderRadius: 'var(--radius-sm)' }}
                          title="Delete"
                        >
                          <Trash2 size={14} style={{ color: 'var(--danger)' }} />
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