// ─────────────────────────────────────────────
// AUTH.JS — Student / Teacher / Admin  Login
// ─────────────────────────────────────────────

// ── 1. Grab Elements ─────────────────────────

const form = document.getElementById("loginForm");


// ── 2. Submit Form ───────────────────────────

form.addEventListener("submit", async (e) => {

    e.preventDefault();

    const username =
        document.getElementById("username")
            .value
            .trim();

    const password =
        document.getElementById("password")
            .value;


    // ── Validation ───────────────────────────

    if (!username) {
        return alert("Email is required");
    }

    if (!password) {
        return alert("Password is required");
    }


    // ── Backend Request ──────────────────────

    const BASE_URL = "http://localhost:5000";

    try {

        const response = await fetch(
            `${BASE_URL}/api/auth/login`,
            {
                method: "POST",

                headers: {
                    "Content-Type":
                        "application/json",
                },

                credentials: "include",

                body: JSON.stringify({
                    email: username,
                    password,
                }),
            }
        );

        const data = await response.json();


        // ── Login Failed ──────────────────────

        if (!response.ok) {
            return alert(
                data.message ||
                "Login failed"
            );
        }


        // ── Login Success ─────────────────────

        alert("Login successful");


        switch (data.role) {

            case "admin":
                window.location.href =
                    "../admin/home.html";
                break;

            case "teacher":
                window.location.href =
                    "../teacher/T01 home.html";
                break;

            case "student":
                window.location.href =
                    "../student/home.html";
                break;

            default:
                alert("Unknown role");
        }

    } catch (error) {

        console.error(error);

        alert(
            "Could not connect to the server"
        );
    }

});