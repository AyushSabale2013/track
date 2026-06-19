// ─────────────────────────────────────────────
// AUTH.JS — Student / Teacher / Admin Login
// ─────────────────────────────────────────────

// const BASE_URL = "http://localhost:5000"; // already declared in load components 

window.addEventListener("DOMContentLoaded", () => {

    const form = document.getElementById("loginForm");
    const loginBtn = document.getElementById("loginBtn");

    // ── Toggle Password Visibility ───────────
    const togglePw = document.getElementById("togglePw");
    const pw = document.getElementById("password");

    togglePw.addEventListener("click", () => {
        if (pw.type === "password") {
            pw.type = "text";
            togglePw.textContent = "🕶️";
        } else {
            pw.type = "password";
            togglePw.textContent = "👁️";
        }
    });

    // ── Submit ────────────────────────────────
    loginBtn.addEventListener("click", () => {
        handleLogin();
    });

    form.addEventListener("submit", (e) => {
        e.preventDefault();
        handleLogin();
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


// ── Main Login Function ───────────────────────
async function handleLogin() {

    hideMessage();

    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;

    // ── Validation ───────────────────────────
    if (!email) {
        return showMessage("Correct Email is required.");
    }

    if (!password) {
        return showMessage("Password is required.");
    }

    // ── Backend Request ──────────────────────
    try {

        const response = await fetch(`${BASE_URL}/api/auth/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify({ email, password }),
        });

        const data = await response.json();

        // ── Login Failed ──────────────────────
        if (!response.ok) {
            return showMessage(data.message || "Invalid email or password.");
        }

        // ── Login Success ─────────────────────
        showPopup("Login successful! Redirecting...", "success", () => {

            switch (data.role) {

                case "admin":
                    window.location.href = "../admin/A01 home.html";
                    break;

                case "teacher":
                    window.location.href = "../teacher/T01 home.html";
                    break;

                case "student":
                    window.location.href = "../student/S01 home.html";
                    break;

                default:
                    showMessage("Unknown role: " + data.role);
            }
        });

    } catch (error) {
        console.error(error);
        showMessage("Could not connect to the server. Try again.");
    }
}