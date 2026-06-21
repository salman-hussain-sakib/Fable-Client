'use client';

import React, { useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { CheckCircle2, BookOpen, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import Link from 'next/link';

function SuccessContent() {
  const searchParams = useSearchParams();
  const tranId = searchParams.get('tran_id');

  useEffect(() => {
    if (typeof window !== 'undefined' && window.self !== window.top) {
      window.parent.location.href = window.location.href;
    }
  }, []);

  return (
    <div style={{ flex: '1', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '80px 24px', position: 'relative' }}>
      <div style={{ position: 'absolute', width: '300px', height: '300px', borderRadius: '50%', background: 'rgba(16, 185, 129, 0.15)', top: '20%', filter: 'blur(100px)', zIndex: '-1' }} />

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
          style={{ color: 'var(--success)' }}
        >
          <CheckCircle2 size={80} style={{ strokeWidth: '1.5' }} />
        </motion.div>

        <div>
          <h1 style={{ fontSize: '28px', fontWeight: '800', marginBottom: '8px' }}>Payment Successful!</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '15px' }}>
            Thank you for your purchase. The ebook is now unlocked and added to your collection.
          </p>
        </div>

        {tranId && (
          <div style={{ padding: '12px 18px', background: 'var(--bg-tertiary)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--card-border)', fontFamily: 'monospace', fontSize: '13px', width: '100%' }}>
            <span style={{ color: 'var(--text-secondary)' }}>Transaction ID:</span>
            <div style={{ fontWeight: '700', marginTop: '4px', wordBreak: 'break-all', color: 'var(--text-primary)' }}>{tranId}</div>
          </div>
        )}

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', width: '100%' }}>
          <Link href="/dashboard/user/gallery" className="btn btn-primary" style={{ width: '100%', height: '46px' }}>
            <BookOpen size={16} />
            <span>Go to My Library</span>
            <ArrowRight size={16} />
          </Link>
          <Link href="/browse" className="btn btn-outline" style={{ width: '100%', height: '46px' }}>
            Browse More Ebooks
          </Link>
        </div>
      </motion.div>
    </div>
  );
}

export default function PaymentSuccess() {
  return (
    <Suspense fallback={
      <div className="spinner-container">
        <div className="spinner" />
      </div>
    }>
      <SuccessContent />
    </Suspense>
  );
}
