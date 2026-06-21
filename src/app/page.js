'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, Compass, Award, ArrowRight, Tag, User, ChevronLeft, ChevronRight, Star } from 'lucide-react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export default function Home() {
  const [featuredEbooks, setFeaturedEbooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [direction, setDirection] = useState(1);

  const defaultSlides = [
    {
      title: "The Odyssey of Fable",
      writer: { name: "Arthur Doyle" },
      coverImage: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&q=80&w=800",
      genre: "Fiction",
      price: 9.99,
      rating: 4.8,
      description: "A sweeping epic that takes readers across mythical lands filled with wonder and danger."
    },
    {
      title: "The Time Machine Reborn",
      writer: { name: "H. G. Wells" },
      coverImage: "https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&q=80&w=800",
      genre: "Sci-Fi",
      price: 15.49,
      rating: 4.9,
      description: "A thrilling journey through time where the past and future collide in spectacular fashion."
    },
    {
      title: "Whispers in the Dark",
      writer: { name: "Emily Bronte" },
      coverImage: "https://images.unsplash.com/photo-1509248961158-e54f6934749c?auto=format&fit=crop&q=80&w=800",
      genre: "Horror",
      price: 6.99,
      rating: 4.7,
      description: "An atmospheric tale of secrets buried deep, slowly rising from the shadows to the light."
    }
  ];

  const slides = featuredEbooks.length > 0 ? featuredEbooks : defaultSlides;

  const goToSlide = useCallback((index, dir = 1) => {
    setDirection(dir);
    setCurrentSlide(index);
  }, []);

  const nextSlide = useCallback(() => {
    goToSlide((currentSlide + 1) % slides.length, 1);
  }, [currentSlide, slides.length, goToSlide]);

  const prevSlide = useCallback(() => {
    goToSlide((currentSlide - 1 + slides.length) % slides.length, -1);
  }, [currentSlide, slides.length, goToSlide]);


  useEffect(() => {
    if (slides.length === 0) return;
    const interval = setInterval(nextSlide, 5000);
    return () => clearInterval(interval);
  }, [nextSlide, slides.length]);

  const [topWriters] = useState([
    {
      name: 'Arthur Conan Doyle',
      role: 'Mystery Author',
      sales: '1.2k+ sold',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200',
    },
    {
      name: 'Emily Bronte',
      role: 'Romance Writer',
      sales: '900+ sold',
      image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200',
    },
    {
      name: 'H. G. Wells',
      role: 'Sci-Fi Pioneer',
      sales: '800+ sold',
      image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200',
    },
  ]);

  const genres = [
    { name: 'Fiction',  count: 12, color: 'var(--primary)' },
    { name: 'Mystery',  count: 8,  color: '#f59e0b' },
    { name: 'Romance',  count: 15, color: 'var(--secondary)' },
    { name: 'Sci-Fi',   count: 9,  color: '#06b6d4' },
    { name: 'Fantasy',  count: 11, color: '#8b5cf6' },
    { name: 'Horror',   count: 6,  color: '#ef4444' },
  ];

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const res = await fetch(`${API_URL}/ebooks/featured`);
        if (res.ok) {
          const data = await res.json();
          setFeaturedEbooks(data);
        }
      } catch (err) {
        console.error('Error fetching featured ebooks:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchFeatured();
  }, []);

  const slideVariants = {
    enter:  (d) => ({ opacity: 0, x: d > 0 ? 80  : -80, scale: 0.96 }),
    center:       ({ opacity: 1, x: 0,              scale: 1   }),
    exit:   (d) => ({ opacity: 0, x: d > 0 ? -80 : 80,  scale: 0.96 }),
  };

  const current = slides[currentSlide] || slides[0];

  return (
    <div style={{ width: '100%' }}>

      
      <section
        style={{
          position: 'relative',
          overflow: 'hidden',
          padding: '110px 0 100px 0',
        }}
      >
        
        <div className="aurora-blob aurora-blob-1" />
        <div className="aurora-blob aurora-blob-2" />
        
        <div className="aurora-blob aurora-blob-3" />

        <div className="container hero-grid">
          
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9 }}
            style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}
          >
            
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: '8px',
              alignSelf: 'flex-start', padding: '7px 18px',
              borderRadius: 'var(--radius-full)',
              background: 'linear-gradient(135deg, rgba(8,145,178,0.18) 0%, rgba(244,63,94,0.12) 100%)',
              border: '1px solid rgba(34,211,238,0.40)',
              boxShadow: '0 0 18px rgba(34,211,238,0.18), inset 0 1px 1px rgba(255,255,255,0.10)',
              backdropFilter: 'blur(8px)',
            }}>
              <Compass size={13} style={{ color: 'var(--primary)' }} />
              <span style={{ fontSize: '11px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1.5px', color: 'var(--primary)' }}>Read original books today</span>
            </div>

            <h1 style={{ fontSize: 'clamp(40px, 5vw, 64px)', fontWeight: '900', lineHeight: '1.08', letterSpacing: '-2px' }}>
              Discover &amp; Read<br />
              <span className="gradient-text">Original Ebooks</span>
            </h1>

            <p style={{ fontSize: '18px', color: 'var(--text-secondary)', lineHeight: '1.7', maxWidth: '520px' }}>
              Welcome to <strong>Fable</strong> — the digital sanctuary where book lovers connect with creative authors. Dive into unique stories, support independent creators, and track your library seamlessly.
            </p>

            
            <div style={{ display: 'flex', gap: '36px', paddingTop: '4px' }}>
              {[['500+', 'Ebooks'], ['120+', 'Authors'], ['10k+', 'Readers']].map(([n, l]) => (
                <div key={l} style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                  <span style={{
                    fontSize: '26px', fontWeight: '800',
                    background: 'linear-gradient(120deg, var(--primary) 0%, var(--secondary) 100%)',
                    WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
                    filter: 'drop-shadow(0 0 8px var(--primary-glow))',
                  }}>{n}</span>
                  <span style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: '600', letterSpacing: '0.5px', textTransform: 'uppercase' }}>{l}</span>
                </div>
              ))}
            </div>

            
            <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', marginTop: '4px' }}>
              <Link href="/browse" className="btn btn-primary" id="btn-browse-hero" style={{ padding: '15px 32px', fontSize: '15px' }}>
                Browse Ebooks
                <ArrowRight size={16} />
              </Link>
              <Link href="/register?role=writer" className="btn btn-outline" style={{ padding: '15px 32px', fontSize: '15px' }}>
                Join as Writer
              </Link>
            </div>
          </motion.div>

          
          <motion.div
            initial={{ opacity: 0, scale: 0.9, x: 40 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            transition={{ duration: 1, delay: 0.25 }}
            style={{ position: 'relative' }}
          >
            
            <div
              className="hero-slider-back hero-slider-back-1"
              style={{ width: '100%', height: '520px' }}
            />
            <div
              className="hero-slider-back hero-slider-back-2"
              style={{ width: '100%', height: '520px' }}
            />

            
            <div className="hero-slider-container">
              <AnimatePresence custom={direction} mode="wait">
                <motion.div
                  key={currentSlide}
                  custom={direction}
                  variants={slideVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: 0.55, ease: [0.25, 0.46, 0.45, 0.94] }}
                  style={{ position: 'absolute', inset: 0 }}
                >
                  
                  <img
                    src={current.coverImage}
                    alt={current.title}
                    style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                  />

                  
                  <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(7,6,26,0.97) 0%, rgba(7,6,26,0.65) 45%, rgba(7,6,26,0.15) 100%)' }} />

                  
                  <div style={{ position: 'absolute', top: 0, left: 0, right: 0, padding: '24px 28px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span className="badge badge-primary" style={{ background: 'var(--primary)', color: '#fff', border: 'none', fontSize: '11px', letterSpacing: '1px' }}>
                      {current.genre || 'Ebook'}
                    </span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'rgba(0,0,0,0.45)', backdropFilter: 'blur(8px)', padding: '5px 12px', borderRadius: 'var(--radius-full)', border: '1px solid rgba(255,255,255,0.12)' }}>
                      <Star size={12} fill="#f59e0b" stroke="none" />
                      <span style={{ fontSize: '12px', fontWeight: '700', color: '#f8fafc' }}>{current.rating || '4.8'}</span>
                    </div>
                  </div>

                  
                  <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '28px 28px 32px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    <h2 style={{ fontSize: '26px', fontWeight: '800', color: '#ffffff', lineHeight: '1.2', textShadow: '0 2px 8px rgba(0,0,0,0.8)' }}>
                      {current.title}
                    </h2>
                    <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.65)', lineHeight: '1.5', textShadow: '0 1px 4px rgba(0,0,0,0.7)' }}>
                      {current.description || `By ${current.writer?.name || 'Unknown Author'}`}
                    </p>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '8px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <User size={13} style={{ color: 'rgba(255,255,255,0.6)' }} />
                        <span style={{ fontSize: '13px', color: 'rgba(255,255,255,0.7)', fontWeight: '500' }}>{current.writer?.name || 'Unknown Author'}</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                        <span style={{ fontSize: '22px', fontWeight: '900', color: '#fff' }}>
                          ${current.price}
                        </span>
                        <Link
                          href={current._id ? `/ebook/${current._id}` : '/browse'}
                          className="btn btn-primary"
                          style={{ padding: '10px 20px', fontSize: '13px' }}
                        >
                          View Book
                          <ArrowRight size={13} />
                        </Link>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>

              
              <button
                onClick={prevSlide}
                style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', zIndex: 10, background: 'rgba(0,0,0,0.40)', backdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,0.15)', color: '#fff', borderRadius: '50%', width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', transition: 'background 0.2s' }}
                onMouseEnter={e => e.currentTarget.style.background = 'var(--primary)'}
                onMouseLeave={e => e.currentTarget.style.background = 'rgba(0,0,0,0.40)'}
                aria-label="Previous slide"
              >
                <ChevronLeft size={18} />
              </button>
              <button
                onClick={nextSlide}
                style={{ position: 'absolute', right: '16px', top: '50%', transform: 'translateY(-50%)', zIndex: 10, background: 'rgba(0,0,0,0.40)', backdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,0.15)', color: '#fff', borderRadius: '50%', width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', transition: 'background 0.2s' }}
                onMouseEnter={e => e.currentTarget.style.background = 'var(--primary)'}
                onMouseLeave={e => e.currentTarget.style.background = 'rgba(0,0,0,0.40)'}
                aria-label="Next slide"
              >
                <ChevronRight size={18} />
              </button>
            </div>

            
            <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', marginTop: '18px' }}>
              {slides.map((_, i) => (
                <button
                  key={i}
                  onClick={() => goToSlide(i, i > currentSlide ? 1 : -1)}
                  style={{
                    width: i === currentSlide ? '28px' : '8px',
                    height: '8px',
                    borderRadius: 'var(--radius-full)',
                    background: i === currentSlide ? 'var(--primary)' : 'var(--card-border)',
                    border: 'none',
                    cursor: 'pointer',
                    transition: 'all 0.35s',
                    boxShadow: i === currentSlide ? '0 0 10px var(--primary-glow)' : 'none',
                    padding: 0,
                  }}
                  aria-label={`Go to slide ${i + 1}`}
                />
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      
      <section className="section-padding" style={{ borderTop: '1px solid var(--card-border)' }}>
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '40px' }}>
            <div>
              <h2 style={{ fontSize: '32px', fontWeight: '800', marginBottom: '12px' }}>Featured Ebooks</h2>
              <p style={{ color: 'var(--text-secondary)' }}>Explore recently published works chosen by readers and editors.</p>
            </div>
            <Link href="/browse" className="btn btn-outline" style={{ padding: '8px 20px', fontSize: '14px' }}>
              <span>View All</span>
              <ArrowRight size={14} />
            </Link>
          </div>

          {loading ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '30px' }}>
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="glass" style={{ padding: '16px' }}>
                  <div className="skeleton skeleton-img" style={{ borderRadius: 'var(--radius-sm)' }} />
                  <div className="skeleton skeleton-title" style={{ width: '70%' }} />
                  <div className="skeleton skeleton-text" style={{ width: '40%' }} />
                  <div className="skeleton skeleton-text" style={{ width: '90%' }} />
                </div>
              ))}
            </div>
          ) : featuredEbooks.length === 0 ? (
            <div className="glass" style={{ padding: '40px', textAlign: 'center', color: 'var(--text-secondary)' }}>
              No ebooks found. Run the database seed script to populate books.
            </div>
          ) : (
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-100px' }}
              variants={{
                hidden: { opacity: 0 },
                visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
              }}
              style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '30px' }}
            >
              {featuredEbooks.map((book) => (
                <motion.div
                  key={book._id}
                  variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.5 } } }}
                  whileHover={{ scale: 1.03 }}
                  className="glass glass-hover"
                  style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden', height: '100%', borderRadius: 'var(--radius-md)' }}
                >
                  <Link href={`/ebook/${book._id}`}>
                    <div style={{ position: 'relative', width: '100%', aspectRatio: '1.3/1.6', overflow: 'hidden', backgroundColor: 'var(--bg-tertiary)' }}>
                      <img src={book.coverImage} alt={book.title} style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s' }} />
                      <div style={{ position: 'absolute', top: '12px', right: '12px', display: 'flex', gap: '8px' }}>
                        {book.isSold ? <span className="badge badge-secondary">Sold Out</span> : <span className="badge badge-primary">Available</span>}
                      </div>
                    </div>
                  </Link>

                  <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', flex: '1', gap: '12px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span className="badge badge-primary" style={{ fontSize: '10px' }}>{book.genre}</span>
                      <span style={{ fontWeight: '700', fontSize: '16px', color: 'var(--primary)' }}>${book.price}</span>
                    </div>

                    <Link href={`/ebook/${book._id}`}>
                      <h3 style={{ fontSize: '18px', fontWeight: '700', lineHeight: '1.3', color: 'var(--text-primary)' }}>{book.title}</h3>
                    </Link>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: 'auto', fontSize: '13px', color: 'var(--text-secondary)' }}>
                      <User size={14} />
                      <span>{book.writer?.name || 'Unknown Writer'}</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      </section>

      
      <section className="section-padding" style={{ borderTop: '1px solid var(--card-border)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '50px' }}>
            <h2 style={{ fontSize: '32px', fontWeight: '800', marginBottom: '12px' }}>Browse by Genre</h2>
            <p style={{ color: 'var(--text-secondary)' }}>Select a genre category to view matching books.</p>
          </div>

          <div className="genres-grid">
            {genres.map((genre, idx) => (
              <Link key={idx} href={`/browse?genre=${genre.name}`}>
                <motion.div
                  whileHover={{ y: -6, scale: 1.02 }}
                  className="glass"
                  style={{ padding: '24px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px', borderTop: `4px solid ${genre.color}`, borderRadius: 'var(--radius-sm)' }}
                >
                  <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: `${genre.color}18`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: genre.color }}>
                    <Tag size={20} />
                  </div>
                  <div>
                    <h3 style={{ fontSize: '16px', fontWeight: '700', marginBottom: '4px' }}>{genre.name}</h3>
                    <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{genre.count} Ebooks</span>
                  </div>
                </motion.div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      
      <section className="section-padding" style={{ borderTop: '1px solid var(--card-border)', borderBottom: '1px solid var(--card-border)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '50px' }}>
            <h2 style={{ fontSize: '32px', fontWeight: '800', marginBottom: '12px' }}>Top Writers</h2>
            <p style={{ color: 'var(--text-secondary)' }}>Meet the talented authors with the highest ebook publication engagement.</p>
          </div>

          <div className="top-writers-grid">
            {topWriters.map((writer, idx) => (
              <motion.div
                key={idx}
                whileHover={{ y: -5 }}
                className="glass"
                style={{ padding: '32px 24px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px', borderRadius: 'var(--radius-md)' }}
              >
                <img src={writer.image} alt={writer.name} style={{ width: '90px', height: '90px', borderRadius: '50%', objectFit: 'cover', border: '3px solid var(--primary)', boxShadow: 'var(--shadow-md)' }} />
                <div>
                  <h3 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '4px' }}>{writer.name}</h3>
                  <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>{writer.role}</p>
                </div>
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '4px 12px', background: 'var(--primary-glow)', borderRadius: 'var(--radius-full)', fontSize: '12px', fontWeight: '600', color: 'var(--primary)' }}>
                  <Award size={12} />
                  <span>{writer.sales}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
