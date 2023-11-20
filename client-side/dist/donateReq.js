

document.getElementById('bloodDonationForm').addEventListener('submit', function (e) {
    e.preventDefault();

    const form = e.target;
    const formData = new FormData(form);

    // Convert FormData to JSON object
    const jsonObject = {};
    formData.forEach((value, key) => {
        jsonObject[key] = value;
    });

    fetch('http://localhost:8080/api/v1/inventory/create-inventory', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(jsonObject),
    })
    .then(response => {
        console.log(response);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        if (data.success) {
            // Redirect to the success page
            window.location.href = "http://localhost:5500/client-side/dist/index.html";
            alert('Blood inventory record created successfully.');
        } else {
            // Handle errors, display an error message
            alert('Error creating blood inventory record: ' + data.message);
        }
    })
    .catch(error => {
        // Handle network or other errors
        console.error('Fetch error:', error);
        alert('An error occurred while communicating with the server.');
    });
});
