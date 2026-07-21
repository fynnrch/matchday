// ==============
// Refresh Cookie
// ==============

async function refreshCookie() {
  const response = await fetch("/api/auth/refresh", {
      method: "POST",
      credentials: "include"
  });

  if (response.ok) window.location.href = "/dashboard";
}
refreshCookie();

// =====================
// Toogle Register/Login
// =====================

const imgSignUp = document.getElementById("imgSignUp");
const imgLogIn = document.getElementById("imgLogIn");

const registerForm = document.getElementById("registerForm");
const loginForm = document.getElementById("loginForm");

imgSignUp.addEventListener("click", () => {
  toogleRegister();
});

imgLogIn.addEventListener("click", () => {
  toogleLogin();
});

function toogleRegister() {
  imgSignUp.parentElement.classList.add("hidden")
  imgLogIn.parentElement.classList.remove("hidden")

  registerForm.parentElement.classList.remove("hidden")
  loginForm.parentElement.classList.add("hidden")
}

function toogleLogin() {
  imgSignUp.parentElement.classList.remove("hidden")
  imgLogIn.parentElement.classList.add("hidden")

  registerForm.parentElement.classList.add("hidden")
  loginForm.parentElement.classList.remove("hidden")
}

// =========
// checkRegisterForm
// =========

const registerEmail = document.getElementById("registerEmail");
const registerStatusEmail = document.getElementById("registerStatusEmail");
let timeoutRegisterEmail;

const registerUsername = document.getElementById("registerUsername");
const registerStatusUsername = document.getElementById("registerStatusUsername");
let timeoutRegisterUsername;

const registerPassword = document.getElementById("registerPassword");
const registerStatusPassword = document.getElementById("registerStatusPassword");
let timeoutRegisterPassword;

const registerClubname = document.getElementById("registerClubname");
const registerStatusClubname = document.getElementById("registerStatusClubname");
let timeoutRegisterClubname;

const registerAbbreviation = document.getElementById("registerAbbreviation");
const registerStatusAbbreviation = document.getElementById("registerStatusAbbreviation");
let timeoutRegisterAbbreviation;

const registerSubmit = document.getElementById("registerSubmit");

registerEmail.addEventListener("input", (inp) => {clearTimeout(timeoutRegisterEmail); timeoutRegisterEmail = setTimeout(() => {checkAvailability(inp.target.value, registerStatusEmail, "checkEmail");}, 400);});
registerUsername.addEventListener("input", (inp) => {clearTimeout(timeoutRegisterUsername); timeoutRegisterUsername = setTimeout(() => {checkAvailability(inp.target.value, registerStatusUsername, "checkUsername");}, 400);});
registerPassword.addEventListener("input", (inp) => {clearTimeout(timeoutRegisterPassword); timeoutRegisterPassword = setTimeout(() => {checkPassword(inp.target.value, registerStatusPassword);}, 400);});
registerClubname.addEventListener("input", (inp) => {clearTimeout(timeoutRegisterClubname); timeoutRegisterClubname = setTimeout(() => {checkAvailability(inp.target.value, registerStatusClubname, "checkClubname");}, 400);});
registerAbbreviation.addEventListener("input", (inp) => {clearTimeout(timeoutRegisterAbbreviation); timeoutRegisterAbbreviation = setTimeout(() => {checkAvailability(inp.target.value, registerStatusAbbreviation, "checkAbbreviation");}, 400);});

// =========
// checkLoginForm
// =========

const loginEmail = document.getElementById("loginEmail");
const loginStatusEmail = document.getElementById("loginStatusEmail");
let timeoutLoginEmail;

const loginPassword = document.getElementById("loginPassword");
const loginStatusPassword = document.getElementById("loginStatusPassword");
let timeoutLoginPassword;

const loginSubmit = document.getElementById("loginSubmit");

loginEmail.addEventListener("input", (inp) => {clearTimeout(timeoutLoginEmail); timeoutLoginEmail = setTimeout(() => {checkEmail(inp.target.value, loginStatusEmail);}, 400);});
loginPassword.addEventListener("input", (inp) => {clearTimeout(timeoutLoginPassword); timeoutLoginPassword = setTimeout(() => {checkPassword(inp.target.value, loginStatusPassword);}, 400);});

// ==============
// checkFunctions
// ==============

async function checkAvailability(inp, statusLabel, endpoint) {
  const response = await fetch("/api/queries/" + endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      inp: inp
    })
  });

  const data = await response.json();

  statusLabel.parentElement.classList.remove("invalid");
  statusLabel.innerHTML = "";
  
  if (!response.ok) {
    statusLabel.parentElement.classList.add("invalid")
    statusLabel.innerHTML = data.res;
  }
}

function checkEmail(inp, statusLabel) {
  statusLabel.parentElement.classList.remove("invalid");
  statusLabel.innerHTML = "";

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(inp)) {
    statusLabel.parentElement.classList.add("invalid")
    statusLabel.innerHTML = "Invalid email";
  }
}

function checkPassword(inp, statusLabel) {
  statusLabel.parentElement.classList.remove("invalid");
  statusLabel.innerHTML = "";

  if (inp.length < 8) {
    statusLabel.parentElement.classList.add("invalid")
    statusLabel.innerHTML = "Password too short";
  }
}

// ==========
// submitRegisterForm
// ==========

const registerStatusSubmit = document.getElementById("registerStatusSubmit");

document.getElementById("registerForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const inpEmail = registerEmail.value;
  const inpUsername = registerUsername.value;
  const inpPassword = registerPassword.value;
  const inpClubname = registerClubname.value;
  const inpAbbreviation = registerAbbreviation.value;

  //Check before POST
  const checks = [
    [registerEmail, "Invalid email"],
    [registerUsername, "Invalid username"],
    [registerPassword, "Invalid password"],
    [registerClubname, "Invalid clubname"],
    [registerAbbreviation, "Invalid abbreviation"]
  ];

  for (const [field, res] of checks) {
    if (field.parentElement.classList.contains("invalid")) {
      registerStatusSubmit.innerHTML = res;
      return;
    }
  }

  const response = await fetch("/api/auth/register", {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      inpEmail,
      inpUsername,
      inpPassword,
      inpClubname,
      inpAbbreviation
    })
  });

  const data = await response.json();
  registerStatusSubmit.innerHTML = data.res;

  if (response.ok) window.location.href = "/dashboard";
});

// ==========
// submitLoginForm
// ==========

const loginStatusSubmit = document.getElementById("loginStatusSubmit");

document.getElementById("loginForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const inpEmail = loginEmail.value;
  const inpPassword = loginPassword.value;

  //Check before POST
  const checks = [
    [loginEmail, "Invalid email"],
    [loginPassword, "Invalid password"]
  ];

  for (const [field, res] of checks) {
    if (field.parentElement.classList.contains("invalid")) {
      loginStatusSubmit.innerHTML = res;
      return;
    }
  }

  const response = await fetch("/api/auth/login", {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      inpEmail,
      inpPassword
    })
  });

  const data = await response.json();
  loginStatusSubmit.innerHTML = data.res;
  
  if (response.ok) window.location.href = "/dashboard";
});