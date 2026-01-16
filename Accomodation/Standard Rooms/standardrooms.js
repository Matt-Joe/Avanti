document.addEventListener('DOMContentLoaded', () => {
  const bg1 = document.getElementById('bg1');
  const bg2 = document.getElementById('bg2');

  const images = [
    '/Images/Standard Rooms/fireplace1.jpg',
    '/Images/Standard Rooms/pool1.jpg',
    '/Images/Standard Rooms/patio1.jpg',
    '/Images/Standard Rooms/kitchen2.jpg'
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
