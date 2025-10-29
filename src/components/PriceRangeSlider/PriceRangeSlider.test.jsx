import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import PriceRangeSlider from './PriceRangeSlider';
import filterReducer from '../../redux/slices/filterSlice';

const createTestStore = (initialState = {}) => {
  return configureStore({
    reducer: {
      filters: filterReducer
    },
    preloadedState: {
      filters: {
        pricingOptions: {
          Paid: false,
          Free: false,
          'View Only': false
        },
        priceRange: {
          min: 0,
          max: 999
        },
        ...initialState
      }
    }
  });
};

const renderWithProvider = (component, { initialState = {} } = {}) => {
  const store = createTestStore(initialState);
  return render(
    <Provider store={store}>
      {component}
    </Provider>
  );
};

describe('PriceRangeSlider', () => {
  it('renders price values', () => {
    renderWithProvider(<PriceRangeSlider />);
    expect(screen.getByText('$0')).toBeInTheDocument();
    expect(screen.getByText('$999')).toBeInTheDocument();
  });

  it('renders disabled when Paid option is false', () => {
    renderWithProvider(<PriceRangeSlider />);
    
    const minSlider = screen.getByDisplayValue('0');
    const maxSlider = screen.getByDisplayValue('999');
    
    expect(minSlider).toBeDisabled();
    expect(maxSlider).toBeDisabled();
  });
});
