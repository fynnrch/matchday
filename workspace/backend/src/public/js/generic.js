// ==============
// Refresh Cookie
// ==============

async function refreshCookie() {
  const response = await fetch("/auth/refresh", {
    method: "POST",
    credentials: "include"
  });

  if (!response.ok) window.location.href = "/";
}
refreshCookie();
setInterval(refreshCookie, 1000 * 60 * 14);

// =====================
// Aside button requests
// =====================

const asideBtnDashboard = document.getElementById("asideBtnDashboard");
const asideBtnTeams = document.getElementById("asideBtnTeams");
const asideBtnPool = document.getElementById("asideBtnPool");

asideBtnDashboard.addEventListener("click", () => {
    window.location.href = "/dashboard";
});

asideBtnTeams.addEventListener("click", () => {
    window.location.href = "/teams";
});

asideBtnPool.addEventListener("click", () => {
    window.location.href = "/pool";
});