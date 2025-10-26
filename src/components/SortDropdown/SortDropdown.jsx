import { useSelector, useDispatch } from 'react-redux';
import { setSortBy } from '../../redux/slices/filterSlice';
import './SortDropdown.css';

const SortDropdown = () => {
  const dispatch = useDispatch();
  const { sortBy } = useSelector(state => state.filters);

  const handleSortChange = (e) => {
    dispatch(setSortBy(e.target.value));
  };

  return (
    <div className="sort-dropdown">
    <span className="sort-text">Sort By </span>
      <select 
        value={sortBy} 
        onChange={handleSortChange}
        className="sort-select"
      >
        <option value="Item Name">Item Name</option>
        <option value="Higher Price">Higher Price</option>
        <option value="Lower Price">Lower Price</option>
      </select>
    </div>
  );
};

export default SortDropdown;
