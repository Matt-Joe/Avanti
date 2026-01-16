// Unique image sets per carousel
const imagePaths1 = [
  "/Images/EatOutImages/food-with-drink.jpg",
  "/Images/EatOutImages/milkshakes.jpg",
  "/Images/EatOutImages/pat-resturant-seats-landscape.jpg",
  "Images/EatOutImages/plate-of-food-in-sun.jpg",
  "Images/EatOutImages/pat-resturant-outside-seating.jpg",
  "Images/EatOutImages/seafood-platter.jpg"
];

const imagePaths2 = [
  "/Images/EatOutImages/fruits-with-seeds.jpg",
  "/Images/EatOutImages/pat-lodge-sign.jpg",
  "/Images/EatOutImages/muslie.jpg",
  "Images/EatOutImages/wine-and-food.jpg"
];

const imagePaths3 = [
  "/Images/EatOutImages/indoor-seating-in-sun.jpg",
  "/Images/EatOutImages/pizza-with-toppings.jpg",
  "/Images/EatOutImages/outdoor-seating.jpg",
  "Images/EatOutImages/romantical-seating.jpg"
];

// Populate Carousel 1
const carouselTrack1 = document.getElementById("carouselTrack1");
[...imagePaths1, ...imagePaths1].forEach(src => {
  const img = document.createElement("img");
  img.src = src;
  img.alt = "Gallery Image 1";
  carouselTrack1.appendChild(img);
});

// Populate Carousel 2
const carouselTrack2 = document.getElementById("carouselTrack2");
[...imagePaths2, ...imagePaths2].forEach(src => {
  const img = document.createElement("img");
  img.src = src;
  img.alt = "Gallery Image 2";
  carouselTrack2.appendChild(img);
});

// Populate Carousel 3
const carouselTrack3 = document.getElementById("carouselTrack3");
[...imagePaths3, ...imagePaths3].forEach(src => {
  const img = document.createElement("img");
  img.src = src;
  img.alt = "Gallery Image 3";
  carouselTrack3.appendChild(img);
});
