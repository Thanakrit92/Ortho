// ป้องกัน zoom
document.addEventListener('wheel', e => { if (e.ctrlKey) e.preventDefault(); }, { passive: false });
['gesturestart', 'gesturechange', 'gestureend'].forEach(evt =>
  document.addEventListener(evt, e => e.preventDefault())
);

function switchSection(id) {
  document.getElementById('loginSection').style.display = 'none';
  document.getElementById('registerSection').style.display = 'none';
  document.getElementById(id).style.display = 'block';
}

function register() {
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

  google.script.run
    .withSuccessHandler(() => {
      new bootstrap.Modal(document.getElementById('successModal')).show();
      resetRegisterBtn();
    })
    .withFailureHandler(err => {
      alert("เกิดข้อผิดพลาด: " + err.message);
      resetRegisterBtn();
    })
    .registerUser({ prefix, fname, lname, bhis, pass });
}

function resetRegisterBtn() {
  const btn = document.getElementById("registerBtn");
  btn.disabled = false;
  btn.innerHTML = "สมัครสมาชิก";
}

function login() {
  const bhis = document.getElementById("bhisLogin").value.trim();
  const pass = document.getElementById("passwordLogin").value.trim();
  const loginBtn = document.getElementById("loginBtn");

  if (!bhis || !pass) return alert("กรุณากรอกข้อมูลให้ครบ");

  loginBtn.disabled = true;
  loginBtn.innerHTML = `<span class="spinner-border spinner-border-sm me-2"></span>กำลังเข้าสู่ระบบ...`;

  google.script.run
    .withSuccessHandler(response => {
      if (response === 'success') {
        google.script.run.withSuccessHandler(url => {
          const a = document.createElement('a');
          a.href = url + "?page=dashboard";
          a.target = '_top';
          document.body.appendChild(a);
          a.click();
        }).getWebAppUrl();
      } else {
        alert("User ID หรือรหัสผ่านไม่ถูกต้อง");
        resetLoginBtn();
      }
    })
    .withFailureHandler(err => {
      alert("เกิดข้อผิดพลาด: " + err.message);
      resetLoginBtn();
    })
    .checkLogin(bhis, pass);
}

function resetLoginBtn() {
  const btn = document.getElementById("loginBtn");
  btn.disabled = false;
  btn.innerHTML = "เข้าสู่ระบบ";
}

///แดชบอร์ด///

// ปิดการ zoom ด้วย Ctrl + Scroll
document.addEventListener('wheel', function(e) {
  if (e.ctrlKey) {
    e.preventDefault();
  }
}, { passive: false });

// ปิดการ zoom ด้วย Gesture บน touch device
document.addEventListener('gesturestart', function (e) {
  e.preventDefault();
});
document.addEventListener('gesturechange', function (e) {
  e.preventDefault();
});
document.addEventListener('gestureend', function (e) {
  e.preventDefault();
});

function navigateTo(page) {
  // แสดง popup
  document.getElementById("loadingPopup").style.display = "flex";

  // เรียก WebApp URL จาก Apps Script
  google.script.run.withSuccessHandler(function (url) {
    const newUrl = url + "?page=" + page;
    window.open(newUrl, "_top");
  }).getWebAppUrl();
}

function logout() {
  const modal = new bootstrap.Modal(document.getElementById('logoutModal'));
  modal.show();
}

function confirmLogout() {
  document.getElementById("loadingPopup").style.display = "flex"; // แสดง loading
  google.script.run
    .withSuccessHandler(function(url) {
      window.location.href = url + "?page=index";
    })
    .logoutAndReturnHome();
}

