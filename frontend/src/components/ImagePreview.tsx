import React from 'react'
import { useSelector } from 'react-redux'

interface RootState {
  photos: {
    files: Array<{
      file: File
      preview: string
      name: string
      size: number
    }>
    activePhotoIndex: number
    previewUrl: string | null
    selectedEffect: string | null
  }
}

const ImagePreview: React.FC = () => {
  const { files, activePhotoIndex, previewUrl, selectedEffect } = useSelector(
    (state: RootState) => state.photos
  )

  if (files.length === 0) {
    return (
      <div className="w-full h-96 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center">
        <div className="text-center">
          <div className="mx-auto w-16 h-16 text-gray-400 mb-4">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
          </div>
          <p className="text-gray-500">Upload photos to see preview</p>
        </div>
      </div>
    )
  }

  const activeFile = files[activePhotoIndex]
  const displayUrl = previewUrl || activeFile?.preview

  return (
    <div className="w-full">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        {/* Header */}
        <div className="px-4 py-3 border-b border-gray-200 bg-gray-50">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium text-gray-900">Preview</h3>
              <p className="text-xs text-gray-500 mt-1">
                {activeFile?.name} 
                {selectedEffect && (
                  <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
                    {selectedEffect.replace('_', ' ')}
                  </span>
                )}
              </p>
            </div>
            <div className="text-xs text-gray-500">
              {activePhotoIndex + 1} of {files.length}
            </div>
          </div>
        </div>

        {/* Image preview */}
        <div className="relative">
          <div className="aspect-video bg-gray-100 flex items-center justify-center">
            {displayUrl && (
              <img
                src={displayUrl}
                alt={activeFile?.name || 'Preview'}
                className="max-w-full max-h-full object-contain"
              />
            )}
          </div>
          
          {/* Loading overlay */}
          {!displayUrl && (
            <div className="absolute inset-0 bg-gray-100 flex items-center justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          )}
        </div>

        {/* Navigation */}
        {files.length > 1 && (
          <div className="px-4 py-3 bg-gray-50 border-t border-gray-200">
            <div className="flex items-center justify-center space-x-4">
              <button
                onClick={() => {
                  // This will be handled by PhotoBasket component
                }}
                disabled={activePhotoIndex === 0}
                className="p-2 rounded-md text-gray-400 hover:text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              
              <span className="text-sm text-gray-600">
                Navigate with thumbnails below
              </span>
              
              <button
                onClick={() => {
                  // This will be handled by PhotoBasket component
                }}
                disabled={activePhotoIndex === files.length - 1}
                className="p-2 rounded-md text-gray-400 hover:text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default ImagePreview
