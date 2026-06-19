// ─────────────────────────────────────────────────────────────
//  STUDENT.JS — Student dashboard logic
//  - Requires login to view this page at all
//  - Renders all feature cards (no lock screens here)
//  - The destination page for each feature decides what content
//    to show based on the student's subscriptions
//  - Greets the student by name using /api/auth/me
// ─────────────────────────────────────────────────────────────

// BASE_URL already declared in loadComponents.js
// showPopup() already declared in loadComponents.js (global)


// ── 1. Feature definitions ─────────────────────────────────────
//    Every feature here is visible and clickable to ANY logged-in
//    student, regardless of subscription. The redirected page is
//    responsible for filtering/restricting content by subscription.

const FEATURES = [
    {
        icon: "fa-solid fa-bars",
        title: "Advanced dashboard",
        desc: "Track syllabus, test results, and progress in one place.",
        href: "/student/S02 dashboard.html"
    },
    {
        icon: "fa-solid fa-circle-question",
        title: "Doubt sessions",
        desc: "Instant doubt resolution via Telegram, WhatsApp, or the app.",
        href: "/student/S03 doubt.html"
    },
    {
        icon: "fa-solid fa-pen-to-square",
        title: "Practice",
        desc: "Weekly tests with performance analytics to track your progress.",
        href: "/student/S04 practice.html"
    },
    {
        icon: "fa-solid fa-book",
        title: "Premium study material",
        desc: "Scientifically designed notes for deep understanding and revision.",
        href: "/student/S05 study material.html"
    },
    {
        icon: "fa-solid fa-trophy",
        title: "Performance",
        desc: "Detailed breakdowns of every test, subject-wise and topic-wise.",
        href: "/student/S06 performance.html"
    },
    {
        icon: "fa-solid fa-display",
        title: "Digital classrooms",
        desc: "Interactive boards, digital notes, and a seamless live class experience.",
        href: "/student/S07 smart classroom.html"
    },
    {
        icon: "fa-solid fa-bullhorn",
        title: "Announcements & notices",
        desc: "Class schedules, test alerts, results, and updates — all in one place.",
        href: "/student/S08 announcements.html"
    },
    {
        icon: "fa-solid fa-calendar-days",
        title: "Smart schedule",
        desc: "Your daily classes, test plans, and revision timetable, organized.",
        href: "/student/S09 schedule.html"
    }
];


// ── 2. Render feature cards ────────────────────────────────────
//    Every card is a plain link. No subscription check happens
//    here — the destination page filters its own content.

function renderFeatures() {
    const thread = document.getElementById("featureThread");
    if (!thread) return;

    thread.innerHTML = ""; // clear before re-render

    FEATURES.forEach(feature => {
        const card = document.createElement("a");
        card.className = "feature-card";
        card.href = feature.href;

        card.innerHTML = `
            <div class="feature-card__icon">
                <i class="${feature.icon}"></i>
            </div>
            <div class="feature-card__body">
                <h3>${feature.title}</h3>
                <p>${feature.desc}</p>
            </div>
            <i class="fa-solid fa-chevron-right feature-card__arrow"></i>
        `;

        thread.appendChild(card);
    });
}


// ── 3. Auth check + greet student ───────────────────────────────
//    Calls /api/auth/me. If the student isn't logged in, they are
//    redirected to the login page — the dashboard never renders
//    for a guest.

async function loadStudentDashboard() {
    try {
        const response = await fetch(`${BASE_URL}/api/auth/me`, {
            credentials: "include"
        });

        const data = await response.json();

        if (!data.success) {
            // Not logged in — block access to this page entirely
            window.location.href = "../auth/A01 login.html";
            return;
        }

        // Greet by first name
        const nameEl = document.getElementById("studentName");
        if (nameEl && data.user?.name) {
            nameEl.textContent = data.user.name.split(" ")[0];
        }

        // Render all feature cards — available to every logged-in student
        renderFeatures();

    } catch (error) {
        console.error("Failed to load dashboard:", error);
        // If we can't even verify login, don't show the dashboard
        window.location.href = "../auth/A01 login.html";
    }
}


// ── 4. Run on page load ────────────────────────────────────────
document.addEventListener("DOMContentLoaded", loadStudentDashboard);