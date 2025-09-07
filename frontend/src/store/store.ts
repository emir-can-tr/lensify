import { configureStore } from '@reduxjs/toolkit'
import photoSlice from './photoSlice'

export const store = configureStore({
  reducer: {
    photos: photoSlice,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['photos/uploadPhotos'],
        ignoredPaths: ['photos.files'],
      },
    }),
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

export default store
