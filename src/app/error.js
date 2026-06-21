'use client';

import React, { useEffect } from 'react';
import { AlertTriangle, RefreshCcw } from 'lucide-react';
import { motion } from 'framer-motion';

export default function GlobalError({ error, reset }) {
  useEffect(() => {

    console.error('Runtime error intercepted:', error);
  }, [error]);

  return (
    <div style={{ flex: '1', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '100px 24px', position: 'relative' }}>
      <div style={{ position: 'absolute', width: '300px', height: '300px', borderRadius: '50%', background: 'rgba(239, 68, 68, 0.1)', top: '25%', left: '35%', filter: 'blur(100px)', zIndex: '-1' }} />

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '24px', maxWidth: '440px' }}
      >
        <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'rgba(239, 68, 68, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--danger)' }}>
          <AlertTriangle size={40} />
        </div>

        <div>
          <h2 style={{ fontSize: '24px', fontWeight: '800', marginBottom: '12px' }}>Something went wrong!</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '15px', lineHeight: '1.6' }}>
            A runtime error occurred during rendering. Please click the button below to retry or refresh the page.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '16px' }}>
          <button onClick={() => reset()} className="btn btn-primary" style={{ padding: '12px 24px' }}>
            <RefreshCcw size={16} />
            <span>Reload & Retry</span>
          </button>
          <button onClick={() => window.location.reload()} className="btn btn-outline" style={{ padding: '12px 24px' }}>
            <span>Refresh Page</span>
          </button>
        </div>
      </motion.div>
    </div>
  );
}
