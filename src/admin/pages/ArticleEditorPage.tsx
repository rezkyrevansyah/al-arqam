import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Save, Loader2, ChevronDown, ChevronUp, Eye } from 'lucide-react';
import { useAdmin } from '../store/admin-store';
import RichTextEditor from '../components/RichTextEditor';
import ImageUpload from '../components/ImageUpload';
import { formatGoogleDriveUrl } from '../../lib/utils';

export default function ArticleEditorPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { articleList, addArticle, updateArticle, isSaving } = useAdmin();
  const isEditing = Boolean(id);

  const [title, setTitle] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [content, setContent] = useState('');
  const [author, setAuthor] = useState('Admin DKM');
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [image, setImage] = useState('');
  const [category, setCategory] = useState('');
  const [showMeta, setShowMeta] = useState(true);
  const [showPreview, setShowPreview] = useState(false);
  const [saved, setSaved] = useState(false);

  // Load existing article for editing
  useEffect(() => {
    if (id) {
      const article = articleList.find(a => a.id === id);
      if (article) {
        setTitle(article.title);
        setExcerpt(article.excerpt);
        setContent(article.content);
        setAuthor(article.author);
        setDate(article.date);
        setImage(article.image);
        setCategory(article.category);
      }
    }
  }, [id, articleList]);

  const handleSave = async () => {
    if (!title || !date) return;
    const sanitizedImage = formatGoogleDriveUrl(image);
    const data = { title, excerpt, content, author, date, image: sanitizedImage, category };

    if (isEditing && id) {
      await updateArticle(id, data);
    } else {
      await addArticle(data);
    }
    setSaved(true);
    setTimeout(() => navigate('/admin/artikel'), 800);
  };

  const goBack = () => navigate('/admin/artikel');

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Bar */}
      <div className="sticky top-0 z-30 bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 md:px-6 py-3 flex items-center justify-between gap-4">
          <button
            onClick={goBack}
            className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 transition-colors flex-shrink-0"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Kembali</span>
          </button>

          <div className="flex-1 min-w-0 text-center">
            <span className="text-sm font-medium text-gray-400">
              {isEditing ? 'Edit Artikel' : 'Tulis Artikel Baru'}
            </span>
          </div>

          <div className="flex items-center gap-2 flex-shrink-0">
            <button
              onClick={() => setShowPreview(!showPreview)}
              className={`flex items-center gap-1.5 px-3 py-2 text-sm rounded-xl transition-colors ${
                showPreview
                  ? 'bg-blue-50 text-blue-600'
                  : 'text-gray-500 hover:bg-gray-100'
              }`}
            >
              <Eye className="w-4 h-4" />
              <span className="hidden sm:inline">Preview</span>
            </button>
            <button
              onClick={handleSave}
              disabled={isSaving || !title}
              className="flex items-center gap-2 px-5 py-2 bg-emerald-600 text-white rounded-xl text-sm font-semibold hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isSaving ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : saved ? (
                <span>✓ Tersimpan</span>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>{isEditing ? 'Perbarui' : 'Publikasi'}</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 md:px-6 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6">
          {/* Main Content Area */}
          <div className="space-y-4">
            {/* Title Input */}
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Judul artikel..."
              className="w-full text-2xl md:text-3xl font-bold text-gray-900 bg-transparent border-0 outline-none placeholder:text-gray-300"
              style={{ fontFamily: "'Playfair Display', serif" }}
            />

            {/* Editor or Preview */}
            {showPreview ? (
              <div className="bg-white rounded-2xl border border-gray-200 p-6 md:p-10">
                <div
                  className="article-content"
                  dangerouslySetInnerHTML={{ __html: content || '<p style="color:#9ca3af;font-style:italic;">Belum ada konten...</p>' }}
                />
              </div>
            ) : (
              <RichTextEditor
                content={content}
                onChange={setContent}
              />
            )}
          </div>

          {/* Sidebar Metadata */}
          <div className="lg:sticky lg:top-[72px] lg:self-start space-y-4">
            {/* Mobile toggle */}
            <button
              onClick={() => setShowMeta(!showMeta)}
              className="lg:hidden w-full flex items-center justify-between px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm font-medium text-gray-700"
            >
              <span>Detail Artikel</span>
              {showMeta ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>

            <div className={`space-y-4 ${showMeta ? '' : 'hidden lg:block'}`}>
              {/* Image Upload */}
              <div className="bg-white border border-gray-200 rounded-2xl p-5">
                <ImageUpload
                  value={image}
                  onChange={setImage}
                  label="Gambar Cover"
                  previewHeight="h-40"
                />
              </div>

              {/* Meta Fields */}
              <div className="bg-white border border-gray-200 rounded-2xl p-5 space-y-4">
                <h3 className="text-sm font-semibold text-gray-700">Detail</h3>

                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1.5">Kategori</label>
                  <input
                    type="text"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    placeholder="Artikel Islami"
                    className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1.5">Penulis</label>
                  <input
                    type="text"
                    value={author}
                    onChange={(e) => setAuthor(e.target.value)}
                    placeholder="Admin DKM"
                    className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1.5">Tanggal</label>
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1.5">Ringkasan</label>
                  <textarea
                    value={excerpt}
                    onChange={(e) => setExcerpt(e.target.value)}
                    rows={3}
                    placeholder="Ringkasan singkat artikel..."
                    className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 resize-none"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
