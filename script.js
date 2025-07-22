// ✅ URL ของ Google Apps Script Web App
const WEB_APP_URL = 'https://script.google.com/macros/s/AKfycbwb0vLATwMa0ke1Um0MwsybC8iFUezl8tcesk-jKNyIzrF0zwt92A4of304Gi30_To/exec';

// ✅ ฟังก์ชันกลางสำหรับเรียก API
async function callAPI(action, payload = {}, extra = {}) {
  const body = {
    action,
    payload,
    ...extra
  };

  const response = await fetch(WEB_APP_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  });

  return await response.json();
}

// ✅ ป้องกันการ Zoom (Mobile)
document.addEventListener('wheel', e => {
  if (e.ctrlKey) e.preventDefault();
}, { passive: false });

['gesturestart', 'gesturechange', 'gestureend'].forEach(evt =>
  document.addEventListener(evt, e => e.preventDefault())
);

// ✅ สลับหน้า login/register
function switchSection(id) {
  document.getElementById('loginSection').style.display = 'none';
  document.getElementById('registerSection').style.display = 'none';
  document.getElementById(id).style.display = 'block';
}

// ✅ สมัครสมาชิก
async function register() {
  const prefix = document.getElementById("prefix").value;
  const fname = document.getElementById("fname").value;
  const lname = document.getElementById("lname").value;
  const bhis = document.getElementById("bhisId").value;
  const pass = document.getElementById("passwordReg").value;
  const confirm = document.getElementById("confirmPassword").value;
  const registerBtn = document.getElementById("registerBtn");

  if (!prefix || !fname || !lname || !bhis || !pass || !confirm) {
    alert("กรุณากรอกข้อมูลให้ครบ");
    return;
  }

  if (pass !== confirm) {
    alert("รหัสผ่านไม่ตรงกัน");
    return;
  }

  registerBtn.disabled = true;
  registerBtn.innerHTML = `<span class="spinner-border spinner-border-sm me-2"></span>กำลังสมัครสมาชิก...`;

  try {
    const res = await callAPI("registerUser", {
      prefix, fname, lname, bhis, pass
    });

    if (res.status === "success") {
      new bootstrap.Modal(document.getElementById('successModal')).show();
    } else {
      alert("เกิดข้อผิดพลาด: " + (res.message || 'ไม่สามารถสมัครสมาชิกได้'));
    }
  } catch (err) {
    alert("เกิดข้อผิดพลาด: " + err.message);
  } finally {
    resetRegisterBtn();
  }
}

function resetRegisterBtn() {
  const btn = document.getElementById("registerBtn");
  btn.disabled = false;
  btn.innerHTML = "สมัครสมาชิก";
}

// ✅ เข้าสู่ระบบ
async function login() {
  const bhis = document.getElementById("bhisLogin").value.trim();
  const pass = document.getElementById("passwordLogin").value.trim();
  const loginBtn = document.getElementById("loginBtn");

  if (!bhis || !pass) {
    alert("กรุณากรอกข้อมูลให้ครบ");
    return;
  }

  loginBtn.disabled = true;
  loginBtn.innerHTML = `<span class="spinner-border spinner-border-sm me-2"></span>กำลังเข้าสู่ระบบ...`;

  try {
    const res = await callAPI("checkLogin", {
      bhis,
      password: pass
    });

    if (res.status === "success") {
      window.location.href = "dashboard-main.html";
    } else {
      alert("User ID หรือรหัสผ่านไม่ถูกต้อง");
      resetLoginBtn();
    }
  } catch (err) {
    alert("เกิดข้อผิดพลาด: " + err.message);
    resetLoginBtn();
  }
}

function resetLoginBtn() {
  const btn = document.getElementById("loginBtn");
  btn.disabled = false;
  btn.innerHTML = "เข้าสู่ระบบ";
}

// ✅ ไปยังหน้าอื่น (ใช้ในระบบ GitHub Pages)
function navigateTo(page) {
  document.getElementById("loadingPopup").style.display = "flex";
  window.location.href = `${page}.html`;
}

// ✅ Logout (modal ยืนยัน)
function logout() {
  const modal = new bootstrap.Modal(document.getElementById('logoutModal'));
  modal.show();
}

function confirmLogout() {
  document.getElementById("loadingPopup").style.display = "flex";
  window.location.href = "index.html";
}
