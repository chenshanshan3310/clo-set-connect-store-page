import { useState, useRef, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setSortBy } from '../../redux/slices/filterSlice';
import './SortDropdown.css';

const SortDropdown = () => {
  const dispatch = useDispatch();
  const { sortBy } = useSelector(state => state.filters);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const options = [
    { value: 'Item Name', label: 'Item Name' },
    { value: 'Higher Price', label: 'Higher Price' },
    { value: 'Lower Price', label: 'Lower Price' }
  ];

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (option) => {
    dispatch(setSortBy(option.value));
    setIsOpen(false);
  };

  const selectedLabel = options.find(opt => opt.value === sortBy)?.label;

  return (
    <div className="sort-dropdown" ref={dropdownRef}>
      <span className="sort-text">Sort by</span>
      <div className="custom-select">
        <div 
          className="select-trigger"
          onClick={() => setIsOpen(!isOpen)}
        >
          {selectedLabel}
        </div>
        <div className={`select-options ${isOpen ? 'show' : ''}`}>
          {options.map(option => (
            <div
              key={option.value}
              className={`select-option ${sortBy === option.value ? 'selected' : ''}`}
              onClick={() => handleSelect(option)}
            >
              {option.label}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SortDropdown;