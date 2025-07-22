const scriptURL = "https://script.google.com/macros/s/AKfycbyoMaHI6zPWH_jcJgkPwN50e9IwxlquH31AfMbct9rtU68jxsjemtuOyRbhLNpUbW-jDQ/exec";

/**
 * Switches the displayed section between login and register forms.
 * @param {string} id - The ID of the section to show ('loginSection' or 'registerSection').
 */
function switchSection(id) {
    document.getElementById("loginSection").style.display = id === "loginSection" ? "block" : "none";
    document.getElementById("registerSection").style.display = id === "registerSection" ? "block" : "none";
}

/**
 * Handles user registration by sending data to Google Apps Script.
 */
async function register() {
    const prefix = document.getElementById("prefix").value;
    const fname = document.getElementById("fname").value;
    const lname = document.getElementById("lname").value;
    const bhisId = document.getElementById("bhisId").value;
    const passwordReg = document.getElementById("passwordReg").value;
    const confirmPassword = document.getElementById("confirmPassword").value;

    if (passwordReg !== confirmPassword) {
        alert("รหัสผ่านไม่ตรงกัน");
        return; // Stop execution if passwords don't match
    }

    const data = {
        action: "register",
        prefix: prefix,
        fname: fname,
        lname: lname,
        bhisId: bhisId,
        password: passwordReg
    };

    try {
        const res = await fetch(scriptURL, {
            method: "POST",
            // Crucial: Set Content-Type header for JSON payload
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data)
        });

        // Check if the response is OK (status 200) before trying to parse JSON
        if (!res.ok) {
            // Log full response for debugging if not OK
            const errorText = await res.text();
            console.error('Network response was not ok. Status:', res.status, 'Error:', errorText);
            throw new Error(`HTTP error! status: ${res.status} - ${errorText}`);
        }

        const json = await res.json();
        alert(json.message);

        if (json.success) {
            // Optionally, switch to login section after successful registration
            switchSection('loginSection');
        }

    } catch (err) {
        console.error('Error during registration:', err);
        alert("เกิดข้อผิดพลาดในการสมัครสมาชิก: " + err.message);
    }
}

/**
 * Handles user login by sending data to Google Apps Script.
 */
async function login() {
    const bhisLogin = document.getElementById("bhisLogin").value;
    const passwordLogin = document.getElementById("passwordLogin").value;

    const data = {
        action: "login",
        bhisId: bhisLogin,
        password: passwordLogin
    };

    try {
        const res = await fetch(scriptURL, {
            method: "POST",
            // Crucial: Set Content-Type header for JSON payload
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        });

        // Check if the response is OK (status 200) before trying to parse JSON
        if (!res.ok) {
            // Log full response for debugging if not OK
            const errorText = await res.text();
            console.error('Network response was not ok. Status:', res.status, 'Error:', errorText);
            throw new Error(`HTTP error! status: ${res.status} - ${errorText}`);
        }

        const json = await res.json();

        if (json.success) {
            alert("เข้าสู่ระบบสำเร็จ");
            localStorage.setItem("user", JSON.stringify(json.user));
            // window.location.href = "dashboard.html"; // Uncomment if you have a dashboard page
        } else {
            alert(json.message);
        }
    } catch (err) {
        console.error('Error during login:', err);
        alert("เกิดข้อผิดพลาดในการเข้าสู่ระบบ: " + err.message);
    }
}

// dashboard.js
window.onload = function () {
  const user = JSON.parse(localStorage.getItem("user"));
  if (user) {
    document.getElementById("welcomeText").innerText = `ยินดีต้อนรับ ${user.prefix}${user.fname} ${user.lname}`;
  } else {
    window.location.href = "index.html"; // redirect กลับถ้ายังไม่ได้ login
  }
};

