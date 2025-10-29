import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setPriceRange } from '../../redux/slices/filterSlice';
import './PriceRangeSlider.css';

const PriceRangeSlider = () => {
  const dispatch = useDispatch();
  const { pricingOptions, priceRange } = useSelector(state => state.filters);
  const [localRange, setLocalRange] = useState(priceRange);
  const [isDragging, setIsDragging] = useState({ min: false, max: false });

  useEffect(() => {
    setLocalRange(priceRange);
  }, [priceRange]);

  const handleMinChange = (value) => {
    const newMin = Math.min(value, localRange.max - 1);
    setLocalRange(prev => ({ ...prev, min: newMin }));
  };

  const handleMaxChange = (value) => {
    const newMax = Math.max(value, localRange.min + 1);
    setLocalRange(prev => ({ ...prev, max: newMax }));
  };

  const handleMouseUp = () => {
    dispatch(setPriceRange(localRange));
    setIsDragging({ min: false, max: false });
  };

  return (
    <div className="price-range-slider">
      <div className="price-values">
        <span>${localRange.min}</span>
        <span>${localRange.max}</span>
      </div>
      <div className="slider-container">
        <input
          type="range"
          min="0"
          max="999"
          value={localRange.min}
          onChange={(e) => handleMinChange(Number(e.target.value))}
          onMouseDown={() => setIsDragging(prev => ({ ...prev, min: true }))}
          onMouseUp={handleMouseUp}
          onKeyUp={handleMouseUp}
          className="slider slider-min"
          disabled={!pricingOptions.Paid}
        />
        <input
          type="range"
          min="0"
          max="999"
          value={localRange.max}
          onChange={(e) => handleMaxChange(Number(e.target.value))}
          onMouseDown={() => setIsDragging(prev => ({ ...prev, max: true }))}
          onMouseUp={handleMouseUp}
          onKeyUp={handleMouseUp}
          className="slider slider-max"
          disabled={!pricingOptions.Paid}
        />
        <div 
          className="slider-track-background"
        />
        <div 
          className={`slider-track ${!pricingOptions.Paid ? 'disabled' : ''}`}
          style={{
            left: `${(localRange.min / 999) * 100}%`,
            right: `${100 - (localRange.max / 999) * 100}%`
          }}
        />
      </div>
    </div>
  );
};

export default PriceRangeSlider;
