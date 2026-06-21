'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { CircleDollarSign, History } from 'lucide-react';
import toast from 'react-hot-toast';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export default function WriterSales() {
  const { authFetch } = useAuth();
  const [sales, setSales] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSales = async () => {
      try {
        const res = await authFetch(`${API_URL}/user/writer/sales`);
        if (res.ok) {
          const data = await res.json();
          setSales(data);
        } else {
          toast.error('Failed to load sales history');
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchSales();
  }, []);

  if (loading) {
    return (
      <div className="spinner-container">
        <div className="spinner" />
      </div>
    );
  }


  const totalEarned = sales.reduce((sum, s) => sum + s.amount, 0);

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h2 style={{ fontSize: '28px', fontWeight: '800', marginBottom: '6px' }}>Sales & Earnings History</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>Monitor purchases of your published work on Fable.</p>
        </div>

        
        <div className="glass" style={{ padding: '16px 24px', display: 'flex', alignItems: 'center', gap: '16px', borderRadius: 'var(--radius-sm)' }}>
          <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'var(--primary-glow)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)' }}>
            <CircleDollarSign size={20} />
          </div>
          <div>
            <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Total Revenue</span>
            <div style={{ fontSize: '20px', fontWeight: '800', color: 'var(--success)' }}>
              ${totalEarned.toFixed(2)}
            </div>
          </div>
        </div>
      </div>

      {sales.length === 0 ? (
        <div className="glass" style={{ padding: '60px 20px', textAlign: 'center', color: 'var(--text-secondary)' }}>
          <History size={40} style={{ color: 'var(--text-muted)', marginBottom: '16px', opacity: '0.4' }} />
          <h3 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '8px', color: 'var(--text-primary)' }}>No Sales Recorded</h3>
          <p style={{ maxWidth: '360px', margin: '0 auto', fontSize: '14px' }}>
            None of your ebooks have been sold yet. Keep writing and promoting your books!
          </p>
        </div>
      ) : (
        <div className="glass table-container">
          <table className="custom-table">
            <thead>
              <tr>
                <th>Transaction ID</th>
                <th>Ebook Title</th>
                <th>Buyer Name</th>
                <th>Buyer Email</th>
                <th>Amount Earned</th>
                <th>Date Sold</th>
              </tr>
            </thead>
            <tbody>
              {sales.map((sale) => (
                <tr key={sale._id}>
                  <td style={{ fontFamily: 'monospace', fontWeight: '600', fontSize: '12px' }}>
                    {sale.transactionId}
                  </td>
                  <td style={{ fontWeight: '600' }}>
                    {sale.ebook?.title || 'Deleted Ebook'}
                  </td>
                  <td>
                    {sale.buyer?.name || 'Anonymous Reader'}
                  </td>
                  <td style={{ color: 'var(--text-secondary)' }}>
                    {sale.buyer?.email || 'N/A'}
                  </td>
                  <td style={{ fontWeight: '700', color: 'var(--success)' }}>
                    ${sale.amount.toFixed(2)}
                  </td>
                  <td>
                    {new Date(sale.createdAt).toLocaleDateString()} at {new Date(sale.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
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
