'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { BookOpen, Twitter, Github, Linkedin, Mail } from 'lucide-react';

export default function Footer() {
  const [email, setEmail] = useState('');

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (!email) {
      toast.error('Please enter a valid email address.');
      return;
    }
    toast.success('Thank you for subscribing to our newsletter!');
    setEmail('');
  };

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          
          <div className="footer-logo-desc">
            <Link href="/" className="nav-logo gradient-text" style={{ padding: '0', fontSize: '22px' }}>
              <BookOpen size={24} style={{ stroke: 'var(--primary)' }} />
              <span>Fable</span>
            </Link>
            <p className="footer-desc">
              Discover, read, and share original ebooks. Empowering independent writers to share their stories with a global audience of passionate readers.
            </p>
          </div>

          
          <div>
            <h3 className="footer-title">Explore</h3>
            <ul className="footer-links">
              <li><Link href="/" className="footer-link">Home</Link></li>
              <li><Link href="/browse" className="footer-link">Browse Ebooks</Link></li>
              <li><Link href="/browse?genre=Fiction" className="footer-link">Fiction Novels</Link></li>
              <li><Link href="/browse?genre=Sci-Fi" className="footer-link">Sci-Fi Adventures</Link></li>
            </ul>
          </div>

          
          <div>
            <h3 className="footer-title">Company</h3>
            <ul className="footer-links">
              <li><Link href="#" className="footer-link">About Fable</Link></li>
              <li><Link href="#" className="footer-link">Contact Support</Link></li>
              <li><Link href="#" className="footer-link">Privacy Policy</Link></li>
              <li><Link href="#" className="footer-link">Terms of Service</Link></li>
            </ul>
          </div>

          
          <div>
            <h3 className="footer-title">Stay Updated</h3>
            <p className="footer-desc" style={{ marginBottom: '16px' }}>
              Subscribe to get notified about new ebook releases and featured writers.
            </p>
            <form onSubmit={handleSubscribe} className="newsletter-form">
              <input
                type="email"
                placeholder="Enter your email"
                className="newsletter-input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <button type="submit" className="btn btn-primary" style={{ padding: '10px 16px', fontSize: '13px' }}>
                <Mail size={16} />
              </button>
            </form>
          </div>
        </div>

        
        <div className="footer-bottom">
          <span>&copy; {new Date().getFullYear()} Fable Inc. All rights reserved.</span>
          <div className="social-icons">
            <a href="https://x.com/sakibsalmanh" target="_blank" rel="noopener noreferrer" className="footer-link" aria-label="Twitter"><Twitter size={18} /></a>
            <a href="https://github.com/salman-hussain-sakib" target="_blank" rel="noopener noreferrer" className="footer-link" aria-label="GitHub"><Github size={18} /></a>
            <a href="https://www.linkedin.com/in/salmanhussainsakib/" target="_blank" rel="noopener noreferrer" className="footer-link" aria-label="LinkedIn"><Linkedin size={18} /></a>
          </div>
        </div>
      </div>
    </footer>
  );
}
