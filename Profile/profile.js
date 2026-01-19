document.addEventListener('DOMContentLoaded', () => {
  // Initialize Supabase client locally
  const supabase = window.supabase.createClient(
    'https://lommjgzgbhflxglathci.supabase.co',
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxvbW1qZ3pnYmhmbHhnbGF0aGNpIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2ODczNjYzOCwiZXhwIjoyMDg0MzEyNjM4fQ.QIk3VYGW_YA6JVcSamGp25Y8fUveKAEC6b41smQoExQ'
  );

  // DOM elements
  const form = document.getElementById('profileForm');
  const inputs = {
    firstName: document.getElementById('firstName'),
    lastName: document.getElementById('lastName'),
    email: document.getElementById('email'),
    phone: document.getElementById('phone'),
  };
  const editBtn = document.getElementById('editBtn');
  const saveBtn = document.getElementById('saveBtn');
  const formMessage = document.getElementById('formMessage');
  const bookingList = document.getElementById('bookingList');

  // Load profile data
  async function loadProfile() {
    const { data: user, error: authError } = await supabase.auth.getUser();
    if (authError || !user?.user) {
      alert("You must be logged in to view your profile.");
      window.location.href = '/Login/login.html';
      return;
    }

    const { data, error } = await supabase
      .from('UserTable')
      .select('*')
      .eq('UserID', user.user.id)
      .single();

    if (error) {
      console.error('Error fetching profile:', error);
      return;
    }

    inputs.firstName.value = data.UserFirstname || '';
    inputs.lastName.value = data.UserLastname || '';
    inputs.email.value = data.UserEmail || '';
    inputs.phone.value = data.UserPhonenumber || '';
  }

  // Save profile updates
  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const { data: user } = await supabase.auth.getUser();
    if (!user?.user) {
      window.location.href = '/Login/login.html';
      return;
    }

    const updates = {
      UserFirstname: inputs.firstName.value.trim(),
      UserLastname: inputs.lastName.value.trim(),
      UserEmail: inputs.email.value.trim(),
      UserPhonenumber: inputs.phone.value.trim()
    };

    const { error } = await supabase
      .from('UserTable')
      .update(updates)
      .eq('UserID', user.user.id);

    if (error) {
      console.error('Error updating profile:', error);
      alert("Failed to save changes.");
    } else {
      formMessage.textContent = 'Profile updated successfully!';
    }

    Object.values(inputs).forEach(input => input.disabled = true);
    editBtn.style.display = 'inline';
    saveBtn.style.display = 'none';
  });

  // Edit button logic
  editBtn.addEventListener('click', () => {
    Object.values(inputs).forEach(input => input.disabled = false);
    editBtn.style.display = 'none';
    saveBtn.style.display = 'inline';
  });

  // Tab switching
  window.showTab = function(event, tabId) {
    document.querySelectorAll('.tab-content').forEach(tab => tab.style.display = 'none');
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    document.getElementById(tabId).style.display = 'block';
    event.target.classList.add('active');
  }

  // Load bookings
  async function loadBookings() {
    const { data: user, error: authError } = await supabase.auth.getUser();
    if (authError || !user?.user) return;

    const { data: bookings, error } = await supabase
      .from('BookingTable')
      .select('*, RoomTable(RoomName)')
      .eq('UserID', user.user.id)
      .order('created_at', { ascending: false });

    bookingList.innerHTML = '';

    if (error || !bookings || bookings.length === 0) {
      bookingList.innerHTML = '<p>No bookings to show.</p>';
      return;
    }

    bookings.forEach(booking => {
      const createdAt = new Date(booking.created_at).toLocaleDateString();
      const start = new Date(booking.BookingStartDate).toLocaleDateString();
      const end = new Date(booking.BookingEndDate).toLocaleDateString();
      const roomName = booking.RoomTable?.RoomName || 'Unknown Room';

      const div = document.createElement('div');
      div.className = 'booking-entry';
      div.style.marginBottom = '1rem';
      div.innerHTML = `
        <h3 style="margin-top:0; margin-bottom:0.5rem; color:#1A2619;">${roomName}</h3>
        <strong>Date booked:</strong> ${createdAt}<br>
        <strong>Booking Period:</strong> ${start} to ${end}<br>
        <strong>Nights booked:</strong> ${booking.BookingTotalNights}<br>
        <strong>Total Price:</strong> R${booking.BookingTotalPrice.toFixed(2)}
        ${booking.iscancelled ? `<p style="color:red; margin-top:0.5rem;"><strong>Booking Cancelled</strong></p>` : ''}
      `;
      bookingList.appendChild(div);
    });
  }

  // Initialize on load
  loadProfile();
  loadBookings();

  // Default tab
  const tabButton = document.querySelector('.tab-btn[onclick*="personal"]');
  const tabContent = document.getElementById('personal');
  if (tabButton && tabContent) {
    tabButton.classList.add('active');
    document.querySelectorAll('.tab-content').forEach(tab => tab.style.display = 'none');
    tabContent.style.display = 'block';
  }

});
