import ContentFilter from './components/ContentFilter/ContentFilter';
import SearchBar from './components/SearchBar/SearchBar';
import SortDropdown from './components/SortDropdown/SortDropdown';
import PriceRangeSlider from './components/PriceRangeSlider/PriceRangeSlider';
import ResetButton from './components/ResetButton/ResetButton';
import ContentList from './components/ContentList/ContentList';
import './index.css';

function App() {
  
  return (
    <div className="app-container">
      <header className="app-header">
        <h1 className="connect-title">Connect</h1>
      </header>
      
      <div className="filters-container">
        <SearchBar />
        <div className="filter-controls">
          <div className="left-filter">
            <ContentFilter />
            <PriceRangeSlider />
          </div>
          <ResetButton />
        </div>
        <SortDropdown />
        
      </div>
      
      <main className="main-content">
        <ContentList />
      </main>
    </div>
  );
}

export default App;