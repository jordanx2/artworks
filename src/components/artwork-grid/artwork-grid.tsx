import { FaTrashAlt } from 'react-icons/fa';
import { ArtworkFormik } from '../../model/artwork.model';
import FlexRow from '../shared/flex-row/flex-row';
import styles from './artwork-grid.module.scss';

interface ArtworkGridProps {
  artworks: ArtworkFormik[];
  onArtworkDelete: (id: string) => void;
}

const ArtworkGrid = ({ artworks, onArtworkDelete }: ArtworkGridProps) => {
  if (artworks.length === 0) return <p>No artworks to display.</p>;

  return (
    <FlexRow className={styles.gridWrapper}>
      <table className={styles.artworkTable}>
        <thead>
          <tr>
            <th>Title</th>
            <th>Artist</th>
            <th>Year</th>
            <th>Classification</th>
            <th>Object ID</th>
            <th>Image</th>
          </tr>
        </thead>
        <tbody>
          {artworks.map((art) => (
            <>
              <tr key={art._id}>
                <td>{art.Title}</td>
                <td>{art.Artist}</td>
                <td>{art.Date}</td>
                <td>{art.Classification}</td>
                <td>{art.ObjectID}</td>
                <td><img src={art.ImageURL} alt="Artwork" className={styles.image}/></td>
                <td><FaTrashAlt onClick={() => onArtworkDelete(art._id)}/></td>
              </tr>
            </> 
          ))}
        </tbody>
      </table>
    </FlexRow>
  );
};

export default ArtworkGrid;
