import { useSelector, useDispatch } from 'react-redux'
import { setActivePhoto, clearPhotos } from '../store/photoSlice'
import { RootState } from '../store/store'

const PhotoBasket = () => {
  const dispatch = useDispatch()
  const { files, activePhotoIndex } = useSelector((state: RootState) => state.photos)

  const handleThumbnailClick = (index: number) => {
    dispatch(setActivePhoto(index))
  }

  const handleClearAll = () => {
    if (window.confirm('Are you sure you want to remove all photos?')) {
      dispatch(clearPhotos())
    }
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  if (files.length === 0) {
    return null
  }

  return (
    <div className="w-full bg-white rounded-lg shadow-sm border border-gray-200 p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium text-gray-900">
          Photo Basket ({files.length} {files.length === 1 ? 'image' : 'images'})
        </h3>
        <button
          onClick={handleClearAll}
          className="text-sm text-red-600 hover:text-red-800 transition-colors"
        >
          Clear All
        </button>
      </div>
      
      <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 gap-3">
        {files.map((fileData, index) => (
          <div key={index} className="relative group">
            <div
              className={`
                relative cursor-pointer rounded-lg overflow-hidden border-2 transition-all duration-200
                ${index === activePhotoIndex 
                  ? 'border-blue-500 ring-2 ring-blue-200' 
                  : 'border-gray-200 hover:border-gray-300'
                }
              `}
              onClick={() => handleThumbnailClick(index)}
            >
              <div className="aspect-square">
                <img
                  src={fileData.preview}
                  alt={fileData.name}
                  className="w-full h-full object-cover"
                />
              </div>
              
              {/* Active indicator */}
              {index === activePhotoIndex && (
                <div className="absolute top-1 right-1 w-3 h-3 bg-blue-500 rounded-full border border-white"></div>
              )}
            </div>
            
            {/* Tooltip on hover */}
            <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 hidden group-hover:block z-10">
              <div className="bg-black text-white text-xs rounded px-2 py-1 whitespace-nowrap">
                <div className="font-medium">{fileData.name}</div>
                <div className="text-gray-300">{formatFileSize(fileData.size)}</div>
              </div>
              <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-black"></div>
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-3 text-xs text-gray-500 text-center">
        Click on a thumbnail to preview that image
      </div>
    </div>
  )
}

export default PhotoBasket
