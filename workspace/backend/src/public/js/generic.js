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
const asideBtnTeamManagement = document.getElementById("asideBtnTeamManagement");
const asideBtnTalentPool = document.getElementById("asideBtnTalentPool");

asideBtnDashboard.addEventListener("click", () => {
    window.location.href = "/dashboard";
});

asideBtnTeamManagement.addEventListener("click", () => {
    window.location.href = "/teammanagement";
});

asideBtnTalentPool.addEventListener("click", () => {
    window.location.href = "/talentpool";
});