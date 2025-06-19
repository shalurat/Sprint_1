let isAuthenticated = false;

function showView(viewId) {
  document.getElementById('login-view').classList.add('hidden');
  document.getElementById('register-view').classList.add('hidden');
  document.getElementById('home-view').classList.add('hidden');
  document.getElementById('request-view').classList.add('hidden');
  document.getElementById(viewId + '-view').classList.remove('hidden');

  const navItems = document.getElementById('nav-items');
  navItems.innerHTML = '';
  if (isAuthenticated && viewId === 'home') {
    navItems.innerHTML = `
      <li class="nav-item"><a class="nav-link active" href="#" onclick="showView('home')">Home</a></li>
      <li class="nav-item"><a class="nav-link" href="#">Announcements</a></li>
      <li class="nav-item"><a class="nav-link" href="#">Documents</a></li>
      <li class="nav-item"><a class="nav-link" href="#">Forums</a></li>
      <li class="nav-item"><a class="nav-link" href="#" onclick="showView('request')">Submit Request</a></li>
      <li class="nav-item"><a class="nav-link" href="#" onclick="handleLogout()">Logout</a></li>
    `;
  } else {
    navItems.innerHTML = `
      <li class="nav-item"><a class="nav-link ${viewId === 'login' ? 'active' : ''}" href="#" onclick="showView('login')">Login</a></li>
      <li class="nav-item"><a class="nav-link ${viewId === 'register' ? 'active' : ''}" href="#" onclick="showView('register')">Register</a></li>
    `;
  }
}

function togglePassword(inputId, element) {
  const input = document.getElementById(inputId);
  const icon = element.querySelector('i');
  if (input.type === 'password') {
    input.type = 'text';
    icon.classList.remove('fa-eye-slash');
    icon.classList.add('fa-eye');
  } else {
    input.type = 'password';
    icon.classList.remove('fa-eye');
    icon.classList.add('fa-eye-slash');
  }
}

function handleLogin(event) {
  event.preventDefault();
  // Mock login: set isAuthenticated to true and show home view
  isAuthenticated = true;
  showView('home');
}

function handleRegister(event) {
  event.preventDefault();
  // Mock registration: set isAuthenticated to true and show home view
  isAuthenticated = true;
  showView('home');
}

function handleLogout() {
  isAuthenticated = false;
  showView('login');
}

function handleRequest(event) {
  event.preventDefault();
  
  // jQuery form validation
  const form = $('#request-form');
  if (!form[0].checkValidity()) {
    event.stopPropagation();
    form.addClass('was-validated');
    return;
  }

  // Get form data
  const requestData = {
    type: $('#request-type').val(),
    title: $('#request-title').val(),
    priority: $('#request-priority').val(),
    description: $('#request-description').val(),
    attachment: $('#request-attachment')[0].files[0] ? $('#request-attachment')[0].files[0].name : null
  };

  // Show success message
  alert('Request submitted successfully!');
  
  // Reset form and return to home
  form[0].reset();
  form.removeClass('was-validated');
  showView('home');
}

// Add jQuery form validation
$(document).ready(function() {
  // Login form validation
  $('#login-form').on('submit', function(event) {
    if (!this.checkValidity()) {
      event.preventDefault();
      event.stopPropagation();
    }
    $(this).addClass('was-validated');
  });

  // Registration form validation
  $('#register-form').on('submit', function(event) {
    if (!this.checkValidity()) {
      event.preventDefault();
      event.stopPropagation();
    }
    $(this).addClass('was-validated');
  });

  // Request form validation
  $('#request-form').on('submit', function(event) {
    if (!this.checkValidity()) {
      event.preventDefault();
      event.stopPropagation();
    }
    $(this).addClass('was-validated');
  });

  // Real-time validation for request title
  $('#request-title').on('input', function() {
    if (this.value.length < 5) {
      this.setCustomValidity('Title must be at least 5 characters long');
    } else {
      this.setCustomValidity('');
    }
  });

  // Real-time validation for request description
  $('#request-description').on('input', function() {
    if (this.value.length < 20) {
      this.setCustomValidity('Description must be at least 20 characters long');
    } else {
      this.setCustomValidity('');
    }
  });
});

// Initialize login view
showView('home');