import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { fetchContents } from '../../services/api';
import { PricingOptionLabels } from '../../enums/pricingOption';

export const fetchAllContents = createAsyncThunk(
  'filters/fetchAllContents',
  async () => {
    return await fetchContents();
  }
);

const initialState = {
  pricingOptions: {
    Paid: false,
    Free: false,
    'View Only': false
  },
  searchKeyword: '',
  allContents: [],
  filteredContents: [],
  loading: false,
  error: null,
};

const filterSlice = createSlice({
  name: 'filters',
  initialState,
  reducers: {
    togglePricingOption: (state, action) => {
      const option = action.payload;
      state.pricingOptions[option] = !state.pricingOptions[option];
      state = applyFilters(state);
    },
    setSearchKeyword: (state, action) => {
      state.searchKeyword = action.payload;
      state = applyFilters(state);
    },
    resetFilters: (state) => {
      state.pricingOptions = {
        Paid: false,
        Free: false,
        'View Only': false
      };
      state.searchKeyword = '';
      state = applyFilters(state);
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllContents.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllContents.fulfilled, (state, action) => {
        state.loading = false;
        state.allContents = action.payload;
        state = applyFilters(state);
      })
      .addCase(fetchAllContents.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  }
});

function applyFilters(state) {
  const selectedOptions = Object.keys(state.pricingOptions)
    .filter(option => state.pricingOptions[option]);
  
  let result = state.allContents;
  if (selectedOptions.length > 0) {
    result = result.filter(item => selectedOptions.includes(PricingOptionLabels[item.pricingOption]));
  }
  
  if (state.searchKeyword) {
    const keyword = state.searchKeyword.toLowerCase();
    result = result.filter(item => 
      item.creator.toLowerCase().includes(keyword) || 
      item.title.toLowerCase().includes(keyword)
    );
  }
  
  state.filteredContents = result;
  return state;
}

export const { 
  togglePricingOption, 
  setSearchKeyword, 
  resetFilters
} = filterSlice.actions;

export default filterSlice.reducer;