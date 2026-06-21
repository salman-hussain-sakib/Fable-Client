'use client';

import React from 'react';
import Link from 'next/link';
import { BookOpen, AlertCircle, ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';

export default function NotFound() {
  return (
    <div style={{ flex: '1', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '100px 24px', position: 'relative' }}>
      
      <div style={{ position: 'absolute', width: '300px', height: '300px', borderRadius: '50%', background: 'var(--primary-glow)', top: '25%', left: '35%', filter: 'blur(100px)', zIndex: '-1' }} />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '24px', maxWidth: '440px' }}
      >
        <div style={{ position: 'relative', display: 'inline-flex' }}>
          <BookOpen size={90} style={{ color: 'var(--text-muted)', strokeWidth: '1' }} />
          <AlertCircle size={30} style={{ position: 'absolute', bottom: '-4px', right: '-4px', color: 'var(--secondary)' }} />
        </div>

        <div>
          <h1 style={{ fontSize: '64px', fontWeight: '800', lineHeight: '1', color: 'var(--primary)', marginBottom: '8px' }}>404</h1>
          <h2 style={{ fontSize: '24px', fontWeight: '800', marginBottom: '12px' }}>Page Not Found</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '15px', lineHeight: '1.6' }}>
            We've searched the library, but the page you are looking for doesn't exist or has been moved to another section.
          </p>
        </div>

        <Link href="/" className="btn btn-primary" style={{ padding: '12px 24px' }}>
          <ArrowLeft size={16} />
          <span>Back to Home</span>
        </Link>
      </motion.div>
    </div>
  );
}
