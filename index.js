// Existing welcome slideshow code
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

// Existing gallery carousel code
const imagePaths = [
    "/Images/IndexGallery/bedroom.jpg",
    "/Images/IndexGallery/fireplace.jpg",
    "/Images/IndexGallery/front-of-house-3.jpg",
    "/Images/IndexGallery/garden-view.jpg",
    "/Images/IndexGallery/inside-of-house.jpg",
    "/Images/IndexGallery/front-oh-house-2.jpg",
    "/Images/IndexGallery/patio.jpg",
    "/Images/IndexGallery/putt-putt.jpg"
];

// Debug Supabase loading
console.log('Checking for Supabase library at:', new Date().toISOString());
if (typeof window.supabase !== 'undefined') {
    console.log('Supabase library loaded:', window.supabase);
    try {
        supabaseClient = window.supabase.createClient(supabaseUrl, supabaseKey);
        console.log('Supabase client initialized successfully');
    } catch (error) {
        console.error('Failed to initialize Supabase client:', error);
    }
} else {
    console.error('Supabase library not loaded. Ensure the CDN script is included and loads correctly.');
    console.log('Global window object keys:', Object.keys(window).filter(key => key.toLowerCase().includes('supabase')));
    console.log('Checking for script load issues. Verify CDN URL: https://unpkg.com/@supabase/supabase-js@2.44.0/dist/umd/supabase.min.js');
}

// Function to fetch active promotions
async function fetchActivePromotions() {
    if (!supabaseClient) {
        console.warn('Supabase client not initialized. Skipping promotion fetch.');
        return [];
    }
    try {
        const { data, error } = await supabaseClient
            .from('PromotionTable')
            .select('PromoID, PromoName, PromoDescription, PhotoURL, PromoIsActive')
            .eq('PromoIsActive', true);
        if (error) {
            throw error;
        }
        console.log('Fetched promotions:', data);
        return data;
    } catch (error) {
        console.error('Error fetching promotions:', error);
        return [];
    }
}

// Function to generate slideshow HTML
function generateSlideshowHtml(promotions) {
    if (promotions.length === 0) {
        console.log('No promotions fetched, using static slides');
        // Fallback to static slides
        return `
            <a href="/promotions" class="swiper-slide" style="background-image: url('https://images.unsplash.com/photo-1504672281656-e3e7b6d4f0d7?q=80&w=1200')">
                <div class="promo-content">
                    <h2 class="promo-title">Summer Sale!</h2>
                    <p class="promo-description">Up to 50% off on all items. Don't miss out!</p>
                    <span class="promo-link">Click to view details</span>
                </div>
            </a>
            <a href="/promotions" class="swiper-slide" style="background-image: url('https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=1200')">
                <div class="promo-content">
                    <h2 class="promo-title">New Arrivals</h2>
                    <p class="promo-description">Explore our latest collection today!</p>
                    <span class="promo-link">Click to view details</span>
                </div>
            </a>
            <a href="/promotions" class="swiper-slide" style="background-image: url('https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=1200')">
                <div class="promo-content">
                    <h2 class="promo-title">Limited Offer</h2>
                    <p class="promo-description">Get 20% off your first purchase!</p>
                    <span class="promo-link">Click to view details</span>
                </div>
            </a>
        `;
    }
    console.log('Generating slideshow with fetched promotions:', promotions);
    return promotions.map(promo => `
        <a href="/promotions" class="swiper-slide" style="background-image: url('${promo.PhotoURL || 'https://via.placeholder.com/1200x400'}')">
            <div class="promo-content">
                <h2 class="promo-title">${promo.PromoName || 'No Title'}</h2>
                <p class="promo-description">${promo.PromoDescription || 'No Description'}</p>
                <span class="promo-link">Click to view details</span>
            </div>
        </a>
    `).join('');
}

window.addEventListener('DOMContentLoaded', () => {
    // Initialize welcome slideshow
    if (bg1 && bg2) {
        setImage(bg1, images[0]);
        bg1.style.opacity = 1;
        setTimeout(crossFade, 6000);
        console.log('Welcome slideshow initialized');
    } else {
        console.error('Welcome slideshow elements (#bg1 or #bg2) not found');
    }

    // Initialize gallery carousel
    const carouselTrack = document.getElementById("carouselTrack");
    if (carouselTrack) {
        [...imagePaths, ...imagePaths].forEach(src => {
            const img = document.createElement("img");
            img.src = src;
            img.alt = "Gallery Image";
            carouselTrack.appendChild(img);
        });
        console.log('Gallery carousel initialized');
    } else {
        console.error('Gallery carousel element (#carouselTrack) not found');
    }
});