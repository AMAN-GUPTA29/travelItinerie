const HeroSection = () => {
  return (
    <div 
      className="relative h-screen w-full flex items-center justify-center"
      style={{
        backgroundImage: 'linear-gradient(rgba(0, 0, 0, 0.75), rgba(0, 0, 0, 0.85)), url("https://images.unsplash.com/photo-1502920917128-1aa500764cbd?q=80&w=1920")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
    >
      {/* Content */}
      <div className="relative z-10 text-center px-4">
        <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
          Your Journey Begins Here
        </h1>
        <p className="text-xl md:text-2xl text-gray-300 max-w-2xl mx-auto">
          Discover handcrafted itineraries for unforgettable adventures in Thailand's most beautiful destinations
        </p>
      </div>
    </div>
  );
};

export default HeroSection;