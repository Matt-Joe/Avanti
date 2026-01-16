document.getElementById('update-password-form').addEventListener('submit', async (e) => {
  e.preventDefault();

  const newPassword = document.getElementById('new-password').value;
  const confirmPassword = document.getElementById('confirm-password').value;
  const messageDiv = document.getElementById('message');

  if (newPassword !== confirmPassword) {
    messageDiv.style.color = 'red';
    messageDiv.textContent = 'Passwords do not match.';
    return;
  }

  const { error } = await supabaseClient.auth.updateUser({
    password: newPassword
  });

  if (error) {
    messageDiv.style.color = 'red';
    messageDiv.textContent = error.message;
  } else {
    messageDiv.style.color = 'green';
    messageDiv.textContent = 'Password updated successfully. You may now log in.';
  }
});
