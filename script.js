// ✅ BASE URL ของ GAS API
const API_URL = "https://script.google.com/macros/s/AKfycbw8N7S3nQSMDAsQGEhads5FM4eRliNq5x1YRMn69QJuIbmsIRe145uvpiU4XQp2QOU1/exec";

// ✅ ตัวช่วยส่ง POST
async function fetchPost(action, payload) {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ action, payload })
  });

  return await response.json();
}

// ✅ ฟังก์ชันสลับหน้า Login/Register
function switchSection(sectionId) {
  document.getElementById("loginSection").style.display = sectionId === "loginSection" ? "block" : "none";
  document.getElementById("registerSection").style.display = sectionId === "registerSection" ? "block" : "none";
}
window.switchSection = switchSection;

// ✅ กดลิงก์ "สมัครสมาชิก"
document.getElementById("goToRegister").addEventListener("click", (e) => {
  e.preventDefault();
  switchSection("registerSection");
});

// ✅ กดลิงก์ "กลับเข้าสู่ระบบ"
document.getElementById("goToLogin").addEventListener("click", (e) => {
  e.preventDefault();
  switchSection("loginSection");
});

// ✅ กดปุ่ม "เข้าสู่ระบบ" บน Modal
document.getElementById("successGoLogin").addEventListener("click", () => {
  switchSection("loginSection");
});

// ✅ Login Event
document.getElementById("loginBtn").addEventListener("click", async () => {
  const bhis = document.getElementById("bhisLogin").value.trim();
  const password = document.getElementById("passwordLogin").value.trim();

  if ([bhis, password].some(val => val === "")) {
    alert("กรุณากรอกข้อมูลให้ครบ");
    return;
  }

  try {
    const result = await fetchPost("checkLogin", { bhis, password });

    if (result.status === "success") {
      // ✅ เก็บ session ชั่วคราวไว้ใน localStorage (optional)
      localStorage.setItem("bhis", bhis);

      // ✅ แสดง loading popup แล้ว redirect
      document.getElementById("loadingPopup").style.display = "flex";
      setTimeout(() => {
        window.location.href = "dashboard.html";
      }, 1000);
    } else {
      alert("รหัสไม่ถูกต้อง");
    }
  } catch (err) {
    alert("เกิดข้อผิดพลาด: " + err.message);
  }
});


// ✅ Register Event
document.getElementById("registerBtn").addEventListener("click", async () => {
  const prefix = document.getElementById("prefix").value;
  const fname = document.getElementById("fname").value.trim();
  const lname = document.getElementById("lname").value.trim();
  const bhis = document.getElementById("bhisId").value.trim();
  const password = document.getElementById("passwordReg").value.trim();
  const confirmPassword = document.getElementById("confirmPassword").value.trim();

  if ([prefix, fname, lname, bhis, password, confirmPassword].some(val => val === "")) {
    alert("กรุณากรอกข้อมูลให้ครบ");
    return;
  }

  if (password !== confirmPassword) {
    alert("รหัสผ่านไม่ตรงกัน");
    return;
  }

  try {
    const result = await fetchPost("registerUser", {
      bhis,
      name: `${prefix}${fname} ${lname}`,
      email: "",
      password
    });

    if (result.status === "success") {
      new bootstrap.Modal(document.getElementById("successModal")).show();
    } else {
      alert(result.message || "เกิดข้อผิดพลาดในการสมัคร");
    }
  } catch (err) {
    alert("เกิดข้อผิดพลาด: " + err.message);
  }
});
