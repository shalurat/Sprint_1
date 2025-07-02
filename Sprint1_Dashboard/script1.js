$(document).ready(function(){

  function loadSection(section) {
    let html = '';

    switch(section) {
      case 'home':
        html = `
          <h2>Dashboard Overview</h2>
          <div class="row g-4 mt-3">
            <div class="col-md-4"><div class="card shadow p-4 bg-white"><h6>Total Projects</h6><h2>12</h2></div></div>
            <div class="col-md-4"><div class="card shadow p-4 bg-white"><h6>Pending Tasks</h6><h2>3</h2></div></div>
            <div class="col-md-4"><div class="card shadow p-4 bg-white"><h6>Notifications</h6><h2>5</h2></div></div>
          </div>`;
        break;

      case 'profile':
  html = `
    <h2>My Profile</h2>
    <div class="card shadow p-4 bg-white">

      <!-- Profile Picture Upload -->
      <div class="text-center mb-3">
        <img id="profilePicPreview" src="free-nature-images.jpg" alt="Profile Picture" class="img-thumbnail rounded-circle" style="width: 120px; height: 120px; object-fit: cover;">
        <input type="file" id="profilePicInput" accept="image/*" class="form-control my-2">
        <button class="btn btn-sm btn-outline-primary" id="uploadPicBtn">Upload Picture</button>
      </div>

      <!-- Personal Information -->
      <h5>Personal Information</h5>
      <div class="row mb-2">
        <div class="col-md-6">
          <label class="form-label">Full Name</label>
          <input type="text" class="form-control" id="profileName" value="XYZ">
        </div>
        <div class="col-md-6">
          <label class="form-label">Email</label>
          <input type="email" class="form-control" id="profileEmail" value="XYZ@example.com">
        </div>
      </div>

      <div class="row mb-2">
        <div class="col-md-6">
          <label class="form-label">Phone</label>
          <input type="text" class="form-control" id="profilePhone" value="+91 9876543210">
        </div>
        <div class="col-md-6">
          <label class="form-label">Department</label>
          <input type="text" class="form-control" id="profileDept" value="Engineering">
        </div>
      </div>

      <button class="btn btn-success" id="saveProfileBtn">Save Changes</button>
    </div>`;
  break;


      case 'tasks':
        html = `
          <h2>Pending Tasks</h2>
          <ul class="list-group">
            <li class="list-group-item">Finish Quarterly Report</li>
            <li class="list-group-item">Team Meeting on Project X</li>
            <li class="list-group-item">Update Personal Profile</li>
          </ul>`;
        $('#taskBadge').text('0').removeClass('bg-warning').addClass('bg-secondary');
        break;

      case 'notifications':
        html = `
          <h2>Notifications</h2>
          <ul class="list-group">
            <li class="list-group-item">New HR Policy Updated</li>
            <li class="list-group-item">Team Outing on Friday!</li>
            <li class="list-group-item">Annual Review Submission Pending</li>
            <li class="list-group-item">Manager Feedback Available</li>
            <li class="list-group-item">Password Change Reminder</li>
          </ul>`;
        $('#notifyBadge').text('0').removeClass('bg-danger').addClass('bg-secondary');
        break;

      case 'settings':
  html = `
    <h2>Settings</h2>
    <div class="card shadow p-4 bg-white">

      <!-- Change Password -->
      <h5 class="mb-2">Change Password</h5>
      <input type="password" id="oldPassword" class="form-control my-1" placeholder="Old Password">
      <input type="password" id="newPassword" class="form-control my-1" placeholder="New Password">
      <input type="password" id="confirmPassword" class="form-control my-1" placeholder="Confirm New Password">
      <button class="btn btn-sm btn-primary my-2" id="changePasswordBtn">Change Password</button>
      <hr>

      <!-- Notification Preferences -->
      <h5 class="mb-2">Notification Preferences</h5>
      <div class="form-check">
        <input class="form-check-input" type="checkbox" id="emailNotify" checked>
        <label class="form-check-label" for="emailNotify">Email Notifications</label>
      </div>
      <div class="form-check">
        <input class="form-check-input" type="checkbox" id="smsNotify">
        <label class="form-check-label" for="smsNotify">SMS Notifications</label>
      </div>
      <button class="btn btn-sm btn-success my-2" id="saveNotifyBtn">Save Preferences</button>
      <hr>

      <!-- Language Options -->
      <h5 class="mb-2">Language Options</h5>
      <select id="languageSelect" class="form-select mb-2">
        <option value="en" selected>English</option>
        <option value="hi">Hindi</option>
        <option value="es">Spanish</option>
      </select>
      <button class="btn btn-sm btn-secondary" id="saveLanguageBtn">Save Language</button>

    </div>`;
  break;


      default:
        html = `<h2>Welcome to your dashboard!</h2>`;
    }

    $('#contentArea').fadeOut(150, function(){
      $(this).html(html).fadeIn(300);
    });
  }
  // Change Password Handler
$(document).on('click', '#changePasswordBtn', function(){
  const oldPass = $('#oldPassword').val();
  const newPass = $('#newPassword').val();
  const confirmPass = $('#confirmPassword').val();

  if(!oldPass || !newPass || !confirmPass) {
    alert('Please fill in all password fields.');
  } else if(newPass !== confirmPass) {
    alert('New passwords do not match.');
  } else {
    alert('Password changed successfully! (Mock)');
    $('#oldPassword, #newPassword, #confirmPassword').val('');
  }
});

// Notification Preferences Save
$(document).on('click', '#saveNotifyBtn', function(){
  const email = $('#emailNotify').is(':checked');
  const sms = $('#smsNotify').is(':checked');
  alert(`Preferences saved!\nEmail: ${email ? 'ON' : 'OFF'}\nSMS: ${sms ? 'ON' : 'OFF'}`);
});

// Language Preference Save
$(document).on('click', '#saveLanguageBtn', function(){
  const lang = $('#languageSelect').val();
  alert(`Language preference saved: ${lang}`);
});

  // Initialize with default home section
  loadSection('home');

  $('.nav-link').click(function(e){
    e.preventDefault();
    $('.nav-link').removeClass('active');
    $(this).addClass('active');

    const section = $(this).data('section');
    loadSection(section);
  });

  // Profile Picture Upload Preview Handler
$(document).on('click', '#uploadPicBtn', function(){
  const input = $('#profilePicInput')[0];

  if (input.files && input.files[0]) {
    const reader = new FileReader();
    reader.onload = function(e) {
      $('#profilePicPreview').attr('src', e.target.result);
      alert('Profile picture updated (Preview only)');
    }
    reader.readAsDataURL(input.files[0]);
  } else {
    alert('Please select an image to upload.');
  }
});


  $(document).on('click', '#saveProfileBtn', function(){
  const profileData = {
    name: $('#profileName').val(),
    email: $('#profileEmail').val(),
    phone: $('#profilePhone').val(),
    dept: $('#profileDept').val()
  };

  console.log('Profile Saved:', profileData);

  // Show Bootstrap Toast
  const toast = new bootstrap.Toast($('#saveToast'));
  toast.show();
});


$(document).on('click', '#saveProfileBtn', function(){
  const profileData = {
    name: $('#profileName').val(),
    email: $('#profileEmail').val(),
    phone: $('#profilePhone').val(),
    dept: $('#profileDept').val()
  };

  // Show Bootstrap Toast
  const toast = new bootstrap.Toast($('#saveToast'));
  toast.show();

  // Redirect to Home after 2 seconds
  setTimeout(() => {
    $('.nav-link').removeClass('active');
    $('.nav-link[data-section="home"]').addClass('active');
    loadSection('home');
  }, 2000);
});


});
