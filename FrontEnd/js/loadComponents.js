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

        if (data.success) {

            loginBtn.style.display = "none";
            registerBtn.style.display = "none";

            profileBtn.style.display = "inline-flex";
            settingsBtn.style.display = "inline-flex";
            logoutBtn.style.display = "inline-flex";

        } else {

            loginBtn.style.display = "inline-flex";
            registerBtn.style.display = "inline-flex";

            profileBtn.style.display = "none";
            settingsBtn.style.display = "none";
            logoutBtn.style.display = "none";
        }

    } catch (err) {
        console.error(err);
    }
}

function showLogoutPopup(icon, message, onClose = null) {
    // Remove existing popup if any
    const existing = document.getElementById("logout-popup");
    if (existing) existing.remove();

    const popup = document.createElement("div");
    popup.id = "logout-popup";
    popup.innerHTML = `
        <div class="logout-popup-box">
            <span>${icon}</span>
            <p>${message}</p>
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
                showLogoutPopup("👋", "Logged out successfully", () => {
                    window.location.href = "../landing/H01 main.html";
                });
            } else {
                showLogoutPopup("❌", data.message || "Logout failed");
            }

        } catch (err) {
            console.error("Logout error:", err);
            showLogoutPopup("❌", "Could not connect to server");
        }
    });
}

const style = document.createElement("style");
style.textContent = `
    #logout-popup {
        position: fixed;
        inset: 0;
        background: rgba(0, 0, 0, 0.45);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 9999;
    }
    .logout-popup-box {
        background: #fff;
        border-radius: 12px;
        padding: 2rem 3rem;
        text-align: center;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 0.75rem;
        box-shadow: 0 20px 60px rgba(0,0,0,0.15);
        animation: popIn 0.25s ease;
    }
    .logout-popup-box span { font-size: 2.2rem; }
    .logout-popup-box p {
        font-size: 1rem;
        font-weight: 600;
        color: #232947;
        margin: 0;
    }
    @keyframes popIn {
        from { transform: scale(0.85); opacity: 0; }
        to   { transform: scale(1);    opacity: 1; }
    }
`;
document.head.appendChild(style);

(async () => {
    await Promise.all([
        loadComponent('navbar', '/components/navbar.html'),
        loadComponent('footer', '/components/footer.html'),
    ]);
    await updateNavbar();  // check login status
    initHamburger();       // wire up mobile menu
    attachLogout();
})();


