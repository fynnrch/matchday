// ==============
// Refresh Cookie
// ==============

async function refreshCookie() {
  const response = await fetch("/api/auth/refresh", {
    method: "POST",
    credentials: "include"
  });

  if (!response.ok) {
    window.location.href = "/";
    throw new Error("Unauthorized");
  }
}
const authReady = refreshCookie();
setInterval(refreshCookie, 1000 * 60 * 14);

// =====================
// Aside button requests
// =====================

//toggleAsideMenu
const toggleAsideMenu = document.getElementById("toggleAsideMenu");
const asideMenu = document.getElementById("asideMenu");
toggleAsideMenu.onclick = () => {
  asideMenu.classList.toggle("collapsed");

  localStorage.setItem("sidebarCollapsed", asideMenu.classList.contains("collapsed"));
}

//isCollapsed option
const isCollapsed = localStorage.getItem("sidebarCollapsed") === "true";
if (isCollapsed) asideMenu.classList.toggle("collapsed");

//asideBtn's
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

// ==============
// Loading screen
// ==============

const mainContainer = document.getElementById("mainContainer");
const mainLoader = document.getElementById("mainLoader");
const loadingText = document.getElementById("loadingText");

async function execPackages(packages) {
    mainContainer.hidden = true;
    mainLoader.hidden = false;

    for (const package of packages) {
        try {
            loadingText.textContent = `loading ${package.name}...`;
            await package.exec();
        }
        catch (error) {
            console.log(`Package ${package.name} raised an error\n${error}`);
        }
    }

    mainContainer.hidden = false;
    mainLoader.hidden = true;
}

/*
const packages = [
  { name: "package", exec: packageFunc },
  { name: "anotherPackage", exec: anotherPackageFunc }
]
await execPackages(packages);
*/