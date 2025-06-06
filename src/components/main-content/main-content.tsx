import InteractiveButtonPanel from '../interactive-button-panel/interactive-button-panel';
import ArtworkForm from '../artwork-form/artwork-form';
import FlexRow from '../shared/flex-row/flex-row';
import { FaAngleDoubleLeft, FaAngleDoubleRight, FaAngleLeft, FaAngleRight } from 'react-icons/fa';
import styles from './main-content.module.scss';
import FlexColumn from '../shared/flex-column/flex-column';
import { useEffect, useMemo, useRef, useState } from 'react';
import { ArtworkFormik } from '../../model/artwork.model';
import {  deleteArtwork, getAllArtworks } from '../../api/artworks-api/artwork.api';
import { toast } from 'react-toastify';
import { Formik, FormikProps } from 'formik';
import { ValidationSchema } from './validation-schema';
import { useArtworkNavigation } from '../../context/artwork-navigation-context';
import ArtworkGrid from '../artwork-grid/artwork-grid';
import LoginForm from '../login-form/login-form';
import { LoginDetailsDomain } from '../login-form/login-form.const';
import { ArtworkView } from './main-content.const';
import { addToUserCollections, getUserCollections, removeFromUserCollections } from '../../api/collections-api/collections-api';
import ExportImages from '../export-images/export-images';
import { useImageExporter } from '../export-images/use-export-images';

