import React, { useCallback, useState } from 'react';
import { UploadIcon } from './icons';

interface ImageUploaderProps {
  onImageUpload: (file: File) => void;
  previewUrl: string | null;
  title?: string;
  description?: string;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ 
  onImageUpload, 
  previewUrl,
  title = "이미지 업로드",
  description = "이미지를 드래그 앤 드롭하거나 여기를 클릭하세요."
}) => {
  const [isDragging, setIsDragging] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onImageUpload(e.target.files[0]);
    }
  };

  const handleDragEvents = useCallback((e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDragEnter = useCallback((e: React.DragEvent<HTMLLabelElement>) => {
    handleDragEvents(e);
    setIsDragging(true);
  }, [handleDragEvents]);
  
  const handleDragLeave = useCallback((e: React.DragEvent<HTMLLabelElement>) => {
    handleDragEvents(e);
    setIsDragging(false);
  }, [handleDragEvents]);

  const handleDrop = useCallback((e: React.DragEvent<HTMLLabelElement>) => {
    handleDragEvents(e);
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      onImageUpload(e.dataTransfer.files[0]);
    }
  }, [handleDragEvents, onImageUpload]);

  return (
    <div>
      <label
        htmlFor="image-upload"
        onDragEnter={handleDragEnter}
        onDragOver={handleDragEvents}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`flex justify-center items-center w-full h-64 md:h-80 border-2 rounded-2xl cursor-pointer transition-all duration-300
        ${isDragging 
          ? 'border-teal-500 bg-teal-50 dark:bg-teal-900/20 ring-4 ring-teal-500/10' 
          : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900/50 shadow-sm hover:shadow-md hover:border-teal-400'
        }`}
      >
        <div className="flex flex-col items-center text-center p-4">
          {previewUrl ? (
            <img src={previewUrl} alt="Health Data Preview" className="max-h-56 md:max-h-72 object-contain rounded-lg shadow-md" />
          ) : (
            <>
              <UploadIcon className="w-16 h-16 text-slate-400 dark:text-slate-500" />
              <p className="mt-4 text-lg font-semibold text-slate-700 dark:text-slate-300">{title}</p>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                {description}
              </p>
            </>
          )}
        </div>
        <input
          id="image-upload"
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFileChange}
        />
      </label>
      {previewUrl && (
        <div className="text-center mt-4">
            <button onClick={() => document.getElementById('image-upload')?.click()} className="text-sm font-semibold text-teal-600 dark:text-teal-400 hover:underline">
                다른 이미지 선택하기
            </button>
        </div>
      )}
    </div>
  );
};

export default ImageUploader;