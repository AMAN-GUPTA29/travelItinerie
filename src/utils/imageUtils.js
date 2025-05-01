export const getImageForRegion = (region) => {
  const regionImages = {
    'Europe': 'https://images.pexels.com/photos/460672/pexels-photo-460672.jpeg',
    'Asia': 'https://images.pexels.com/photos/248159/pexels-photo-248159.jpeg',
    'Africa': 'https://images.pexels.com/photos/1054218/pexels-photo-1054218.jpeg',
    'North America': 'https://images.pexels.com/photos/161772/las-vegas-nevada-cities-urban-161772.jpeg',
    'South America': 'https://images.pexels.com/photos/1054218/pexels-photo-1054218.jpeg',
    'Oceania': 'https://images.pexels.com/photos/248159/pexels-photo-248159.jpeg',
    'Antarctica': 'https://images.pexels.com/photos/460672/pexels-photo-460672.jpeg',
  };

  return regionImages[region] || 'https://images.pexels.com/photos/460672/pexels-photo-460672.jpeg';
}; 