'use client';

import { RotateCcw, X } from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { canvasFilter, clampCropOffset, coverScale, EDITOR_SIZE, editedFilename } from '@/libs/image-editor.js';

const defaults = { cropX: 0, cropY: 0, zoom: 1, rotation: 0, brightness: 100, contrast: 100, saturation: 100, grayscale: 0 };

export function ProfilePhotoEditor({ sourceFile, onCancel, onSave }) {
  const [settings, setSettings] = useState(defaults);
  const [imageReady, setImageReady] = useState(false);
  const canvasRef = useRef(null);
  const imageRef = useRef(null);
  const sourceURLRef = useRef('');

  useEffect(() => {
    const sourceURL = URL.createObjectURL(sourceFile);
    sourceURLRef.current = sourceURL;
    const image = new window.Image();
    image.onload = () => {
      imageRef.current = image;
      setImageReady(true);
    };
    image.src = sourceURL;
    return () => URL.revokeObjectURL(sourceURL);
  }, [sourceFile]);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    const image = imageRef.current;
    if (!canvas || !image) return;
    canvas.width = EDITOR_SIZE;
    canvas.height = EDITOR_SIZE;
    const context = canvas.getContext('2d');
    context.clearRect(0, 0, EDITOR_SIZE, EDITOR_SIZE);
    context.save();
    context.filter = canvasFilter(settings);
    context.translate(EDITOR_SIZE / 2, EDITOR_SIZE / 2);
    context.rotate((settings.rotation * Math.PI) / 180);
    const quarterTurn = Math.abs(settings.rotation / 90) % 2 === 1;
    const scale = coverScale(quarterTurn ? image.height : image.width, quarterTurn ? image.width : image.height, EDITOR_SIZE, settings.zoom);
    const width = image.width * scale;
    const height = image.height * scale;
    const offsetX = (clampCropOffset(settings.cropX) / 100) * (EDITOR_SIZE / 2);
    const offsetY = (clampCropOffset(settings.cropY) / 100) * (EDITOR_SIZE / 2);
    context.drawImage(image, (-width / 2) + offsetX, (-height / 2) + offsetY, width, height);
    context.restore();
  }, [settings]);

  useEffect(() => {
    if (imageReady) draw();
  }, [draw, imageReady]);

  const update = (key, value) => setSettings((current) => ({ ...current, [key]: Number(value) }));
  const rotate = () => setSettings((current) => ({ ...current, rotation: (current.rotation + 90) % 360 }));

  const save = () => {
    draw();
    canvasRef.current.toBlob((blob) => {
      if (!blob) return;
      onSave(new File([blob], editedFilename(sourceFile.name), { type: 'image/webp' }));
    }, 'image/webp', 0.9);
  };

  const controls = [
    ['cropX', 'Horizontal crop', -100, 100, 1],
    ['cropY', 'Vertical crop', -100, 100, 1],
    ['zoom', 'Zoom', 1, 3, 0.05],
    ['brightness', 'Brightness', 50, 150, 1],
    ['contrast', 'Contrast', 50, 150, 1],
    ['saturation', 'Saturation', 0, 200, 1],
    ['grayscale', 'Grayscale', 0, 100, 1],
  ];

  return (
    <div className="fixed inset-0 z-[100] grid place-items-center overflow-y-auto bg-[#070914]/75 p-4" role="dialog" aria-modal="true" aria-labelledby="photo-editor-title">
      <div className="hard-card my-6 w-full max-w-3xl rounded-[2rem] p-5 sm:p-7">
        <div className="flex items-center justify-between gap-4">
          <div><h2 id="photo-editor-title" className="font-display text-2xl font-black">Edit profile photo</h2><p className="mt-1 text-sm muted">Crop and adjust the image before upload.</p></div>
          <button type="button" onClick={onCancel} className="btn-outline icon-button grid" aria-label="Close photo editor"><X size={20} /></button>
        </div>
        <div className="mt-5 grid gap-6 md:grid-cols-[360px_1fr]">
          <canvas ref={canvasRef} className="aspect-square w-full max-w-[360px] rounded-2xl border-2 border-[#17192d] bg-[#f4f6ff]" aria-label="Edited profile photo preview" />
          <div className="grid content-start gap-3">
            {controls.map(([key, label, min, max, step]) => <label key={key} className="grid gap-1 text-xs font-black"><span className="flex justify-between"><span>{label}</span><span className="muted">{settings[key]}</span></span><input type="range" min={min} max={max} step={step} value={settings[key]} onChange={(event) => update(key, event.target.value)} /></label>)}
            <div className="mt-2 grid grid-cols-2 gap-3">
              <button type="button" onClick={rotate} className="btn-outline rounded-xl px-3 py-2 text-sm font-black">Rotate 90°</button>
              <button type="button" onClick={() => setSettings(defaults)} className="btn-outline flex items-center justify-center gap-2 rounded-xl px-3 py-2 text-sm font-black"><RotateCcw size={16} /> Reset</button>
            </div>
          </div>
        </div>
        <div className="mt-6 flex justify-end gap-3"><button type="button" onClick={onCancel} className="btn-outline rounded-xl px-5 py-3 font-black">Cancel</button><button type="button" onClick={save} disabled={!imageReady} className="btn-lime rounded-xl px-6 py-3 font-black disabled:opacity-50">Save photo</button></div>
      </div>
    </div>
  );
}
