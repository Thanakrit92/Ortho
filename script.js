// ป้องกันการ Zoom
document.addEventListener('wheel', e => { if (e.ctrlKey) e.preventDefault(); }, { passive: false });
['gesturestart', 'gesturechange', 'gestureend'].forEach(evt =>
  document.addEventListener(evt, e => e.preventDefault())
);

// 🟢 URL ของ Apps Script Web App
const WEB_APP_URL = "https://script.google.com/macros/s/AKfycbyoFATY4l0nQXzq3-IN1Q7yX2kdJwypx8KSwxG-U0jYQ0ju9cdW7DgIabcREfjftRQ/exec";

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

  if (!prefix || !fname || !lname || !bhis || !pass || !confirm) return alert("กรุณากรอกข้อมูลให้ครบ");
  if (pass !== confirm) return alert("รหัสผ่านไม่ตรงกัน");

  registerBtn.disabled = true;
  registerBtn.innerHTML = `<span class="spinner-border spinner-border-sm me-2"></span>กำลังสมัครสมาชิก...`;

  try {
    const res = await fetch(WEB_APP_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "register",
        prefix,
        fname,
        lname,
        bhis,
        pass
      })
    });

    const result = await res.json();
    if (result.status === "success") {
      new bootstrap.Modal(document.getElementById('successModal')).show();
    } else {
      alert("เกิดข้อผิดพลาด: " + result.message);
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

  if (!bhis || !pass) return alert("กรุณากรอกข้อมูลให้ครบ");

  loginBtn.disabled = true;
  loginBtn.innerHTML = `<span class="spinner-border spinner-border-sm me-2"></span>กำลังเข้าสู่ระบบ...`;

  try {
    const res = await fetch(WEB_APP_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "login",
        bhis,
        pass
      })
    });

    const result = await res.json();
    if (result.status === "success") {
      window.location.href = result.redirectUrl;
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

// ✅ ไปยังหน้าต่าง ๆ
function navigateTo(page) {
  document.getElementById("loadingPopup").style.display = "flex";
  window.location.href = `${WEB_APP_URL}?page=${page}`;
}

// ✅ ออกจากระบบ
function logout() {
  const modal = new bootstrap.Modal(document.getElementById('logoutModal'));
  modal.show();
}

function confirmLogout() {
  document.getElementById("loadingPopup").style.display = "flex";
  window.location.href = `${WEB_APP_URL}?page=index&logout=true`;
}
