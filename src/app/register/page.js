'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { BookOpen, Mail, Lock, User as UserIcon, UserCheck, ArrowRight, Key, ArrowLeft, RefreshCw } from 'lucide-react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { authClient } from '@/lib/auth-client';

export default function Register() {
  const { register, sendOTP, user, loading } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState('user');
  const [otp, setOtp] = useState('');
  const [showOtpField, setShowOtpField] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (user && !loading) {
      router.push('/');
    }
  }, [user, loading, router]);

  // Countdown timer effect for OTP resend
  useEffect(() => {
    if (resendTimer > 0) {
      const interval = setInterval(() => {
        setResendTimer((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [resendTimer]);

  const handleRequestOTP = async (e) => {
    e.preventDefault();
    if (!name || !email || !password || !confirmPassword) {
      toast.error('All fields are required.');
      return;
    }

    if (password !== confirmPassword) {
      toast.error('Passwords do not match.');
      return;
    }

    if (password.length < 6) {
      toast.error('Password must be at least 6 characters long.');
      return;
    }

    setSubmitting(true);
    try {
      await sendOTP(email);
      setShowOtpField(true);
      setResendTimer(60); // set 60 seconds countdown
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleResendOTP = async () => {
    if (resendTimer > 0) return;
    setSubmitting(true);
    try {
      await sendOTP(email);
      setResendTimer(60);
      toast.success('A new OTP has been sent to your email.');
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleVerifyAndRegister = async (e) => {
    e.preventDefault();
    if (!otp) {
      toast.error('Please enter the OTP code.');
      return;
    }

    if (otp.length !== 6) {
      toast.error('OTP must be a 6-digit number.');
      return;
    }

    setSubmitting(true);
    try {
      await register(name, email, password, confirmPassword, role, otp);
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleGoogleRegister = async () => {
    setGoogleLoading(true);
    try {
      await authClient.signIn.social({
        provider: 'google',
        callbackURL: '/auth/sync',
      });
    } catch (err) {
      console.error(err);
      setGoogleLoading(false);
    }
  };

  return (
    <div style={{ flex: '1', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '100px 24px 60px', position: 'relative' }}>
      <div style={{ position: 'absolute', width: '250px', height: '250px', borderRadius: '50%', background: 'var(--primary-glow)', top: '10%', right: '15%', filter: 'blur(90px)', zIndex: '-1' }} />
      <div style={{ position: 'absolute', width: '250px', height: '250px', borderRadius: '50%', background: 'var(--secondary-glow)', bottom: '10%', left: '15%', filter: 'blur(90px)', zIndex: '-1' }} />

      <div className="glass" style={{ width: '100%', maxWidth: '480px', padding: '40px', display: 'flex', flexDirection: 'column', gap: '24px', borderRadius: 'var(--radius-md)' }}>

        <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
          <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <BookOpen size={30} style={{ color: 'var(--primary)' }} />
            <span style={{ fontSize: '26px', fontWeight: '800' }} className="gradient-text">Fable</span>
          </Link>
          <h2 style={{ fontSize: '20px', fontWeight: '700' }}>
            {showOtpField ? 'Verify Your Email' : 'Create an Account'}
          </h2>
          <p style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>
            {showOtpField ? `Enter the 6-digit code sent to ${email}` : 'Join Fable ebook sharing community'}
          </p>
        </div>

        {!showOtpField ? (
          /* Step 1: Request OTP / Details form */
          <>
            <form onSubmit={handleRequestOTP} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div className="form-group">
                <label className="form-label" htmlFor="name-input">Full Name</label>
                <div style={{ position: 'relative' }}>
                  <UserIcon size={16} style={{ position: 'absolute', left: '16px', top: '16px', color: 'var(--text-muted)' }} />
                  <input
                    id="name-input"
                    type="text"
                    placeholder="John Doe"
                    className="form-input"
                    style={{ paddingLeft: '44px' }}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="email-input">Email Address</label>
                <div style={{ position: 'relative' }}>
                  <Mail size={16} style={{ position: 'absolute', left: '16px', top: '16px', color: 'var(--text-muted)' }} />
                  <input
                    id="email-input"
                    type="email"
                    placeholder="you@example.com"
                    className="form-input"
                    style={{ paddingLeft: '44px' }}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <span className="form-label">Choose Your Role</span>
                <div style={{ display: 'flex', gap: '12px' }}>
                  <button
                    type="button"
                    className={`btn ${role === 'user' ? 'btn-primary' : 'btn-outline'}`}
                    style={{ flex: '1', display: 'flex', flexDirection: 'column', padding: '12px 10px', height: 'auto', gap: '4px' }}
                    onClick={() => setRole('user')}
                  >
                    <span style={{ fontSize: '14px', fontWeight: '600' }}>Reader (User)</span>
                    <span style={{ fontSize: '11px', fontWeight: '400', opacity: '0.8' }}>Browse &amp; buy ebooks</span>
                  </button>
                  <button
                    type="button"
                    className={`btn ${role === 'writer' ? 'btn-primary' : 'btn-outline'}`}
                    style={{ flex: '1', display: 'flex', flexDirection: 'column', padding: '12px 10px', height: 'auto', gap: '4px' }}
                    onClick={() => setRole('writer')}
                  >
                    <span style={{ fontSize: '14px', fontWeight: '600' }}>Author (Writer)</span>
                    <span style={{ fontSize: '11px', fontWeight: '400', opacity: '0.8' }}>Publish &amp; sell ebooks</span>
                  </button>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="password-input">Password</label>
                <div style={{ position: 'relative' }}>
                  <Lock size={16} style={{ position: 'absolute', left: '16px', top: '16px', color: 'var(--text-muted)' }} />
                  <input
                    id="password-input"
                    type="password"
                    placeholder="Min 6 characters"
                    className="form-input"
                    style={{ paddingLeft: '44px' }}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="confirm-password-input">Confirm Password</label>
                <div style={{ position: 'relative' }}>
                  <Lock size={16} style={{ position: 'absolute', left: '16px', top: '16px', color: 'var(--text-muted)' }} />
                  <input
                    id="confirm-password-input"
                    type="password"
                    placeholder="Repeat password"
                    className="form-input"
                    style={{ paddingLeft: '44px' }}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                className="btn btn-primary"
                style={{ width: '100%', height: '48px', marginTop: '6px' }}
                disabled={submitting}
              >
                {submitting ? (
                  <div style={{ width: '20px', height: '20px', border: '2px solid white', borderBottomColor: 'transparent', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
                ) : (
                  <>
                    <span>Send Verification Code</span>
                    <ArrowRight size={16} />
                  </>
                )}
              </button>
            </form>

            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ flex: 1, height: '1px', background: 'var(--card-border)' }} />
              <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>or</span>
              <div style={{ flex: 1, height: '1px', background: 'var(--card-border)' }} />
            </div>

            <button
              onClick={handleGoogleRegister}
              disabled={googleLoading}
              style={{
                width: '100%',
                height: '48px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '12px',
                background: 'var(--bg-primary)',
                border: '1px solid var(--card-border)',
                borderRadius: 'var(--radius-sm)',
                cursor: 'pointer',
                fontSize: '15px',
                fontWeight: '600',
                color: 'var(--text-primary)',
                fontFamily: 'inherit',
                transition: 'all 0.2s',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--bg-secondary)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = 'var(--bg-primary)'; }}
            >
              {googleLoading ? (
                <div style={{ width: '20px', height: '20px', border: '2px solid var(--primary)', borderBottomColor: 'transparent', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
              ) : (
                <>
                  <svg width="20" height="20" viewBox="0 0 48 48">
                    <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
                    <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
                    <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
                    <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
                  </svg>
                  <span>Continue with Google</span>
                </>
              )}
            </button>
          </>
        ) : (
          /* Step 2: Verify OTP form */
          <form onSubmit={handleVerifyAndRegister} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div className="form-group">
              <label className="form-label" htmlFor="otp-input">Verification Code (OTP)</label>
              <div style={{ position: 'relative' }}>
                <Key size={16} style={{ position: 'absolute', left: '16px', top: '16px', color: 'var(--text-muted)' }} />
                <input
                  id="otp-input"
                  type="text"
                  maxLength={6}
                  placeholder="123456"
                  className="form-input"
                  style={{ paddingLeft: '44px', letterSpacing: '8px', fontSize: '18px', fontWeight: '700' }}
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              className="btn btn-primary"
              style={{ width: '100%', height: '48px' }}
              disabled={submitting}
            >
              {submitting ? (
                <div style={{ width: '20px', height: '20px', border: '2px solid white', borderBottomColor: 'transparent', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
              ) : (
                <>
                  <UserCheck size={16} />
                  <span>Verify &amp; Sign Up</span>
                </>
              )}
            </button>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', alignItems: 'center', marginTop: '4px' }}>
              <button
                type="button"
                onClick={handleResendOTP}
                disabled={resendTimer > 0 || submitting}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  background: 'none',
                  border: 'none',
                  color: resendTimer > 0 ? 'var(--text-muted)' : 'var(--primary)',
                  fontSize: '14px',
                  fontWeight: '600',
                  cursor: resendTimer > 0 ? 'not-allowed' : 'pointer',
                  padding: '4px 8px',
                }}
              >
                <RefreshCw size={14} className={submitting ? 'animate-spin' : ''} />
                <span>
                  {resendTimer > 0 ? `Resend Code in ${resendTimer}s` : 'Resend Code'}
                </span>
              </button>

              <button
                type="button"
                onClick={() => setShowOtpField(false)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  background: 'none',
                  border: 'none',
                  color: 'var(--text-secondary)',
                  fontSize: '13px',
                  cursor: 'pointer',
                  padding: '4px 8px',
                }}
              >
                <ArrowLeft size={14} />
                <span>Change Registration Details</span>
              </button>
            </div>
          </form>
        )}

        <p style={{ textAlign: 'center', fontSize: '14px', color: 'var(--text-secondary)' }}>
          Already have an account?{' '}
          <Link href="/login" style={{ color: 'var(--primary)', fontWeight: '600', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
            <span>Log In</span>
            <ArrowRight size={12} />
          </Link>
        </p>
      </div>
    </div>
  );
}