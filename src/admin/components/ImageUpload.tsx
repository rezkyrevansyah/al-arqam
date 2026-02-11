import { useState, useRef, type ChangeEvent } from 'react';
import { Upload, Link as LinkIcon, X, Image as ImageIcon, AlertCircle } from 'lucide-react';

interface ImageUploadProps {
  value: string;
  onChange: (url: string) => void;
  label?: string;
  previewHeight?: string;
}

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_FORMATS = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];
const ALLOWED_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.webp', '.gif'];

export default function ImageUpload({ value, onChange, label = "Gambar", previewHeight = "h-40" }: ImageUploadProps) {
  const [uploadMethod, setUploadMethod] = useState<'file' | 'url'>('url');
  const [error, setError] = useState<string>('');
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (file: File) => {
    setError('');

    // Validate file type
    if (!ALLOWED_FORMATS.includes(file.type)) {
      setError('Format file tidak didukung. Gunakan JPG, PNG, WebP, atau GIF.');
      return;
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      setError('Ukuran file terlalu besar. Maksimal 5MB.');
      return;
    }

    // Convert to base64 or object URL
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      onChange(result);
    };
    reader.readAsDataURL(file);
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleClear = () => {
    onChange('');
    setError('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-3">
      <label className="block text-sm font-medium text-gray-700">{label}</label>

      {/* Toggle Method */}
      <div className="flex gap-2 p-1 bg-gray-100 rounded-lg w-fit">
        <button
          type="button"
          onClick={() => setUploadMethod('url')}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
            uploadMethod === 'url'
              ? 'bg-white text-gray-900 shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          <LinkIcon className="w-4 h-4 inline mr-2" />
          Paste URL
        </button>
        <button
          type="button"
          onClick={() => setUploadMethod('file')}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
            uploadMethod === 'file'
              ? 'bg-white text-gray-900 shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          <Upload className="w-4 h-4 inline mr-2" />
          Upload File
        </button>
      </div>

      {/* URL Input Method */}
      {uploadMethod === 'url' && (
        <div>
          <div className="relative">
            <input
              type="url"
              value={value}
              onChange={(e) => {
                onChange(e.target.value);
                setError('');
              }}
              className="w-full pl-10 pr-10 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
              placeholder="https://example.com/image.jpg"
            />
            <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            {value && (
              <button
                type="button"
                onClick={handleClear}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
          <p className="text-xs text-gray-500 mt-1.5">
            Paste link gambar dari internet (JPG, PNG, WebP, GIF)
          </p>
        </div>
      )}

      {/* File Upload Method */}
      {uploadMethod === 'file' && (
        <div>
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`border-2 border-dashed rounded-xl p-6 text-center transition-all ${
              isDragging
                ? 'border-emerald-500 bg-emerald-50'
                : value
                ? 'border-emerald-300 bg-emerald-50/50'
                : 'border-gray-300 hover:border-gray-400'
            }`}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept={ALLOWED_EXTENSIONS.join(',')}
              onChange={handleFileChange}
              className="hidden"
            />

            {value ? (
              <div className="flex flex-col items-center gap-2">
                <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center">
                  <ImageIcon className="w-6 h-6 text-emerald-600" />
                </div>
                <p className="text-sm font-medium text-gray-700">File berhasil diupload</p>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="text-xs text-emerald-600 hover:text-emerald-700 font-medium"
                  >
                    Ganti File
                  </button>
                  <span className="text-xs text-gray-400">•</span>
                  <button
                    type="button"
                    onClick={handleClear}
                    className="text-xs text-red-600 hover:text-red-700 font-medium"
                  >
                    Hapus
                  </button>
                </div>
              </div>
            ) : (
              <div>
                <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-3">
                  <Upload className="w-6 h-6 text-gray-400" />
                </div>
                <p className="text-sm font-medium text-gray-700 mb-1">
                  Drop gambar disini atau{' '}
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="text-emerald-600 hover:text-emerald-700 underline"
                  >
                    pilih file
                  </button>
                </p>
              </div>
            )}
          </div>

          {/* Upload Requirements */}
          <div className="mt-2 bg-blue-50 border border-blue-100 rounded-lg p-3">
            <div className="flex gap-2">
              <AlertCircle className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
              <div className="text-xs text-blue-800 space-y-1">
                <p className="font-medium">Syarat upload gambar:</p>
                <ul className="list-disc list-inside space-y-0.5 text-blue-700">
                  <li>Format: JPG, PNG, WebP, atau GIF</li>
                  <li>Ukuran maksimal: 5MB</li>
                  <li>Resolusi disarankan: minimal 800x600px</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="flex items-start gap-2 p-3 bg-red-50 border border-red-100 rounded-lg">
          <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
          <p className="text-xs text-red-700">{error}</p>
        </div>
      )}

      {/* Image Preview */}
      {value && !error && (
        <div className="relative">
          <p className="text-xs font-medium text-gray-600 mb-2">Preview:</p>
          <div className={`relative ${previewHeight} rounded-xl overflow-hidden bg-gray-100 border border-gray-200`}>
            <img
              src={value}
              alt="Preview"
              className="w-full h-full object-cover"
              onError={() => setError('Gagal memuat gambar. Periksa URL atau file.')}
            />
          </div>
        </div>
      )}
    </div>
  );
}
