function getQueryParams() {
  const params = new URLSearchParams(window.location.search);
  return {
    room: params.get('room'),
    start: params.get('start'),
    end: params.get('end'),
    nights: parseInt(params.get('nights')),
    rate: parseInt(params.get('rate'))
  };
}

const { room, start, end, nights, rate } = getQueryParams();

if (room && start && end && !isNaN(nights) && !isNaN(rate)) {
  document.getElementById('room-name').textContent = room;
  document.getElementById('start-date').textContent = start;
  document.getElementById('end-date').textContent = end;
  document.getElementById('nights').textContent = nights;
  document.getElementById('rate').textContent = rate;
  document.getElementById('total').textContent = rate * nights;
} else {
  alert("Missing or invalid booking data.");
}
