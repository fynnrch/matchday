// =========
// Init data
// =========

async function fetchData(api, method, initUI) {
    const response = await fetch(api, {
        method: method,
        credentials: "include"
    })
    if (response.ok) initUI(await response.json());
    else initUI(false);
}

async function initData() {
    await authReady;

    await Promise.all([
        fetchData("/api/user", "GET", initUI_user),
        fetchData("/api/teams", "GET", initUI_teams)
    ]);
}

initData();

// =======
// Init ui
// =======

function initUI_user(user) {
    if (user) {

    }
    else {
        //Default Werte
    }
}

function initUI_teams(teams) {
    if (teams) {

    }
    else {
        //Default Werte
    }
}