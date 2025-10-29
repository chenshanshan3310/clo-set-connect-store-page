import { configureStore } from '@reduxjs/toolkit';
import filterReducer, {
  togglePricingOption,
  setSearchKeyword,
  resetFilters,
  setSortBy,
  setPriceRange,
  fetchAllContents
} from './filterSlice';

// 模拟 window.location
const mockLocation = {
  search: '',
  pathname: '/test'
};

Object.defineProperty(window, 'location', {
  value: mockLocation,
  writable: true
});

// 模拟 URLSearchParams
global.URLSearchParams = class URLSearchParams {
  constructor(init) {
    this.params = new Map();
    if (typeof init === 'string') {
      init.split('&').forEach(param => {
        const [key, value] = param.split('=');
        if (key) {
          this.params.set(key, value || '');
        }
      });
    }
  }

  get(name) {
    return this.params.get(name);
  }

  set(name, value) {
    this.params.set(name, value);
  }

  delete(name) {
    this.params.delete(name);
  }

  toString() {
    return Array.from(this.params.entries())
      .map(([key, value]) => `${key}=${value}`)
      .join('&');
  }
};

describe('filterSlice', () => {
  let store;

  beforeEach(() => {
    store = configureStore({
      reducer: {
        filters: filterReducer
      }
    });
    mockLocation.search = '';
  });

  describe('initial state', () => {
    it('should return initial state', () => {
      expect(store.getState().filters).toEqual({
        pricingOptions: {
          Paid: false,
          Free: false,
          'View Only': false
        },
        searchKeyword: '',
        allContents: [],
        filteredContents: [],
        sortBy: 'Item Name',
        priceRange: {
          min: 0,
          max: 999
        },
        loading: false,
        error: null
      });
    });
  });

  describe('reducers', () => {
    it('should handle togglePricingOption', () => {
      store.dispatch(togglePricingOption('Paid'));
      const state = store.getState().filters;
      expect(state.pricingOptions.Paid).toBe(true);
    });

    it('should handle setSearchKeyword', () => {
      store.dispatch(setSearchKeyword('test'));
      const state = store.getState().filters;
      expect(state.searchKeyword).toBe('test');
    });

    it('should handle resetFilters', () => {
      store.dispatch(resetFilters());
      const state = store.getState().filters;
      expect(state.pricingOptions).toEqual({
        Paid: false,
        Free: false,
        'View Only': false
      });
      expect(state.searchKeyword).toBe('');
      expect(state.sortBy).toBe('Item Name');
      expect(state.priceRange).toEqual({ min: 0, max: 999 });
      expect(mockLocation.search).toBe('');
    });

    it('should handle setSortBy', () => {
      store.dispatch(setSortBy('Higher Price'));
      const state = store.getState().filters;
      expect(state.sortBy).toBe('Higher Price');
    });

    it('should handle setPriceRange', () => {
      store.dispatch(setPriceRange({ min: 100, max: 500 }));
      const state = store.getState().filters;
      expect(state.priceRange).toEqual({ min: 100, max: 500 });
    });
  });

  describe('async actions', () => {
    it('should handle fetchAllContents.pending', () => {
      store.dispatch(fetchAllContents.pending());
      const state = store.getState().filters;
      expect(state.loading).toBe(true);
      expect(state.error).toBe(null);
    });

    it('should handle fetchAllContents.fulfilled', () => {
      const mockData = [
        { id: 1, title: 'Test 1', pricingOption: 0, price: 100 },
        { id: 2, title: 'Test 2', pricingOption: 1, price: 0 }
      ];
      store.dispatch(fetchAllContents.fulfilled(mockData));
      const state = store.getState().filters;
      expect(state.loading).toBe(false);
      expect(state.allContents).toEqual(mockData);
      expect(state.filteredContents).toEqual(mockData);
    });

    it('should handle fetchAllContents.rejected', () => {
      const error = new Error('Test error');
      store.dispatch(fetchAllContents.rejected(error));
      const state = store.getState().filters;
      expect(state.loading).toBe(false);
      expect(state.error).toBe('Test error');
    });
  });

  describe('filtering logic', () => {
    const mockContents = [
      { id: 1, title: 'Test 1', creator: 'Creator 1', pricingOption: 0, price: 100 },
      { id: 2, title: 'Test 2', creator: 'Creator 2', pricingOption: 1, price: 0 },
      { id: 3, title: 'Another Test', creator: 'Creator 1', pricingOption: 0, price: 200 }
    ];

    it('should filter by pricing options', () => {
      store.dispatch(togglePricingOption('Paid'));
      store.dispatch(fetchAllContents.fulfilled(mockContents));
      const state = store.getState().filters;
      expect(state.filteredContents).toHaveLength(2);
    });

    it('should filter by search keyword', () => {
      store.dispatch(setSearchKeyword('test'));
      store.dispatch(fetchAllContents.fulfilled(mockContents));
      const state = store.getState().filters;
      expect(state.filteredContents).toHaveLength(3);
    });

    it('should sort by price', () => {
      store.dispatch(setSortBy('Higher Price'));
      store.dispatch(fetchAllContents.fulfilled(mockContents));
      const state = store.getState().filters;
      expect(state.filteredContents[0].price).toBe(200);
    });

    it('should apply price range filter', () => {
      store.dispatch(setPriceRange({ min: 150, max: 250 }));
      store.dispatch(fetchAllContents.fulfilled(mockContents));
      const state = store.getState().filters;
      expect(state.filteredContents).toHaveLength(3);
    });
  });
});
