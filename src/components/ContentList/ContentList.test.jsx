import { vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import ContentList from './ContentList';
import filterReducer from '../../redux/slices/filterSlice';

const createTestStore = (initialState = {}) => {
  return configureStore({
    reducer: {
      filters: filterReducer
    },
    preloadedState: {
      filters: {
        filteredContents: [],
        hasMore: true,
        loading: false,
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

global.IntersectionObserver = class IntersectionObserver {
  constructor(callback) {
    this.callback = callback;
  }

  observe(element) {
    this.callback([{ isIntersecting: true }]);
  }

  unobserve() {}
  disconnect() {}
};

describe('ContentList', () => {
  it('renders no results when filteredContents is empty', () => {
    renderWithProvider(<ContentList />);
    expect(screen.getByText('No contents found')).toBeInTheDocument();
  });

  it('renders content items', () => {
    const mockContents = [
      { id: 1, title: 'Test 1', creator: 'Creator 1' },
      { id: 2, title: 'Test 2', creator: 'Creator 2' }
    ];
    renderWithProvider(<ContentList />, {
      initialState: {
        filteredContents: mockContents,
        hasMore: false,
        loading: false
      }
    });

    expect(screen.getByText('Test 1')).toBeInTheDocument();
    expect(screen.getByText('Test 2')).toBeInTheDocument();
    expect(screen.getByText('Creator 1')).toBeInTheDocument();
    expect(screen.getByText('Creator 2')).toBeInTheDocument();
  });

  it('shows loading indicator when loading', () => {
    renderWithProvider(<ContentList />, {
      initialState: {
        filteredContents: [{ id: 1, title: 'Test 1' }],
        hasMore: true,
        loading: true
      }
    });

    expect(screen.getByText('Loading more...')).toBeInTheDocument();
  });

  it('shows scroll trigger', () => {
    renderWithProvider(<ContentList />, {
      initialState: {
        filteredContents: [{ id: 1, title: 'Test 1' }],
        hasMore: true,
        loading: false
      }
    });

    const trigger = document.querySelector('.scroll-trigger');
    expect(trigger).toBeInTheDocument();
    expect(trigger).toHaveStyle({ height: '20px' });
  });

  it('does not show loading indicator when no more content', () => {
    renderWithProvider(<ContentList />, {
      initialState: {
        filteredContents: [{ id: 1, title: 'Test 1' }],
        hasMore: false,
        loading: false
      }
    });

    expect(screen.queryByText('Loading more...')).not.toBeInTheDocument();
  });

  it('applies correct CSS classes', () => {
    const { container } = renderWithProvider(<ContentList />, {
      initialState: {
        filteredContents: [{ id: 1, title: 'Test 1' }],
        hasMore: true,
        loading: false
      }
    });

    expect(container.firstChild).toHaveClass('content-grid');
    expect(container.querySelector('.scroll-trigger')).toBeInTheDocument();
  });

  it('preserves scroll position when new content loads', async () => {
    const mockScrollY = 100;
    window.scrollY = mockScrollY;

    const { rerender } = renderWithProvider(<ContentList />, {
      initialState: {
        filteredContents: [{ id: 1, title: 'Test 1' }],
        hasMore: true,
        loading: false
      }
    });

    rerender(
      <Provider store={createTestStore({
        filteredContents: [
          { id: 1, title: 'Test 1' },
          { id: 2, title: 'Test 2' }
        ],
        hasMore: true,
        loading: false
      })}>
        <ContentList />
      </Provider>
    );

    await waitFor(() => {
      expect(window.scrollY).toBe(mockScrollY);
    });
  });

  it('handles empty filteredContents', () => {
    renderWithProvider(<ContentList />, {
      initialState: {
        filteredContents: [],
        hasMore: false,
        loading: false
      }
    });

    expect(screen.getByText('No contents found')).toBeInTheDocument();
    expect(screen.queryByText('Loading more...')).not.toBeInTheDocument();
  });
});