const MainContent: React.FC = () => {
  const formikRef = useRef<FormikProps<ArtworkFormik>>(null);
  const [currentUser, setCurrentUser] = useState<LoginDetailsDomain>();
  const [currentView, setCurrentView] = useState<ArtworkView>(ArtworkView.CARD);
  const [userCollections, setUserCollections] = useState<ArtworkFormik[]>([]);
  const [isExportModalOpen, setIsExportModalOpen] = useState<boolean>(false);
  const { downloadImages } = useImageExporter();

  const toggleExportModal = () => setIsExportModalOpen(prev => !prev);

  const {
    setCurrentArtwork,
    currentArtwork,
    setArtworks,
    onFirst,
    onLast,
    onNext,
    onPrev,
    currentIndex,
    isUserSearching,
    setProjectedArtworks,
    firstRender,
    artworks,
    onDeleteCallback,
    isUserInserting,
    setIsUserSearching
  } = useArtworkNavigation();

  useEffect(() => {
    if (firstRender.current) {
      setTimeout(() => {
        toast.info('Data is being loaded please wait...');
      }, 100);

      firstRender.current = false;

      (async () => {
        const data = await getAllArtworks();
        setArtworks(data);
        setProjectedArtworks(data);

        if (data.length > 0) {
          setCurrentArtwork(data[0]);
        }

        toast.success('Data has been loaded successfully!');
      })();
    }
  }, []);

  useEffect(() => {
    isUserInserting.current = false
    setIsUserSearching(false);
  }, [currentIndex, currentView]);

  const onLoginSuccess = async (user: LoginDetailsDomain) => {
    setCurrentUser(user);
    setCurrentView(ArtworkView.CARD);

    const result = await getUserCollections(user.username);
    setUserCollections(result);
  };

  const logoutUser = () => {
    setCurrentUser(undefined);
    setCurrentView(ArtworkView.CARD);
  };

  const addToCollection = async () => {
    if(currentView !== ArtworkView.CARD) return;

    if (!currentUser) {
      toast.error('You must be logged in to add to your collection.');
      return;
    }

    if(!currentArtwork._id || !currentArtwork) {
      toast.error('Artwork must be selected.');
      return;
    }

    const result = await addToUserCollections(currentUser.username, currentArtwork._id);

    if(result) {
      toast.success(result.message);
      setUserCollections((prev) => [...prev, currentArtwork]);
    }
  };

  const deleteArtworkFromCollection = async (id: string) => {
    if (!currentUser) {
      toast.error('You must be logged in to add to your collection.');
      return false;
    }

    const result = await removeFromUserCollections(currentUser.username, id);

    if(result.collections) {
      setUserCollections((prev) => prev.filter((art) => art._id !== id));
      toast.success(result.message);

      return true;
    }

    return false;
  };

  const onGridDelete = async (artId: string) => {
    const response = await deleteArtwork(artId);

    if(response.message) {
      onDeleteCallback(artId);
      toast.success(`Artwork successfully deleted: ${artId}`);

      return true;
    }

    return false;
  };

  const onCollectionImageDownloaded = async () => {
    const validImages = userCollections
      .filter(art => art.ImageURL && art.ImageURL.trim() !== '')
      .map(art => art.ImageURL!);
  
    await downloadImages(validImages, () => undefined);
  };
  
  const initialValues: ArtworkFormik = { ...currentArtwork };
  const validationSchema = useMemo(() => ValidationSchema(isUserSearching), [isUserSearching]);

  return (
    <>
      <h1>Test the REST Microservice Server Implemented using Node.js</h1>
      {currentUser && (
        <p className={styles.loggedInMessage}>
          Logged in as <strong>{currentUser.username}</strong>
        </p>
      )}

      { isExportModalOpen && (
        <ExportImages 
          onClose={toggleExportModal}
          artworks={artworks}
        />
      )}

      <FlexRow justify='center' className={styles.mainContentContainer}>
        <FlexRow className={styles.buttonPanelContainer}>
          <InteractiveButtonPanel
            formikRef={formikRef}
            onViewToggleClicked={() => setCurrentView((prev) => prev === ArtworkView.CARD ? ArtworkView.GRID : ArtworkView.CARD) }
            toggleLoginScreen={() => setCurrentView((prev) => prev === ArtworkView.LOGIN ? ArtworkView.CARD : ArtworkView.LOGIN) }
            toggleView={currentView !== ArtworkView.CARD}
            isLoginScreenOpen={currentView === ArtworkView.LOGIN}
            isUserLoggedIn={!!currentUser}
            logoutUser={logoutUser}
            toggleViewCollections={() => setCurrentView((prev) => prev === ArtworkView.COLLECTIONS ? ArtworkView.CARD : ArtworkView.COLLECTIONS) }
            addToCollection={addToCollection}
            toggleExportView={toggleExportModal}
          />
        </FlexRow>

        {currentView === ArtworkView.LOGIN && (
          <LoginForm onLoginSuccess={onLoginSuccess} />
        )}

        {currentView === ArtworkView.CARD && (
          <FlexColumn align='center'>
            <Formik
              innerRef={formikRef}
              initialValues={initialValues}
              onSubmit={() => undefined}
              validationSchema={validationSchema}
              enableReinitialize
            >
              <ArtworkForm artwork={currentArtwork} />
            </Formik>
            <FlexRow className={styles.buttonContainer}>
              <button onClick={onFirst}><FaAngleDoubleLeft /></button>
              <button onClick={onPrev}><FaAngleLeft /></button>
              <input type="text" value={currentIndex} className={styles.currentIdx} readOnly />
              <button onClick={onNext}><FaAngleRight /></button>
              <button onClick={onLast}><FaAngleDoubleRight /></button>
            </FlexRow>
          </FlexColumn>
        )}

        {currentView === ArtworkView.GRID && (
          <ArtworkGrid 
            artworks={artworks} 
            onArtworkDelete={onGridDelete}
          />
        )}

        {currentView === ArtworkView.COLLECTIONS ? (
          userCollections.length > 0 ? (
            <ArtworkGrid 
              artworks={userCollections} 
              onArtworkDelete={deleteArtworkFromCollection}
              onExportImages={userCollections.length > 0 ? onCollectionImageDownloaded: undefined}
            />
          ) : (
            <p>No collections available.</p>
          )
        ) : null}
      </FlexRow>
    </>
  );
};
export default MainContent;