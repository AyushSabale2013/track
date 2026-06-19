// ─────────────────────────────────────────────
// REGISTER.JS — Student Registration
// ─────────────────────────────────────────────

// BASE_URL already declared in loadComponents.js
// showPopup() already declared in loadComponents.js (global)

window.addEventListener("DOMContentLoaded", () => {

    const form             = document.getElementById("registerForm");
    const passwordInput    = document.getElementById("password");
    const confirmInput     = document.getElementById("confirmPassword");
    const togglePwBtn      = document.getElementById("togglePw");
    const toggleConfirmBtn = document.getElementById("toggleConfirmPw");

    // ── Toggle Password Visibility ───────────
    togglePwBtn.addEventListener("click", () => {
        if (passwordInput.type === "password") {
            passwordInput.type = "text";
            togglePwBtn.textContent = "🕶️";
        } else {
            passwordInput.type = "password";
            togglePwBtn.textContent = "👁️";
        }
    });

    toggleConfirmBtn.addEventListener("click", () => {
        if (confirmInput.type === "password") {
            confirmInput.type = "text";
            toggleConfirmBtn.textContent = "🕶️";
        } else {
            confirmInput.type = "password";
            toggleConfirmBtn.textContent = "👁️";
        }
    });

    // ── Submit ────────────────────────────────
    form.addEventListener("submit", (e) => {
        e.preventDefault();
        handleRegister();
    });

});


// ── Show / Hide inline message ────────────────
// type: "error" | "success"
function showMessage(text, type = "error") {
    const banner = document.getElementById("formMessage");
    banner.textContent = text;
    banner.className = "form-message " + type;  // swap class for colour
    banner.style.display = "block";
}

function hideMessage() {
    const banner = document.getElementById("formMessage");
    banner.style.display = "none";
    banner.textContent = "";
    banner.className = "form-message";
}


// ── Main Register Function ────────────────────
async function handleRegister() {

    hideMessage();

    const name            = document.getElementById("name").value.trim();
    const email           = document.getElementById("email").value.trim();
    const phone           = document.getElementById("phone").value.trim();
    const password        = document.getElementById("password").value;
    const confirmPassword = document.getElementById("confirmPassword").value;

    // ── Validation ───────────────────────────
    if (!name) {
        return showMessage("Name is required.");
    }

    if (!isValidEmail(email)) {
        return showMessage("Invalid email address.");
    }

    if (!isValidPhone(phone)) {
        return showMessage("Phone number must be exactly 10 digits.");
    }

    if (password.length < 8) {
        return showMessage("Password must be at least 8 characters.");
    }

    if (password !== confirmPassword) {
        return showMessage("Passwords do not match.");
    }

    // ── Backend Request ──────────────────────
    try {

        const response = await fetch(`${BASE_URL}/api/auth/register`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name, email, phone, password }),
            // Note: confirmPassword is NOT sent — backend doesn't need it.
        });

        const data = await response.json();

        // ── Registration Failed ──────────────────
        if (!response.ok) {
            return showMessage(data.message || "Registration failed.");
        }

        // ── Registration Success ─────────────────
        showPopup("Registration successful! Redirecting...", "success", () => {
            window.location.href = "../landing/H01 main.html";
        });

    } catch (error) {
        console.error("Registration error:", error);
        showMessage("Could not connect to the server. Try again.");
    }
}


// ── Helper / Utility functions ────────────────

// Checks basic email format: something@something.something
function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// Checks that phone is exactly 10 digits (no spaces or dashes)
function isValidPhone(phone) {
    return /^[0-9]{10}$/.test(phone);
}