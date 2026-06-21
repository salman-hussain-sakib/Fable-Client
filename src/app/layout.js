import './globals.css';
import { ThemeProvider } from '@/context/ThemeContext';
import { AuthProvider } from '@/context/AuthContext';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import PageTransition from '@/components/PageTransition';
import { Toaster } from 'react-hot-toast';

export const metadata = {
  title: 'Fable – Discover & Read Original Ebooks',
  description: 'Fable is a premium digital ebook sharing platform connecting readers with independent writers. Browse original books, read summaries, and purchase unique literature.',
  keywords: 'ebook sharing, original novels, digital reading, independent writers, MERN stack, online publishing',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning data-scroll-behavior="smooth">
      <body suppressHydrationWarning>
        <ThemeProvider>
          <AuthProvider>
            <Toaster
              position="top-right"
              toastOptions={{
                duration: 4000,
                style: {
                  background: 'var(--bg-secondary)',
                  color: 'var(--text-primary)',
                  border: '1px solid var(--card-border)',
                },
              }}
            />
            <Navbar />
            <main style={{ flex: '1', display: 'flex', flexDirection: 'column' }}>
              <PageTransition>
                {children}
              </PageTransition>
            </main>
            <Footer />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
