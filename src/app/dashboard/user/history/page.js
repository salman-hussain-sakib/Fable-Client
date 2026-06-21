'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { History, CircleDollarSign } from 'lucide-react';
import toast from 'react-hot-toast';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export default function PurchaseHistory() {
  const { authFetch } = useAuth();
  const [purchases, setPurchases] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPurchases = async () => {
      try {
        const res = await authFetch(`${API_URL}/user/purchases`);
        if (res.ok) {
          const data = await res.json();
          setPurchases(data);
        } else {
          toast.error('Failed to load transaction history');
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchPurchases();
  }, []);

  if (loading) {
    return (
      <div className="spinner-container">
        <div className="spinner" />
      </div>
    );
  }

  return (
    <div>
      <h2 style={{ fontSize: '28px', fontWeight: '800', marginBottom: '24px' }}>Transaction & Purchase History</h2>

      {purchases.length === 0 ? (
        <div className="glass" style={{ padding: '60px 20px', textAlign: 'center', color: 'var(--text-secondary)' }}>
          <History size={40} style={{ color: 'var(--text-muted)', marginBottom: '16px', opacity: '0.4' }} />
          <h3 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '8px', color: 'var(--text-primary)' }}>No Transactions Record</h3>
          <p style={{ maxWidth: '360px', margin: '0 auto', fontSize: '14px' }}>
            You have not made any purchases or payment transactions on Fable yet.
          </p>
        </div>
      ) : (
        <div className="glass table-container">
          <table className="custom-table">
            <thead>
              <tr>
                <th>Transaction ID</th>
                <th>Ebook Title</th>
                <th>Writer Name</th>
                <th>Amount Paid</th>
                <th>Purchase Date</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {purchases.map((tx) => (
                <tr key={tx._id}>
                  <td style={{ fontFamily: 'monospace', fontWeight: '600', fontSize: '12px' }}>
                    {tx.transactionId}
                  </td>
                  <td style={{ fontWeight: '600' }}>
                    {tx.ebook?.title || 'Unknown Ebook'}
                  </td>
                  <td>
                    {tx.ebook?.writer?.name || 'Unknown Author'}
                  </td>
                  <td style={{ fontWeight: '700', color: 'var(--primary)' }}>
                    ${tx.amount.toFixed(2)}
                  </td>
                  <td>
                    {new Date(tx.createdAt).toLocaleDateString()} at {new Date(tx.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </td>
                  <td>
                    <span className={`badge ${tx.status === 'success' ? 'badge-success' : tx.status === 'pending' ? 'badge-primary' : 'badge-danger'}`}>
                      {tx.status}
                    </span>
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
