import { useState } from 'react';
import { Modal, Button } from 'react-bootstrap';
import styles from './export-images.module.scss';
import { ArtworkFormik } from '../../model/artwork.model';

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

  const downloadImage = async (url: string) => {
    const res = await fetch(url);
    const blob = await res.blob();
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = url.split('/').pop() || 'image.jpg';
    link.click();
  };

  const downloadSelected = () => {
    selected.forEach(downloadImage);
  };

  return (
    <Modal show={true} onHide={onClose} size="xl" centered backdrop="static" className={styles.modal}>
      <Modal.Header>
        <Modal.Title>Select Images to Export</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className={styles.imageGrid}>
          {artworks.map(art => (
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
        <Button variant="primary" onClick={downloadSelected}>Download Selected</Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ExportImages;
