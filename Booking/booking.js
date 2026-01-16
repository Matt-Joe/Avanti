// Fetch room data from Supabase and their image URLs
async function fetchRoomsFromSupabase() {
  const { data, error } = await supabaseClient
    .from('RoomTable')
    .select('RoomName, RoomDescription, amenities, ratepernight, imagePaths');

  if (error) {
    console.error('Error fetching rooms:', error);
    return [];
  }

  const rooms = [];

  for (const room of data) {
    const images = await getRoomImages(room.imagePaths || []);
    rooms.push({
      name: room.RoomName,
      description: room.RoomDescription,
      amenities: room.amenities,
      rate: room.ratepernight,
      images: images
    });
  }

  return rooms.sort((a, b) =>
    a.name.localeCompare(b.name, undefined, { numeric: true, sensitivity: 'base' })
  );
}

// Generate public URLs for room images from Supabase Storage
async function getRoomImages(imagePaths) {
  const bucket = 'room-images';
  const publicURLs = [];

  for (const path of imagePaths) {
    const { data, error } = await supabaseClient.storage
      .from(bucket)
      .getPublicUrl(path.trim());

    if (error) {
      console.warn(`Error fetching URL for ${path}:`, error.message);
      continue;
    }

    publicURLs.push(data.publicUrl);
  }

  return publicURLs;
}

let rooms = [];

document.addEventListener('DOMContentLoaded', async () => {
  setDateInputMin(); // ✅ Prevent past/today-after-2PM date selection
  rooms = await fetchRoomsFromSupabase();
  displayRooms();
});

// Set minimum date for booking inputs
function setDateInputMin() {
  const now = new Date();
  const hour = now.getHours();

  const minDate = new Date(now);
  if (hour >= 14) {
    minDate.setDate(minDate.getDate() + 1);
  }

  const minDateStr = minDate.toISOString().split('T')[0];

  const startInput = document.getElementById('start-date');
  const endInput = document.getElementById('end-date');

  if (startInput && endInput) {
    startInput.min = minDateStr;
    endInput.min = minDateStr;
  }
}

// Render all rooms dynamically
function displayRooms() {
  const roomsContainer = document.getElementById('rooms');
  roomsContainer.innerHTML = '';

  rooms.forEach((room, index) => {
    const container = document.createElement('div');
    container.className = 'room-container';

    // Left section: Title and image carousel
    const left = document.createElement('div');
    left.className = 'room-left';

    const title = document.createElement('h2');
    title.textContent = room.name;

    let currentImageIndex = 0;

    const imageWrapper = document.createElement('div');
    imageWrapper.className = 'image-slider';

    const img = document.createElement('img');
    img.src = room.images[currentImageIndex];
    img.alt = `${room.name} image`;
    img.className = 'room-image';

    const prevBtn = document.createElement('button');
    prevBtn.textContent = '←';
    prevBtn.className = 'image-arrow';
    prevBtn.onclick = () => {
      currentImageIndex = (currentImageIndex - 1 + room.images.length) % room.images.length;
      img.src = room.images[currentImageIndex];
    };

    const nextBtn = document.createElement('button');
    nextBtn.textContent = '→';
    nextBtn.className = 'image-arrow';
    nextBtn.onclick = () => {
      currentImageIndex = (currentImageIndex + 1) % room.images.length;
      img.src = room.images[currentImageIndex];
    };

    imageWrapper.appendChild(img);

    const arrowContainer = document.createElement('div');
    arrowContainer.className = 'arrow-container';
    arrowContainer.appendChild(prevBtn);
    arrowContainer.appendChild(nextBtn);
    imageWrapper.appendChild(arrowContainer);

    left.appendChild(title);
    left.appendChild(imageWrapper);

    // Right section: Description, amenities, rate, buttons
    const right = document.createElement('div');
    right.className = 'room-right';

    const descHeading = document.createElement('h3');
    descHeading.textContent = 'Room Description';

    const description = document.createElement('p');
    description.textContent = room.description;

    const amenitiesHeading = document.createElement('h3');
    amenitiesHeading.textContent = 'Amenities';

    const amenitiesTable = document.createElement('table');
    amenitiesTable.className = 'amenities-table';

    let row;
    room.amenities.forEach((item, idx) => {
      if (idx % 4 === 0) {
        row = document.createElement('tr');
        amenitiesTable.appendChild(row);
      }
      const cell = document.createElement('td');
      cell.textContent = item;
      row.appendChild(cell);
    });

    const checkBtn = document.createElement('button');
    checkBtn.textContent = 'Check Availability';
    checkBtn.onclick = () => checkAvailability(room.name);

    const bookBtn = document.createElement('button');
    bookBtn.textContent = 'Book Now';
    bookBtn.style.marginLeft = '1rem';
    bookBtn.onclick = () => bookRoom(room.name);

    const result = document.createElement('p');
    result.id = `result-${index}`;
    result.className = 'availability-result hidden';

    right.appendChild(descHeading);
    right.appendChild(description);
    right.appendChild(amenitiesHeading);
    right.appendChild(amenitiesTable);

    const rateHeading = document.createElement('h3');
    rateHeading.textContent = `Rate: R${room.rate} per night`;
    right.appendChild(rateHeading);

    right.appendChild(checkBtn);
    right.appendChild(bookBtn);
    right.appendChild(result);

    container.appendChild(left);
    container.appendChild(right);
    roomsContainer.appendChild(container);
  });
}

