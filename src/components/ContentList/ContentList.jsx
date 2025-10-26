import { useEffect, useRef, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import ContentItem from '../ContentItem/ContentItem';
import './ContentList.css';

const ContentList = () => {
  const dispatch = useDispatch();
  const { filteredContents, hasMore, loading } = useSelector(state => state.filters);
  const observer = useRef();
  
  const lastContentElementRef = useCallback(node => {
    if (loading) return;
    if (observer.current) observer.current.disconnect();
    
    if (node) observer.current.observe(node);
  }, [loading, hasMore, dispatch]);
  
  if (loading) {
    return <div className="loading">Loading contents...</div>;
  }
  
  if (filteredContents.length === 0) {
    return <div className="no-results">No contents found</div>;
  }
  
  return (
    <div className="content-grid">
      {filteredContents.map((item, index) => {
        if (filteredContents.length === index + 1) {
          return <ContentItem ref={lastContentElementRef} key={item.id} item={item} />;
        } else {
          return <ContentItem key={item.id} item={item} />;
        }
      })}
      {hasMore && <div className="loading-more">Loading more...</div>}
    </div>
  );
};

export default ContentList;