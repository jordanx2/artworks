import { createContext, Dispatch, RefObject, useContext, useEffect, useRef, useState } from 'react';
import { ArtworkFormik } from '../model/artwork.model';
import { defaultArtwork } from '../model/artwork.const';

interface ArtworkNavigationContextProps {
  artworks: ArtworkFormik[];
  currentArtwork: ArtworkFormik;
  currentIndex: number;
  setCurrentIndex: Dispatch<React.SetStateAction<number>>;
  setArtworks: Dispatch<React.SetStateAction<ArtworkFormik[]>>;
  setCurrentArtwork: Dispatch<React.SetStateAction<ArtworkFormik>>;
  onFirst: () => void;
  onPrev: () => void;
  onNext: () => void;
  onLast: () => void;
  isUserSearching: boolean;
  setIsUserSearching: Dispatch<React.SetStateAction<boolean>>;
  setProjectedArtworks: Dispatch<React.SetStateAction<ArtworkFormik[]>>;
  firstRender: RefObject<boolean>;
  onDeleteCallback: (artId: string) => void;
  isUserInserting: RefObject<boolean>;
}

const ArtworkNavigationContext = createContext<ArtworkNavigationContextProps | undefined>(undefined);

export const useArtworkNavigation = () => {
  const context = useContext(ArtworkNavigationContext);
  if (!context) {
    throw new Error('useArtworkNavigation must be used within an ArtworkNavigationProvider');
  }
  return context;
};

export const ArtworkNavigationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [artworks, setArtworks] = useState<ArtworkFormik[]>([]);
  const [projectedArtworks, setProjectedArtworks]  = useState<ArtworkFormik[]>([]);
  const [currentArtwork, setCurrentArtwork] = useState<ArtworkFormik>(defaultArtwork);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const firstRender = useRef<boolean>(true);
  const [isUserSearching, setIsUserSearching] = useState<boolean>(false);
  const isUserInserting = useRef<boolean>(false);

  useEffect(() => {
    if(projectedArtworks.length > 0) {
      setCurrentIndex(0);
      setCurrentArtwork(projectedArtworks[0]);
    }
  }, [projectedArtworks])

  const onFirst = () => {
    setCurrentIndex(0);
    setCurrentArtwork(projectedArtworks[0]);
  };

  const onPrev = () => {
    setCurrentIndex((prev) => {
      const newIdx = (prev - 1 + projectedArtworks.length) % projectedArtworks.length;
      setCurrentArtwork(projectedArtworks[newIdx]);
      return newIdx;
    });
  };

  const onNext = () => {
    setCurrentIndex((prev) => {
      const newIdx = (prev + 1) % projectedArtworks.length;
      setCurrentArtwork(projectedArtworks[newIdx]);
      return newIdx;
    });
  };

  const onLast = () => {
    const lastIdx = projectedArtworks.length - 1;
    setCurrentIndex(lastIdx);
    setCurrentArtwork(projectedArtworks[lastIdx]);
  };

  const onDeleteCallback = async (artId: string) => {
    setArtworks(prev => prev.filter(art => art._id !== artId));
    setProjectedArtworks(prev => prev.filter(art => art._id !== artId));
    onFirst();
  };
  

  return (
    <ArtworkNavigationContext.Provider
      value={{
        artworks,
        currentArtwork,
        currentIndex,
        setArtworks,
        setCurrentArtwork,
        onFirst,
        onPrev,
        onNext,
        onLast,
        setCurrentIndex,
        setProjectedArtworks,
        firstRender,
        setIsUserSearching,
        isUserSearching,
        onDeleteCallback,
        isUserInserting
      }}
    >
      {children}
    </ArtworkNavigationContext.Provider>
  );
};
