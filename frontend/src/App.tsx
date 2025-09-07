import ImageUploader from './components/ImageUploader'
import PhotoBasket from './components/PhotoBasket'
import ImagePreview from './components/ImagePreview'
import EffectGallery from './components/EffectGallery'
import BatchProcessor from './components/BatchProcessor'

function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Lensify</h1>
                <p className="text-xs text-gray-500">Instant Photo Effects</p>
              </div>
            </div>
            
            <div className="hidden sm:flex items-center space-x-4 text-sm text-gray-600">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>Batch Processing Ready</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          {/* Upload Section */}
          <section>
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                Transform Your Photos Instantly
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Upload multiple photos, apply stunning effects, and download them all at once. 
                Perfect for social media, blogs, and professional use.
              </p>
            </div>
            <ImageUploader />
          </section>

          {/* Photo Basket */}
          <PhotoBasket />

          {/* Main Editing Interface */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Column - Preview */}
            <div className="space-y-6">
              <ImagePreview />
            </div>

            {/* Right Column - Effects and Processing */}
            <div className="space-y-6">
              <EffectGallery />
              <BatchProcessor />
            </div>
          </div>

          {/* Features Section */}
          <section className="mt-16 py-12 bg-white rounded-xl shadow-sm border border-gray-200">
            <div className="px-8">
              <h3 className="text-2xl font-bold text-gray-900 text-center mb-8">
                Why Choose Lensify?
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="text-center">
                  <div className="mx-auto w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                    <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 12l2 2 4-4" />
                    </svg>
                  </div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-2">Batch Processing</h4>
                  <p className="text-gray-600 text-sm">
                    Apply effects to multiple photos simultaneously and download them as a ZIP file.
                  </p>
                </div>
                
                <div className="text-center">
                  <div className="mx-auto w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                    <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-2">Instant Preview</h4>
                  <p className="text-gray-600 text-sm">
                    See effects applied in real-time before processing your entire batch.
                  </p>
                </div>
                
                <div className="text-center">
                  <div className="mx-auto w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                    <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4" />
                    </svg>
                  </div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-2">14 Premium Effects</h4>
                  <p className="text-gray-600 text-sm">
                    Professional-quality filters including Vintage, Cinematic, Analog Film stocks, and more.
                  </p>
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center text-gray-500 text-sm">
            <p>© 2025 Lensify. Made with ❤️ for photographers and creators.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default App
