import { useRef, useState } from 'react';
import { Modal, Button } from 'react-bootstrap';
import styles from './export-images.module.scss';
import { ArtworkFormik } from '../../model/artwork.model';
import { useImageExporter } from './use-export-images';
import InfiniteScrollingWrapper from '../shared/infinite-scrolling-wrapper/infinite-scrolling-wrapper';

const INCREMENT_AMOUNT = 200;

interface ExportImagesProps {
  onClose: () => void;
  artworks: ArtworkFormik[];
}

const ExportImages = ({ onClose, artworks }: ExportImagesProps) => {
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const containerRef = useRef<HTMLDivElement>(null);
  const [projectedExportView, setProjectedExportView] = useState<ArtworkFormik[]>(artworks.slice(0, INCREMENT_AMOUNT));
  const [currentIncrement, setCurrentIncrement] = useState<number>(INCREMENT_AMOUNT);
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
      <Modal.Body className={styles.modalBody}>
      <InfiniteScrollingWrapper 
        infiniteScrollingProps={{
        fetchMore: (increment: number) => setCurrentIncrement((prev) => {
        const nextStartIndex = prev;
        const nextEndIndex = prev + increment;

        setProjectedExportView(viewPrev => {
        const nextBatch = artworks.slice(nextStartIndex, nextEndIndex);

        return [...viewPrev, ...nextBatch];
        });

        return nextEndIndex;
        }),
        canFetchMore: currentIncrement <= artworks.length,
        containerRef: containerRef,
        fetchMoreIncrement: INCREMENT_AMOUNT
        }}
      >
        <div className={styles.imageGrid} ref={containerRef}>
          {projectedExportView
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
        </InfiniteScrollingWrapper>
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
