'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { authClient } from '@/lib/auth-client';
import { useAuth } from '@/context/AuthContext';
import Cookies from 'js-cookie';
import toast from 'react-hot-toast';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export default function AuthSync() {
  const router = useRouter();
  const { setUser } = useAuth();
  const { data: session, isPending } = authClient.useSession();

  useEffect(() => {
    if (isPending) return;

    if (!session || !session.user) {
      router.push('/login');
      return;
    }

    const syncWithBackend = async () => {
      const { email, name, image } = session.user;

      try {
        const res = await fetch(`${API_URL}/auth/google-login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, name, profilePicture: image || '' }),
        });

        const data = await res.json();

        if (res.ok) {
          Cookies.set('token', data.token, { expires: 7, path: '/' });
          setUser(data.user);
          toast.success(`Welcome, ${data.user.name}!`);

          if (data.user.role === 'admin') {
            router.push('/dashboard/admin');
          } else if (data.user.role === 'writer') {
            router.push('/dashboard/writer');
          } else {
            router.push('/');
          }
        } else {
          toast.error(data.message || 'Login failed');
          router.push('/login');
        }
      } catch (err) {
        toast.error('Something went wrong. Please try again.');
        router.push('/login');
      }
    };

    syncWithBackend();
  }, [session, isPending]);

  return (
    <div className="spinner-container" style={{ minHeight: '80vh' }}>
      <div className="spinner" />
    </div>
  );
}
