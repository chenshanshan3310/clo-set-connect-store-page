import { useDispatch, useSelector } from 'react-redux';
import { togglePricingOption } from '../../redux/slices/filterSlice';
import './ContentFilter.css';

const ContentFilter = () => {
  const dispatch = useDispatch();
  const { pricingOptions } = useSelector(state => state.filters);

  const PRICING_OPTIONS = ['Paid', 'Free', 'View Only'];
  
  const handleOptionChange = (option) => {
    dispatch(togglePricingOption(option));
  };
  
  return (
    <div className="pricing-filter">
      <div className='filter-title'>Pricing Options</div>
      <div 
        className="filter-options"
        role="group"
        aria-label="Pricing options"
      >
        {PRICING_OPTIONS.map(option => (
          <label key={option} className="filter-option form-check form-check-inline">
            <input
              className="form-check-input"
              type="checkbox"
              checked={pricingOptions[option]}
              onChange={() => handleOptionChange(option)}
              aria-label={option}
            />
            {option}
          </label>
        ))}
      </div>
    </div>
  );
};

export default ContentFilter;