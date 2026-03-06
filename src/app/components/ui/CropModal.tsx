import React, { useState, useCallback } from 'react';
import Cropper from 'react-easy-crop';
import { FiX, FiCheck } from 'react-icons/fi';
import { motion, AnimatePresence } from 'motion/react';

interface CropModalProps {
  image: string;
  onCropComplete: (croppedImage: Blob) => void;
  onCancel: () => void;
  aspect?: number;
  circular?: boolean;
}

export const CropModal: React.FC<CropModalProps> = ({ 
  image, 
  onCropComplete, 
  onCancel, 
  aspect = 1,
  circular = true 
}) => {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<any>(null);

  const onCropChange = (crop: any) => {
    setCrop(crop);
  };

  const onZoomChange = (zoom: number) => {
    setZoom(zoom);
  };

  const onCropAreaComplete = useCallback((_: any, croppedAreaPixels: any) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const createImage = (url: string): Promise<HTMLImageElement> =>
    new Promise((resolve, reject) => {
      const image = new Image();
      image.addEventListener('load', () => resolve(image));
      image.addEventListener('error', (error) => reject(error));
      image.setAttribute('crossOrigin', 'anonymous');
      image.src = url;
    });

  const getCroppedImg = async () => {
    try {
      const img = await createImage(image);
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');

      if (!ctx) return;

      canvas.width = croppedAreaPixels.width;
      canvas.height = croppedAreaPixels.height;

      ctx.drawImage(
        img,
        croppedAreaPixels.x,
        croppedAreaPixels.y,
        croppedAreaPixels.width,
        croppedAreaPixels.height,
        0,
        0,
        croppedAreaPixels.width,
        croppedAreaPixels.height
      );

      canvas.toBlob((blob) => {
        if (blob) {
          onCropComplete(blob);
        }
      }, 'image/jpeg');
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <motion.div 
        className="glass-panel w-full max-w-2xl overflow-hidden flex flex-col h-[80vh]"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
      >
        <div className="p-4 border-b border-white/10 flex justify-between items-center">
          <h3 className="text-xl font-bold gradient-text">Crop Image</h3>
          <button onClick={onCancel} className="p-2 hover:bg-white/10 rounded-full transition-colors">
            <FiX size={24} />
          </button>
        </div>

        <div className="relative flex-1 bg-neutral-900">
          <Cropper
            image={image}
            crop={crop}
            zoom={zoom}
            aspect={aspect}
            cropShape={circular ? 'round' : 'rect'}
            showGrid={false}
            onCropChange={onCropChange}
            onCropComplete={onCropAreaComplete}
            onZoomChange={onZoomChange}
          />
        </div>

        <div className="p-6 border-t border-white/10 space-y-6 bg-[#030213]">
          <div className="space-y-2">
            <label className="text-sm font-medium text-white/60">Zoom</label>
            <input
              type="range"
              value={zoom}
              min={1}
              max={3}
              step={0.1}
              aria-labelledby="Zoom"
              onChange={(e) => onZoomChange(Number(e.target.value))}
              className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-cyan-400"
            />
          </div>

          <div className="flex gap-4">
            <button
              onClick={onCancel}
              className="flex-1 px-6 py-3 rounded-xl border border-white/10 font-semibold hover:bg-white/5 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={getCroppedImg}
              className="flex-1 px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-magenta-500 font-semibold flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/20 hover:opacity-90 transition-opacity"
            >
              <FiCheck /> Apply Crop
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};