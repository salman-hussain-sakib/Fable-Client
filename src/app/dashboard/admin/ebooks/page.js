'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';
import { Trash2, Eye, EyeOff, BookOpen, ShieldCheck } from 'lucide-react';
import toast from 'react-hot-toast';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export default function AdminEbooks() {
  const { authFetch } = useAuth();
  const [ebooks, setEbooks] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchAllEbooks = async () => {
    try {
      const res = await authFetch(`${API_URL}/admin/ebooks`);
      if (res.ok) {
        const data = await res.json();
        setEbooks(data);
      } else {
        toast.error('Failed to load all ebooks');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllEbooks();
  }, []);

  const handleToggleStatus = async (id, currentStatus) => {
    const nextStatus = currentStatus === 'published' ? 'unpublished' : 'published';
    try {
      const res = await authFetch(`${API_URL}/ebooks/${id}/status`, {
        method: 'PATCH',
        body: JSON.stringify({ status: nextStatus }),
      });
      if (res.ok) {
        toast.success(`Ebook status updated to "${nextStatus}" successfully!`);
        setEbooks(ebooks.map(e => e._id === id ? { ...e, status: nextStatus } : e));
      } else {
        toast.error('Failed to change ebook status');
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteEbook = async (id, title) => {
    if (!confirm(`Are you sure you want to permanently delete ebook "${title}"? This cannot be undone.`)) return;

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
      toast.error('Server error deleting ebook');
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
        <h2 style={{ fontSize: '28px', fontWeight: '800', marginBottom: '6px', color: 'var(--text-primary)' }}>Manage Platform Ebooks</h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>View, update, and manage all uploaded ebooks across the platform.</p>
      </div>

      {ebooks.length === 0 ? (
        <div className="glass" style={{ padding: '60px 20px', textAlign: 'center', color: 'var(--text-secondary)', borderRadius: 'var(--radius-md)', border: '1px solid var(--card-border)' }}>
          <BookOpen size={48} style={{ color: 'var(--text-muted)', marginBottom: '16px', opacity: '0.5' }} />
          <h3 style={{ fontSize: '20px', fontWeight: '700', marginBottom: '8px', color: 'var(--text-primary)' }}>No Ebooks Found</h3>
          <p style={{ maxWidth: '360px', margin: '0 auto', fontSize: '14px', lineHeight: '1.6' }}>
            No authors have uploaded ebooks on the platform yet.
          </p>
        </div>
      ) : (
        <div className="glass" style={{ borderRadius: 'var(--radius-md)', border: '1px solid var(--card-border)', boxShadow: 'var(--shadow-md)', overflow: 'hidden' }}>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: 'var(--bg-tertiary)', borderBottom: '1px solid var(--card-border)' }}>
                  <th style={{ padding: '14px 20px', textAlign: 'left', fontSize: '12px', fontWeight: '700', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Cover</th>
                  <th style={{ padding: '14px 20px', textAlign: 'left', fontSize: '12px', fontWeight: '700', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Ebook Title</th>
                  <th style={{ padding: '14px 20px', textAlign: 'left', fontSize: '12px', fontWeight: '700', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Author</th>
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
                    <td style={{ color: 'var(--text-secondary)', fontSize: '13px' }}>{book.writer?.name || 'Unknown Author'}</td>
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
                        <ShieldCheck size={12} />
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

                        <button
                          onClick={() => handleDeleteEbook(book._id, book.title)}
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
        </div>
      )}
    </div>
  );
}