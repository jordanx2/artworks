import { toast } from 'react-toastify';
import { createArtwork, deleteArtwork, searchArtworks, updateArtwork } from '../../api/artworks-api/artwork.api';
import { ArtworkFormik } from '../../model/artwork.model';
import FlexColumn from '../shared/flex-column/flex-column';
import styles from './interactive-button-panel.module.scss'
import { RefObject, useState } from 'react';
import { FormikProps } from 'formik';
import { defaultArtwork } from '../../model/artwork.const';
import { useArtworkNavigation } from '../../context/artwork-navigation-context';

interface InteractiveButtonPanelProps {
  formikRef: RefObject<FormikProps<ArtworkFormik> | null>;
  onViewToggleClicked: () => void;
  toggleView: boolean;
  toggleLoginScreen: () => void;
  isLoginScreenOpen: boolean;
  isUserLoggedIn: boolean;
  logoutUser: () => void;
  toggleViewCollections: () => void;
  addToCollection: () => void;
}

const InteractiveButtonPanel = ({
  formikRef,
  onViewToggleClicked,
  toggleView,
  toggleLoginScreen,
  isLoginScreenOpen,
  isUserLoggedIn,
  logoutUser,
  toggleViewCollections,
  addToCollection
} :InteractiveButtonPanelProps) => {
  const [searchResults, setSearchResults] = useState<ArtworkFormik[]>([]);

  const showCardViewIfGrid = () => {
    if(toggleView) {
      onViewToggleClicked()
    }
  }; 

  const { 
    setCurrentArtwork, 
    setArtworks,
    onLast,
    setProjectedArtworks,
    setIsUserSearching,
    isUserSearching,
    artworks,
    onDeleteCallback,
    isUserInserting
  } = useArtworkNavigation();

  const setArtworkSearchResults = (results: ArtworkFormik[]) => {
    setSearchResults(results);
    setProjectedArtworks(results);
    setIsUserSearching(prev => !prev);
  };

  const checkFormikErrors = async () => {
    const errors = await formikRef.current?.validateForm();

    if ((errors && Object.keys(errors).length > 0)) {
      toast.error('Please fix the validation errors before submitting.');
      return true;
    }

    return false;
  }

  const onInsert = async () => {
    if(!isUserInserting.current) {
      setSearchResults([]);
      toast.info('Insert your data');
      setCurrentArtwork(defaultArtwork);
      isUserInserting.current = true;

      showCardViewIfGrid();

      return;
    }

    if(await checkFormikErrors() || !formikRef.current?.values) {
      return;
    }

    const values = formikRef.current.values;
    const response = await createArtwork(values);

    if(response) {
      setArtworks(prev => {
        const newData = [
          ...prev,
          response
        ];

        setProjectedArtworks(newData);

        return newData;
      });

      toast.success('Successfully created artwork!');
      onLast();
    }
  };

  const onDelete = async () => {
    const artId = formikRef.current?.values._id;

    if(!formikRef.current?.values || !artId || isUserSearching) {
      return;
    }

    const response = await deleteArtwork(artId);

    if(response.message) {
      onDeleteCallback(artId);
      toast.success(`Artwork successfully deleted: ${artId}`);
    }
  };

  const onUpdate = async () => {
    const currentFormik = formikRef.current?.values;

    if(!currentFormik || isUserSearching || isUserInserting.current) {
      return;
    }

    if(await checkFormikErrors()) {
      return;
    }

    const response = await updateArtwork(currentFormik);

    if(response) {
      setArtworks(prev => [
        ...prev.filter(art => art._id !== currentFormik._id),
        response
        ]
      );
      setProjectedArtworks(prev => [
        ...prev.filter(art => art._id !== currentFormik._id),
        response
        ]
      );
      toast.success(`Artwork successfully updated: ${response._id}`);
    }
  };

  const onSearch = async () => {
    if(!isUserSearching) {
      setIsUserSearching(prev => !prev);
      toast.info('Enter search criteria');
      setCurrentArtwork(defaultArtwork);

      showCardViewIfGrid();

      return;
    }

    const formikValues = formikRef.current?.values;

    if(!formikValues) {
      return;
    }

    const response = await searchArtworks(formikValues);

    if(response.length > 0) {
      setArtworkSearchResults(response);
      toast.success(`Number of search results: ${response.length}`);
    } else {
      toast.info('No results found for search');
    }
  };

  const exitSearchView = () => {
    setProjectedArtworks(artworks);
    setCurrentArtwork(artworks[0]);
    setSearchResults([]);
    setIsUserSearching(false);
  };

  const resolveLoginActionButton = () => {
    const defaultAction = {
      text: 'Sign Up / Login',
      action: () => {
        toggleLoginScreen();
        exitSearchView();
      }
    }

    if(isUserLoggedIn) {
      return {
        text: 'Log out',
        action: logoutUser
      };
    }

    if(isLoginScreenOpen) {
      defaultAction.text = 'Return to main';
      return defaultAction;
    }
    
    return defaultAction;
  };

  return (
    <FlexColumn className={styles.panelContainer} align='start'>
      { !isLoginScreenOpen && (
        <>
          <button onClick={onInsert}>Insert</button>
          <button  onClick={onUpdate}>Update</button>
          <button onClick={onDelete}>Delete</button>
          <button  onClick={onSearch}>Search</button>
          <button  onClick={() => {
            exitSearchView();
            onViewToggleClicked();
          }}>{ !toggleView ? 'Enter Grid View' : 'Enter Page View' }</button>
        </>
      ) }
      { searchResults.length > 0 && (
        <button onClick={exitSearchView}>Exit Search Results View</button>  
      ) }
      <button onClick={() => {
        resolveLoginActionButton().action();
      }
      }>{ resolveLoginActionButton().text }</button>
      { isUserLoggedIn && (
        <>
          <button onClick={addToCollection}>Add to Collection</button>  
          <button onClick={toggleViewCollections}>View Collection</button>  
        </>
      ) }
      <button onClick={() => window.open('http://localhost:3001/about', '_blank')}>About this Page</button>
    </FlexColumn>
  );
};

export default InteractiveButtonPanel;