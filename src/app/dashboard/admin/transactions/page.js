'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { History, CircleDollarSign, ShieldCheck, ShieldAlert, Clock } from 'lucide-react';
import toast from 'react-hot-toast';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export default function AdminTransactions() {
  const { authFetch } = useAuth();
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const res = await authFetch(`${API_URL}/admin/transactions`);
        if (res.ok) {
          const data = await res.json();
          setTransactions(data);
        } else {
          toast.error('Failed to load transaction logs');
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, []);

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
        <h2 style={{ fontSize: '28px', fontWeight: '800', marginBottom: '6px', color: 'var(--text-primary)' }}>System Transactions Log</h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>Complete payment history and transaction records across the platform.</p>
      </div>

      {transactions.length === 0 ? (
        <div className="glass" style={{ padding: '60px 20px', textAlign: 'center', color: 'var(--text-secondary)', borderRadius: 'var(--radius-md)', border: '1px solid var(--card-border)' }}>
          <History size={48} style={{ color: 'var(--text-muted)', marginBottom: '16px', opacity: '0.5' }} />
          <h3 style={{ fontSize: '20px', fontWeight: '700', marginBottom: '8px', color: 'var(--text-primary)' }}>No Transactions Found</h3>
          <p style={{ maxWidth: '360px', margin: '0 auto', fontSize: '14px', lineHeight: '1.6' }}>
            No payment history exists in the platform logs yet.
          </p>
        </div>
      ) : (
        <div className="glass" style={{ borderRadius: 'var(--radius-md)', border: '1px solid var(--card-border)', boxShadow: 'var(--shadow-md)', overflow: 'hidden' }}>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: 'var(--bg-tertiary)', borderBottom: '1px solid var(--card-border)' }}>
                  <th style={{ padding: '14px 20px', textAlign: 'left', fontSize: '12px', fontWeight: '700', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Transaction ID</th>
                  <th style={{ padding: '14px 20px', textAlign: 'left', fontSize: '12px', fontWeight: '700', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Type</th>
                  <th style={{ padding: '14px 20px', textAlign: 'left', fontSize: '12px', fontWeight: '700', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Ebook / Item</th>
                  <th style={{ padding: '14px 20px', textAlign: 'left', fontSize: '12px', fontWeight: '700', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Payer</th>
                  <th style={{ padding: '14px 20px', textAlign: 'left', fontSize: '12px', fontWeight: '700', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Amount</th>
                  <th style={{ padding: '14px 20px', textAlign: 'left', fontSize: '12px', fontWeight: '700', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Date & Time</th>
                  <th style={{ padding: '14px 20px', textAlign: 'left', fontSize: '12px', fontWeight: '700', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Status</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((tx) => (
                  <tr key={tx._id} style={{ borderBottom: '1px solid var(--card-border)', transition: 'background var(--transition-fast) ease' }}>
                    <td style={{ padding: '16px 20px', fontFamily: 'monospace', fontWeight: '600', fontSize: '12px', color: 'var(--text-secondary)' }}>
                      {tx.transactionId}
                    </td>
                    <td style={{ padding: '16px 20px' }}>
                      <span style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px',
                        padding: '5px 12px',
                        borderRadius: 'var(--radius-full)',
                        fontSize: '12px',
                        fontWeight: '600',
                        background: tx.type === 'purchase' ? 'var(--primary-glow)' : 'var(--secondary-glow)',
                        

                      }}>
                        <CircleDollarSign size={12} />
                        {tx.type === 'purchase' ? 'Purchase' : tx.type}
                      </span>
                    </td>
                    <td style={{ padding: '16px 20px', fontWeight: '600', color: 'var(--text-primary)', fontSize: '14px', maxWidth: '260px' }}>
                      {tx.type === 'purchase' ? (tx.ebook?.title || 'Deleted Ebook') : 'N/A'}
                    </td>
                    <td style={{ padding: '16px 20px', color: 'var(--text-secondary)', fontSize: '13px' }}>{tx.buyer?.email || 'N/A'}</td>
                    <td style={{ padding: '16px 20px', fontWeight: '700', color: 'var(--text-primary)', fontSize: '14px' }}>${tx.amount.toFixed(2)}</td>
                    <td style={{ padding: '16px 20px', color: 'var(--text-secondary)', fontSize: '13px' }}>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                        <span>{new Date(tx.createdAt).toLocaleDateString()}</span>
                        <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{new Date(tx.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      </div>
                    </td>
                    <td style={{ padding: '16px 20px' }}>
                      <span style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px',
                        padding: '5px 12px',
                        borderRadius: 'var(--radius-full)',
                        fontSize: '12px',
                        fontWeight: '600',
                        background: tx.status === 'success' ? 'rgba(16, 185, 129, 0.12)' : tx.status === 'pending' ? 'rgba(245, 158, 11, 0.12)' : 'rgba(239, 68, 68, 0.12)',
                        color: tx.status === 'success' ? 'var(--success)' : tx.status === 'pending' ? '#f59e0b' : 'var(--danger)',
                      }}>
                        {tx.status === 'success' && <ShieldCheck size={12} />}
                        {tx.status === 'pending' && <Clock size={12} />}
                        {tx.status === 'failed' && <ShieldAlert size={12} />}
                        {tx.status}
                      </span>
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