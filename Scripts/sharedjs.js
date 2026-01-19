// Initialize Supabase client
const supabaseClient = window.supabase.createClient(
  'https://lommjgzgbhflxglathci.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxvbW1qZ3pnYmhmbHhnbGF0aGNpIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2ODczNjYzOCwiZXhwIjoyMDg0MzEyNjM4fQ.QIk3VYGW_YA6JVcSamGp25Y8fUveKAEC6b41smQoExQ'
);

document.addEventListener('DOMContentLoaded', () => {
  // Logout functionality
  const logoutLink = document.getElementById('logout-link');
  if (logoutLink) {
    logoutLink.addEventListener('click', async (e) => {
      e.preventDefault();
      const { error } = await supabaseClient.auth.signOut();
      if (error) {
        console.error('Logout error:', error.message);
      } else {
        alert('Logged out successfully.');
        window.location.href = '/Login/login.html';
      }
    });
  }

  // Burger menu toggle
  const burgerButton = document.querySelector('.burger-button');
  const burgerDropdown = document.querySelector('.burger-dropdown');

  if (burgerButton && burgerDropdown) {
    console.log('Burger menu elements found, adding event listeners');
    
    burgerButton.addEventListener('click', (e) => {
      console.log('Burger button clicked');
      e.stopPropagation(); // Prevents immediate closing by document click
      burgerDropdown.classList.toggle('show');
    });

    document.addEventListener('click', (e) => {
      console.log('Document clicked');
      if (
        !burgerDropdown.contains(e.target) &&
        !burgerButton.contains(e.target)
      ) {
        burgerDropdown.classList.remove('show');
      }
    });
  } else {
    console.log('Burger menu elements NOT found:', { burgerButton, burgerDropdown });
  }
});
