import { useDispatch, useSelector } from 'react-redux';
import { setSearchKeyword } from '../../redux/slices/filterSlice';
import './SearchBar.css';

const SearchBar = () => {
  const dispatch = useDispatch();
  const { searchKeyword } = useSelector(state => state.filters);
  
  const handleSearch = (e) => {
    dispatch(setSearchKeyword(e.target.value));
  };
  
  return (
    <div className="search-bar">
      <input
        type="text"
        placeholder="Find the Items you're looking for "
        value={searchKeyword}
        onChange={handleSearch}
      />
    </div>
  );
};

export default SearchBar;