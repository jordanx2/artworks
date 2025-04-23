
import { toast } from 'react-toastify';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';

export const useImageExporter = () => {
  const handleSingleImageDownload = (url: string) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = url;

    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;

      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      ctx.drawImage(img, 0, 0);
      canvas.toBlob((blob) => {
        if (!blob) return;
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = url.split('/').pop()?.split('?')[0] || 'image.png';
        link.click();
        URL.revokeObjectURL(link.href);
      }, 'image/png');
    };

    img.onerror = () => {
      toast.error(`Failed to load image from ${url}`);
    };
  };

  const convertImageToBlob = (url: string, index: number, folder: JSZip) => {
    return new Promise<void>((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.src = url;

      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;

        const ctx = canvas.getContext('2d');
        if (!ctx) return reject();

        ctx.drawImage(img, 0, 0);
        canvas.toBlob((blob) => {
          if (!blob) return reject();

          const filename = url.split('/').pop()?.split('?')[0] || `image-${index + 1}.png`;
          folder?.file(filename, blob);
          resolve();
        }, 'image/png');
      };

      img.onerror = () => {
        toast.error(`Failed to load image from ${url}`);
        resolve();
      };
    });
  };

  const handleMultipleImageDownload = async (urls: string[]) => {
    const zip = new JSZip();
    const folder = zip.folder('exported-images');

    const imagePromises = urls.map((url, index) =>
      convertImageToBlob(url, index, folder!)
    );

    await Promise.all(imagePromises);

    zip.generateAsync({ type: 'blob' }).then((blob) => {
      saveAs(blob, 'artwork-images.zip');
    });
  };

  const downloadImages = async (selectedUrls: string[], onComplete: () => void) => {
    if (selectedUrls.length === 0) {
      toast.warning('Please select at least one image to download.');
      return;
    }

    if (selectedUrls.length === 1) {
      handleSingleImageDownload(selectedUrls[0]);
    } else {
      await handleMultipleImageDownload(selectedUrls);
    }

    toast.success(`Successfully downloaded ${selectedUrls.length} image(s).`);
    onComplete();
  };

  return {
    downloadImages
  };
};
