document.addEventListener('DOMContentLoaded', () => {
    const supabase = window.supabase.createClient(
        'https://lommjgzgbhflxglathci.supabase.co',
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxvbW1qZ3pnYmhmbHhnbGF0aGNpIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2ODczNjYzOCwiZXhwIjoyMDg0MzEyNjM4fQ.QIk3VYGW_YA6JVcSamGp25Y8fUveKAEC6b41smQoExQ'
    );
    console.log(supabase);

    const form = document.getElementById('signup-form');
    const message = document.getElementById('message');

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const email = document.getElementById('email').value.trim();
        const firstName = document.getElementById('first-name').value.trim();
        const lastName = document.getElementById('last-name').value.trim();
        const phoneNumber = document.getElementById('phone-number').value.trim();
        const password = document.getElementById('password').value;
        const confirm = document.getElementById('confirm-password').value;

        // Validate passwords match
        if (password !== confirm) {
            message.textContent = 'Passwords do not match.';
            return;
        }

        // Password validation
        if (password.length < 8) {
            message.textContent = "Password must be at least 8 characters long.";
            return;
        }

        if (!password.match(/[A-Z]/) || !password.match(/[a-z]/) || !password.match(/[0-9]/) || !password.match(/[^A-Za-z0-9]/)) {
            message.textContent = "Password must contain uppercase, lowercase, number, and special character.";
            return;
        }

        // Phone number validation and cleaning
        const cleanedPhone = phoneNumber.replace(/\D/g, ''); // Remove non-digit characters

        if (cleanedPhone.length !== 10 || !/^\d+$/.test(cleanedPhone)) {
            message.textContent = "Phone number must be exactly 10 digits and contain numbers only.";
            return;
        }

        // Check if email already exists
        const { data: emailExists, error: emailError } = await supabase
            .from('UserTable')
            .select('*')
            .eq('UserEmail', email)
            .limit(1);

        if (emailExists && emailExists.length > 0) {
            message.textContent = 'Email already exists.';
            return;
        }

        // Check if phone number already exists
        const { data: phoneExists, error: phoneError } = await supabase
            .from('UserTable')
            .select('*')
            .eq('UserPhonenumber', cleanedPhone)
            .limit(1);

        if (phoneExists && phoneExists.length > 0) {
            message.textContent = 'Phone number already exists.';
            return;
        }

        // Determine role based on email (example logic)
        const role = email.endsWith('@admin.com') ? 'Admin' : 'User';

        // 1) Sign up with Supabase Auth
        const { data: signUpData, error: signupError } = await supabase.auth.signUp({
            email, password,
            options: {
                data: {
                    first_name: firstName,
                    last_name: lastName,
                    phone_number: cleanedPhone,
                    role: role
                }
            }
        });
        console.log('signUpData →', signUpData, 'signupError →', signupError);

        if (signupError) {
            message.textContent = `Signup error: ${signupError.message}`;
            return;
        }

        // Make sure data.user exists
        const user = signUpData?.user;
        if (!user || !user.id) {
            console.error('No user returned from signUp:', signUpData);
            message.textContent = 'Unexpected error: no user ID.';
            return;
        }

        // 2) Insert into UserTable
        try {
            const { data: insertData, error: dbError } = await supabase
                .from('UserTable')
                .insert([{
                    UserID: user.id,
                    UserEmail: email,
                    UserFirstname: firstName,
                    UserLastname: lastName,
                    UserPhonenumber: cleanedPhone,
                    Role: role
                }]);

            console.log('insertData →', insertData, 'dbError →', dbError);

            if (dbError) {
                message.textContent = `Database error: ${dbError.message}`;
            } else {
                message.textContent = 'Signup successful! Please check your email for confirmation.';
                setTimeout(() => window.location.href = '../Login/login.html', 2000);
            }
        } catch (err) {
            console.error('Unexpected exception during insert:', err);
            message.textContent = 'An unexpected error occurred.';
        }
    });
});