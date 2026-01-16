// Add image navigation functionality
const thumbnails = document.querySelectorAll('.thumbnail');
const dots = document.querySelectorAll('.dot');
const mainImage = document.querySelector('.main-image img');

// Set initial image
mainImage.src = thumbnails[0].querySelector('img').src;

// Thumbnail click event
thumbnails.forEach((thumbnail, index) => {
  thumbnail.addEventListener('click', () => {
    // Remove active class from all thumbnails
    thumbnails.forEach(t => t.classList.remove('active'));
    // Add active class to clicked thumbnail
    thumbnail.classList.add('active');
    // Update main image
    mainImage.src = thumbnail.querySelector('img').src;
    // Update dots
    dots.forEach(d => d.classList.remove('active'));
    dots[index].classList.add('active');
  });
});

// Dot click event
dots.forEach((dot, index) => {
  dot.addEventListener('click', () => {
    // Update dots
    dots.forEach(d => d.classList.remove('active'));
    dot.classList.add('active');
    // Update main image
    mainImage.src = thumbnails[index].querySelector('img').src;
    // Update thumbnails
    thumbnails.forEach(t => t.classList.remove('active'));
    thumbnails[index].classList.add('active');
  });
});

// Navigation button functionality
let currentIndex = 0;
const totalImages = thumbnails.length;

document.querySelector('.nav-button:first-child').addEventListener('click', () => {
  currentIndex = (currentIndex - 1 + totalImages) % totalImages;
  updateGallery();
});

document.querySelector('.nav-button:last-child').addEventListener('click', () => {
  currentIndex = (currentIndex + 1) % totalImages;
  updateGallery();
});

function updateGallery() {
  // Update main image
  mainImage.src = thumbnails[currentIndex].querySelector('img').src;
  // Update thumbnails
  thumbnails.forEach(t => t.classList.remove('active'));
  thumbnails[currentIndex].classList.add('active');
  // Update dots
  dots.forEach(d => d.classList.remove('active'));
  dots[currentIndex].classList.add('active');
}