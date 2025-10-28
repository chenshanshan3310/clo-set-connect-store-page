import { useEffect, useRef, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import ContentItem from '../ContentItem/ContentItem';
import { fetchAllContents } from '../../redux/slices/filterSlice';
import './ContentList.css';

const ContentList = () => {
  const dispatch = useDispatch();
  const { filteredContents, hasMore, loading } = useSelector(state => state.filters);
  const observer = useRef();
  const observerRef = useRef();
  const scrollPositionRef = useRef(0);
  const prevContentsLengthRef = useRef(0);
  const hasInitialized = useRef(false);
  const isScrollLoad = useRef(false);

  useEffect(() => {
   if (!hasInitialized.current) {
      hasInitialized.current = true;
      dispatch(fetchAllContents());
    }
  }, [dispatch]);

  const saveScrollPosition = useCallback(() => {
    scrollPositionRef.current = window.scrollY;
  }, []);

  const restoreScrollPosition = useCallback(() => {
    window.scrollTo(0, scrollPositionRef.current);
  }, []);

  useEffect(() => {
    const currentLength = filteredContents.length;
    const prevLength = prevContentsLengthRef.current;
    if (currentLength > prevLength && isScrollLoad.current) {
      requestAnimationFrame(() => {
        restoreScrollPosition();
      });
      isScrollLoad.current = false;
    }

    prevContentsLengthRef.current = currentLength;
  }, [filteredContents.length, restoreScrollPosition]);

  const renderContent = useCallback(() => {
    return filteredContents.map((item, index) => (
      <ContentItem key={`${item.id}-${index}`} item={item} />
    ));
  }, [filteredContents]);

  const loadMore = useCallback(() => {
    if (!loading) {
      isScrollLoad.current = true;
      saveScrollPosition();
      dispatch(fetchAllContents())
        .unwrap()
        .catch(error => {
          console.error('Failed to fetch contents:', error);
        });
    }
  }, [loading, dispatch, saveScrollPosition]);

  useEffect(() => {
    const options = {
      root: null,
      rootMargin: '100px',
      threshold: 0.1
    };

    observer.current = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        loadMore();
      }
    }, options);

    if (observerRef.current) {
      observer.current.observe(observerRef.current);
    }

    return () => {
      if (observer.current) {
        observer.current.disconnect();
      }
    };
  }, [loadMore]);
  
  if (filteredContents && filteredContents.length === 0) {
    return <div className="no-results">No contents found</div>;
  }
  
  return (
    <div className="content-grid">
       {renderContent()}
      <div 
        ref={observerRef} 
        className="scroll-trigger"
        style={{ height: '20px' }}
      />
      {hasMore && <div className="loading-more">Loading more...</div>}
    </div>
  );
};

export default ContentList;