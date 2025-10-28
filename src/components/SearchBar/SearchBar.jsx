import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setSearchKeyword } from '../../redux/slices/filterSlice';
import './SearchBar.css';

const SearchBar = () => {
  const dispatch = useDispatch();
  const { searchKeyword } = useSelector(state => state.filters);
  const [inputValue, setInputValue] = useState(searchKeyword);

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };
  
  const handleSearch = (e) => {
    if (e.key === 'Enter') {
      dispatch(setSearchKeyword(e.target.value));
    }
  };

  const handleButtonClick = () => {
    dispatch(setSearchKeyword(inputValue));
  }
  
  return (
    <div className="search-bar">
      <input
        type="text"
        placeholder="Find the Items you're looking for "
        value={inputValue}
        onChange={handleInputChange}
        onKeyDown={handleSearch}
      />
      <span className="search-icon" onClick={handleButtonClick}>
        <svg viewBox="0 0 24 24" color="inherit" size="24" className="search-icon-svg css-g817xy e1ez7he82"><path fillRule="evenodd" clipRule="evenodd" d="M4.2 10.2C4.2 13.5137 6.88629 16.2 10.2 16.2C13.5137 16.2 16.2 13.5137 16.2 10.2C16.2 6.88629 13.5137 4.2 10.2 4.2C6.88629 4.2 4.2 6.88629 4.2 10.2ZM10.2 2C5.67127 2 2 5.67127 2 10.2C2 14.7287 5.67127 18.4 10.2 18.4C14.7287 18.4 18.4 14.7287 18.4 10.2C18.4 5.67127 14.7287 2 10.2 2Z"></path><path d="M16.1213 14L20.8615 18.7401C21.4472 19.3259 21.4472 20.2757 20.8615 20.8614C20.2757 21.4472 19.3259 21.4472 18.7401 20.8614L14 16.1213L16.1213 14Z"></path></svg>
      </span>
    </div>
  );
};

export default SearchBar;