'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@/context/ThemeContext';
import { Smartphone, ShieldCheck, AlertCircle, ArrowLeft, Loader2, KeyRound, BookOpen, CreditCard } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardNumberElement, CardExpiryElement, CardCvcElement, useStripe, useElements } from '@stripe/react-stripe-js';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

function StripeCardForm({ tranId, price, onSuccess, onError, authFetch, isDark }) {
  const stripe = useStripe();
  const elements = useElements();
  const [processing, setProcessing] = useState(false);
  const [cardError, setCardError] = useState('');

  const inputStyle = {
    padding: '14px 16px',
    borderRadius: '8px',
    background: isDark ? 'rgba(255,255,255,0.04)' : 'var(--bg-secondary)',
    border: '1px solid var(--card-border)',
    fontSize: '15px',
  };

  const stripeElementStyle = {
    style: {
      base: {
        fontSize: '15px',
        color: isDark ? '#f1f5f9' : '#0a1628',
        fontFamily: 'Outfit, sans-serif',
        '::placeholder': { color: isDark ? '#64748b' : '#7aaebb' },
      },
      invalid: { color: '#ef4444' },
    },
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) return;
    setProcessing(true);
    setCardError('');

    try {
      const res = await authFetch(`${API_URL}/payment/create-payment-intent`, {
        method: 'POST',
        body: JSON.stringify({ transactionId: tranId }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to initiate payment');

      const { error, paymentIntent } = await stripe.confirmCardPayment(data.clientSecret, {
        payment_method: { card: elements.getElement(CardNumberElement) },
      });

      if (error) {
        setCardError(error.message);
        setProcessing(false);
        return;
      }

      if (paymentIntent.status === 'succeeded') {
        const confirmRes = await authFetch(`${API_URL}/payment/confirm-payment`, {
          method: 'POST',
          body: JSON.stringify({ transactionId: tranId }),
        });
        if (confirmRes.ok) {
          onSuccess();
        } else {
          throw new Error('Payment confirmed but failed to update records');
        }
      }
    } catch (err) {
      onError(err.message);
      setProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <div style={{ padding: '16px', background: 'linear-gradient(135deg, var(--primary) 0%, #0e7490 100%)', borderRadius: '12px', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <p style={{ fontSize: '11px', opacity: 0.8, marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '1px' }}>Fable Secure Payment</p>
          <p style={{ fontSize: '16px', fontWeight: '700' }}>Credit / Debit Card</p>
        </div>
        <CreditCard size={28} />
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
        <label style={{ fontSize: '12px', color: 'var(--text-secondary)', fontWeight: '600' }}>Card Number</label>
        <div style={inputStyle}>
          <CardNumberElement options={stripeElementStyle} />
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <label style={{ fontSize: '12px', color: 'var(--text-secondary)', fontWeight: '600' }}>Expiry Date</label>
          <div style={inputStyle}>
            <CardExpiryElement options={stripeElementStyle} />
          </div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <label style={{ fontSize: '12px', color: 'var(--text-secondary)', fontWeight: '600' }}>CVC</label>
          <div style={inputStyle}>
            <CardCvcElement options={stripeElementStyle} />
          </div>
        </div>
      </div>

      {cardError && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 12px', background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: '8px', color: '#ef4444', fontSize: '13px' }}>
          <AlertCircle size={14} />
          <span>{cardError}</span>
        </div>
      )}

      <button
        type="submit"
        disabled={!stripe || processing}
        style={{
          width: '100%', padding: '14px', borderRadius: '10px', border: 'none',
          background: processing ? 'var(--bg-tertiary)' : 'var(--primary)',
          color: processing ? 'var(--text-muted)' : '#fff',
          cursor: processing ? 'not-allowed' : 'pointer',
          fontSize: '15px', fontWeight: '700',
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
          boxShadow: processing ? 'none' : '0 4px 14px var(--primary-glow)',
          transition: 'all 0.2s',
        }}
      >
        {processing ? (
          <><Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} /> Processing...</>
        ) : (
          <><ShieldCheck size={16} /> Pay ${price}</>
        )}
      </button>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', fontSize: '11px', color: 'var(--text-muted)' }}>
        <ShieldCheck size={12} style={{ color: 'var(--success)' }} />
        Secured by Stripe — 256-bit SSL encryption
      </div>
    </form>
  );
}

function GatewayContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { authFetch } = useAuth();
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const tranId = searchParams.get('tran_id');
  const title = searchParams.get('title') || 'Digital Ebook';
  const price = searchParams.get('price') ? parseFloat(searchParams.get('price')).toFixed(2) : '0.00';
  const cover = searchParams.get('cover') || '';
  const methodParam = searchParams.get('method') || 'bkash';

  const [paymentMethod, setPaymentMethod] = useState(methodParam);
  const [step, setStep] = useState(1);
  const [walletNumber, setWalletNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [pin, setPin] = useState('');
  const [mockOtp, setMockOtp] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [simulatingStatus, setSimulatingStatus] = useState('');

  useEffect(() => {
    if (!tranId) {
      toast.error('Invalid payment session');
      router.push('/browse');
    }
  }, [tranId]);

  const getBrandColor = () => {
    if (paymentMethod === 'bkash') return '#e2125f';
    if (paymentMethod === 'nagad') return '#f69220';
    if (paymentMethod === 'rocket') return '#8c3c96';
    return 'var(--primary)';
  };

  const getMethodTitle = () => {
    if (paymentMethod === 'bkash') return 'bKash Wallet';
    if (paymentMethod === 'nagad') return 'Nagad Account';
    if (paymentMethod === 'rocket') return 'Rocket Wallet';
    return 'Card Payment';
  };

  const sendMockOtp = () => {
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    setMockOtp(code);
    setTimeout(() => {
      toast.custom((t) => (
        <div style={{ borderLeft: '4px solid #e2125f', background: '#0e0e11', color: '#fff', padding: '16px', borderRadius: '8px', maxWidth: '360px', display: 'flex', gap: '12px' }}>
          <div style={{ flex: 1 }}>
            <p style={{ fontSize: '13px', fontWeight: '700', color: '#e2125f', margin: '0 0 6px' }}>💬 SMS from 29000 (FABLE)</p>
            <p style={{ fontSize: '12px', color: '#a1a1aa', margin: 0, lineHeight: '1.5' }}>
              Your Fable OTP is <strong style={{ color: '#fff', fontSize: '15px', letterSpacing: '2px' }}>{code}</strong>. Valid 2 mins.
            </p>
          </div>
          <button onClick={() => toast.dismiss(t.id)} style={{ background: 'none', border: 'none', color: '#71717a', cursor: 'pointer', fontSize: '18px', alignSelf: 'flex-start' }}>×</button>
        </div>
      ), { duration: 9000 });
    }, 1500);
  };

  const handleNextStep = () => {
    setErrorMsg('');
    if (step === 1) {
      const regex = /^(01)[3-9][0-9]{8}$/;
      if (!regex.test(walletNumber)) {
        setErrorMsg('Please enter a valid 11-digit BD number (e.g. 017XXXXXXXX)');
        return;
      }
      sendMockOtp();
      setStep(2);
    } else if (step === 2) {
      if (otp !== mockOtp && otp !== '123456') {
        setErrorMsg('Invalid OTP. Check the notification.');
        return;
      }
      setStep(3);
    } else if (step === 3) {
      if (pin.length < 4) {
        setErrorMsg('Please enter your PIN');
        return;
      }
      processWalletPayment();
    }
  };

  const processWalletPayment = async () => {
    setStep(4);
    setSimulatingStatus('Connecting to secure payment gateway...');
    setTimeout(() => setSimulatingStatus(`Authorizing with ${paymentMethod.toUpperCase()} network...`), 1500);
    setTimeout(() => setSimulatingStatus('Unlocking your ebook...'), 3000);
    try {
      const res = await authFetch(`${API_URL}/payment/simulate-success`, {
        method: 'POST',
        body: JSON.stringify({ transactionId: tranId }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Payment failed');
      setTimeout(() => {
        toast.success('Payment successful! Invoice sent to your email.');
        router.push(`/payment/success?tran_id=${tranId}`);
      }, 4200);
    } catch (err) {
      setTimeout(() => {
        toast.error('Payment failed.');
        router.push('/payment/fail');
      }, 4200);
    }
  };

  const handleCardSuccess = () => {
    toast.success('Payment successful! Invoice sent to your email.');
    router.push(`/payment/success?tran_id=${tranId}`);
  };

  const handleCardError = (msg) => {
    toast.error(msg || 'Card payment failed.');
  };

  const orderSummary = (
    <div className="order-summary-box">
      <div>
        <div style={{ marginBottom: '28px' }}>
          <BookOpen size={28} style={{ color: 'var(--primary)', marginBottom: '8px' }} />
          <span style={{ fontSize: '22px', fontWeight: '800', background: 'linear-gradient(120deg, var(--primary) 0%, var(--secondary) 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            Fable Checkout
          </span>
        </div>

        <div style={{ display: 'flex', gap: '14px', marginBottom: '24px' }}>
          {cover ? (
            <img src={cover} alt={title} style={{ width: '72px', height: '100px', objectFit: 'cover', borderRadius: '8px', border: '1px solid var(--card-border)', flexShrink: 0 }} />
          ) : (
            <div style={{ width: '72px', height: '100px', background: 'var(--bg-tertiary)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <BookOpen size={20} style={{ color: 'var(--text-muted)' }} />
            </div>
          )}
          <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: '6px' }}>
            <span style={{ fontSize: '11px', color: 'var(--primary)', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1px' }}>Purchasing</span>
            <h3 style={{ fontSize: '16px', fontWeight: '700', margin: 0, lineHeight: '1.3', color: 'var(--text-primary)' }}>{title}</h3>
            <span style={{ fontSize: '11px', color: 'var(--text-muted)', fontFamily: 'monospace' }}>{tranId?.slice(0, 18)}...</span>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', padding: '18px', background: isDark ? 'rgba(255,255,255,0.02)' : 'var(--bg-primary)', borderRadius: '12px', border: '1px solid var(--card-border)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px' }}>
            <span style={{ color: 'var(--text-secondary)' }}>Ebook Price</span>
            <span style={{ fontWeight: '500' }}>${price}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px' }}>
            <span style={{ color: 'var(--text-secondary)' }}>Platform Fee</span>
            <span style={{ color: 'var(--success)', fontWeight: '700' }}>FREE</span>
          </div>
          <hr style={{ border: 'none', borderTop: '1px solid var(--card-border)', margin: '4px 0' }} />
          <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: '800', fontSize: '18px' }}>
            <span>Total</span>
            <span style={{ color: 'var(--primary)' }}>${price}</span>
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-muted)', fontSize: '12px' }}>
        <ShieldCheck size={14} style={{ color: 'var(--success)' }} />
        <span>256-bit SSL Secured Connection</span>
      </div>
    </div>
  );

  return (
    <div className="gateway-wrapper">
      <div className="gateway-card">
        {orderSummary}

        <div className="gateway-form-panel">
          {step < 4 && (
            <div>
              <h3 style={{ fontSize: '20px', fontWeight: '800', marginBottom: '4px' }}>Payment Method</h3>
              <p style={{ fontSize: '13px', color: 'var(--text-secondary)', margin: 0 }}>Choose how you want to pay.</p>
            </div>
          )}

          {step < 4 && (
            <div className="payment-method-grid">
              {[
                { id: 'bkash', name: 'bKash', color: '#e2125f' },
                { id: 'nagad', name: 'Nagad', color: '#f69220' },
                { id: 'rocket', name: 'Rocket', color: '#8c3c96' },
                { id: 'card', name: 'Card', color: 'var(--primary)' },
              ].map((item) => {
                const isActive = paymentMethod === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => { setPaymentMethod(item.id); setStep(1); setErrorMsg(''); setWalletNumber(''); setOtp(''); setPin(''); }}
                    style={{
                      padding: '12px 6px', borderRadius: '10px', cursor: 'pointer',
                      border: isActive ? `2px solid ${item.color}` : '1px solid var(--card-border)',
                      background: isActive ? (isDark ? 'rgba(255,255,255,0.04)' : 'var(--bg-secondary)') : 'transparent',
                      color: isActive ? item.color : 'var(--text-secondary)',
                      fontWeight: '700', fontSize: '12px',
                      display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px',
                      transition: 'all 0.2s',
                    }}
                  >
                    <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: item.color }} />
                    {item.name}
                  </button>
                );
              })}
            </div>
          )}

          {/* Card Payment — Stripe Elements */}
          {paymentMethod === 'card' && step < 4 && (
            <Elements stripe={stripePromise}>
              <StripeCardForm
                tranId={tranId}
                price={price}
                onSuccess={handleCardSuccess}
                onError={handleCardError}
                authFetch={authFetch}
                isDark={isDark}
              />
            </Elements>
          )}

          {/* Wallet Payment Flow */}
          {paymentMethod !== 'card' && step < 4 && (
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <AnimatePresence mode="wait">
                {step === 1 && (
                  <motion.div key="step-1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <div style={{ padding: '14px 18px', background: getBrandColor(), borderRadius: '12px', color: '#fff', fontWeight: '700', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <span>{getMethodTitle()} Portal</span>
                      <Smartphone size={20} />
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginTop: '8px' }}>
                      <label style={{ fontSize: '12px', color: 'var(--text-secondary)', fontWeight: '600' }}>Wallet Mobile Number</label>
                      <input
                        type="text" placeholder="017XXXXXXXX" maxLength={11} value={walletNumber}
                        onChange={(e) => setWalletNumber(e.target.value.replace(/[^0-9]/g, ''))}
                        style={{ padding: '14px', borderRadius: '8px', background: isDark ? 'rgba(255,255,255,0.04)' : 'var(--bg-secondary)', border: '1px solid var(--card-border)', color: 'var(--text-primary)', fontSize: '16px', outline: 'none', letterSpacing: '1px', fontFamily: 'inherit' }}
                      />
                    </div>
                  </motion.div>
                )}
                {step === 2 && (
                  <motion.div key="step-2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <div style={{ textAlign: 'center', padding: '10px 0' }}>
                      <Smartphone size={40} style={{ color: getBrandColor(), marginBottom: '12px' }} />
                      <h4 style={{ fontSize: '16px', fontWeight: '700', marginBottom: '6px' }}>OTP Verification</h4>
                      <p style={{ fontSize: '13px', color: 'var(--text-secondary)', margin: 0 }}>Check the SMS notification for your 6-digit code.</p>
                    </div>
                    <input
                      type="text" placeholder="● ● ● ● ● ●" maxLength={6} value={otp}
                      onChange={(e) => setOtp(e.target.value.replace(/[^0-9]/g, ''))}
                      style={{ padding: '16px', borderRadius: '8px', background: isDark ? 'rgba(255,255,255,0.04)' : 'var(--bg-secondary)', border: '1px solid var(--card-border)', color: 'var(--text-primary)', fontSize: '22px', fontWeight: '700', outline: 'none', textAlign: 'center', letterSpacing: '8px', fontFamily: 'monospace' }}
                    />
                  </motion.div>
                )}
                {step === 3 && (
                  <motion.div key="step-3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <div style={{ textAlign: 'center', padding: '10px 0' }}>
                      <KeyRound size={40} style={{ color: getBrandColor(), marginBottom: '12px' }} />
                      <h4 style={{ fontSize: '16px', fontWeight: '700', marginBottom: '6px' }}>Enter PIN</h4>
                      <p style={{ fontSize: '13px', color: 'var(--text-secondary)', margin: 0 }}>Enter your {paymentMethod.toUpperCase()} account PIN.</p>
                    </div>
                    <input
                      type="password" placeholder="••••" maxLength={5} value={pin}
                      onChange={(e) => setPin(e.target.value.replace(/[^0-9]/g, ''))}
                      style={{ padding: '16px', borderRadius: '8px', background: isDark ? 'rgba(255,255,255,0.04)' : 'var(--bg-secondary)', border: '1px solid var(--card-border)', color: 'var(--text-primary)', fontSize: '24px', outline: 'none', textAlign: 'center', letterSpacing: '10px' }}
                    />
                  </motion.div>
                )}
              </AnimatePresence>

              {errorMsg && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '12px', background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: '8px', color: '#ef4444', fontSize: '13px' }}>
                  <AlertCircle size={16} /><span>{errorMsg}</span>
                </div>
              )}

              <div style={{ display: 'flex', gap: '12px' }}>
                {step > 1 && (
                  <button onClick={() => { setStep(step - 1); setErrorMsg(''); }} style={{ padding: '14px 20px', borderRadius: '10px', background: 'transparent', border: '1px solid var(--card-border)', color: 'var(--text-primary)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '14px', fontWeight: '600' }}>
                    <ArrowLeft size={16} /> Back
                  </button>
                )}
                <button
                  onClick={handleNextStep}
                  style={{ flex: 1, padding: '14px', borderRadius: '10px', background: getBrandColor(), border: 'none', color: '#fff', cursor: 'pointer', fontSize: '14px', fontWeight: '700', boxShadow: `0 4px 14px ${getBrandColor()}40` }}
                >
                  {step === 3 ? `Pay $${price}` : 'Confirm & Proceed'}
                </button>
              </div>
            </div>
          )}

          {/* Processing Step */}
          {step === 4 && (
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '20px', padding: '40px 0' }}>
              <Loader2 size={50} style={{ color: getBrandColor(), animation: 'spin 1s linear infinite' }} />
              <div style={{ textAlign: 'center' }}>
                <h4 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '8px' }}>Processing Payment</h4>
                <p style={{ fontSize: '14px', color: 'var(--text-secondary)', margin: 0 }}>{simulatingStatus}</p>
              </div>
            </div>
          )}
        </div>
      </div>

      <style jsx global>{`
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}

export default function GatewayPage() {
  return (
    <Suspense fallback={
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-primary)' }}>
        <div style={{ width: '40px', height: '40px', border: '3px solid var(--card-border)', borderTopColor: 'var(--primary)', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
      </div>
    }>
      <GatewayContent />
    </Suspense>
  );
}
