import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { fetchContents } from "../../services/api";
import { PricingOptionLabels } from "../../enums/pricingOption";

export const fetchAllContents = createAsyncThunk(
  "filters/fetchAllContents",
  async () => {
    return await fetchContents();
  }
);

const getInitialState = () => {
  const params = new URLSearchParams(window.location.search);
  const pricingOptionsParam = params.get("pricingOptions");

  return {
    searchKeyword: params.get("search") || "",
    pricingOptions: pricingOptionsParam
      ? {
          Paid: pricingOptionsParam.includes("Paid"),
          Free: pricingOptionsParam.includes("Free"),
          "View Only": pricingOptionsParam.includes("View Only"),
        }
      : {
          Paid: false,
          Free: false,
          "View Only": false,
        },
  };
};

const initialState = {
  pricingOptions: {
    Paid: false,
    Free: false,
    "View Only": false,
  },
  searchKeyword: "",
  allContents: [],
  filteredContents: [],
  sortBy: 'Item Name',
  priceRange: {
    min: 0,
    max: 999
  },
  loading: false,
  error: null,
  ...getInitialState(),
};

const filterSlice = createSlice({
  name: "filters",
  initialState,
  reducers: {
    togglePricingOption: (state, action) => {
      const option = action.payload;
      state.pricingOptions[option] = !state.pricingOptions[option];
      const activeOptions = Object.entries(state.pricingOptions)
        .filter(([_, value]) => value)
        .map(([key]) => key);

      const params = new URLSearchParams(window.location.search);

      if (activeOptions.length > 0) {
        params.set("pricingOptions", activeOptions.join(","));
      } else {
        params.delete("pricingOptions");
      }

      const newUrl = `${window.location.pathname}${
        params.toString() ? `?${params.toString()}` : ""
      }`;
      window.history.replaceState({}, "", newUrl);
      state = applyFilters(state);
    },
    setSearchKeyword: (state, action) => {
      state.searchKeyword = action.payload;
      const params = new URLSearchParams(window.location.search);
      if (action.payload) {
        params.set("search", action.payload);
      } else {
        params.delete("search");
      }
      const newUrl = `${window.location.pathname}${
        params.toString() ? `?${params.toString()}` : ""
      }`;
      window.history.replaceState({}, "", newUrl);

      state = applyFilters(state);
    },
    resetFilters: (state) => {
      state.pricingOptions = {
        Paid: false,
        Free: false,
        "View Only": false,
      };
      state.searchKeyword = "";
      state = applyFilters(state);
    },
    setSortBy: (state, action) => {
      state.sortBy = action.payload;
      applyFilters(state);
    },
     setPriceRange: (state, action) => {
      state.priceRange = action.payload;
      applyFilters(state);
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllContents.pending, (state) => {
        if (state.loading) return;
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllContents.fulfilled, (state, action) => {
        state.loading = false;
        state.allContents = [...state.allContents, ...action.payload];
        state = applyFilters(state);
      })
      .addCase(fetchAllContents.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

function applyFilters(state) {
  const selectedOptions = Object.keys(state.pricingOptions).filter(
    (option) => state.pricingOptions[option]
  );

  let result = state.allContents;
  if (selectedOptions.length > 0) {
    result = result.filter((item) =>
      selectedOptions.includes(PricingOptionLabels[item.pricingOption])
    );
  }

  if (state.searchKeyword) {
    const keyword = state.searchKeyword.toLowerCase();
    result = result.filter(
      (item) =>
        item.creator.toLowerCase().includes(keyword) ||
        item.title.toLowerCase().includes(keyword)
    );
  }

  if (state.pricingOptions.Paid) {
    result = result.filter(item => {
      const price = item.price || 0;
      return price >= state.priceRange.min && price <= state.priceRange.max;
    });
  }

  switch(state.sortBy) {
    case 'Higher Price':
      result.sort((a, b) => (b.price || 0) - (a.price || 0));
      break;
    case 'Lower Price':
      result.sort((a, b) => (a.price || 0) - (b.price || 0));
      break;
    case 'Item Name':
    default:
      result.sort((a, b) => a.title.localeCompare(b.title));
      break;
  }

  state.filteredContents = result;
  return state;
}

export const { togglePricingOption, setSearchKeyword, resetFilters, setSortBy, setPriceRange } =
  filterSlice.actions;

export default filterSlice.reducer;
