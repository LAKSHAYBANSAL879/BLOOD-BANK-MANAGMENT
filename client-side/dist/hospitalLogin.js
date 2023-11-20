document.addEventListener("DOMContentLoaded", async function () {
    try {
        // Retrieve the stored token from the cookie
        const token = getCookie("token");
console.log(token);
        if (token) {
            // If token exists, the user is already logged in
            window.location.href = "http://localhost:5500/client-side/dist/hospitalprofile.html";
        }
    } catch (error) {
        console.error("Error:", error);
    }

    document.getElementById("loginForm").addEventListener("submit", async function (e) {
        e.preventDefault();

        const email = document.getElementById("email").value;
        const password = document.getElementById("password").value;

        if (!email || !password) {
            document.getElementById("message").textContent = "Email and password are required.";
            return;
        }

        const userData = { email, password };

        try {
            const response = await fetch("http://localhost:8080/api/v1/auth/hospitalsignin", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(userData),
            });

            if (response.status === 200) {
                const { token, org} = await response.json();
                if (org && org.name) {
                    document.cookie = `token=${token}; Max-Age=172800; Path=/`;
                    window.location.href = "http://localhost:5500/client-side/dist/hospitalprofile.html";
                } else {
                    document.getElementById("message").textContent = "Login failed. Please try again.";
                }
            } else if (response.status === 401) {
                document.getElementById("message").textContent = "Invalid email or password.";
            } else {
                document.getElementById("message").textContent = "An error occurred while logging in.";
            }
        } catch (error) {
            console.error("Error:", error);
            document.getElementById("message").textContent = "An error occurred while logging in.";
        }
    });

    // Function to retrieve a specific cookie value by name
    function getCookie(name) {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop().split(';').shift();
    }
});
