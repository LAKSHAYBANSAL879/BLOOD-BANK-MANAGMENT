document.addEventListener('DOMContentLoaded', function () {
    // Add an event listener to the form
    const signupForm = document.getElementById('signupForm');
  
    signupForm.addEventListener('submit', function (e) {
      e.preventDefault(); // Prevent the form from submitting normally
  
      // Get the form data
      const formData = new FormData(signupForm);
  
      // Convert form data to a JSON object
      const jsonObject = {};
      formData.forEach((value, key) => {
        jsonObject[key] = value;
      });
  
      // Make an AJAX request to your API with the JSON data
      // Replace the URL with your API endpoint
      fetch('http://localhost:8080/api/v1/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(jsonObject),
      })
        .then((response) => response.json())
        .then((data) => {
          // Handle the response from your API
          if (data.success) {
            // User signup was successful
            // console.log('User signed up successfully');
            window.location.href="http://localhost:5500/client-side/dist/userlogin.html";
            // You can redirect the user to another page or show a success message.
          } else {
            // Signup failed
            console.error('Signup failed:', data.message);
            // Handle the error, show an error message to the user, etc.
          }
        })
        .catch((error) => {
          console.error('Error:', error);
          // Handle the error and show a message to the user
        });
    });
  });
  