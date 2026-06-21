'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Users, BookOpen, ShoppingCart, CircleDollarSign, TrendingUp, BarChart3 } from 'lucide-react';
import toast from 'react-hot-toast';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export default function AdminOverview() {
  const { authFetch } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isMounted, setIsMounted] = useState(false);


  const COLORS = ['var(--primary)', 'var(--secondary)', '#f59e0b', '#10b981', '#8b5cf6', '#ef4444'];

  useEffect(() => {
    setIsMounted(true);
    const fetchAnalytics = async () => {
      try {
        const res = await authFetch(`${API_URL}/admin/analytics`);
        if (res.ok) {
          const analyticsData = await res.json();
          setData(analyticsData);
        } else {
          toast.error('Failed to load admin analytics');
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  if (loading) {
    return (
      <div className="spinner-container" style={{ minHeight: '60vh' }}>
        <div className="spinner" />
      </div>
    );
  }

  const { metrics, ebooksByGenre, monthlySales } = data || {
    metrics: { totalUsers: 0, totalWriters: 0, totalEbooksSold: 0, totalRevenue: 0 },
    ebooksByGenre: [],
    monthlySales: [],
  };

  const statCards = [
    { label: 'Total Users', value: metrics.totalUsers, icon: <Users size={22} />, color: 'var(--primary)', glow: 'var(--primary-glow)' },
    { label: 'Total Authors', value: metrics.totalWriters, icon: <Users size={22} />, color: 'var(--secondary)', glow: 'var(--secondary-glow)' },
    { label: 'Ebooks Sold', value: metrics.totalEbooksSold, icon: <ShoppingCart size={22} />, color: '#f59e0b', glow: 'rgba(245, 158, 11, 0.15)' },
    { label: 'Total Revenue', value: `$${metrics.totalRevenue.toFixed(2)}`, icon: <CircleDollarSign size={22} />, color: '#10b981', glow: 'rgba(16, 185, 129, 0.15)' },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
      
      <div>
        <h2 style={{ fontSize: '28px', fontWeight: '800', marginBottom: '6px', color: 'var(--text-primary)' }}>Analytics Overview</h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>System metrics and platform-wide performance.</p>
      </div>

      
      <div className="dashboard-stats-grid">
        {statCards.map((card, idx) => (
          <div
            key={idx}
            className="glass glass-hover"
            style={{ 
              padding: '24px', 
              display: 'flex', 
              alignItems: 'center', 
              gap: '20px', 
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--card-border)',
              boxShadow: 'var(--shadow-md)',
            }}
          >
            <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: card.glow, display: 'flex', alignItems: 'center', justifyContent: 'center', color: card.color, flexShrink: 0 }}>
              {card.icon}
            </div>
            <div>
              <span style={{ fontSize: '13px', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>{card.label}</span>
              <div style={{ fontSize: '24px', fontWeight: '800', marginTop: '2px', color: 'var(--text-primary)' }}>{card.value}</div>
            </div>
          </div>
        ))}
      </div>

      
      {isMounted && (
        <div className="dashboard-responsive-grid">
          
          <div className="glass" style={{ padding: '30px', borderRadius: 'var(--radius-md)', border: '1px solid var(--card-border)', boxShadow: 'var(--shadow-md)' }}>
            <h3 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-primary)' }}>
              <TrendingUp size={18} style={{ color: 'var(--primary)' }} />
              <span>Monthly Revenue Trend</span>
            </h3>
            <div style={{ width: '100%', height: '300px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={monthlySales} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.4}/>
                      <stop offset="95%" stopColor="var(--primary)" stopOpacity={0.01}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--card-border)" />
                  <XAxis dataKey="month" stroke="var(--text-muted)" fontSize={12} tickLine={false} />
                  <YAxis stroke="var(--text-muted)" fontSize={12} tickLine={false} />
                  <Tooltip
                    contentStyle={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--card-border)', borderRadius: '8px', color: 'var(--text-primary)' }}
                  />
                  <Area type="monotone" dataKey="revenue" name="Revenue ($)" stroke="var(--primary)" strokeWidth={2} fillOpacity={1} fill="url(#colorRevenue)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          
          <div className="glass" style={{ padding: '30px', borderRadius: 'var(--radius-md)', border: '1px solid var(--card-border)', boxShadow: 'var(--shadow-md)' }}>
            <h3 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-primary)' }}>
              <BarChart3 size={18} style={{ color: 'var(--secondary)' }} />
              <span>Ebooks by Genre</span>
            </h3>
            <div style={{ width: '100%', height: '300px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              {ebooksByGenre.length === 0 ? (
                <div style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: '14px' }}>No genre data found.</div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={ebooksByGenre}
                      cx="50%"
                      cy="45%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {ebooksByGenre.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--card-border)', borderRadius: '8px', color: 'var(--text-primary)' }}
                    />
                    <Legend verticalAlign="bottom" height={36} iconType="circle" wrapperStyle={{ fontSize: '12px' }} />
                  </PieChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}