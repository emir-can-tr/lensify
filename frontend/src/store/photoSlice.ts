import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

interface PhotoFile {
  file: File
  preview: string
}

interface PhotoState {
  files: PhotoFile[]
  activePhotoIndex: number
  selectedEffect: string | null
  isProcessing: boolean
  previewUrl: string | null
}

const initialState: PhotoState = {
  files: [],
  activePhotoIndex: 0,
  selectedEffect: null,
  isProcessing: false,
  previewUrl: null,
}

const photoSlice = createSlice({
  name: 'photos',
  initialState,
  reducers: {
    uploadPhotos: (state, action: PayloadAction<PhotoFile[]>) => {
      state.files = action.payload
      state.activePhotoIndex = 0
      if (action.payload.length > 0) {
        state.previewUrl = action.payload[0].preview
      }
    },
    setActivePhoto: (state, action: PayloadAction<number>) => {
      state.activePhotoIndex = action.payload
      if (state.files[action.payload]) {
        state.previewUrl = state.files[action.payload].preview
      }
    },
    setSelectedEffect: (state, action: PayloadAction<string | null>) => {
      state.selectedEffect = action.payload
    },
    setProcessing: (state, action: PayloadAction<boolean>) => {
      state.isProcessing = action.payload
    },
    updatePreview: (state, action: PayloadAction<string>) => {
      state.previewUrl = action.payload
    },
    clearPhotos: (state) => {
      // Clean up blob URLs
      state.files.forEach(file => {
        if (file.preview) {
          URL.revokeObjectURL(file.preview)
        }
      })
      state.files = []
      state.activePhotoIndex = 0
      state.selectedEffect = null
      state.previewUrl = null
    }
  },
})

export const {
  uploadPhotos,
  setActivePhoto,
  setSelectedEffect,
  setProcessing,
  updatePreview,
  clearPhotos
} = photoSlice.actions

export default photoSlice.reducer
