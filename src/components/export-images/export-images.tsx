import { useState } from 'react';
import { Modal, Button } from 'react-bootstrap';
import styles from './export-images.module.scss';
import { ArtworkFormik } from '../../model/artwork.model';
import { useImageExporter } from './use-export-images';
interface ExportImagesProps {
  onClose: () => void;
  artworks: ArtworkFormik[];
}

const ExportImages = ({ onClose, artworks }: ExportImagesProps) => {
  const [selected, setSelected] = useState<Set<string>>(new Set());

  const { downloadImages } = useImageExporter();

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
        <Button 
          variant="primary" 
          onClick={() => downloadImages(Array.from(selected), onClose)} 
          disabled={selected.size == 0}> 
            { selected.size == 0 ? 'Select images to download': `Download Selected (${selected.size})` }
          </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ExportImages;
