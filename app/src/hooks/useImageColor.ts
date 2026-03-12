import { useState, useEffect } from 'react';

// Extracts dominant color from an image URL using canvas sampling
export function useImageColor(imageUrl: string | null | undefined): string {
  const [color, setColor] = useState<string>('#2563EB');

  useEffect(() => {
    if (!imageUrl) return;

    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = imageUrl;

    img.onload = () => {
      try {
        const canvas = document.createElement('canvas');
        const size   = 80; // sample at small size for speed
        canvas.width  = size;
        canvas.height = size;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        ctx.drawImage(img, 0, 0, size, size);
        const data = ctx.getImageData(0, 0, size, size).data;

        // Sample left-center region (matches where gradient starts)
        let r = 0, g = 0, b = 0, count = 0;
        for (let y = size * 0.3; y < size * 0.8; y += 4) {
          for (let x = 0; x < size * 0.5; x += 4) {
            const idx = (Math.floor(y) * size + Math.floor(x)) * 4;
            r += data[idx];
            g += data[idx + 1];
            b += data[idx + 2];
            count++;
          }
        }
        r = Math.round(r / count);
        g = Math.round(g / count);
        b = Math.round(b / count);

        // Boost saturation: push toward the most dominant channel
        const max = Math.max(r, g, b);
        const boost = 1.6;
        r = Math.min(255, Math.round(r === max ? r * boost : r * 0.6));
        g = Math.min(255, Math.round(g === max ? g * boost : g * 0.6));
        b = Math.min(255, Math.round(b === max ? b * boost : b * 0.6));

        // Ensure minimum brightness so it's visible
        const brightness = (r * 299 + g * 587 + b * 114) / 1000;
        if (brightness < 40) { setColor('#2563EB'); return; }

        setColor(`rgb(${r},${g},${b})`);
      } catch {
        setColor('#2563EB');
      }
    };

    img.onerror = () => setColor('#2563EB');
  }, [imageUrl]);

  return color;
}
