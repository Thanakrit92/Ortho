const scriptURL = "https://script.google.com/macros/s/AKfycbyoMaHI6zPWH_jcJgkPwN50e9IwxlquH31AfMbct9rtU68jxsjemtuOyRbhLNpUbW-jDQ/exec";

function switchSection(id) {
  document.getElementById("loginSection").style.display = id === "loginSection" ? "block" : "none";
  document.getElementById("registerSection").style.display = id === "registerSection" ? "block" : "none";
}

async function register() {
  const data = {
    action: "register",
    prefix: document.getElementById("prefix").value,
    fname: document.getElementById("fname").value,
    lname: document.getElementById("lname").value,
    bhisId: document.getElementById("bhisId").value,
    password: document.getElementById("passwordReg").value,
    confirmPassword: document.getElementById("confirmPassword").value
  };
  if (data.password !== data.confirmPassword) return alert("รหัสผ่านไม่ตรงกัน");

  const res = await fetch(scriptURL, {
    method: "POST",
    headers: { "Content-Type": "application/json" }, // ✅ เพิ่มส่วนนี้
    body: JSON.stringify(data)
  });

  const json = await res.json();
  alert(json.message);
}

async function login() {
  const data = {
    action: "login",
    bhisId: document.getElementById("bhisLogin").value,
    password: document.getElementById("passwordLogin").value
  };

  try {
    const res = await fetch(scriptURL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"   // ✅ ต้องมี header นี้
      },
      body: JSON.stringify(data)
    });

    const json = await res.json();

    if (json.success) {
      alert("เข้าสู่ระบบสำเร็จ");
      localStorage.setItem("user", JSON.stringify(json.user));
      // window.location.href = "dashboard.html"; // ถ้ามีหน้าใหม่
    } else {
      alert(json.message);
    }
  } catch (err) {
    alert("เกิดข้อผิดพลาด: " + err.message);
  }
}

