// ฟังก์ชันสลับหน้า login/register
function switchSection(sectionId) {
  document.getElementById('loginSection').style.display = sectionId === 'loginSection' ? 'block' : 'none';
  document.getElementById('registerSection').style.display = sectionId === 'registerSection' ? 'block' : 'none';
}

// ✅ ให้สามารถเรียกจาก onclick ใน HTML ได้
window.switchSection = switchSection;

// 🎯 Login
document.getElementById("loginBtn").addEventListener("click", async () => {
  const bhisId = document.getElementById("bhisLogin").value.trim();
  const password = document.getElementById("passwordLogin").value.trim();

  if (!bhisId || !password) {
    alert("กรุณากรอกข้อมูลให้ครบ");
    return;
  }

  try {
    const response = await fetch("https://script.google.com/macros/s/AKfycbyoMaHI6zPWH_jcJgkPwN50e9IwxIqUh31AfMbct9rtU68jxsjemtuOyRbhLNpUbW-jDQ/exec", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "login", bhisId, password })
    });

    const result = await response.json();
    if (result.success) {
      alert("เข้าสู่ระบบสำเร็จ: " + result.user.fname + " " + result.user.lname);
      // redirect ไปหน้า dashboard ได้ที่นี่
    } else {
      alert(result.message);
    }
  } catch (error) {
    alert("เกิดข้อผิดพลาด: " + error.message);
  }
});

// 📝 Register
document.getElementById("registerBtn").addEventListener("click", async () => {
  const prefix = document.getElementById("prefix").value;
  const fname = document.getElementById("fname").value.trim();
  const lname = document.getElementById("lname").value.trim();
  const bhisId = document.getElementById("bhisId").value.trim();
  const password = document.getElementById("passwordReg").value.trim();
  const confirmPassword = document.getElementById("confirmPassword").value.trim();

  if (!prefix || !fname || !lname || !bhisId || !password || !confirmPassword) {
    alert("กรุณากรอกข้อมูลให้ครบ");
    return;
  }

  if (password !== confirmPassword) {
    alert("รหัสผ่านไม่ตรงกัน");
    return;
  }

  try {
    const response = await fetch("https://script.google.com/macros/s/AKfycbyoMaHI6zPWH_jcJgkPwN50e9IwxIqUh31AfMbct9rtU68jxsjemtuOyRbhLNpUbW-jDQ/exec", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "register",
        prefix, fname, lname, bhisId, password
      })
    });

    const result = await response.json();
    if (result.success) {
      new bootstrap.Modal(document.getElementById("successModal")).show();
    } else {
      alert(result.message);
    }
  } catch (error) {
    alert("เกิดข้อผิดพลาด: " + error.message);
  }
});
