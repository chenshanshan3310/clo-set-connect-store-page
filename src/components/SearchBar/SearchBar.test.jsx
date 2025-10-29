import { render, screen, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import SearchBar from './SearchBar';
import filterReducer from '../../redux/slices/filterSlice';

const createTestStore = (initialState = {}) => {
  return configureStore({
    reducer: {
      filters: filterReducer
    },
    preloadedState: {
      filters: {
        searchKeyword: '',
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

describe('SearchBar', () => {
  it('renders search input', () => {
    renderWithProvider(<SearchBar />);
    expect(screen.getByPlaceholderText('Find the Items you\'re looking for')).toBeInTheDocument();
  });

  it('renders search icon', () => {
    renderWithProvider(<SearchBar />);
    const icon = document.querySelector('.search-icon');
    expect(icon).toBeInTheDocument();
  });
});
