export function Footer() {
  return (
    <footer className="bg-white/80 backdrop-blur-sm border-t border-purple-100 py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center space-x-2 mb-4 md:mb-0">
            <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg flex items-center justify-center">
              <img src='./favicon.ico'></img>
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              My Shopping Fairy
            </span>
          </div>
          <div className="text-gray-600 text-sm">
            © 2025 My Shopping Fairy. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
}