// Check if a room is available for the selected date range
async function checkAvailability(roomName) {
  const startInput = document.getElementById('start-date');
  const endInput = document.getElementById('end-date');
  const startDate = startInput.value;
  const endDate = endInput.value;

  if (!startDate || !endDate) {
    alert('Please select both a start and end date.');
    return;
  }

  if (new Date(startDate) < new Date(startInput.min)) {
    alert(`Start date cannot be earlier than ${startInput.min}.`);
    return;
  }

  if (new Date(startDate) > new Date(endDate)) {
    alert('Start date cannot be after end date.');
    return;
  }

  const index = rooms.findIndex(r => r.name === roomName);
  const resultElement = document.getElementById(`result-${index}`);

  try {
    const { data: roomData, error: roomError } = await supabaseClient
      .from('RoomTable')
      .select('RoomID')
      .eq('RoomName', roomName)
      .single();

    if (roomError || !roomData) {
      console.error('Error fetching RoomID:', roomError);
      resultElement.textContent = 'Error fetching room information.';
      return;
    }

    const roomID = roomData.RoomID;

    const { data: bookings, error: bookingError } = await supabaseClient
      .from('BookingTable')
      .select('BookingStartDate, BookingEndDate')
      .eq('RoomID', roomID)
      .or(`and(BookingStartDate.lte.${endDate},BookingEndDate.gte.${startDate})`);

    if (bookingError) {
      console.error('Error checking bookings:', bookingError);
      resultElement.textContent = 'Error checking availability.';
      return;
    }

    resultElement.classList.remove('available', 'not-available', 'hidden');

    if (bookings.length > 0) {
      resultElement.textContent = `${roomName} is NOT available from ${startDate} to ${endDate}.`;
      resultElement.classList.add('not-available');
    } else {
      resultElement.textContent = `${roomName} is available from ${startDate} to ${endDate}.`;
      resultElement.classList.add('available');
    }

  } catch (err) {
    console.error('Unexpected error:', err);
    resultElement.textContent = 'Error checking availability.';
  }
}

// Trigger the booking modal or redirect
async function bookRoom(roomName) {
  const { data: { user } } = await supabaseClient.auth.getUser();

  if (!user) {
    alert('You must be logged in to book a room.');
    window.location.href = '/Login/login.html';
    return;
  }

  const startInput = document.getElementById('start-date');
  const endInput = document.getElementById('end-date');
  const startDate = startInput.value;
  const endDate = endInput.value;

  if (!startDate || !endDate) {
    alert('Please select both a start and end date.');
    return;
  }

  if (new Date(startDate) < new Date(startInput.min)) {
    alert(`Start date cannot be earlier than ${startInput.min}.`);
    return;
  }

  const nights = calculateNights(startDate, endDate);
  if (nights <= 0) {
    alert('End date must be after start date.');
    return;
  }

  const room = rooms.find(r => r.name === roomName);
  if (!room) {
    alert('Room not found.');
    return;
  }

  try {
    const { data: roomData, error: roomError } = await supabaseClient
      .from('RoomTable')
      .select('RoomID')
      .eq('RoomName', roomName)
      .single();

    if (roomError || !roomData) {
      console.error('Error fetching RoomID:', roomError);
      alert('Error verifying room information.');
      return;
    }

    const roomID = roomData.RoomID;

    const { data: bookings, error: bookingError } = await supabaseClient
      .from('BookingTable')
      .select('BookingStartDate, BookingEndDate')
      .eq('RoomID', roomID)
      .or(`and(BookingStartDate.lte.${endDate},BookingEndDate.gte.${startDate})`);

    if (bookingError) {
      console.error('Error checking bookings:', bookingError);
      alert('Error checking availability.');
      return;
    }

    if (bookings.length > 0) {
      alert(`${roomName} is NOT available from ${startDate} to ${endDate}. Please choose different dates.`);
      return;
    }

    const totalCost = nights * room.rate;

    document.getElementById('modal-title').textContent = `Booking: ${roomName}`;
    document.getElementById('modal-dates').textContent = `From ${startDate} to ${endDate}`;
    document.getElementById('modal-nights').textContent = `Number of nights: ${nights}`;
    document.getElementById('modal-total').textContent = `Total cost: R${totalCost}`;
    document.getElementById('booking-modal').style.display = 'flex';

    document.getElementById('proceed-payment').onclick = async () => {
    try {
      const response = await fetch('https://avantiguest-backend.onrender.com/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          roomID: roomID,                 // ✅ required by backend
          roomName: room.name,            // ✅ for display/logs
          start: startDate,
          end: endDate,
          nights: nights,
          rate: room.rate,
          total: totalCost,
          userID: user.id
        }),
      });

      const data = await response.json();

      if (data.url) {
        window.location.href = data.url;
      } else {
        alert('Failed to initiate payment.');
        console.error(data.error || 'Unknown error');
      }
    } catch (err) {
      console.error('Error creating checkout session:', err);
      alert('Payment initiation error.');
    }
    console.log("Proceed button clicked");
  };


  } catch (err) {
    console.error('Unexpected error:', err);
    alert('Something went wrong while checking availability.');
  }
}

function calculateNights(startDate, endDate) {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const diffTime = end - start;
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

function closeModal() {
  document.getElementById('booking-modal').style.display = 'none';
}
