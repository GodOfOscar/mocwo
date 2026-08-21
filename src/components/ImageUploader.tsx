import { useState, useRef } from "react";
import { Upload, X } from "lucide-react";

export interface UploadedImage {
  id: string;
  preview: string;
  file: File;
}

interface ImageUploaderProps {
  onImagesAdded: (images: UploadedImage[]) => void;
  maxFiles?: number;
}

export default function ImageUploader({ onImagesAdded, maxFiles = 10 }: ImageUploaderProps) {
  const [uploadedImages, setUploadedImages] = useState<UploadedImage[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFiles = (files: FileList) => {
    const newImages: UploadedImage[] = [];

    for (let i = 0; i < Math.min(files.length, maxFiles - uploadedImages.length); i++) {
      const file = files[i];

      if (file.type.startsWith("image/")) {
        const reader = new FileReader();
        reader.onload = (e) => {
          if (e.target?.result) {
            const image: UploadedImage = {
              id: `${Date.now()}-${i}`,
              preview: e.target.result as string,
              file,
            };
            newImages.push(image);

            if (newImages.length === Math.min(files.length, maxFiles - uploadedImages.length)) {
              const combined = [...uploadedImages, ...newImages];
              setUploadedImages(combined);
              onImagesAdded(newImages);
            }
          }
        };
        reader.readAsDataURL(file);
      }
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.type === "dragover" || e.type === "dragenter") {
      setIsDragging(true);
    } else if (e.type === "dragleave") {
      setIsDragging(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      handleFiles(e.target.files);
    }
  };

  const removeImage = (id: string) => {
    const filtered = uploadedImages.filter((img) => img.id !== id);
    setUploadedImages(filtered);
  };

  const clearAll = () => {
    setUploadedImages([]);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="space-y-4">
      {/* Drop Zone */}
      <div
        onDragOver={handleDrag}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDrop={handleDrop}
        className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
          isDragging
            ? "border-amber-400 bg-amber-50"
            : "border-slate-300 hover:border-slate-400 bg-slate-50"
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*"
          onChange={handleFileSelect}
          className="hidden"
          disabled={uploadedImages.length >= maxFiles}
        />

        <Upload className="w-10 h-10 mx-auto mb-2 text-slate-500" />
        <p className="text-slate-700 font-medium">Drag and drop images here</p>
        <p className="text-sm text-slate-500 mb-4">or click to browse</p>

        <button
          onClick={() => fileInputRef.current?.click()}
          disabled={uploadedImages.length >= maxFiles}
          className="px-4 py-2 bg-slate-900 text-white rounded hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Select Images
        </button>

        <p className="text-xs text-slate-500 mt-4">
          {uploadedImages.length} / {maxFiles} images selected
        </p>
      </div>

      {/* Previews */}
      {uploadedImages.length > 0 && (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-slate-900">Preview ({uploadedImages.length})</h3>
            <button
              onClick={clearAll}
              className="text-xs text-slate-500 hover:text-slate-700"
            >
              Clear all
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
            {uploadedImages.map((img) => (
              <div key={img.id} className="relative group">
                <img
                  src={img.preview}
                  alt="Preview"
                  className="w-full h-24 object-cover rounded shadow max-w-full"
                />
                <button
                  onClick={() => removeImage(img.id)}
                  className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded opacity-0 group-hover:opacity-100 transition"
                >
                  <X size={16} />
                </button>
                <p className="text-xs text-slate-500 mt-1 truncate">{img.file.name}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
