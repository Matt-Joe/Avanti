document.addEventListener('DOMContentLoaded', () => {
    const supabaseUrl = 'https://lommjgzgbhflxglathci.supabase.co';
    const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxvbW1qZ3pnYmhmbHhnbGF0aGNpIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2ODczNjYzOCwiZXhwIjoyMDg0MzEyNjM4fQ.QIk3VYGW_YA6JVcSamGp25Y8fUveKAEC6b41smQoExQ';
    const supabase = window.supabase.createClient(supabaseUrl, supabaseKey);
  
    const form = document.getElementById('login-form');
    const message = document.getElementById('message');
  
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
  
      const email = document.getElementById('email').value.trim();
      const password = document.getElementById('password').value;

      // Validate input fields
      if (!email || !password) {
        message.textContent = 'Please fill in both email and password.';
        return;
      }

      try {
        // Sign in user
        const { data, error } = await supabase.auth.signInWithPassword({ email, password });

        if (error) {
            console.error("Login error:", error);
            message.textContent = `Login failed: ${error.message}`;
            return;
        }

        console.log("User logged in successfully:", data);
        console.log("User token:", data.session.access_token);

        // Get user ID from Supabase
        const userId = data.user.id;

        // Check user role from UserTable
        const { data: userData, error: userError } = await supabase
            .from("UserTable")
            .select("Role")
            .eq("UserEmail", email)
            .single();

        if (userError) {
            console.error("User role check error:", userError);
            message.textContent = "Error checking user role.";
            return;
        }

        if (userData.Role === 'Admin' || userData.Role === 'admin') {
            // Redirect admin to admin dashboard
            console.log("Admin detected, redirecting...");
            window.location.href = "/Admin/roomBooking.html";
        } else {
            // Redirect regular user to user dashboard
            console.log("User detected, redirecting...");
            window.location.href = "/index.html";
        }

      } catch (error) {
        message.textContent = "Login failed: " + error.message;
        console.error("Login error details:", error);
      }
    });

    // Modal functionality
    const modal = document.getElementById('forgot-password-modal');
    const closeModal = document.getElementById('close-modal');
    const forgotLink = document.querySelector('#signup-link a[href="/Login/forgotps.html"]');
    const resetForm = document.getElementById('forgot-password-form');
    const resetMessage = document.getElementById('reset-message');

    // Open modal when "Forgot your password?" is clicked
    forgotLink.addEventListener('click', (e) => {
      e.preventDefault();
      modal.style.display = 'block';
    });

    // Close modal
    closeModal.addEventListener('click', () => {
      modal.style.display = 'none';
      resetMessage.textContent = '';
      resetForm.reset();
    });

    // Handle password reset submission
    resetForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const email = document.getElementById('reset-email').value.trim();

      if (!email) {
        resetMessage.textContent = 'Please enter your email.';
        return;
      }

      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: 'http://127.0.0.1:5500/Login/resetps.html' // Your password reset handler page
      });

      if (error) {
        console.error('Reset error:', error.message);
        resetMessage.textContent = `Error: ${error.message}`;
      } else {
        resetMessage.textContent = 'Check your email for the reset link.';
      }
    });

});