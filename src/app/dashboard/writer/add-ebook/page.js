'use client';

import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { PlusCircle, Image as ImageIcon, Save, ArrowLeft, Loader } from 'lucide-react';
import toast from 'react-hot-toast';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
const IMGBB_API_KEY = process.env.NEXT_PUBLIC_IMGBB_API_KEY || 'd7d07c067a99f1fa023a1d953ee24f9f';

export default function AddEbook() {
  const { authFetch } = useAuth();
  const router = useRouter();


  const [title, setTitle] = useState('');
  const [genre, setGenre] = useState('Fiction');
  const [price, setPrice] = useState('');
  const [previewDescription, setPreviewDescription] = useState('');
  const [description, setDescription] = useState('');
  const [coverImage, setCoverImage] = useState('');

  const [uploadingImage, setUploadingImage] = useState(false);
  const [saving, setSaving] = useState(false);

  const genres = ['Fiction', 'Mystery', 'Romance', 'Sci-Fi', 'Fantasy', 'Horror'];


  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploadingImage(true);
    const formData = new FormData();
    formData.append('image', file);

    try {
      const res = await fetch(`https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`, {
        method: 'POST',
        body: formData,
      });
      const result = await res.json();

      if (res.ok && result.data && result.data.url) {
        setCoverImage(result.data.url);
        toast.success('Cover image uploaded successfully to imgBB!');
      } else {
        throw new Error('Image upload failed');
      }
    } catch (err) {
      console.error(err);
      toast.error('Failed to upload image. Please try pasting a direct image URL instead.');
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title || !price || !genre || !previewDescription || !description || !coverImage) {
      toast.error('All fields including cover image are required.');
      return;
    }

    setSaving(true);
    try {
      const res = await authFetch(`${API_URL}/ebooks`, {
        method: 'POST',
        body: JSON.stringify({
          title,
          genre,
          price: Number(price),
          previewDescription,
          description,
          coverImage,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        toast.success(`Ebook "${title}" uploaded and published!`);
        router.push('/dashboard/writer');
      } else {
        throw new Error(data.message || 'Failed to save ebook');
      }
    } catch (err) {
      toast.error(err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div style={{ maxWidth: '800px' }}>
      <button onClick={() => router.back()} className="btn btn-outline" style={{ display: 'inline-flex', gap: '8px', padding: '8px 16px', marginBottom: '24px' }}>
        <ArrowLeft size={16} />
        <span>Back</span>
      </button>

      <h2 style={{ fontSize: '28px', fontWeight: '800', marginBottom: '24px' }}>Upload New Ebook</h2>

      <div className="glass" style={{ padding: '40px', borderRadius: 'var(--radius-md)' }}>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
            <div className="form-group">
              <label className="form-label" htmlFor="ebook-title-input">Ebook Title</label>
              <input
                id="ebook-title-input"
                type="text"
                placeholder="e.g. Journey to the Center of the Earth"
                className="form-input"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="genre-select">Genre Category</label>
              <select
                id="genre-select"
                className="form-select"
                value={genre}
                onChange={(e) => setGenre(e.target.value)}
              >
                {genres.map((g) => (
                  <option key={g} value={g}>{g}</option>
                ))}
              </select>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', alignItems: 'end' }}>
            <div className="form-group">
              <label className="form-label" htmlFor="price-input">Price (USD)</label>
              <input
                id="price-input"
                type="number"
                step="0.01"
                placeholder="e.g. 9.99"
                className="form-input"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                required
              />
            </div>

            
            <div className="form-group">
              <label className="form-label" htmlFor="cover-image-upload">Cover Image File</label>
              <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                <input
                  id="cover-image-upload"
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleImageUpload(e, 'cover')}
                  style={{ display: 'none' }}
                />
                <button
                  type="button"
                  onClick={() => document.getElementById('cover-image-upload').click()}
                  className="btn btn-outline"
                  style={{ flex: '1' }}
                >
                  Upload Cover Image
                </button>
              </div>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="cover-url-input">Or Paste Cover Image URL</label>
            <input
              id="cover-url-input"
              type="url"
              placeholder="Paste image URL here"
              className="form-input"
              value={coverImage}
              onChange={(e) => setCoverImage(e.target.value)}
            />
          </div>

          
          {coverImage && (
            <div style={{ display: 'flex', gap: '16px', alignItems: 'center', padding: '16px', background: 'var(--bg-tertiary)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--card-border)' }}>
              <img src={coverImage} alt="Cover Preview" style={{ width: '60px', height: '80px', objectFit: 'cover', borderRadius: 'var(--radius-sm)' }} />
              <div>
                <div style={{ fontSize: '14px', fontWeight: '600' }}>Cover Preview Active</div>
                <div style={{ fontSize: '11px', color: 'var(--text-secondary)', wordBreak: 'break-all' }}>{coverImage}</div>
              </div>
            </div>
          )}

          
          <div className="form-group">
            <label className="form-label" htmlFor="preview-desc-input">Ebook Preview Summary (Visible to Guests)</label>
            <textarea
              id="preview-desc-input"
              placeholder="Provide a short synopsis/teaser to hook potential readers..."
              className="form-textarea"
              value={previewDescription}
              onChange={(e) => setPreviewDescription(e.target.value)}
              required
            />
          </div>

          
          <div className="form-group">
            <label className="form-label" htmlFor="full-content-input">Ebook Full Text Content (Unlocked on Purchase)</label>
            <textarea
              id="full-content-input"
              placeholder="Write or paste the full contents of your book chapters here..."
              className="form-textarea"
              style={{ minHeight: '220px' }}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="btn btn-primary" style={{ alignSelf: 'flex-start', padding: '14px 28px' }} disabled={saving}>
            <Save size={16} />
            <span>{saving ? 'Publishing Book...' : 'Publish Ebook'}</span>
          </button>
        </form>
      </div>
    </div>
  );
}
