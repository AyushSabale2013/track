// js/loadComponents.js
// Loads /components/navbar.html and /components/footer.html into
// #navbar and #footer divs respectively, then wires up interactions.

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
    const navLinks  = document.querySelector('.navbar__links');
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
(async () => {
    await Promise.all([
        loadComponent('navbar', '/components/navbar.html'),
        loadComponent('footer', '/components/footer.html'),
    ]);

    initHamburger();
})();