import { configureStore } from '@reduxjs/toolkit';
import filterReducer from './slices/filterSlice';


export const store = configureStore({
  reducer: {
    filters: filterReducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // 忽略这些 action types 的序列化检查
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE']
      }
    })
});