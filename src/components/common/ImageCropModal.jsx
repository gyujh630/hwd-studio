import React, { useState, useRef } from 'react';
import ReactCrop, { centerCrop, makeAspectCrop } from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';

export default function ImageCropModal({ 
  imageUrl, 
  onCropComplete, 
  onCancel, 
  aspectRatio = 1, // 1:1 비율
  cropShape = 'rect' // 'rect' 또는 'round'
}) {
  const [crop, setCrop] = useState();
  const [completedCrop, setCompletedCrop] = useState();
  const imgRef = useRef(null);

  function onImageLoad(e) {
    const { width, height } = e.currentTarget;
    const crop = centerCrop(
      makeAspectCrop(
        {
          unit: '%',
          width: 90,
        },
        aspectRatio,
        width,
        height
      ),
      width,
      height
    );
    setCrop(crop);
  }

  const getCroppedImg = (image, crop) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;

    canvas.width = crop.width * scaleX;
    canvas.height = crop.height * scaleY;

    ctx.drawImage(
      image,
      crop.x * scaleX,
      crop.y * scaleY,
      crop.width * scaleX,
      crop.height * scaleY,
      0,
      0,
      crop.width * scaleX,
      crop.height * scaleY
    );

    return new Promise((resolve) => {
      canvas.toBlob((blob) => {
        if (!blob) {
          console.error('Canvas is empty');
          return;
        }
        blob.name = 'cropped.jpeg';
        const fileUrl = URL.createObjectURL(blob);
        resolve({ blob, fileUrl });
      }, 'image/jpeg', 1);
    });
  };

  const handleCropComplete = async () => {
    if (!completedCrop || !imgRef.current) return;

    try {
      const { blob, fileUrl } = await getCroppedImg(imgRef.current, completedCrop);
      onCropComplete({ blob, fileUrl });
    } catch (error) {
      console.error('Error cropping image:', error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">이미지 크롭</h3>
          <button
            onClick={onCancel}
            className="text-gray-500 hover:text-gray-700"
          >
            <svg width="24" height="24" fill="none" viewBox="0 0 24 24">
              <path stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M18 6 6 18M6 6l12 12"/>
            </svg>
          </button>
        </div>
        
        <div className="mb-4">
          <p className="text-sm text-gray-600 mb-2">
            원하는 영역을 선택하여 1:1 비율로 크롭하세요.
          </p>
        </div>

        <div className="flex justify-center mb-4">
          <ReactCrop
            crop={crop}
            onChange={(_, percentCrop) => setCrop(percentCrop)}
            onComplete={(c) => setCompletedCrop(c)}
            aspect={aspectRatio}
            circularCrop={cropShape === 'round'}
          >
            <img
              ref={imgRef}
              alt="Crop me"
              src={imageUrl}
              onLoad={onImageLoad}
              className="max-w-full max-h-[60vh] object-contain"
            />
          </ReactCrop>
        </div>

        <div className="flex gap-3 justify-end">
          <button
            onClick={onCancel}
            className="px-4 py-2 text-gray-600 border border-gray-300 rounded hover:bg-gray-50"
          >
            취소
          </button>
          <button
            onClick={handleCropComplete}
            disabled={!completedCrop}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            크롭 완료
          </button>
        </div>
      </div>
    </div>
  );
} 