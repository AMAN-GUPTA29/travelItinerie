import DarkModeToggle from './DarkModeToggle';

const Header = () => {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-gray-900/95 backdrop-blur-sm border-b border-gray-800">
      <nav className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <h1 className="text-xl font-bold text-white">Travel Itineraries</h1>
          </div>

          {/* Navigation */}
          <div className="flex items-center space-x-8">
            <a href="/" className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium">Home</a>
            <a href="/itineraries" className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium">Itineraries</a>
            <a href="/about" className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium">About</a>
            <DarkModeToggle />
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;