
  const images = [
    'Images/IndexWelcomeDivImages/bag-on-bed.jpg',
    'Images/IndexWelcomeDivImages/front-of-house.jpg',
    'Images/IndexWelcomeDivImages/golf-corse.jpg',
    'Images/IndexWelcomeDivImages/solar-pannels.jpg',
    'Images/IndexWelcomeDivImages/wineglasses.jpg'
  ];

  let index = 0;
  let showingBg1 = true;

  const bg1 = document.getElementById('bg1');
  const bg2 = document.getElementById('bg2');

  function setImage(el, img) {
    el.style.backgroundImage = `url(${img})`;
  }

  function crossFade() {
    const nextImage = images[index];
    const visible = showingBg1 ? bg2 : bg1;
    const hidden = showingBg1 ? bg1 : bg2;

    setImage(visible, nextImage);
    visible.style.opacity = 1;
    hidden.style.opacity = 0;

    showingBg1 = !showingBg1;
    index = (index + 1) % images.length;

    setTimeout(crossFade, 6000); // 5s visible + 1s fade
  }

  window.addEventListener('DOMContentLoaded', () => {
    setImage(bg1, images[0]);
    bg1.style.opacity = 1;
    setTimeout(crossFade, 6000);
  });


    const imagePaths = [
    "/Images/IndexGallery/bedroom.jpg",
    "/Images/IndexGallery/fireplace.jpg",
    "/Images/IndexGallery/front-of-house-3.jpg",
    "/Images/IndexGallery/garden-view.jpg",
    "/Images/IndexGallery/inside-of-house.jpg",
    "/Images/IndexGallery/front-oh-house-2.jpg",
    "/Images/IndexGallery/patio.jpg",
    "/Images/IndexGallery/putt-putt.jpg"
    // Add more if needed
  ];
  const carouselTrack = document.getElementById("carouselTrack");

  // Add the images twice for seamless scrolling
  [...imagePaths, ...imagePaths].forEach(src => {
    const img = document.createElement("img");
    img.src = src;
    img.alt = "Gallery Image";
    carouselTrack.appendChild(img);
  });
