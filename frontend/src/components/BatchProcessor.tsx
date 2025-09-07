import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import JSZip from 'jszip'

interface RootState {
  photos: {
    files: Array<{
      file: File
      preview: string
      name: string
      size: number
    }>
    selectedEffect: string | null
    isProcessing: boolean
  }
}

const BatchProcessor: React.FC = () => {
  const { files, selectedEffect } = useSelector((state: RootState) => state.photos)
  const [isProcessing, setIsProcessing] = useState(false)
  const [processedCount, setProcessedCount] = useState(0)

  const applyToAll = async () => {
    if (!selectedEffect || files.length === 0) return

    setIsProcessing(true)
    setProcessedCount(0)

    try {
      const formData = new FormData()
      formData.append('effect', selectedEffect)
      
      // Add all files to the form data
      files.forEach(fileData => {
        formData.append('files', fileData.file)
      })

      const response = await fetch(`${import.meta.env.VITE_API_URL}/apply-effect`, {
        method: 'POST',
        body: formData,
      })

      if (response.ok) {
        const blob = await response.blob()
        
        if (files.length === 1) {
          // Single file - download directly
          const url = window.URL.createObjectURL(blob)
          const a = document.createElement('a')
          a.href = url
          a.download = `processed_${files[0].name}`
          document.body.appendChild(a)
          a.click()
          document.body.removeChild(a)
          window.URL.revokeObjectURL(url)
        } else {
          // Multiple files - should be a ZIP
          const url = window.URL.createObjectURL(blob)
          const a = document.createElement('a')
          a.href = url
          a.download = 'lensify_processed_images.zip'
          document.body.appendChild(a)
          a.click()
          document.body.removeChild(a)
          window.URL.revokeObjectURL(url)
        }
        
        setProcessedCount(files.length)
      } else {
        throw new Error('Failed to process images')
      }
    } catch (error) {
      console.error('Error processing images:', error)
      alert('Error processing images. Please try again.')
    } finally {
      setIsProcessing(false)
      setTimeout(() => setProcessedCount(0), 3000) // Reset after 3 seconds
    }
  }

  const downloadSingle = async () => {
    if (files.length !== 1 || !selectedEffect) return

    setIsProcessing(true)

    try {
      const formData = new FormData()
      formData.append('effect', selectedEffect)
      formData.append('files', files[0].file)

      const response = await fetch(`${import.meta.env.VITE_API_URL}/apply-effect`, {
        method: 'POST',
        body: formData,
      })

      if (response.ok) {
        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `processed_${files[0].name}`
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
        window.URL.revokeObjectURL(url)
      }
    } catch (error) {
      console.error('Error downloading image:', error)
      alert('Error downloading image. Please try again.')
    } finally {
      setIsProcessing(false)
    }
  }

  if (files.length === 0) {
    return null
  }

  return (
    <div className="w-full bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h3 className="text-lg font-medium text-gray-900 mb-4">Process & Download</h3>
      
      {/* Processing status */}
      {isProcessing && (
        <div className="mb-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <div className="flex items-center space-x-3">
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
            <div>
              <p className="text-sm font-medium text-blue-900">
                Processing {files.length} {files.length === 1 ? 'image' : 'images'}...
              </p>
              <p className="text-xs text-blue-700">
                This may take a few moments
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Success message */}
      {processedCount > 0 && !isProcessing && (
        <div className="mb-4 p-4 bg-green-50 rounded-lg border border-green-200">
          <div className="flex items-center space-x-3">
            <div className="text-green-600">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-medium text-green-900">
                Successfully processed {processedCount} {processedCount === 1 ? 'image' : 'images'}!
              </p>
              <p className="text-xs text-green-700">
                Your download should start automatically
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="space-y-4">
        {/* Effect info */}
        {selectedEffect ? (
          <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
            <div className="w-4 h-4 bg-blue-500 rounded-full"></div>
            <div>
              <p className="text-sm font-medium text-gray-900">
                Selected Effect: <span className="capitalize">{selectedEffect.replace('_', ' ')}</span>
              </p>
              <p className="text-xs text-gray-600">
                Will be applied to {files.length} {files.length === 1 ? 'image' : 'images'}
              </p>
            </div>
          </div>
        ) : (
          <div className="flex items-center space-x-3 p-3 bg-amber-50 rounded-lg border border-amber-200">
            <div className="text-amber-600">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.982 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <p className="text-sm text-amber-800">
              Select an effect from the gallery above to enable processing
            </p>
          </div>
        )}

        {/* Action buttons */}
        <div className="flex flex-col sm:flex-row gap-3">
          {files.length === 1 ? (
            <button
              onClick={downloadSingle}
              disabled={!selectedEffect || isProcessing}
              className={`
                flex-1 inline-flex items-center justify-center px-6 py-3 rounded-lg text-sm font-medium transition-colors
                ${selectedEffect && !isProcessing
                  ? 'bg-blue-600 hover:bg-blue-700 text-white'
                  : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                }
              `}
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-4-4m4 4l4-4m6 12H6a2 2 0 01-2-2v-7a2 2 0 012-2h4l2 2h4a2 2 0 012 2v7a2 2 0 01-2 2z" />
              </svg>
              Download Processed Image
            </button>
          ) : (
            <>
              <button
                onClick={applyToAll}
                disabled={!selectedEffect || isProcessing}
                className={`
                  flex-1 inline-flex items-center justify-center px-6 py-3 rounded-lg text-sm font-medium transition-colors
                  ${selectedEffect && !isProcessing
                    ? 'bg-blue-600 hover:bg-blue-700 text-white'
                    : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                  }
                `}
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                Apply to All & Download ZIP
              </button>
            </>
          )}
        </div>

        {/* File count info */}
        <div className="text-center">
          <p className="text-xs text-gray-500">
            {files.length} {files.length === 1 ? 'image' : 'images'} ready for processing
            {files.length > 1 && ' • Will be downloaded as a ZIP file'}
          </p>
        </div>
      </div>
    </div>
  )
}

export default BatchProcessor
