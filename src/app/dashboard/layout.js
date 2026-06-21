'use client';

import React, { useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { LayoutDashboard, BookOpen, Users, CircleDollarSign, PlusCircle, Bookmark, History, UserCheck, Heart } from 'lucide-react';
import toast from 'react-hot-toast';

export default function DashboardLayout({ children }) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!loading && !user) {
      toast.error('Access denied. Please log in first.');
      router.push('/login');
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="spinner-container" style={{ minHeight: '80vh' }}>
        <div className="spinner" />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const getSidebarItems = () => {
    switch (user.role) {
      case 'admin':
        return [
          { label: 'Overview', href: '/dashboard/admin', icon: <LayoutDashboard size={18} /> },
          { label: 'Manage Users', href: '/dashboard/admin/users', icon: <Users size={18} /> },
          { label: 'Manage Ebooks', href: '/dashboard/admin/ebooks', icon: <BookOpen size={18} /> },
          { label: 'All Transactions', href: '/dashboard/admin/transactions', icon: <CircleDollarSign size={18} /> },
          { label: 'Profile Settings', href: '/dashboard/admin/profile', icon: <UserCheck size={18} /> },
        ];
      case 'writer':
        return [
          { label: 'Manage Ebooks', href: '/dashboard/writer', icon: <BookOpen size={18} /> },
          { label: 'Add Ebook', href: '/dashboard/writer/add-ebook', icon: <PlusCircle size={18} /> },
          { label: 'Sales History', href: '/dashboard/writer/sales', icon: <CircleDollarSign size={18} /> },
          { label: 'Bookmarks', href: '/dashboard/writer/bookmarks', icon: <Bookmark size={18} /> },
        ];
      case 'user':
      default:
        return [
          { label: 'Profile Management', href: '/dashboard/user', icon: <UserCheck size={18} /> },
          { label: 'Purchased Ebooks', href: '/dashboard/user/gallery', icon: <BookOpen size={18} /> },
          { label: 'Purchase History', href: '/dashboard/user/history', icon: <History size={18} /> },
          { label: 'Bookmarks', href: '/dashboard/user/bookmarks', icon: <Bookmark size={18} /> },
          { label: 'Wishlist', href: '/dashboard/user/wishlist', icon: <Heart size={18} /> },
        ];
    }
  };

  const navItems = getSidebarItems();

  return (
    <div className="dashboard-layout-container">
      
      <aside className="glass dashboard-aside-menu">
        <div style={{ padding: '0 12px' }}>
          <span style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '1.5px', color: 'var(--text-muted)', fontWeight: '700', display: 'block', marginBottom: '6px' }}>Role Control</span>
          <h3 style={{ fontSize: '22px', fontWeight: '800', textTransform: 'capitalize', color: 'var(--primary)', margin: 0, lineHeight: '1.2' }}>
            {user.role} Portal
          </h3>
        </div>

        <nav className="dashboard-aside-nav">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`dashboard-sidebar-link ${isActive ? 'active' : ''}`}
              >
                <span style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  {item.icon}
                  <span>{item.label}</span>
                </span>
              </Link>
            );
          })}
        </nav>
      </aside>

      
      <section className="dashboard-main-section">
        {children}
      </section>
    </div>
  );
}