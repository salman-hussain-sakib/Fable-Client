'use client';

import React, { useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { XCircle, ArrowLeft, RefreshCw } from 'lucide-react';
import { motion } from 'framer-motion';
import Link from 'next/link';

function FailContent() {
  const searchParams = useSearchParams();
  const reason = searchParams.get('reason');

  useEffect(() => {
    if (typeof window !== 'undefined' && window.self !== window.top) {
      window.parent.location.href = window.location.href;
    }
  }, []);

  const getReasonMessage = () => {
    switch (reason) {
      case 'cancelled':
        return 'The payment session was cancelled by the user.';
      case 'validation_failed':
        return 'The signature validation check failed with the gateway.';
      case 'tx_not_found':
        return 'The transaction reference could not be found in our logs.';
      case 'server_error':
      default:
        return 'The payment gateway could not process your transaction at this time.';
    }
  };

  return (
    <div style={{ flex: '1', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '80px 24px', position: 'relative' }}>
      <div style={{ position: 'absolute', width: '300px', height: '300px', borderRadius: '50%', background: 'rgba(239, 68, 68, 0.12)', top: '20%', filter: 'blur(100px)', zIndex: '-1' }} />

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="glass"
        style={{ width: '100%', maxWidth: '480px', padding: '40px', borderRadius: 'var(--radius-md)', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '24px' }}
      >
        
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 260, damping: 20, delay: 0.2 }}
          style={{ color: 'var(--danger)' }}
        >
          <XCircle size={80} style={{ strokeWidth: '1.5' }} />
        </motion.div>

        <div>
          <h1 style={{ fontSize: '26px', fontWeight: '800', marginBottom: '8px' }}>Payment Failed</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '15px' }}>
            We were unable to complete your purchase. {getReasonMessage()}
          </p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', width: '100%' }}>
          <Link href="/browse" className="btn btn-primary" style={{ width: '100%', height: '46px' }}>
            <RefreshCw size={16} />
            <span>Try Purchasing Again</span>
          </Link>
          <Link href="/" className="btn btn-outline" style={{ width: '100%', height: '46px' }}>
            <ArrowLeft size={16} />
            <span>Back to Home</span>
          </Link>
        </div>
      </motion.div>
    </div>
  );
}

export default function PaymentFail() {
  return (
    <Suspense fallback={
      <div className="spinner-container">
        <div className="spinner" />
      </div>
    }>
      <FailContent />
    </Suspense>
  );
}
