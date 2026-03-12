import { useState, useEffect } from 'react';

export function useImageColor(imageUrl: string | null | undefined): string {
  const [color, setColor] = useState<string>('#2563EB');

  useEffect(() => {
    if (!imageUrl) return;

    const img      = new Image();
    img.crossOrigin = 'anonymous';
    img.src         = imageUrl;

    img.onload = () => {
      try {
        const canvas  = document.createElement('canvas');
        const size    = 100;
        canvas.width  = size;
        canvas.height = size;
        const ctx     = canvas.getContext('2d');
        if (!ctx) return;

        ctx.drawImage(img, 0, 0, size, size);
        const data = ctx.getImageData(0, 0, size, size).data;

        // Sample a wider middle band
        let r = 0, g = 0, b = 0, count = 0;
        for (let y = 10; y < size - 10; y += 3) {
          for (let x = 10; x < size - 10; x += 3) {
            const idx = (y * size + x) * 4;
            r += data[idx];
            g += data[idx + 1];
            b += data[idx + 2];
            count++;
          }
        }
        r = Math.round(r / count);
        g = Math.round(g / count);
        b = Math.round(b / count);

        // Find dominant channel and boost saturation
        const max = Math.max(r, g, b);
        const min = Math.min(r, g, b);

        if (max - min < 30) {
          // Near-greyscale — fallback to blue
          setColor('#2563EB');
          return;
        }

        // Boost: push dominant channel up, suppress others
        const boost  = 2.0;
        const dampen = 0.4;
        const nr = Math.min(255, Math.round(r === max ? r * boost : r * dampen));
        const ng = Math.min(255, Math.round(g === max ? g * boost : g * dampen));
        const nb = Math.min(255, Math.round(b === max ? b * boost : b * dampen));

        // Min brightness check
        const brightness = (nr * 299 + ng * 587 + nb * 114) / 1000;
        if (brightness < 30) { setColor('#2563EB'); return; }

        setColor(`rgb(${nr},${ng},${nb})`);
      } catch {
        setColor('#2563EB');
      }
    };

    img.onerror = () => setColor('#2563EB');
  }, [imageUrl]);

  return color;
}
