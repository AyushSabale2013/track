// ─────────────────────────────────────────────
//  REGISTER.JS  —  Handles student registration
// ─────────────────────────────────────────────


// ── 1. Grab elements from the DOM ─────────────────────────────

const form             = document.getElementById("registerForm");
const passwordInput    = document.getElementById("password");
const confirmInput     = document.getElementById("confirmPassword");
const togglePwBtn      = document.getElementById("togglePw");
const toggleConfirmBtn = document.getElementById("toggleConfirmPw");

// Popup elements
const popupOverlay = document.getElementById("popup");
const popupMessage = document.getElementById("popup-message");
const popupIcon    = document.getElementById("popup-icon");
const popupClose   = document.getElementById("popup-close");


// ── 2. Popup helper ────────────────────────────────────────────
//    Use this everywhere instead of alert().
//    type: "error" | "success"
//    onClose: optional callback to run after user clicks OK

function showPopup(message, type = "error", onClose = null) {
    popupIcon.textContent    = type === "success" ? "✅" : "❌";
    popupMessage.textContent = message;
    popupOverlay.classList.remove("hidden");

    // Auto-close after 2 seconds, then run callback if provided
    setTimeout(() => {
        popupOverlay.classList.add("hidden");
        if (onClose) onClose(); // e.g. redirect after success
    }, 1500);
}


// ── 3. Password visibility toggles ────────────────────────────
//    When the eye icon is clicked, switch input type between
//    "password" (hidden) and "text" (visible)

togglePwBtn.addEventListener("click", () => {
    const isHidden = passwordInput.type === "password";
    passwordInput.type = isHidden ? "text" : "password";
    togglePwBtn.textContent = isHidden ? "🕶️" : "👁️";
});

toggleConfirmBtn.addEventListener("click", () => {
    const isHidden = confirmInput.type === "password";
    confirmInput.type = isHidden ? "text" : "password";
    toggleConfirmBtn.textContent = isHidden ? "🕶️" : "👁️";
});


// ── 4. Form submit ─────────────────────────────────────────────

form.addEventListener("submit", async (e) => {
    e.preventDefault(); // Stop the page from reloading on submit

    // Read values from the form fields
    const name            = document.getElementById("name").value.trim();
    const email           = document.getElementById("email").value.trim();
    const phone           = document.getElementById("phone").value.trim();
    const password        = passwordInput.value;
    const confirmPassword = confirmInput.value;


    // ── 5. Client-side validation ──────────────────────────────
    //    We check inputs BEFORE sending to the server.
    //    This gives instant feedback without a network request.

    if (!name) {
        return showPopup("Name is required");
    }

    if (!isValidEmail(email)) {
        return showPopup("Invalid email address");
    }

    if (!isValidPhone(phone)) {
        return showPopup("Phone number must be exactly 10 digits");
    }

    if (password.length < 8) {
        return showPopup("Password must be at least 8 characters");
    }

    if (password !== confirmPassword) {
        return showPopup("Passwords do not match");
    }


    // ── 6. Send data to the backend ────────────────────────────
    //    fetch() sends an HTTP POST request to your Express server.
    //    We send JSON because our backend uses express.json() middleware.
    //
    //    ⚠️  Change BASE_URL to match your backend port.

    const BASE_URL = "http://localhost:5000"; // <-- change if your port is different

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
            return showPopup(data.message || "Registration failed");
        }

        // ── Success ───────────────────────────────────────────
        // Show success popup, then redirect after user clicks OK
        showPopup("Registration successful! Redirecting...", "success", () => {
            window.location.href = "../landing/H01 main.html";
        });

    } catch (error) {
        // This catch block runs if:
        //   - The server is not running
        //   - The URL is wrong
        //   - There's a network / CORS issue
        console.error("Registration error:", error);
        showPopup("Could not connect to the server. Make sure your backend is running.");
    }
});


// ── 7. Helper / Utility functions ─────────────────────────────

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