import { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { setSelectedEffect, updatePreview } from '../store/photoSlice'
import { RootState } from '../store/store'

interface Effect {
  id: string
  name: string
  description: string
  icon: React.ReactNode
}

const effects: Effect[] = [
  {
    id: 'vintage',
    name: 'Vintage',
    description: 'Warm sepia tone with reduced saturation',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
      </svg>
    )
  },
  {
    id: 'black_white',
    name: 'Black & White',
    description: 'Classic monochrome conversion',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-6.219-8.56" />
      </svg>
    )
  },
  {
    id: 'cinematic',
    name: 'Cinematic',
    description: 'High contrast with moody tones',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
      </svg>
    )
  },
  {
    id: 'lomo',
    name: 'Lomo',
    description: 'Saturated colors with dark vignette',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
      </svg>
    )
  },
  {
    id: 'warm',
    name: 'Warm',
    description: 'Enhanced reds for cozy feeling',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" />
      </svg>
    )
  },
  {
    id: 'cool',
    name: 'Cool',
    description: 'Enhanced blues for crisp look',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zM7 3H5a2 2 0 00-2 2v12a4 4 0 004 4h2a2 2 0 002-2V5a2 2 0 00-2-2z" />
      </svg>
    )
  },
  {
    id: 'sharp',
    name: 'Sharp',
    description: 'Enhanced edge definition',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    )
  },
  {
    id: 'soft',
    name: 'Soft',
    description: 'Gentle blur for dreamy effect',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
      </svg>
    )
  },
  {
    id: 'analog_kodak',
    name: 'Kodak Film',
    description: 'Classic warm film stock with grain',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    )
  },
  {
    id: 'analog_fuji',
    name: 'Fuji Film',
    description: 'Cool tones with enhanced greens',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    )
  },
  {
    id: 'analog_polaroid',
    name: 'Polaroid',
    description: 'Instant film with warm cast',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
      </svg>
    )
  },
  {
    id: 'analog_expired',
    name: 'Expired Film',
    description: 'Degraded film with color shifts',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    )
  },
  {
    id: 'analog_cross_process',
    name: 'Cross Process',
    description: 'Inverted color processing effect',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
      </svg>
    )
  },
  {
    id: 'analog_light_leak',
    name: 'Light Leak',
    description: 'Film exposure with orange glow',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.879 16.121A3 3 0 1012.015 11L11 14H9c0 .768.293 1.536.879 2.121z" />
      </svg>
    )
  }
]

const EffectGallery = () => {
  const dispatch = useDispatch()
  const { files, activePhotoIndex, selectedEffect } = useSelector(
    (state: RootState) => state.photos
  )
  const [previewingEffect, setPreviewingEffect] = useState<string | null>(null)

  const applyEffectPreview = async (effectId: string) => {
    if (files.length === 0) return

    const activeFile = files[activePhotoIndex]
    if (!activeFile) return

    setPreviewingEffect(effectId)

    try {
      const formData = new FormData()
      formData.append('effect', effectId)
      formData.append('files', activeFile.file)

      const response = await fetch(`${import.meta.env.VITE_API_URL}/apply-effect`, {
        method: 'POST',
        body: formData,
      })

      if (response.ok) {
        const blob = await response.blob()
        const previewUrl = URL.createObjectURL(blob)
        
        dispatch(updatePreview(previewUrl))
        dispatch(setSelectedEffect(effectId))
      }
    } catch (error) {
      console.error('Error applying effect preview:', error)
    } finally {
      setPreviewingEffect(null)
    }
  }

  const clearEffect = () => {
    if (files.length === 0) return
    
    const activeFile = files[activePhotoIndex]
    if (activeFile) {
      dispatch(updatePreview(activeFile.preview))
      dispatch(setSelectedEffect(null))
    }
  }

  if (files.length === 0) {
    return (
      <div className="w-full bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Effects Gallery</h3>
        <div className="text-center text-gray-500 py-8">
          <p>Upload photos to apply effects</p>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-medium text-gray-900">Effects Gallery</h3>
        {selectedEffect && (
          <button
            onClick={clearEffect}
            className="text-sm text-gray-600 hover:text-gray-800 transition-colors"
          >
            Clear Effect
          </button>
        )}
      </div>
      
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {effects.map((effect) => (
          <div key={effect.id} className="relative">
            <button
              onClick={() => applyEffectPreview(effect.id)}
              disabled={previewingEffect !== null}
              className={`
                w-full p-4 rounded-lg border-2 transition-all duration-200 text-left
                ${selectedEffect === effect.id
                  ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-200'
                  : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                }
                ${previewingEffect === effect.id ? 'opacity-75' : ''}
                disabled:cursor-not-allowed
              `}
            >
              <div className="flex items-center space-x-3">
                <div className={`
                  ${selectedEffect === effect.id ? 'text-blue-600' : 'text-gray-400'}
                `}>
                  {effect.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-medium text-gray-900 truncate">
                    {effect.name}
                  </h4>
                  <p className="text-xs text-gray-500 mt-1">
                    {effect.description}
                  </p>
                </div>
              </div>
              
              {/* Loading indicator */}
              {previewingEffect === effect.id && (
                <div className="absolute inset-0 bg-white bg-opacity-75 rounded-lg flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
                </div>
              )}
              
              {/* Selected indicator */}
              {selectedEffect === effect.id && (
                <div className="absolute top-2 right-2 w-3 h-3 bg-blue-500 rounded-full border border-white"></div>
              )}
            </button>
          </div>
        ))}
      </div>
      
      <div className="mt-4 text-xs text-gray-500 text-center">
        Click an effect to preview it on the active photo
      </div>
    </div>
  )
}

export default EffectGallery
