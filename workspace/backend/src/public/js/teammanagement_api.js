// =============
// Load document
// =============

const user = {};
const teams = [];

document.addEventListener("DOMContentLoaded", async () => {
    //await authReady

    const packages = [
        { name: "User", load: getUser },
        { name: "Teams", load: getTeams },
        { name: "Players", load: getPlayers },
        { name: "Lineup", load: getLineup },
        { name: "Tactics", load: getTactics }
    ]
    await executeAPI(packages);

    UI_initialLoad();
});

// TODO implement loading screen
async function executeAPI(packages) {
    for (const package of packages) {
        try {
            await package.load();
            console.log(`Package ${package.name} loaded  succesfully`);
        }
        catch (error) {
            console.log(`Package ${package.name} raised an error\n${error}`);
        }
    }
}

// ========
// API: get
// ========

async function getUser() {
    Object.assign(user, {
        idUser: 1
    });

    /*
    const response = await fetch("/api/user");
    if (!response.ok) throw new Error(`Failed to load your user data properly: ${response.status}`);
    Object.assign(user, await response.json());
    */
}

async function getTeams() {
    const fetchedTeams = [
    {
        idTeam: 1,
        name: "1. Mannschaft"
    },
    {
        idTeam: 2,
        name: "2. Mannschaft"
    }
    ];
    teams.push(...fetchedTeams);

    /* ALLE TEAMS EINES USERS
    const response = await fetch("/api/teams");
    if (!response.ok) throw new Error(`Failed to load your teams data properly: ${response.status}`);
    teams.push(...await response.json());
    */
}

async function getPlayers() {
    teams[0].players = [
    {
        idPerson: 1,
        idTeam: 1,
        firstname: "Manuel",
        lastname: "Neuer",
        age: 25,
        matches: 15,
        
        pace: 85.5,
        endurance: 80.2,
        strenght: 82.7,
        positioning: 75.8,
        ball_control: 90.2,
        passing: 85.4,
        shooting: 72.1,
        duel: 71.3
    },
    {
        idPerson: 2,
        idTeam: 1,
        firstname: "Josua",
        lastname: "Kimmich",
        age: 22,
        matches: 12,

        pace: 95.5,
        endurance: 80.2,
        strenght: 82.7,
        positioning: 75.8,
        ball_control: 90.2,
        passing: 85.4,
        shooting: 72.1,
        duel: 91.3
    }
    ];
    teams[1].players = [
    {
        idPerson: 3,
        idTeam: 2,
        firstname: "Jamal",
        lastname: "Musiala",
        age: 18,
        matches: 5,
        
        pace: 85.5,
        endurance: 80.2,
        strenght: 82.7,
        positioning: 75.8,
        ball_control: 90.2,
        passing: 85.4,
        shooting: 72.1,
        duel: 71.3
    }
    ];

    /*
    for (const team of teams) {
        const response = await fetch(api/players#idTeam);
        if (!response.ok) throw new Error(`Failed to load your players data properly: ${response.status}`);
        team.players = await response.json();
    }
    */

    //calc individuell player ovr
    for (const team of teams) {
        for (const p of team.players) {
            p.ovr = Math.round((p.pace + p.endurance + p.strenght + p.positioning + p.ball_control + p.passing + p.shooting + p.duel) / 8);
        }
    }
}

async function getLineup() {
    teams[0].lineup = [
        {pos: "LW", idPerson: null},
        {pos: "LF", idPerson: null},
        {pos: "ST", idPerson: null},
        {pos: "RF", idPerson: null},
        {pos: "RW", idPerson: null},
        {pos: "LAM", idPerson: null},
        {pos: "CAM", idPerson: null},
        {pos: "RAM", idPerson: null},
        {pos: "LM", idPerson: null},
        {pos: "LCM", idPerson: null},
        {pos: "CM", idPerson: null},
        {pos: "RCM", idPerson: null},
        {pos: "RM", idPerson: null},
        {pos: "LDM", idPerson: null},
        {pos: "CDM", idPerson: null},
        {pos: "RDM", idPerson: null},
        {pos: "LWB", idPerson: null},
        {pos: "RWB", idPerson: null},
        {pos: "LB", idPerson: null},
        {pos: "LCB", idPerson: null},
        {pos: "CB", idPerson: null},
        {pos: "RCB", idPerson: null},
        {pos: "RB", idPerson: null},
        {pos: "GK", idPerson: null},
        {pos: "S1", idPerson: null},
        {pos: "S2", idPerson: null},
        {pos: "S3", idPerson: null},
        {pos: "S4", idPerson: null},
        {pos: "S5", idPerson: null},
        {pos: "S6", idPerson: null},
        {pos: "S7", idPerson: null},
        {pos: "S8", idPerson: null},
        {pos: "S9", idPerson: null},
        {pos: "S10", idPerson: null},
        {pos: "S11", idPerson: null},
        {pos: "S12", idPerson: null}
    ];
    teams[1].lineup = [
        {pos: "LW", idPerson: null},
        {pos: "LF", idPerson: null},
        {pos: "ST", idPerson: null},
        {pos: "RF", idPerson: null},
        {pos: "RW", idPerson: null},
        {pos: "LAM", idPerson: null},
        {pos: "CAM", idPerson: null},
        {pos: "RAM", idPerson: null},
        {pos: "LM", idPerson: null},
        {pos: "LCM", idPerson: null},
        {pos: "CM", idPerson: null},
        {pos: "RCM", idPerson: null},
        {pos: "RM", idPerson: null},
        {pos: "LDM", idPerson: null},
        {pos: "CDM", idPerson: null},
        {pos: "RDM", idPerson: null},
        {pos: "LWB", idPerson: null},
        {pos: "RWB", idPerson: null},
        {pos: "LB", idPerson: null},
        {pos: "LCB", idPerson: null},
        {pos: "CB", idPerson: null},
        {pos: "RCB", idPerson: null},
        {pos: "RB", idPerson: null},
        {pos: "GK", idPerson: null},
        {pos: "S1", idPerson: null},
        {pos: "S2", idPerson: null},
        {pos: "S3", idPerson: null},
        {pos: "S4", idPerson: null},
        {pos: "S5", idPerson: null},
        {pos: "S6", idPerson: null},
        {pos: "S7", idPerson: null},
        {pos: "S8", idPerson: null},
        {pos: "S9", idPerson: null},
        {pos: "S10", idPerson: null},
        {pos: "S11", idPerson: null},
        {pos: "S12", idPerson: null}
    ];

    /*
    for (const team of teams) {
        const response = await fetch(api/lineup#idTeam);
        if (!response.ok) throw new Error(`Failed to load your lineup data properly: ${response.status}`);
        team.lineup = await response.json();
    }
    */
}
async function getTactics() {
    teams[0].tactics = [
        {pace: "12.5"},
        {endurance: "12.5"},
        {strenght: "12.5"},
        {positioning: "12.5"},
        {ball_control: "12.5"},
        {passing: "12.5"},
        {shooting: "12.5"},
        {duel: "12.5"}
    ];
    teams[1].tactics = [
        {pace: "12.5"},
        {endurance: "12.5"},
        {strenght: "12.5"},
        {positioning: "12.5"},
        {ball_control: "12.5"},
        {passing: "12.5"},
        {shooting: "12.5"},
        {duel: "12.5"}
    ];

    /*
    for (const team of teams) {
        const response = await fetch(api/tactics#teamid);
        if (!response.ok) throw new Error(`Failed to load your tactics data properly: ${response.status}`);
        team.tactics = await response.json();
    }
    */
}

// =========
// API: post
// =========

async function postA() {
    
}