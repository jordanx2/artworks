import { FaTrashAlt } from 'react-icons/fa';
import { ArtworkFormik } from '../../model/artwork.model';
import FlexRow from '../shared/flex-row/flex-row';
import styles from './artwork-grid.module.scss';
import FlexColumn from '../shared/flex-column/flex-column';

interface ArtworkGridProps {
  artworks: ArtworkFormik[];
  onArtworkDelete: (id: string) => void;
  onExportImages?: () => void;
}

const ArtworkGrid = ({ artworks, onArtworkDelete, onExportImages }: ArtworkGridProps) => {
  if (artworks.length === 0) return <p>No artworks to display.</p>;

  return (
    <FlexColumn>
    { onExportImages && (
      <FlexRow justify='center' align='center'>
        <button onClick={onExportImages}>Export collection images</button>
      </FlexRow>
    )}

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
    </FlexColumn>
  );
};

export default ArtworkGrid;
