import { toPng, toJpeg } from 'html-to-image';

export const generateImage = async (
  node: HTMLElement, 
  options: { 
    format: 'png' | 'jpeg', 
    scale: number,
    quality?: number
  }
): Promise<string> => {
  const config = {
    quality: options.quality || 0.95,
    pixelRatio: options.scale,
    cacheBust: true,
  };

  try {
    if (options.format === 'jpeg') {
      return await toJpeg(node, config);
    }
    return await toPng(node, config);
  } catch (err) {
    console.warn("Initial image generation failed, retrying with fallback settings...", err);
    
    // Fallback: Filter out link tags (external stylesheets) which often cause CORS issues.
    // The image might lose specific web fonts, but it will successfully generate.
    const fallbackConfig = {
        ...config,
        filter: (child: any) => {
            if (child.tagName === 'LINK') return false;
            return true;
        }
    };

    try {
        if (options.format === 'jpeg') {
        return await toJpeg(node, fallbackConfig);
        }
        return await toPng(node, fallbackConfig);
    } catch (retryErr) {
        console.error("Failed to generate image after retry", retryErr);
        throw retryErr;
    }
  }
};

export const downloadDataUrl = (dataUrl: string, filename: string) => {
  const link = document.createElement('a');
  link.download = filename;
  link.href = dataUrl;
  link.click();
};