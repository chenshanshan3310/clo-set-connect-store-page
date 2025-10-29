import { render, screen, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import SortDropdown from './SortDropdown';
import filterReducer from '../../redux/slices/filterSlice';

const createTestStore = (initialState = {}) => {
  return configureStore({
    reducer: {
      filters: filterReducer
    },
    preloadedState: {
      filters: {
        sortBy: 'Item Name',
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

const mockAddEventListener = vi.fn();
const mockRemoveEventListener = vi.fn();

Object.defineProperty(document, 'addEventListener', {
  value: mockAddEventListener
});

Object.defineProperty(document, 'removeEventListener', {
  value: mockRemoveEventListener
});

describe('SortDropdown', () => {
  beforeEach(() => {
    mockAddEventListener.mockClear();
    mockRemoveEventListener.mockClear();
  });

  it('renders sort text', () => {
    renderWithProvider(<SortDropdown />);
    expect(screen.getByText('Sort by')).toBeInTheDocument();
  });

  it('adds and removes event listeners', () => {
    renderWithProvider(<SortDropdown />);
    
    expect(mockAddEventListener).toHaveBeenCalledWith('mousedown', expect.any(Function));
    
    const { unmount } = renderWithProvider(<SortDropdown />);
    unmount();
    
    expect(mockRemoveEventListener).toHaveBeenCalledWith('mousedown', expect.any(Function));
  });
});
