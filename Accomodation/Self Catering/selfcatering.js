document.addEventListener('DOMContentLoaded', () => {
  const bg1 = document.getElementById('bg1');
  const bg2 = document.getElementById('bg2');

  const images = [
    '/Images/Rooms/Flat 1/flat 1 kitchen.jpg',
    '/Images/Rooms/Flat 1/flat 1 bedroom.jpg',
    '/Images/Rooms/Flat 1/flat 1 bathroom.jpg',
    '/Images/Rooms/Flat 3/flat 3 chairs.jpg'
  ];

  let currentIndex = 0;
  let showingBg1 = true;

  // Set initial images
  bg1.style.backgroundImage = `url('${images[0]}')`;
  bg2.style.backgroundImage = `url('${images[1]}')`;
  bg1.style.opacity = '1';
  bg2.style.opacity = '0';

  setInterval(() => {
    currentIndex = (currentIndex + 1) % images.length;
    const nextIndex = (currentIndex + 1) % images.length;

    if (showingBg1) {
      bg2.style.backgroundImage = `url('${images[nextIndex]}')`;
      bg2.style.opacity = '1';
      bg1.style.opacity = '0';
    } else {
      bg1.style.backgroundImage = `url('${images[nextIndex]}')`;
      bg1.style.opacity = '1';
      bg2.style.opacity = '0';
    }

    showingBg1 = !showingBg1;
  }, 5000);
});
