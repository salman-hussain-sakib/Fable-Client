'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@/context/ThemeContext';
import { Sun, Moon, Menu, X, BookOpen, LogOut, User as UserIcon } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Navbar() {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const getDashboardLink = () => {
    if (!user) return '/login';
    if (user.role === 'admin') return '/dashboard/admin';
    if (user.role === 'writer') return '/dashboard/writer';
    return '/dashboard/user';
  };

  const navLinks = [
    { label: 'Home', href: '/' },
    { label: 'Browse Ebooks', href: '/browse' },
    ...(user ? [{ label: 'Dashboard', href: getDashboardLink() }] : []),
  ];

  const toggleMobileMenu = () => setMobileMenuOpen(!mobileMenuOpen);

  return (
    <nav className="navbar glass">
      <div className="container navbar-container">
        
        <Link href="/" className="nav-logo gradient-text">
          <BookOpen size={28} className="text-primary" style={{ stroke: 'var(--primary)' }} />
          <span>Fable</span>
        </Link>

        
        <div className="nav-links">
          {navLinks.map((link) => {
            const isActive = pathname === link.href || (link.href !== '/' && pathname.startsWith(link.href));
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`nav-link ${isActive ? 'active' : ''}`}
                style={{ position: 'relative', zIndex: 1 }}
              >
                {isActive && (
                  <motion.span
                    layoutId="activeNavBubble"
                    style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      background: 'var(--primary-glow)',
                      border: '1px solid var(--primary)',
                      borderRadius: 'var(--radius-full)',
                      zIndex: -1,
                      boxShadow: '0 4px 12px var(--primary-glow)',
                    }}
                    transition={{ type: 'spring', stiffness: 700, damping: 36 }}
                  />
                )}
                {link.label}
              </Link>
            );
          })}

          
          <button
            onClick={toggleTheme}
            className="btn btn-outline"
            style={{ padding: '8px', borderRadius: '50%' }}
            aria-label="Toggle Theme"
          >
            {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
          </button>

          
          {user ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                {user.profilePicture ? (
                  <img
                    src={user.profilePicture}
                    referrerPolicy="no-referrer"
                    alt={user.name}
                    style={{ width: '32px', height: '32px', borderRadius: '50%', objectFit: 'cover', border: '2px solid var(--primary)' }}
                  />
                ) : (
                  <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'var(--primary-glow)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)' }}>
                    <UserIcon size={16} />
                  </div>
                )}
                <span style={{ fontSize: '14px', fontWeight: '500' }}>{user.name.split(' ')[0]}</span>
              </div>
              <button onClick={logout} className="btn btn-primary" style={{ padding: '8px 16px', fontSize: '13px' }}>
                <LogOut size={14} />
                <span>Logout</span>
              </button>
            </div>
          ) : (
            <Link href="/login" className="btn btn-primary" style={{ padding: '8px 20px', fontSize: '14px' }}>
              Login
            </Link>
          )}
        </div>

        
        <div style={{ alignItems: 'center', gap: '12px' }} className="nav-mobile-btn">
          <button
            onClick={toggleTheme}
            className="btn btn-outline"
            style={{ padding: '8px', borderRadius: '50%' }}
          >
            {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
          </button>
          
          <button onClick={toggleMobileMenu} className="btn btn-outline" style={{ padding: '8px' }}>
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      
      {mobileMenuOpen && (
        <div className="mobile-menu glass">
          {navLinks.map((link) => {
            const isActive = pathname === link.href || (link.href !== '/' && pathname.startsWith(link.href));
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`nav-link ${isActive ? 'active' : ''}`}
                onClick={() => setMobileMenuOpen(false)}
              >
                {link.label}
              </Link>
            );
          })}

          <div style={{ borderTop: '1px solid var(--card-border)', paddingTop: '16px', marginTop: '4px' }}>
            {user ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  {user.profilePicture ? (
                    <img
                      src={user.profilePicture}
                      referrerPolicy="no-referrer"
                      alt={user.name}
                      style={{ width: '36px', height: '36px', borderRadius: '50%', objectFit: 'cover' }}
                    />
                  ) : (
                    <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'var(--primary-glow)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <UserIcon size={18} />
                    </div>
                  )}
                  <div>
                    <div style={{ fontWeight: '600', fontSize: '15px' }}>{user.name}</div>
                    <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{user.email}</div>
                  </div>
                </div>
                <button
                  onClick={() => {
                    logout();
                    setMobileMenuOpen(false);
                  }}
                  className="btn btn-primary"
                  style={{ width: '100%' }}
                >
                  <LogOut size={16} />
                  <span>Logout</span>
                </button>
              </div>
            ) : (
              <Link
                href="/login"
                className="btn btn-primary"
                style={{ width: '100%' }}
                onClick={() => setMobileMenuOpen(false)}
              >
                Login
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}