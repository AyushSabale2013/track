// ═══════════════════════════════════════════════════════════════
//  COURSES.JS — Shared script for all course pages
//  (NDA, JEE, NEET, CET …)
//  Handles: scroll-reveal animations
// ═══════════════════════════════════════════════════════════════

document.addEventListener("DOMContentLoaded", () => {

    // ── Scroll Reveal ─────────────────────────────────────────
    // Any element with class "reveal" fades + slides in when it
    // enters the viewport. Add class="reveal" to any section or
    // card in your HTML to opt it in.

    const revealEls = document.querySelectorAll(".reveal");

    if (revealEls.length === 0) return;

    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add("visible");
                    // Stop watching once revealed — no re-trigger
                    observer.unobserve(entry.target);
                }
            });
        },
        {
            threshold: 0.12,       // trigger when 12% of element is visible
            rootMargin: "0px 0px -40px 0px"  // slight offset from bottom
        }
    );

    revealEls.forEach((el) => observer.observe(el));

});