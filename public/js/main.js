// public/js/main.js
document.addEventListener('DOMContentLoaded', () => {
  // Citizen Login/Register Logic
  const loginForm = document.getElementById('loginForm');
  const registerForm = document.getElementById('registerForm');
  const adminLoginForm = document.getElementById('adminLoginForm');
  
  const showRegisterBtn = document.getElementById('showRegisterBtn');
  const registerPopup = document.getElementById('registerPopup');
  const closePopupBtn = document.getElementById('closePopupBtn');

  if (showRegisterBtn) {
    showRegisterBtn.addEventListener('click', () => {
      registerPopup.style.display = 'flex';
    });
  }

  if (closePopupBtn) {
    closePopupBtn.addEventListener('click', () => {
      registerPopup.style.display = 'none';
    });
  }
  
  // Handle forms with Fetch API
  const handleFormSubmit = async (form, url, errorElementId) => {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const formData = new FormData(form);
      const data = Object.fromEntries(formData.entries());
      const errorElement = document.getElementById(errorElementId);

      try {
        const response = await fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
        });

        const result = await response.json();
        
        if (response.ok) {
          window.location.href = result.redirectUrl;
        } else {
          errorElement.textContent = result.message || 'An error occurred.';
          // Reset reCAPTCHA if it exists
          if (typeof grecaptcha !== 'undefined') {
            grecaptcha.reset();
          }
        }
      } catch (err) {
        errorElement.textContent = 'Failed to connect to the server.';
      }
    });
  };

  if (loginForm) {
    handleFormSubmit(loginForm, '/api/auth/login/citizen', 'loginError');
  }
  if (registerForm) {
    handleFormSubmit(registerForm, '/api/auth/register', 'registerError');
  }
  if (adminLoginForm) {
    handleFormSubmit(adminLoginForm, '/api/auth/login/admin', 'adminLoginError');
  }
});