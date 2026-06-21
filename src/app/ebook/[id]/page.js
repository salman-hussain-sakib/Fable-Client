'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Bookmark, Heart, ShoppingBag, BookOpen, Clock, Tag, ArrowLeft, ShieldAlert } from 'lucide-react';
import toast from 'react-hot-toast';
import Link from 'next/link';
import { motion } from 'framer-motion';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export default function EbookDetails() {
  const { id } = useParams();
  const { user, authFetch } = useAuth();
  const router = useRouter();

  const [ebook, setEbook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [purchased, setPurchased] = useState(false);
  const [canAccess, setCanAccess] = useState(false);

  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [togglingAction, setTogglingAction] = useState(false);

  const [showCheckoutModal, setShowCheckoutModal] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('bkash');
  const [isInitiatingPayment, setIsInitiatingPayment] = useState(false);

  const handleClosePayment = () => {
    setPaymentUrl(null);
    setShowCheckoutModal(false);
  };

  useEffect(() => {
    const fetchDetails = async () => {
      setLoading(true);
      try {

        const headers = {};
        const token = require('js-cookie').get('token');
        if (token) {
          headers['Authorization'] = `Bearer ${token}`;
        }

        const res = await fetch(`${API_URL}/ebooks/${id}`, { headers });
        if (!res.ok) {
          throw new Error('Ebook not found');
        }

        const data = await res.json();
        setEbook(data.ebook);
        setPurchased(data.isPurchased);
        setCanAccess(data.canAccessFullContent);


        if (user) {
          const userRes = await authFetch(`${API_URL}/auth/me`);
          if (userRes.ok) {
            const userData = await userRes.json();
            setIsBookmarked(userData.user.bookmarks?.includes(id));
            setIsWishlisted(userData.user.wishlist?.includes(id));
          }
        }
      } catch (err) {
        console.error(err);
        setEbook(null);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchDetails();
  }, [id, user]);

  const handleBookmarkToggle = async () => {
    if (!user) {
      toast.error('Please log in to bookmark ebooks.');
      router.push('/login');
      return;
    }
    setTogglingAction(true);
    try {
      const res = await authFetch(`${API_URL}/user/bookmarks/toggle`, {
        method: 'POST',
        body: JSON.stringify({ ebookId: id }),
      });
      if (res.ok) {
        const data = await res.json();
        setIsBookmarked(data.isBookmarked);
        toast.success(data.isBookmarked ? 'Added to Bookmarks!' : 'Removed from Bookmarks.');
      }
    } catch (err) {
      toast.error('Failed to toggle bookmark.');
    } finally {
      setTogglingAction(false);
    }
  };

  const handleWishlistToggle = async () => {
    if (!user) {
      toast.error('Please log in to add ebooks to your wishlist.');
      router.push('/login');
      return;
    }
    setTogglingAction(true);
    try {
      const res = await authFetch(`${API_URL}/user/wishlist/toggle`, {
        method: 'POST',
        body: JSON.stringify({ ebookId: id }),
      });
      if (res.ok) {
        const data = await res.json();
        setIsWishlisted(data.isWishlisted);
        toast.success(data.isWishlisted ? 'Added to Wishlist!' : 'Removed from Wishlist.');
      }
    } catch (err) {
      toast.error('Failed to toggle wishlist.');
    } finally {
      setTogglingAction(false);
    }
  };

  const handleBuyClick = () => {
    if (!user) {
      toast.error('Please log in to purchase ebooks.');
      router.push('/login');
      return;
    }
    setShowCheckoutModal(true);
  };

  const handleInitiatePayment = async () => {
    setIsInitiatingPayment(true);
    const toastId = toast.loading('Redirecting to secure checkout...');
    try {
      const res = await authFetch(`${API_URL}/payment/create-checkout-session`, {
        method: 'POST',
        body: JSON.stringify({ ebookId: id, paymentMethod: paymentMethod }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Payment initiation failed');
      toast.dismiss(toastId);
      window.location.href = data.url;
    } catch (err) {
      toast.error(err.message, { id: toastId });
    } finally {
      setIsInitiatingPayment(false);
    }
  };

  if (loading) {
    return (
      <div className="container section-padding" style={{ maxWidth: '900px' }}>
        <div className="ebook-details-grid loading">
          <div className="skeleton skeleton-img" style={{ borderRadius: 'var(--radius-md)' }} />
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div className="skeleton skeleton-title" style={{ width: '40%' }} />
            <div className="skeleton skeleton-title" style={{ width: '90%' }} />
            <div className="skeleton skeleton-text" style={{ width: '100%', height: '100px' }} />
          </div>
        </div>
      </div>
    );
  }

  if (!ebook) {
    return (
      <div className="container section-padding" style={{ textAlign: 'center', maxWidth: '500px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '24px' }}>
        <ShieldAlert size={64} style={{ color: 'var(--danger)' }} />
        <div>
          <h2 style={{ fontSize: '24px', fontWeight: '800', marginBottom: '8px' }}>Ebook Not Found</h2>
          <p style={{ color: 'var(--text-secondary)' }}>
            The ebook you are looking for might have been deleted, unpublished, or the ID is invalid.
          </p>
        </div>
        <Link href="/browse" className="btn btn-primary">
          <ArrowLeft size={16} />
          <span>Back to Browse</span>
        </Link>
      </div>
    );
  }

  const isWriter = user && ebook.writer?._id === user.id;

  return (
    <div className="section-padding container" style={{ maxWidth: '900px', paddingBottom: '100px' }}>
      
      <button onClick={() => router.back()} className="btn btn-outline" style={{ display: 'inline-flex', gap: '8px', padding: '8px 16px', marginBottom: '30px' }}>
        <ArrowLeft size={16} />
        <span>Back</span>
      </button>

      
      <div className="glass ebook-details-grid" style={{ borderRadius: 'var(--radius-md)', marginBottom: '40px', alignItems: 'start' }}>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', width: '100%' }}>
          <div style={{ width: '100%', aspectRatio: '1.3/1.7', borderRadius: 'var(--radius-sm)', overflow: 'hidden', boxShadow: 'var(--shadow-lg)' }}>
            <img src={ebook.coverImage} alt={ebook.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </div>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button
              onClick={handleBookmarkToggle}
              disabled={togglingAction}
              className={`btn ${isBookmarked ? 'btn-primary' : 'btn-outline'}`}
              style={{ flex: '1', padding: '10px' }}
              title="Bookmark"
            >
              <Bookmark size={18} fill={isBookmarked ? 'currentColor' : 'none'} />
            </button>
            <button
              onClick={handleWishlistToggle}
              disabled={togglingAction}
              className={`btn ${isWishlisted ? 'btn-secondary' : 'btn-outline'}`}
              style={{ flex: '1', padding: '10px' }}
              title="Add to Wishlist"
            >
              <Heart size={18} fill={isWishlisted ? 'currentColor' : 'none'} />
            </button>
          </div>
        </div>

        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', alignItems: 'center' }}>
            <span className="badge badge-primary" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Tag size={12} />
              <span>{ebook.genre}</span>
            </span>
            <span className="badge badge-success" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Clock size={12} />
              <span>{new Date(ebook.createdAt).toLocaleDateString()}</span>
            </span>
            {ebook.isSold && <span className="badge badge-danger">Sold</span>}
          </div>

          <h1 style={{ fontSize: '32px', fontWeight: '800', lineHeight: '1.2' }}>{ebook.title}</h1>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '15px' }}>
            {ebook.writer?.profilePicture ? (
              <img src={ebook.writer.profilePicture} referrerPolicy="no-referrer" alt={ebook.writer.name} style={{ width: '36px', height: '36px', borderRadius: '50%', objectFit: 'cover' }} />
            ) : (
              <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'var(--primary-glow)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <BookOpen size={16} />
              </div>
            )}
            <div>
              <div style={{ color: 'var(--text-secondary)', fontSize: '12px' }}>Written by</div>
              <div style={{ fontWeight: '600' }}>{ebook.writer?.name || 'Unknown Author'}</div>
            </div>
          </div>

          <hr style={{ border: 'none', borderTop: '1px solid var(--card-border)' }} />

          <div>
            <h3 style={{ fontSize: '14px', color: 'var(--text-secondary)', marginBottom: '8px' }}>Preview Description</h3>
            <p style={{ fontSize: '15px', color: 'var(--text-primary)', lineHeight: '1.6' }}>{ebook.previewDescription}</p>
          </div>

          <div className="purchase-box">
            <div>
              <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>Purchase Price</span>
              <div style={{ fontSize: '26px', fontWeight: '800', color: 'var(--primary)' }}>${ebook.price.toFixed(2)}</div>
            </div>

            
            {canAccess ? (
              <div className="badge badge-success" style={{ fontSize: '14px', padding: '12px 20px', borderRadius: 'var(--radius-sm)' }}>
                <BookOpen size={16} style={{ marginRight: '6px' }} />
                <span>Unlocked & Purchased</span>
              </div>
            ) : isWriter ? (
              <div className="badge badge-primary" style={{ fontSize: '13px', padding: '12px 20px', borderRadius: 'var(--radius-sm)' }}>
                <span>Author Account</span>
              </div>
            ) : ebook.isSold ? (
              <button disabled className="btn btn-primary" style={{ padding: '12px 24px' }}>
                <span>Sold Out</span>
              </button>
            ) : (
              <button onClick={handleBuyClick} className="btn btn-primary" style={{ padding: '12px 24px' }}>
                <ShoppingBag size={16} />
                <span>Buy Now</span>
              </button>
            )}
          </div>
        </div>
      </div>

      
      <div className="glass reading-panel">
        <h2 style={{ fontSize: '22px', fontWeight: '700', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <BookOpen size={20} style={{ color: 'var(--primary)' }} />
          <span>Ebook Reading Panel</span>
        </h2>

        {canAccess ? (
          <div style={{ padding: '24px', background: 'var(--bg-secondary)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--card-border)', lineHeight: '1.8', fontSize: '16px', color: 'var(--text-primary)', whiteSpace: 'pre-line' }}>
            {ebook.description}
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '60px 20px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
            <ShoppingBag size={48} style={{ color: 'var(--text-muted)', opacity: '0.4' }} />
            <div>
              <h4 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '6px' }}>Content Locked</h4>
              <p style={{ color: 'var(--text-secondary)', fontSize: '14px', maxWidth: '400px', margin: '0 auto' }}>
                Purchase this ebook to unlock the full reading experience.
              </p>
            </div>
            {!user && (
              <Link href="/login" className="btn btn-outline" style={{ fontSize: '13px', padding: '8px 16px' }}>
                Login to Purchase
              </Link>
            )}
          </div>
        )}
      </div>

      
      {showCheckoutModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.7)',
          backdropFilter: 'blur(8px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: '20px'
        }}>
          
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              className="glass"
              style={{
                width: '100%',
                maxWidth: '520px',
                padding: '32px',
                borderRadius: 'var(--radius-md)',
                display: 'flex',
                flexDirection: 'column',
                gap: '24px',
                boxShadow: 'var(--shadow-lg)',
                border: '1px solid var(--card-border)',
                background: 'var(--bg-secondary)',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h2 style={{ fontSize: '22px', fontWeight: '800' }}>Confirm Order</h2>
                <button 
                  onClick={() => setShowCheckoutModal(false)}
                  style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', fontSize: '20px', fontWeight: 'bold' }}
                >
                  &times;
                </button>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '80px 1fr', gap: '16px', padding: '16px', background: 'var(--bg-tertiary)', borderRadius: 'var(--radius-sm)' }}>
                <img src={ebook.coverImage} alt={ebook.title} style={{ width: '100%', height: '110px', objectFit: 'cover', borderRadius: '4px' }} />
                <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: '6px' }}>
                  <h4 style={{ fontWeight: '700', fontSize: '16px' }}>{ebook.title}</h4>
                  <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>By {ebook.writer?.name || 'Unknown Writer'}</p>
                  <span style={{ fontWeight: '700', color: 'var(--primary)' }}>${ebook.price.toFixed(2)}</span>
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <h4 style={{ fontSize: '14px', fontWeight: '700', color: 'var(--text-secondary)' }}>Order Summary</h4>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px' }}>
                  <span>Ebook Price</span>
                  <span>${ebook.price.toFixed(2)}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px' }}>
                  <span>Platform Fee</span>
                  <span style={{ color: 'var(--success)' }}>FREE</span>
                </div>
                <hr style={{ border: 'none', borderTop: '1px solid var(--card-border)' }} />
                <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: '800', fontSize: '16px' }}>
                  <span>Total Payable</span>
                  <span style={{ color: 'var(--primary)' }}>${ebook.price.toFixed(2)}</span>
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <h4 style={{ fontSize: '13px', fontWeight: '700', color: 'var(--text-secondary)' }}>Select Payment Method</h4>
                <div className="payment-method-grid">
                  {[
                    { id: 'bkash', name: 'bKash', color: '#e2125f' },
                    { id: 'nagad', name: 'Nagad', color: '#f69220' },
                    { id: 'rocket', name: 'Rocket', color: '#8c3c96' },
                    { id: 'card', name: 'Visa / Mastercard', color: '#0e7490' },
                  ].map((item) => {
                    const isActive = paymentMethod === item.id;
                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => setPaymentMethod(item.id)}
                        style={{
                          padding: '10px 8px', borderRadius: '10px', cursor: 'pointer',
                          border: isActive ? `2px solid ${item.color}` : '1px solid var(--card-border)',
                          background: isActive ? 'var(--bg-tertiary)' : 'transparent',
                          color: isActive ? item.color : 'var(--text-secondary)',
                          fontWeight: '700', fontSize: '12px',
                          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px',
                          transition: 'all 0.2s',
                        }}
                      >
                        <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: item.color, display: 'inline-block' }} />
                        {item.name}
                      </button>
                    );
                  })}
                </div>
                <p style={{ fontSize: '11px', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px', marginTop: '4px' }}>
                  🔒 Payments are secured and encrypted
                </p>
              </div>

              <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
                <button 
                  onClick={() => setShowCheckoutModal(false)} 
                  className="btn btn-outline" 
                  style={{ flex: 1, height: '46px' }}
                >
                  Cancel
                </button>
                <button 
                  onClick={handleInitiatePayment} 
                  disabled={isInitiatingPayment}
                  className="btn btn-primary" 
                  style={{ flex: 2, height: '46px' }}
                >
                  {isInitiatingPayment ? 'Processing...' : `Pay $${ebook.price.toFixed(2)}`}
                </button>
              </div>
            </motion.div>
        </div>
      )}
    </div>
  );
}
