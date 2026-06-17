// ─────────────────────────────────────────────
//  REGISTER.JS  —  Handles student registration
// ─────────────────────────────────────────────


// ── 1. Grab elements from the DOM ─────────────────────────────

const form            = document.getElementById("registerForm");
const passwordInput   = document.getElementById("password");
const confirmInput    = document.getElementById("confirmPassword");
const togglePwBtn     = document.getElementById("togglePw");
const toggleConfirmBtn = document.getElementById("toggleConfirmPw");


// ── 2. Password visibility toggles ────────────────────────────
//    When the eye icon is clicked, switch input type between
//    "password" (hidden) and "text" (visible)

togglePwBtn.addEventListener("click", () => {
    const isHidden = passwordInput.type === "password";
    passwordInput.type = isHidden ? "text" : "password";
    togglePwBtn.textContent = isHidden ? "🙈" : "👁️";
});

toggleConfirmBtn.addEventListener("click", () => {
    const isHidden = confirmInput.type === "password";
    confirmInput.type = isHidden ? "text" : "password";
    toggleConfirmBtn.textContent = isHidden ? "🙈" : "👁️";
});


// ── 3. Form submit ─────────────────────────────────────────────

form.addEventListener("submit", async (e) => {
    e.preventDefault(); // Stop the page from reloading on submit

    // Read values from the form fields
    const name            = document.getElementById("name").value.trim();
    const email           = document.getElementById("email").value.trim();
    const phone           = document.getElementById("phone").value.trim();
    const password        = passwordInput.value;
    const confirmPassword = confirmInput.value;


    // ── 4. Client-side validation ──────────────────────────────
    //    We check inputs BEFORE sending to the server.
    //    This gives instant feedback without a network request.

    if (!name) {
        return alert("Name is required");
    }

    if (!isValidEmail(email)) {
        return alert("Invalid email address");
    }

    if (!isValidPhone(phone)) {
        return alert("Phone number must be exactly 10 digits");
    }

    if (password.length < 8) {
        return alert("Password must be at least 8 characters");
    }

    if (password !== confirmPassword) {
        return alert("Passwords do not match");
    }


    // ── 5. Send data to the backend ────────────────────────────
    //    fetch() sends an HTTP POST request to your Express server.
    //    We send JSON because our backend uses express.json() middleware.
    //
    //    ⚠️  IMPORTANT: Change the BASE_URL below to match your
    //    backend port. In development this is usually localhost:5000
    //    or localhost:3000. In production, use your deployed URL.

    const BASE_URL = "http://localhost:5000"; // <-- change this if your port is different

    try {
        const response = await fetch(`${BASE_URL}/api/auth/register`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json", // tells the server we're sending JSON
            },
            body: JSON.stringify({ name, email, phone, password }),
            // Note: confirmPassword is NOT sent — the backend doesn't need it.
            // Password matching is a frontend-only check.
        });

        // Parse the JSON response from the server
        const data = await response.json();

        // response.ok is true for status codes 200–299
        if (!response.ok) {
            // Server returned an error (e.g. "User already exists")
            return alert(data.message || "Registration failed");
        }

        // ── Success ──────────────────────────────────────────────
        alert("Registration successful! Please log in.");
        window.location.href = "../auth/A01 student login.html";

    } catch (error) {
        // This catch block runs if:
        //   - The server is not running
        //   - The URL is wrong
        //   - There's a network/CORS issue
        console.error("Registration error:", error);
        alert("Could not connect to the server ");
    }
});


// ── 6. Helper / Utility functions ─────────────────────────────

// Checks basic email format: something@something.something
function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    //      ─────────  ─────────  ──────
    //      local part  domain    extension
}

// Checks that phone is exactly 10 digits (no spaces or dashes)
function isValidPhone(phone) {
    return /^[0-9]{10}$/.test(phone);
}