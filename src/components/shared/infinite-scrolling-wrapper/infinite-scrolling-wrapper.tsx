import { useEffect } from "react";
import styles from './infinite-scrolling-wrapper.module.scss';

interface InfiniteScrollingProps {
  fetchMore: (increment: number) => void,
  canFetchMore: boolean,
  containerRef: React.RefObject<HTMLDivElement | null>,
  fetchMoreIncrement: number
}

interface GenericViewWrapperProps {
  infiniteScrollingProps: InfiniteScrollingProps;
  children: React.ReactNode;
}

const PADDING_SIZE = 5;

const InfiniteScrollingWrapper: React.FC<GenericViewWrapperProps> = ({ infiniteScrollingProps, children }) => {
  const { fetchMore, canFetchMore, containerRef, fetchMoreIncrement } = infiniteScrollingProps;

  const handleScroll = () => {
    if(containerRef && containerRef.current){
      const container = containerRef.current;
      if(((container.scrollHeight - container.scrollTop) - container.clientHeight) <= PADDING_SIZE){
        if(canFetchMore && fetchMore !== undefined){
          fetchMore(fetchMoreIncrement);
        }
      }
    }
  };

  useEffect(() => {
    if(containerRef && containerRef.current){
      const container = containerRef.current;
      container.addEventListener('scroll', handleScroll);

      return () => {
        container.removeEventListener('scroll', handleScroll);
      };
    } 
  }, [canFetchMore, containerRef]);

  return (
    <div ref={containerRef} className={styles.viewWrapperContainer}>
      {children}
    </div>
  );
};

export default InfiniteScrollingWrapper;