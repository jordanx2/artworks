import { useState } from 'react';
import { Modal, Button } from 'react-bootstrap';
import styles from './export-images.module.scss';
import { ArtworkFormik } from '../../model/artwork.model';
import { toast } from 'react-toastify';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';

interface ExportImagesProps {
  onClose: () => void;
  artworks: ArtworkFormik[];
}

const ExportImages = ({ onClose, artworks }: ExportImagesProps) => {
  const [selected, setSelected] = useState<Set<string>>(new Set());

  const toggleImage = (url: string) => {
    setSelected(prev => {
      const updated = new Set(prev);
      if (updated.has(url)) {
        updated.delete(url);
      } else {
        updated.add(url);
      }
      return updated;
    });
  };

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
        resolve(); // Continue on error
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
  
  const downloadSelected = async () => {
    if (selected.size === 0) {
      toast.warning('Please select at least one image to download.');
      return;
    }
  
    const selectedUrls = Array.from(selected);
  
    if (selectedUrls.length === 1) {
      handleSingleImageDownload(selectedUrls[0]);
    } else {
      await handleMultipleImageDownload(selectedUrls);
    }

    toast.success(`Successfully downloaded ${selectedUrls.length} image(s).`);
    onClose();
  };
  
  

  return (
    <Modal show={true} onHide={onClose} size="xl" centered backdrop="static" className={styles.modal}>
      <Modal.Header>
        <Modal.Title>Select Images to Export</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className={styles.imageGrid}>
          {artworks
          .filter(art => !!art.ImageURL)
          .map(art => (
            <div key={art._id} className={styles.imageCard}>
              <img src={art.ImageURL} alt={art.Title} className={styles.image} />
              <label className={styles.checkboxLabel}>
                <input
                  type="checkbox"
                  checked={art.ImageURL ? selected.has(art.ImageURL) : false}
                  onChange={() => art.ImageURL && toggleImage(art.ImageURL)}
                />
                Select
              </label>
            </div>
          ))}
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onClose}>Cancel</Button>
        <Button variant="primary" onClick={downloadSelected} disabled={selected.size == 0}>Download Selected</Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ExportImages;
