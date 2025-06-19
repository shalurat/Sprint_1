$(document).ready(function () {
  $("#register-form").validate({
    rules: {
      fullname: {
        required: true,
        minlength: 3
      },
      email: {
        required: true,
        email: true
      },
      password: {
        required: true,
        minlength: 6
      },
      confirm_password: {
        required: true,
        equalTo: "#reg-password"
      }
    },
    messages: {
      fullname: {
        required: "Please enter your full name",
        minlength: "Name must be at least 3 characters"
      },
      email: {
        required: "Please enter your email",
        email: "Please enter a valid email address"
      },
      password: {
        required: "Please provide a password",
        minlength: "Password must be at least 6 characters"
      },
      confirm_password: {
        required: "Please confirm your password",
        equalTo: "Passwords do not match"
      }
    },
    errorElement: 'div',
    errorClass: 'invalid-feedback',
    highlight: function (element) {
      $(element).addClass('is-invalid');
    },
    unhighlight: function (element) {
      $(element).removeClass('is-invalid');
    }
  });
});
