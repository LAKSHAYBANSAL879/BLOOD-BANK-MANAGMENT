document.addEventListener("DOMContentLoaded", async function () {
    try {
        const token = getCookie("token");
console.log(token);
        if (!token) {
            console.error("Token not found in the cookie");
            return;
        }

        const response = await fetch("http://localhost:8080/api/v1/auth/gethospbytoken", {
            method: "GET",
            headers: {
                "Authorization": `${token}`,
                "Content-Type": "application/json",
                credentials: 'include',
            },
        });
        console.log(response);
        if (response.status === 200) {
            
            const { success, org } = await response.json();
            if (success && org) {
                const welcomeMessage = document.getElementById("welcomeMessage");
                const userEmail = document.getElementById("userEmail");

                welcomeMessage.textContent = `Welcome, ${org.name}!`;
                userEmail.textContent = `Email: ${org.email}`;
            } else {
                console.log("Error getting user profile");
            }
        } else {
            console.log("Error getting user profile");
        }
    } catch (error) {
        console.error("Error:", error);
    }

    const logoutButton = document.getElementById("logout");
    if (logoutButton) {
        logoutButton.addEventListener("click", async function () {
            try {
                const token = getCookie("token");
                console.log(token)
                const response = await fetch("http://localhost:8080/api/v1/auth/hospitallogout", {
                    method: "GET",
                    headers: {
                        "Authorization": `${token}`,
                        "Content-Type": "application/json",
                        credentials: 'include',
                    },
                });

                if (response.status === 200) {
                    document.cookie = "token=; Max-Age=0; Path=/";
                    alert("User Logged out sucessfully")
                    window.location.href = "http://localhost:5500/client-side/dist/hospitallogin.html";
                } else {
                    alert("Error logging out");
                }
            } catch (error) {
               alert("Error:", error);
            }
        });
    }
});

function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
}
