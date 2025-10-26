import { useDispatch } from 'react-redux';
import { resetFilters } from '../../redux/slices/filterSlice';
import './ResetButton.css'

const ResetButton = () => {
  const dispatch = useDispatch();
  
  const handleReset = () => {
    dispatch(resetFilters());
  };
  
  return (
    <div className="reset-button" onClick={handleReset}>
      RESET
    </div>
  );
};

export default ResetButton;