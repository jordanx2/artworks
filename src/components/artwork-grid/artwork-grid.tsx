import { FaTrashAlt } from 'react-icons/fa';
import { ArtworkFormik } from '../../model/artwork.model';
import FlexRow from '../shared/flex-row/flex-row';
import styles from './artwork-grid.module.scss';
import FlexColumn from '../shared/flex-column/flex-column';
import InfiniteScrollingWrapper from '../shared/infinite-scrolling-wrapper/infinite-scrolling-wrapper';
import { useRef, useState } from 'react';

const INCREMENT_AMOUNT = 50;

interface ArtworkGridProps {
  artworks: ArtworkFormik[];
  onArtworkDelete: (id: string) => void;
  onExportImages?: () => void;
}

const ArtworkGrid = ({ artworks, onArtworkDelete, onExportImages }: ArtworkGridProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [projectedGridView, setProjectedGridView] = useState<ArtworkFormik[]>(artworks.slice(0, INCREMENT_AMOUNT));
  const [currentIncrement, setCurrentIncrement] = useState<number>(INCREMENT_AMOUNT);

  if (artworks.length === 0) return <p>No artworks to display.</p>;

  return (
    <InfiniteScrollingWrapper 
      infiniteScrollingProps={{
        fetchMore: (increment: number) => setCurrentIncrement((prev) => {
          const nextStartIndex = prev;
          const nextEndIndex = prev + increment;
          
          setProjectedGridView(viewPrev => {
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
            {projectedGridView.map((art) => (
              <>
                <tr key={art._id}>
                  <td>{art.Title}</td>
                  <td>{art.Artist}</td>
                  <td>{art.Date}</td>
                  <td>{art.Classification}</td>
                  <td>{art.ObjectID}</td>
                  <td> { !art.ImageURL ? (<>Artwork Unavailable</>) : <img src={art.ImageURL} alt="Artwork" className={styles.image}/> } </td>
                  <td><FaTrashAlt onClick={() => onArtworkDelete(art._id)}/></td>
                </tr>
              </> 
            ))}
          </tbody>
        </table>
      </FlexRow>
      </FlexColumn>
    </InfiniteScrollingWrapper>
  );
};

export default ArtworkGrid;
