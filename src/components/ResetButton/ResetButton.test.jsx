import { render, screen, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import ResetButton from './ResetButton';
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
        searchKeyword: '',
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

describe('ResetButton', () => {
  it('renders reset button', () => {
    renderWithProvider(<ResetButton />);
    expect(screen.getByText('RESET')).toBeInTheDocument();
  });

  it('applies correct CSS classes', () => {
    renderWithProvider(<ResetButton />);
    const button = screen.getByText('RESET');
    expect(button).toHaveClass('reset-button');
  });

  it('dispatches resetFilters when clicked', () => {
    const store = createTestStore();
    const dispatchSpy = vi.spyOn(store, 'dispatch');
    
    render(
      <Provider store={store}>
        <ResetButton />
      </Provider>
    );
    
    fireEvent.click(screen.getByText('RESET'));
    expect(dispatchSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        type: 'filters/resetFilters'
      })
    );
  });

  it('handles click event', () => {
    renderWithProvider(<ResetButton />);
    const button = screen.getByText('RESET');
    
    fireEvent.click(button);
    expect(button).toBeInTheDocument();
  });

  it('handles mouse enter event', () => {
    renderWithProvider(<ResetButton />);
    const button = screen.getByText('RESET');
    
    fireEvent.mouseEnter(button);
    expect(button).toBeInTheDocument();
  });

  it('handles mouse leave event', () => {
    renderWithProvider(<ResetButton />);
    const button = screen.getByText('RESET');
    
    fireEvent.mouseLeave(button);
    expect(button).toBeInTheDocument();
  });
});
