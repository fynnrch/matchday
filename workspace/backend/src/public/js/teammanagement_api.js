// =============
// Load document
// =============

const teams = [];

document.addEventListener("DOMContentLoaded", async () => {
    await authReady

    const packages = [
        { name: "fetchTeams", exec: fetchTeams },
        { name: "fetchPlayers", exec: fetchPlayers },
        { name: "fetchLineups", exec: fetchLineups },
        { name: "fetchTactics", exec: fetchTactics }
    ]
    await execPackages(packages);

    UI_initialLoad();
});

// =========
// fetchData
// =========

async function fetchTeams() {
    const response = await fetch("/api/teams/fetch", {
        method: "GET",
        credentials: "include"
    });

    if (!response.ok) throw new Error(`Failed to load teams: ${response.status}`);
    teams.push(...await response.json());
}

async function fetchPlayers() {
    await Promise.all(
        teams.map(async (team) => {
            const response = await fetch(`/api/players/fetch/${encodeURIComponent(team.idTeam)}`, {
                method: "GET",
                credentials: "include"
            });
            
            if (!response.ok) throw new Error(`Failed to load players for team ${team.name}: ${response.status}`); 
            team.players = await response.json();

            //Calc ovr
            for (const p of team.players) p.ovr = Math.round((p.pace + p.endurance + p.strength + p.positioning + p.ball_control + p.passing + p.shooting + p.duel) / 8);
        })
    );

    await Promise.all(
        teams.flatMap(team =>
            team.players.map(async player => {
                const response = await fetch(
                    `/api/players/fetchHistory/${encodeURIComponent(player.idPerson)}`,
                    {
                        method: "GET",
                        credentials: "include"
                    }
                );

                player.history = await response.json();
            })
        )
    );
}

async function fetchLineups() {
    await Promise.all(
        teams.map(async (team) => {
            const response = await fetch(`/api/lineups/fetch/${encodeURIComponent(team.idTeam)}`, {
                method: "GET",
                credentials: "include"
            });
            
            if (!response.ok) throw new Error(`Failed to load lineup for team ${team.name}: ${response.status}`); 
            team.lineup = await response.json();
        })
    );
}

async function fetchTactics() {
    await Promise.all(
        teams.map(async (team) => {
            const response = await fetch(`/api/tactics/fetch/${encodeURIComponent(team.idTeam)}`, {
                method: "GET",
                credentials: "include"
            });
            
            if (!response.ok) throw new Error(`Failed to load tactics for team ${team.name}: ${response.status}`);
            team.tactics = await response.json();
            for (const key in team.tactics) {
                team.tactics[key] /= 100;
            }
        })
    );
}

// ================
// patch player dev
// ================

async function patchPlayerDev(idPerson, newDev) {
    const response = await fetch(`/api/players/patchDev/${encodeURIComponent(idPerson)}`, {
        method: "PATCH",
        credentials: "include",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            newDev,
        })
    });
    
    if (!response.ok) throw new Error(`Failed to patch player dev: ${response.status}`); 
}


// ==========================
// insert/delete lineup entry
// ==========================

async function insertLineupEntry(idTeam, idPerson, positionCode) {
    const response = await fetch(`/api/lineups/insert/${encodeURIComponent(idTeam)}`, {
        method: "POST",
        credentials: "include",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            idPerson,
            positionCode
        })
    });
    
    if (!response.ok) throw new Error(`Failed to insert lineup: ${response.status}`); 
}

async function deleteLineupEntry(idTeam, positionCode) {
    const response = await fetch(`/api/lineups/delete/${encodeURIComponent(idTeam)}`, {
        method: "DELETE",
        credentials: "include",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            positionCode,
        })
    });
    
    if (!response.ok) throw new Error(`Failed to delete lineup: ${response.status}`); 
}

// ==============
// update tactics
// ==============

async function updateTactics(idTeam, tactics) {
    const response = await fetch(`/api/tactics/update/${encodeURIComponent(idTeam)}`, {
        method: "PUT",
        credentials: "include",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            tactics,
        })
    });
    
    if (!response.ok) throw new Error(`Failed to update tactics: ${response.status}`); 
}