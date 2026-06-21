'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import { Search, Filter, SlidersHorizontal, BookOpen, ChevronLeft, ChevronRight, User, Tag } from 'lucide-react';
import toast from 'react-hot-toast';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';


function BrowseContent() {
  const searchParams = useSearchParams();
  const router = useRouter();


  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');
  const [selectedGenre, setSelectedGenre] = useState(searchParams.get('genre') || 'All');
  const [minPrice, setMinPrice] = useState(searchParams.get('minPrice') || '');
  const [maxPrice, setMaxPrice] = useState(searchParams.get('maxPrice') || '');
  const [availability, setAvailability] = useState(searchParams.get('availability') || 'all');
  const [sortOption, setSortOption] = useState(searchParams.get('sort') || 'newest');
  const [page, setPage] = useState(Number(searchParams.get('page')) || 1);

  const [ebooks, setEbooks] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);

  const genres = ['All', 'Fiction', 'Mystery', 'Romance', 'Sci-Fi', 'Fantasy', 'Horror'];


  useEffect(() => {
    const fetchEbooks = async () => {
      setLoading(true);
      try {
        const queryParams = new URLSearchParams();
        if (searchTerm) queryParams.append('search', searchTerm);
        if (selectedGenre && selectedGenre !== 'All') queryParams.append('genre', selectedGenre);
        if (minPrice) queryParams.append('minPrice', minPrice);
        if (maxPrice) queryParams.append('maxPrice', maxPrice);
        if (availability && availability !== 'all') queryParams.append('availability', availability);
        if (sortOption) queryParams.append('sort', sortOption);
        queryParams.append('page', page.toString());
        queryParams.append('limit', '8');

        const res = await fetch(`${API_URL}/ebooks?${queryParams.toString()}`);
        if (!res.ok) throw new Error('Failed to fetch ebooks');
        
        const data = await res.json();
        setEbooks(data.ebooks);
        setTotalPages(data.totalPages || 1);
        setTotalCount(data.totalCount || 0);
      } catch (err) {
        console.error(err);
        toast.error('Failed to load ebooks. Please check backend connection.');
      } finally {
        setLoading(false);
      }
    };

    fetchEbooks();
  }, [searchTerm, selectedGenre, minPrice, maxPrice, availability, sortOption, page]);


  const updateUrl = (newParams = {}) => {
    const current = new URLSearchParams(searchParams.toString());
    Object.entries(newParams).forEach(([key, value]) => {
      if (value === null || value === '' || value === 'All' || value === 'all') {
        current.delete(key);
      } else {
        current.set(key, value.toString());
      }
    });
    router.push(`/browse?${current.toString()}`);
  };

  const handleSearchChange = (e) => {
    const val = e.target.value;
    setSearchTerm(val);
    setPage(1);
    updateUrl({ search: val, page: 1 });
  };

  const handleGenreSelect = (genre) => {
    setSelectedGenre(genre);
    setPage(1);
    updateUrl({ genre, page: 1 });
  };

  const handleAvailabilityChange = (val) => {
    setAvailability(val);
    setPage(1);
    updateUrl({ availability: val, page: 1 });
  };

  const handleSortChange = (e) => {
    const val = e.target.value;
    setSortOption(val);
    setPage(1);
    updateUrl({ sort: val, page: 1 });
  };

  const handlePriceFilterSubmit = (e) => {
    e.preventDefault();
    setPage(1);
    updateUrl({ minPrice, maxPrice, page: 1 });
  };

  const handleResetFilters = () => {
    setSearchTerm('');
    setSelectedGenre('All');
    setMinPrice('');
    setMaxPrice('');
    setAvailability('all');
    setSortOption('newest');
    setPage(1);
    router.push('/browse');
  };

  const handlePageChange = (newPage) => {
    if (newPage < 1 || newPage > totalPages) return;
    setPage(newPage);
    updateUrl({ page: newPage });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="section-padding container" style={{ paddingBottom: '100px' }}>
      <h1 style={{ fontSize: '36px', fontWeight: '800', marginBottom: '8px' }}>Explore Ebooks</h1>
      <p style={{ color: 'var(--text-secondary)', marginBottom: '40px' }}>Find original masterpieces uploaded by authors worldwide.</p>

      
      <div className="browse-layout-grid">
        
        <aside className="glass browse-sidebar">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ fontSize: '18px', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Filter size={18} />
              <span>Filters</span>
            </h3>
            <button onClick={handleResetFilters} style={{ fontSize: '13px', background: 'none', border: 'none', color: 'var(--primary)', cursor: 'pointer', fontWeight: '600' }}>
              Reset
            </button>
          </div>

          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <span className="form-label" style={{ fontWeight: '600' }}>Genres</span>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {genres.map((g) => (
                <button
                  key={g}
                  onClick={() => handleGenreSelect(g)}
                  className={`btn ${selectedGenre === g ? 'btn-primary' : 'btn-outline'}`}
                  style={{ padding: '6px 12px', fontSize: '12px', borderRadius: 'var(--radius-full)' }}
                >
                  {g}
                </button>
              ))}
            </div>
          </div>

          
          <form onSubmit={handlePriceFilterSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <span className="form-label" style={{ fontWeight: '600' }}>Price Range</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <input
                type="number"
                placeholder="Min"
                className="form-input"
                style={{ padding: '8px 12px', fontSize: '14px' }}
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
              />
              <span style={{ color: 'var(--text-muted)' }}>-</span>
              <input
                type="number"
                placeholder="Max"
                className="form-input"
                style={{ padding: '8px 12px', fontSize: '14px' }}
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
              />
            </div>
            <button type="submit" className="btn btn-outline" style={{ padding: '8px 12px', fontSize: '13px', width: '100%' }}>
              Apply Price
            </button>
          </form>

          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <span className="form-label" style={{ fontWeight: '600' }}>Availability</span>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {['all', 'available', 'sold'].map((option) => (
                <label key={option} style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '14px', textTransform: 'capitalize' }}>
                  <input
                    type="radio"
                    name="availability"
                    checked={availability === option}
                    onChange={() => handleAvailabilityChange(option)}
                    style={{ accentColor: 'var(--primary)' }}
                  />
                  <span style={{ color: availability === option ? 'var(--text-primary)' : 'var(--text-secondary)' }}>{option === 'all' ? 'All Books' : option === 'available' ? 'Available' : 'Sold Out'}</span>
                </label>
              ))}
            </div>
          </div>
        </aside>

        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
          
          <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ position: 'relative', flex: '1', minWidth: '280px' }}>
              <Search size={18} style={{ position: 'absolute', left: '16px', top: '15px', color: 'var(--text-muted)' }} />
              <input
                type="text"
                placeholder="Search by book title or writer name..."
                className="form-input"
                style={{ paddingLeft: '48px', height: '48px' }}
                value={searchTerm}
                onChange={handleSearchChange}
              />
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <span style={{ fontSize: '14px', color: 'var(--text-secondary)', whiteSpace: 'nowrap' }}>{totalCount} results</span>
              <div style={{ position: 'relative' }}>
                <select
                  className="form-select"
                  style={{ height: '48px', paddingRight: '40px', minWidth: '160px' }}
                  value={sortOption}
                  onChange={handleSortChange}
                >
                  <option value="newest">Newest Releases</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                </select>
              </div>
            </div>
          </div>

          
          {loading ? (
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '24px' }}>
              {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                <div key={i} className="glass" style={{ padding: '12px' }}>
                  <div className="skeleton skeleton-img" style={{ aspectRatio: '3/4', borderRadius: 'var(--radius-sm)' }} />
                  <div className="skeleton skeleton-title" style={{ width: '80%', height: '20px' }} />
                  <div className="skeleton skeleton-text" style={{ width: '50%', height: '14px' }} />
                </div>
              ))}
            </div>
          ) : ebooks.length === 0 ? (
            <div className="glass" style={{ padding: '80px 20px', textAlign: 'center' }}>
              <BookOpen size={48} style={{ color: 'var(--text-muted)', marginBottom: '16px', opacity: '0.5' }} />
              <h3 style={{ fontSize: '20px', fontWeight: '700', marginBottom: '8px' }}>No Ebooks Found</h3>
              <p style={{ color: 'var(--text-secondary)', maxWidth: '360px', margin: '0 auto' }}>
                We couldn't find any ebooks matching your filters. Try resetting or adjusting your criteria.
              </p>
            </div>
          ) : (
            
            <>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '24px' }}>
                {ebooks.map((book) => (
                  <div
                    key={book._id}
                    className="glass glass-hover"
                    style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden', height: '100%', borderRadius: 'var(--radius-md)' }}
                  >
                    <Link href={`/ebook/${book._id}`}>
                      <div style={{ position: 'relative', width: '100%', aspectRatio: '1.3/1.6', overflow: 'hidden', backgroundColor: 'var(--bg-tertiary)' }}>
                        <img
                          src={book.coverImage}
                          alt={book.title}
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        />
                        <div style={{ position: 'absolute', top: '10px', right: '10px' }}>
                          {book.isSold ? (
                            <span className="badge badge-secondary" style={{ fontSize: '9px' }}>Sold Out</span>
                          ) : (
                            <span className="badge badge-primary" style={{ fontSize: '9px' }}>Available</span>
                          )}
                        </div>
                      </div>
                    </Link>

                    <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', flex: '1', gap: '10px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span className="badge badge-primary" style={{ fontSize: '9px', padding: '2px 8px' }}>{book.genre}</span>
                        <span style={{ fontWeight: '700', fontSize: '15px', color: 'var(--primary)' }}>${book.price}</span>
                      </div>

                      <Link href={`/ebook/${book._id}`}>
                        <h3 style={{ fontSize: '16px', fontWeight: '700', lineHeight: '1.3', color: 'var(--text-primary)' }}>{book.title}</h3>
                      </Link>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: 'auto', fontSize: '12px', color: 'var(--text-secondary)' }}>
                        <User size={12} />
                        <span>{book.writer?.name || 'Unknown Writer'}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              
              {totalPages > 1 && (
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '16px', marginTop: '30px' }}>
                  <button
                    onClick={() => handlePageChange(page - 1)}
                    disabled={page === 1}
                    className="btn btn-outline"
                    style={{ padding: '10px 14px', borderRadius: '50%' }}
                  >
                    <ChevronLeft size={18} />
                  </button>

                  <div style={{ display: 'flex', gap: '8px' }}>
                    {Array.from({ length: totalPages }, (_, idx) => idx + 1).map((pNum) => (
                      <button
                        key={pNum}
                        onClick={() => handlePageChange(pNum)}
                        className={`btn ${page === pNum ? 'btn-primary' : 'btn-outline'}`}
                        style={{ width: '40px', height: '40px', padding: '0', borderRadius: '50%', fontSize: '14px', fontWeight: '600' }}
                      >
                        {pNum}
                      </button>
                    ))}
                  </div>

                  <button
                    onClick={() => handlePageChange(page + 1)}
                    disabled={page === totalPages}
                    className="btn btn-outline"
                    style={{ padding: '10px 14px', borderRadius: '50%' }}
                  >
                    <ChevronRight size={18} />
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default function Browse() {
  return (
    <Suspense fallback={
      <div className="spinner-container">
        <div className="spinner" />
      </div>
    }>
      <BrowseContent />
    </Suspense>
  );
}
