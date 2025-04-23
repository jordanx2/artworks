import FlexRow from '../shared/flex-row/flex-row';
import FlexColumn from '../shared/flex-column/flex-column';
import styles from './artwork-form.module.scss';
import { ArtworkFormik } from '../../model/artwork.model';
import BootstrapInputField from '../shared/bootstrap-input-field/bootstrap-input-field';
import { useArtworkNavigation } from '../../context/artwork-navigation-context';

interface ArtworkFormProps {
  artwork: ArtworkFormik;
}

const ArtworkForm = ({ artwork }: ArtworkFormProps) => {
  const isReadonly = useArtworkNavigation().isUserSearching;

  return (
    <div className={styles.formContainer}>
      <form>
        <FlexRow key={artwork._id}>
          <FlexColumn>
            <FlexRow className={styles.formRow}>
              <label htmlFor="Title">Name:</label>
              <BootstrapInputField name="Title" placeholderText="Title" value={artwork.Title} />
            </FlexRow>
            <FlexRow className={styles.formRow}>
              <label htmlFor="_id">Id:</label>
              <BootstrapInputField name="_id" placeholderText="ID" value={artwork._id ?? ''} />
            </FlexRow>
            <FlexRow className={styles.formRow}>
              <label htmlFor="Artist">Author:</label>
              <BootstrapInputField name="Artist" placeholderText="Artist(s)" value={artwork.Artist}  />
            </FlexRow>
            <FlexRow className={styles.formRow}>
              <label htmlFor="Date">Year:</label>
              <BootstrapInputField name="Date" placeholderText="Year" value={artwork.Date} isDisabled={isReadonly}/>
            </FlexRow>
            <FlexRow className={styles.formRow}>
              <label htmlFor="ConstituentID">Constituent ID:</label>
              <BootstrapInputField name="ConstituentID" placeholderText="Constituent ID" value={artwork.ConstituentID?.toString() ?? ''} isDisabled={isReadonly}/>
            </FlexRow>
            <FlexRow className={styles.formRow}>
              <label htmlFor="ArtistBio">Artist Bio:</label>
              <BootstrapInputField name="ArtistBio" placeholderText="Artist Bio" value={artwork.ArtistBio ?? ''} isDisabled={isReadonly}/>
            </FlexRow>
            <FlexRow className={styles.formRow}>
              <label htmlFor="Nationality">Nationality:</label>
              <BootstrapInputField name="Nationality" placeholderText="Nationality" value={artwork.Nationality ?? ''} isDisabled={isReadonly}/>
            </FlexRow>
            <FlexRow className={styles.formRow}>
              <label htmlFor="BeginDate">Begin Date:</label>
              <BootstrapInputField name="BeginDate" placeholderText="Begin Date" value={artwork.BeginDate?.toString() ?? ''} isDisabled={isReadonly}/>
            </FlexRow>
            <FlexRow className={styles.formRow}>
              <label htmlFor="EndDate">End Date:</label>
              <BootstrapInputField name="EndDate" placeholderText="End Date" value={artwork.EndDate?.toString() ?? ''} isDisabled={isReadonly}/>
            </FlexRow>
            <FlexRow className={styles.formRow}>
              <label htmlFor="Gender">Gender:</label>
              <BootstrapInputField name="Gender" placeholderText="Gender" value={artwork.Gender ?? ''} isDisabled={isReadonly}/>
            </FlexRow>
            <FlexRow className={styles.formRow}>
              <label htmlFor="Medium">Medium:</label>
              <BootstrapInputField name="Medium" placeholderText="Medium" value={artwork.Medium ?? ''} isDisabled={isReadonly}/>
            </FlexRow>
            <FlexRow className={styles.formRow}>
              <label htmlFor="Dimensions">Dimensions:</label>
              <BootstrapInputField name="Dimensions" placeholderText="Dimensions" value={artwork.Dimensions ?? ''} isDisabled={isReadonly}/>
            </FlexRow>
          </FlexColumn>

          <FlexColumn>
            <FlexRow className={styles.formRow}>
              <label htmlFor="CreditLine">Credit Line:</label>
              <BootstrapInputField name="CreditLine" placeholderText="Credit Line" value={artwork.CreditLine ?? ''} isDisabled={isReadonly}/>
            </FlexRow>
            <FlexRow className={styles.formRow}>
              <label htmlFor="AccessionNumber">Accession Number:</label>
              <BootstrapInputField name="AccessionNumber" placeholderText="Accession Number" value={artwork.AccessionNumber ?? ''} isDisabled={isReadonly}/>
            </FlexRow>
            <FlexRow className={styles.formRow}>
              <label htmlFor="Classification">Classification:</label>
              <BootstrapInputField name="Classification" placeholderText="Classification" value={artwork.Classification} isDisabled={isReadonly}/>
            </FlexRow>
            <FlexRow className={styles.formRow}>
              <label htmlFor="Department">Department:</label>
              <BootstrapInputField name="Department" placeholderText="Department" value={artwork.Department ?? ''} isDisabled={isReadonly}/>
            </FlexRow>
            <FlexRow className={styles.formRow}>
              <label htmlFor="DateAcquired">Date Acquired:</label>
              <BootstrapInputField name="DateAcquired" placeholderText="Date Acquired" value={artwork.DateAcquired ?? ''} isDisabled={isReadonly}/>
            </FlexRow>
            <FlexRow className={styles.formRow}>
              <label htmlFor="Cataloged">Cataloged:</label>
              <BootstrapInputField name="Cataloged" placeholderText="Cataloged" value={artwork.Cataloged ?? ''} isDisabled={isReadonly}/>
            </FlexRow>
            <FlexRow className={styles.formRow}>
              <label htmlFor="ObjectID">Object ID:</label>
              <BootstrapInputField name="ObjectID" placeholderText="Object ID" value={String(artwork.ObjectID)} isDisabled={isReadonly}/>
            </FlexRow>
            <FlexRow className={styles.formRow}>
              <label htmlFor="URL">URL:</label>
              <BootstrapInputField name="URL" placeholderText="URL" value={artwork.URL} isDisabled={isReadonly}/>
            </FlexRow>
            <FlexRow className={styles.formRow}>
              <label htmlFor="OnView">On View:</label>
              <BootstrapInputField name="OnView" placeholderText="On View" value={artwork.OnView ?? ''} isDisabled={isReadonly}/>
            </FlexRow>
            <FlexRow className={styles.formRow}>
              <label htmlFor="Height (cm)">Height (cm):</label>
              <BootstrapInputField name="Height (cm)" placeholderText="Height (cm)" value={artwork['Height (cm)']?.toString() ?? ''} isDisabled={isReadonly}/>
            </FlexRow>
            <FlexRow className={styles.formRow}>
              <label htmlFor="Width (cm)">Width (cm):</label>
              <BootstrapInputField name="Width (cm)" placeholderText="Width (cm)" value={artwork['Width (cm)']?.toString() ?? ''} isDisabled={isReadonly}/>
            </FlexRow>
          </FlexColumn>
        </FlexRow>

        <FlexRow className={styles.formRow}>
          <label>Image:</label>
          <div className={styles.imageWrapper}>
            <img src={artwork.ImageURL} alt="Artwork" className={styles.artworkImage} />
          </div>
        </FlexRow>
      </form>
    </div>
  );
};

export default ArtworkForm;
