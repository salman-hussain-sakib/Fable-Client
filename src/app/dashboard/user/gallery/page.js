'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';
import { BookOpen, User, ArrowRight } from 'lucide-react';
import toast from 'react-hot-toast';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export default function PurchasedGallery() {
  const { authFetch } = useAuth();
  const [ebooks, setEbooks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPurchased = async () => {
      try {
        const res = await authFetch(`${API_URL}/user/purchased-ebooks`);
        if (res.ok) {
          const data = await res.json();
          setEbooks(data);
        } else {
          toast.error('Failed to load purchased ebooks');
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchPurchased();
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
      <h2 style={{ fontSize: '28px', fontWeight: '800', marginBottom: '24px' }}>My Purchased Ebooks</h2>

      {ebooks.length === 0 ? (
        <div className="glass" style={{ padding: '60px 20px', textAlign: 'center', color: 'var(--text-secondary)' }}>
          <BookOpen size={40} style={{ color: 'var(--text-muted)', marginBottom: '16px', opacity: '0.4' }} />
          <h3 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '8px', color: 'var(--text-primary)' }}>Your Bookshelf is Empty</h3>
          <p style={{ maxWidth: '360px', margin: '0 auto 20px auto', fontSize: '14px' }}>
            You haven't purchased any ebooks yet. Explore our catalog to buy premium original releases!
          </p>
          <Link href="/browse" className="btn btn-primary">
            Browse Catalog
          </Link>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '24px' }}>
          {ebooks.map((book) => (
            <div
              key={book._id}
              className="glass glass-hover"
              style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden', height: '100%', borderRadius: 'var(--radius-md)' }}
            >
              <div style={{ position: 'relative', width: '100%', aspectRatio: '1.3/1.6', overflow: 'hidden', backgroundColor: 'var(--bg-tertiary)' }}>
                <img src={book.coverImage} alt={book.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>

              <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', flex: '1', gap: '10px' }}>
                <h3 style={{ fontSize: '15px', fontWeight: '700', lineHeight: '1.3', color: 'var(--text-primary)' }}>{book.title}</h3>
                
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: 'var(--text-secondary)' }}>
                  <User size={12} />
                  <span>{book.writer?.name || 'Unknown Writer'}</span>
                </div>

                <Link
                  href={`/ebook/${book._id}`}
                  className="btn btn-primary"
                  style={{ width: '100%', padding: '8px', fontSize: '13px', marginTop: 'auto' }}
                >
                  <span>Read Ebook</span>
                  <ArrowRight size={12} />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
