// js/loadComponents.js
// Loads /components/navbar.html and /components/footer.html into
// #navbar and #footer divs respectively, then wires up interactions.

const BASE_URL = "http://localhost:5000"; // <-- change if your port is different

async function loadComponent(id, url) {
    const el = document.getElementById(id);
    if (!el) return;

    try {
        const res = await fetch(url);
        if (!res.ok) throw new Error(`Failed to fetch ${url} (${res.status})`);
        el.innerHTML = await res.text();
    } catch (err) {
        console.error(`[loadComponents] ${err.message}`);
    }
}

function initHamburger() {
    const hamburger = document.getElementById('hamburger');
    const navLinks = document.querySelector('.navbar__links');
    if (!hamburger || !navLinks) return;

    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('open');
        navLinks.classList.toggle('open');
    });

    // Close menu when any link inside is clicked (mobile UX)
    navLinks.querySelectorAll('a, button').forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('open');
            navLinks.classList.remove('open');
        });
    });
}

// Load both components in parallel, then init interactions


async function updateNavbar() {

    try {

        const response = await fetch(
            "http://localhost:5000/api/auth/me",
            {
                credentials: "include"
            }
        );

        const data = await response.json();

        const loginBtn = document.getElementById("loginBtn");
        const registerBtn = document.getElementById("registerBtn");
        const profileBtn = document.getElementById("profileBtn");
        const settingsBtn = document.getElementById("settingsBtn");
        const logoutBtn = document.getElementById("logoutBtn");
        const productsBtn = document.getElementById("productsBtn");
        const zoneBtn = document.getElementById("zoneBtn");

        if (data.success) {

            loginBtn.style.display = "none";
            registerBtn.style.display = "none";
            zoneBtn.style.display = "none";

            profileBtn.style.display = "inline-flex";
            settingsBtn.style.display = "inline-flex";
            logoutBtn.style.display = "inline-flex";
            productsBtn.style.display = "inline-flex";

        } else {

            loginBtn.style.display = "inline-flex";
            registerBtn.style.display = "inline-flex";
            productsBtn.style.display = "inline-flex";
            zoneBtn.style.display = "inline-flex";

            profileBtn.style.display = "none";
            settingsBtn.style.display = "none";
            logoutBtn.style.display = "none";
        }

    } catch (err) {
        console.error(err);
    }
}

function showPopup(message, type = "error", onClose = null) {
    const existing = document.getElementById("popup-overlay");
    if (existing) existing.remove();

    const popup = document.createElement("div");
    popup.id = "popup-overlay";
    popup.className = "popup-overlay";
    popup.innerHTML = `
        <div class="popup-box">
            <div class="popup-icon-wrap ${type}">
                <span id="popup-icon">${type === "success" ? "✓" : "✕"}</span>
            </div>
            <p id="popup-message">${message}</p>
            <div class="popup-progress">
                <div class="popup-progress-fill ${type}"></div>
            </div>
        </div>
    `;
    document.body.appendChild(popup);

    setTimeout(() => {
        popup.remove();
        if (onClose) onClose();
    }, 2000);
}

function attachLogout() {
    const logoutBtn = document.getElementById("logoutBtn");
    if (!logoutBtn) return;

    logoutBtn.addEventListener("click", async (e) => {
        e.preventDefault();

        try {
            const res = await fetch(`${BASE_URL}/api/auth/logout`, {
                method: "POST",
                credentials: "include"
            });

            const data = await res.json();

            if (res.ok) {
                showPopup("Logged out successfully", "success", () => {
                    window.location.href = "../landing/H01 main.html";
                });
            } else {
                showPopup(data.message || "Logout failed", "error");
            }

        } catch (err) {
            console.error("Logout error:", err);
            showPopup("Could not connect to server", "error");
        }
    });
}


(async () => {
    await Promise.all([
        loadComponent('navbar', '../components/navbar.html'),
        loadComponent('footer', '../components/footer.html'),
    ]);
    await updateNavbar();  // check login status and updates nav bar accoridngly 
    initHamburger();       // wire up mobile menu
    attachLogout();
})();



