import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { fetchAllContents } from './redux/slices/filterSlice';
import ContentFilter from './components/ContentFilter/ContentFilter';
import SearchBar from './components/SearchBar/SearchBar';
import ResetButton from './components/ResetButton/ResetButton';
import ContentList from './components/ContentList/ContentList';
import './index.css';

function App() {
  const dispatch = useDispatch();
  
  useEffect(() => {
    dispatch(fetchAllContents());
  }, [dispatch]);
  
  return (
    <div className="app-container">
      <header className="app-header">
        <h1 className="connect-title">Connect</h1>
      </header>
      
      <div className="filters-container">
        <SearchBar />
        <div className="filter-controls">
          <ContentFilter />
          <ResetButton />
        </div>
      </div>
      
      <main className="main-content">
        <ContentList />
      </main>
    </div>
  );
}

export default App;