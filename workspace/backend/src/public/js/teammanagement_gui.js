// TODO zweites Team erstellen

// ==============
// UI_initialLoad
// ==============

function UI_initialLoad() {
    UI_initTeams();
    UI_initPlayers();
    UI_initPlayerActions();
    UI_initStatsHistory();
    UI_initLineupTactics();
}

// ============
// UI_initTeams
// ============

let active_idTeam = Number(localStorage.getItem("active_idTeam"));

function UI_initTeams() {
    validateActiveIdTeam();
    createTeamsSwitch();
    setTeamName();
    calcOVR();
}

function validateActiveIdTeam() {
    if (!teams.some(team => team.idTeam === active_idTeam)) {
        active_idTeam = teams[0].idTeam
        localStorage.setItem("active_idTeam", active_idTeam);
    }
}

function createTeamsSwitch() {
    const switchTeam = document.getElementById("switchTeam");
    switchTeam.replaceChildren();
    
    teams.forEach(team => switchTeam.appendChild(createTeamSwitch(team)))
    switchTeam.value = active_idTeam;

    switchTeam.onchange = () => {
        active_idTeam = Number(switchTeam.value);
        localStorage.setItem("active_idTeam", active_idTeam);

        UI_initTeams();
        UI_initPlayers();
        UI_initPlayerActions();
        UI_initLineupTactics();
    }
}

function createTeamSwitch(team) {
    const option = document.createElement("option");
    option.value = team.idTeam;
    option.textContent = team.name;

    return option
}

function setTeamName() {
    document.getElementById("teamName").textContent = teams.find(team => team.idTeam === active_idTeam).name;
}

function calcOVR() {
    const team = teams.find(team => team.idTeam === active_idTeam);
    document.getElementById("ovr").textContent = Math.round(team.players.reduce((a, pl) => a + pl.ovr, 0) / team.players.length);
}

// ==============
// UI_initPlayers
// ==============

let selectedPlayers = [];
const playerContainer = document.getElementById("playerContainer");

function UI_initPlayers() {
    selectedPlayers = [];
    createPlayers(teams.find(team => team.idTeam === active_idTeam).players);
    checkForMultiSelection();
}

function createPlayers(players) {
    playerContainer.replaceChildren();
    players.forEach(player => createPlayer(player))
}

function createPlayer(player) {
    const article = document.createElement("article");
    article.className = "player gap horizontalContainer"
    article.dataset.idPerson = player.idPerson;
    article.innerHTML = `
        <div class="inline enable-flex space-between">
            <div>
                <p><strong>${player.first_name} ${player.last_name}</strong></p>
                <p>${player.age} Years · ${player.matches} Matches</p>
            </div>
            <div class="inline center">
                <p class="muted">Rest</p>
            </div>
            <div class="inline gap center space-between">
                <p><strong>${player.ovr}</strong></p>
                <p class="position"><strong>${returnPlayerPosition(player.idPerson)}</strong></p>
            </div>
        </div>
    `;
    playerContainer.appendChild(article);

    article.onclick = (event) => {
        const multiSelect = event.ctrlKey || event.metaKey
        const multipleSelected = selectedPlayers.length <= teams.find(team => team.idTeam === active_idTeam).players.length && selectedPlayers.length > 1;
        const alreadySelected = selectedPlayers.some(pl => pl.idPerson === player.idPerson);

        if (multiSelect) {
            if (alreadySelected) {
                article.classList.remove("active");
                selectedPlayers = selectedPlayers.filter(pl => pl.idPerson !== player.idPerson);
                allSlots().find(slot => Number(slot.dataset.idPerson) === player.idPerson)?.classList.remove("selected");
            }
            else {
                article.classList.add("active");
                selectedPlayers.push(player);
                allSlots().find(slot => Number(slot.dataset.idPerson) === player.idPerson)?.classList.add("selected");
            }
        }
        else {
            Array.from(playerContainer.children).forEach(ch => ch.classList.remove("active"));
            allSlots().forEach(ch => ch.classList.remove("selected"));

            if (multipleSelected) {
                article.classList.add("active");
                selectedPlayers = [player];
                allSlots().find(slot => Number(slot.dataset.idPerson) === player.idPerson)?.classList.add("selected");
            }
            else if (alreadySelected) {
                selectedPlayers = [];
            }
            else {
                article.classList.add("active");
                selectedPlayers = [player];
                allSlots().find(slot => Number(slot.dataset.idPerson) === player.idPerson)?.classList.add("selected");
            }
        }

        checkForMultiSelection();

        configureSelectAll();
        configureSelection();
    }
}

function returnPlayerPosition(idPerson) {
    let position = "RES"

    const playerInLineup = teams.find(team => team.idTeam === active_idTeam).lineup.find(player => player.idPerson === idPerson);
    if (playerInLineup !== undefined) position = playerInLineup.positionCode;

    return position;
}

function checkForMultiSelection() {
    const detailsContainer = document.getElementById("detailsContainer");
    const detailsBlock = document.getElementById("detailsBlock");

    if (selectedPlayers.length !== 1) {
        detailsContainer.hidden  = true;
        detailsBlock.hidden  = false;

        const playerCounts = document.querySelectorAll(".player-count");
        playerCounts.forEach(pC =>  pC.textContent = `${selectedPlayers.length} Players` );
    }
    else {
        detailsContainer.hidden  = false;
        detailsBlock.hidden  = true;
    }
}

// ====================
// UI_initPlayerActions
// ====================

const buttonSelectAll = document.getElementById("buttonSelectAll");
const buttonDeselectAll = document.getElementById("buttonDeselectAll");
const selectTraining = document.getElementById("selectTraining");
const transferMarkt = document.getElementById("transferMarkt");
const transferTeam = document.getElementById("transferTeam");

function UI_initPlayerActions() {
    Array.from(transferTeam.options).forEach(option => { if(option.value !== "") option.remove(); })
    teams.forEach(team => { if (team.idTeam !== active_idTeam) transferTeam.append(new Option(team.name, team.idTeam)); })

    checkForMultiSelection();

    configureSelectAll();
    configureSelection();
}

//buttonSelectAll
buttonSelectAll.onclick = () => {
    Array.from(playerContainer.children).forEach(child => child.classList.add("active"));
    selectedPlayers = teams.find(team => team.idTeam === active_idTeam).players.slice();
    allSlots().filter(slot => slot.dataset.idPerson !== "").forEach(slot => slot.classList.add("selected"));
    
    checkForMultiSelection();

    configureSelectAll();
    configureSelection();
}

//buttonDeselectAll
buttonDeselectAll.onclick = () => {
    Array.from(playerContainer.children).forEach(child => child.classList.remove("active"));
    selectedPlayers = [];
    allSlots().filter(slot => slot.dataset.idPerson !== "").forEach(slot => slot.classList.remove("selected"));

    checkForMultiSelection();

    configureSelectAll();
    configureSelection();
}

//selectTraining
selectTraining.onchange = async () => {
    const packages = [
        { name: "implementFunction", exec: () => console.log("TODO: implement function") }
    ]
    await execPackages(packages);
}

//transferMarkt
transferMarkt.onchange = async () => {
    const packages = [
        { name: "implementFunction", exec: () => console.log("TODO: implement function") }
    ]
    await execPackages(packages);
}

//transferTeam
transferTeam.onchange = async () => {
    const packages = [
        { name: "implementFunction", exec: () => console.log("TODO: implement function") }
    ]
    await execPackages(packages);
}

function configureSelectAll() {
    const allActive = Array.from(playerContainer.children).every(ch => ch.classList.contains("active"));
    buttonSelectAll.hidden = allActive;
    buttonDeselectAll.hidden = !allActive;
}

function configureSelection() {
    const isActiveSelection = selectedPlayers.length > 0;
    selectTraining.disabled = !isActiveSelection;
    transferMarkt.disabled = !isActiveSelection;
    transferTeam.disabled = !isActiveSelection;

    if(selectedPlayers.length === 1) { footballPitch.classList.add("has-selected-player"); bench.classList.add("has-selected-player"); }
    else { footballPitch.classList.remove("has-selected-player"); bench.classList.remove("has-selected-player"); }
}

// ===============
// Stats & History
// ===============

const buttonStats = document.getElementById("buttonStats");
const buttonHistory = document.getElementById("buttonHistory");

function UI_initStatsHistory() {
    
}

buttonStats.onclick = () => {
    if (buttonStats.classList.contains("active")) return;

    buttonStats.classList.toggle("active");
    buttonHistory.classList.toggle("active");
}

buttonHistory.onclick = () => {
    if (buttonHistory.classList.contains("active")) return;

    buttonStats.classList.toggle("active");
    buttonHistory.classList.toggle("active");
}

// ================
// Lineup & Tactics
// ===============

//General
const buttonLineup = document.getElementById("buttonLineup");
const buttonTactics = document.getElementById("buttonTactics");

const lineupView = document.getElementById("lineupView");
const tacticsView = document.getElementById("tacticsView");

const lineupHelp = document.getElementById("lineupHelp");
const tacticsHelp = document.getElementById("tacticsHelp");

//Lineup
const footballPitch = document.getElementById("footballPitch");
const bench = document.getElementById("bench");
const pitchSlots = Array.from(footballPitch.children);
function allSlots() { return [...footballPitch.children, ...bench.children]; }

const lineupStatus = document.getElementById("lineupStatus");

function UI_initLineupTactics() {
    setupLineup();
    updateFormation();
}

function setupLineup() {
    allSlots().forEach(slot => setupSlot(slot));
}

function setupSlot(slot) {
    const lineupEntry = teams.find(team => team.idTeam === active_idTeam).lineup.find(entry => entry.positionCode === slot.dataset.positionCode);

    if (lineupEntry === undefined) {
        slot.classList.remove("assigned");
        slot.dataset.idPerson = "";
        slot.children[1].textContent = "Empty";
    }
    else {
        slot.classList.add("assigned");
        slot.dataset.idPerson = `${lineupEntry.idPerson}`;
        slot.children[1].textContent = teams.find(team => team.idTeam === active_idTeam).players.find(player => player.idPerson === lineupEntry.idPerson).last_name;
    }
}

function updateFormation() {
    const allPlayer = pitchSlots.filter(slot => slot.dataset.idPerson !== "");
    const countPlayer = allPlayer.length;
    
    const Goalkeeper = allPlayer.filter(slot => slot.dataset.line === "Goalkeeper").length;
    const Defense = allPlayer.filter(slot => slot.dataset.line === "Defense").length;
    const Midfield = allPlayer.filter(slot => slot.dataset.line === "Midfield").length;
    const Attack = allPlayer.filter(slot => slot.dataset.line === "Attack").length;

    if (Goalkeeper !== 1) {
        lineupStatus.classList.remove("complete");
        lineupStatus.textContent = "Missing GK";
    }
    else if (countPlayer === 11) {
        lineupStatus.classList.add("complete");
        lineupStatus.textContent = `${Defense}-${Midfield}-${Attack}`
    }
    else {
        lineupStatus.classList.remove("complete");
        lineupStatus.textContent = `${countPlayer}/11 Players`;
    }
}

buttonLineup.onclick = () => {
    if (buttonLineup.classList.contains("active")) return;

    buttonLineup.classList.add("active");
    buttonTactics.classList.remove("active");

    lineupView.hidden = false;
    tacticsView.hidden = true;

    lineupHelp.hidden = false;
    tacticsHelp.hidden = true;
}

buttonTactics.onclick = () => {
    if (buttonTactics.classList.contains("active")) return;

    buttonTactics.classList.add("active");
    buttonLineup.classList.remove("active");

    lineupView.hidden = true;
    tacticsView.hidden = false;

    lineupHelp.hidden = true;
    tacticsHelp.hidden = false;
}

// Lineup functions

async function assignLineup(idPerson, positionCode) {
    const packages = [
        { name: "insertLineup", exec: () => insertLineupEntry(active_idTeam, idPerson, positionCode) },
        { name: "fetchLineups", exec: fetchLineups }
    ]
    await execPackages(packages);
}

async function revokeLineup(positionCode) {
    const packages = [
        { name: "deleteLineup", exec: () => deleteLineupEntry(active_idTeam, positionCode) },
        { name: "fetchLineups", exec: fetchLineups }
    ]
    await execPackages(packages);
}

for (const slot of allSlots()) {
    slot.onclick = async () => {
        
        if (slot.parentElement.classList.contains("has-selected-player")) {
            // Catch transfer to same pitch slot as player deselection
            if (Number(slot.dataset.idPerson) === selectedPlayers[0].idPerson) {
                Array.from(playerContainer.children).find(child => Number(child.dataset.idPerson) === selectedPlayers[0].idPerson).click();
                return;
            }
            
            // Catch player from beeing assigned more than one time
            for (const slot of allSlots()) if (Number(slot.dataset.idPerson) === selectedPlayers[0].idPerson) await revokeLineup(slot.dataset.positionCode);

            //Revoke old entry to assign new one in the next step
            if (slot.dataset.idPerson !== "") await revokeLineup(slot.dataset.positionCode);
            
            //Store old button to restore selection later
            const origIdPerson = selectedPlayers[0].idPerson;
            
            await assignLineup(selectedPlayers[0].idPerson, slot.dataset.positionCode);

            UI_initPlayers();
            UI_initPlayerActions();
            UI_initLineupTactics();

            //Restore old selection with click
            const newArticle = Array.from(playerContainer.children).find(child => Number(child.dataset.idPerson) === origIdPerson);
            if (newArticle) newArticle.click();
        }
        else if (slot.classList.contains("assigned")) {
            const chosenArticle = Array.from(playerContainer.children).find(child => Number(child.dataset.idPerson) === Number(slot.dataset.idPerson));
            if (chosenArticle) {
                chosenArticle.click();

                chosenArticle.scrollIntoView({
                    behavior: "smooth",
                    block: "center",
                    inline: "nearest"
                });
            }
        }
    }

    slot.oncontextmenu = async (event) => {
        event.preventDefault();

        if (slot.dataset.idPerson !== "") {
            await revokeLineup(slot.dataset.positionCode);
            
            UI_initPlayers();
            UI_initPlayerActions();
            UI_initLineupTactics();
        }
    }
}

// Tactics functions

const tacticsPresetSelect = document.getElementById("tacticsPresetSelect");
const tacticsPresetDescription = document.getElementById("tacticsPresetDescription");
const tacticsTotalValue = document.getElementById("tacticsTotalValue");
const tacticsTotalBadge = document.getElementById("tacticsTotalBadge");
const buttonResetTactics = document.getElementById("buttonResetTactics");

const tacticControls = {
    pace: {
        range: document.getElementById("tacticsPaceRange"),
        input: document.getElementById("tacticsPaceInput")
    },

    endurance: {
        range: document.getElementById("tacticsEnduranceRange"),
        input: document.getElementById("tacticsEnduranceInput")
    },

    strength: {
        range: document.getElementById("tacticsStrengthRange"),
        input: document.getElementById("tacticsStrengthInput")
    },

    positioning: {
        range: document.getElementById("tacticsPositioningRange"),
        input: document.getElementById("tacticsPositioningInput")
    },

    ball_control: {
        range: document.getElementById("tacticsBallControlRange"),
        input: document.getElementById("tacticsBallControlInput")
    },

    passing: {
        range: document.getElementById("tacticsPassingRange"),
        input: document.getElementById("tacticsPassingInput")
    },

    shooting: {
        range: document.getElementById("tacticsShootingRange"),
        input: document.getElementById("tacticsShootingInput")
    },

    duel: {
        range: document.getElementById("tacticsDuelRange"),
        input: document.getElementById("tacticsDuelInput")
    }
};

const tacticPresets = {
    "tiki-taka": {
        description:
            "Short passing, close control and intelligent positioning.",

        values: {
            pace: 8,
            endurance: 10,
            strength: 5,
            positioning: 18,
            ball_control: 20,
            passing: 25,
            shooting: 7,
            duel: 7
        }
    },

    "high-press": {
        description:
            "High intensity pressing with strong endurance and pace.",

        values: {
            pace: 15,
            endurance: 20,
            strength: 10,
            positioning: 15,
            ball_control: 10,
            passing: 10,
            shooting: 8,
            duel: 12
        }
    },

    counter: {
        description:
            "Fast transitions and direct attacks after winning possession.",

        values: {
            pace: 25,
            endurance: 10,
            strength: 8,
            positioning: 12,
            ball_control: 8,
            passing: 8,
            shooting: 17,
            duel: 12
        }
    },

    possession: {
        description:
            "Controlled possession with strong passing and ball control.",

        values: {
            pace: 8,
            endurance: 12,
            strength: 5,
            positioning: 18,
            ball_control: 20,
            passing: 22,
            shooting: 5,
            duel: 10
        }
    },

    "wing-play": {
        description:
            "Wide attacking play with pace, passing and ball control.",

        values: {
            pace: 20,
            endurance: 12,
            strength: 8,
            positioning: 10,
            ball_control: 15,
            passing: 15,
            shooting: 10,
            duel: 10
        }
    },

    defensive: {
        description:
            "Deep defensive organisation with strength and duelling.",

        values: {
            pace: 5,
            endurance: 15,
            strength: 20,
            positioning: 20,
            ball_control: 8,
            passing: 8,
            shooting: 4,
            duel: 20
        }
    },

    "direct-play": {
        description:
            "Direct passing and fast finishing with a balanced structure.",

        values: {
            pace: 15,
            endurance: 10,
            strength: 12,
            positioning: 12,
            ball_control: 8,
            passing: 20,
            shooting: 15,
            duel: 8
        }
    },

    balanced: {
        description:
            "A balanced tactical approach without a strong focus on one specific team skill.",

        values: {
            pace: 12.5,
            endurance: 12.5,
            strength: 12.5,
            positioning: 12.5,
            ball_control: 12.5,
            passing: 12.5,
            shooting: 12.5,
            duel: 12.5
        }
    }
};

function setTacticValues(values) {
    for (const [name, value] of Object.entries(values)) {
        const control = tacticControls[name];

        control.range.value = value;
        control.input.value = value;
    }

    updateTacticsTotal();
}

function updateTacticsTotal() {
    const total = Object.values(tacticControls).reduce(
        (sum, control) => sum + Number(control.input.value || 0), 0
    );

    tacticsTotalValue.textContent = `${total}%`;

    tacticsTotalBadge.classList.toggle(
        "invalid",
        Math.abs(total - 100) > 0.001
    );
}

function markTacticsAsCustom() {
    tacticsPresetSelect.value = "custom";

    tacticsPresetDescription.textContent =
        "Individual values adjusted manually.";
}

tacticsPresetSelect.onchange = () => {
    const selectedPreset = tacticsPresetSelect.value;

    if (selectedPreset === "custom") {
        tacticsPresetDescription.textContent =
            "Individual values adjusted manually.";

        return;
    }

    const preset = tacticPresets[selectedPreset];

    if (!preset) return;

    tacticsPresetDescription.textContent = preset.description;

    setTacticValues(preset.values);

    //set tactic preset on db
};

for (const control of Object.values(tacticControls)) {
    control.range.oninput = () => {
        control.input.value = control.range.value;

        markTacticsAsCustom();
        updateTacticsTotal();
    };

    control.input.oninput = () => {
        let value = Number(control.input.value);

        if (!Number.isFinite(value)) value = 0;

        value = Math.max(0, Math.min(100, value));

        control.input.value = value;
        control.range.value = value;

        markTacticsAsCustom();
        updateTacticsTotal();
    };
}

buttonResetTactics.onclick = () => {
    tacticsPresetSelect.value = "balanced";

    const preset = tacticPresets.balanced;

    tacticsPresetDescription.textContent = preset.description;

    setTacticValues(preset.values);
};

setTacticValues(tacticPresets.balanced.values);

//TODO räume tactic kram auf und binde sendTactics vernünftig an
async function sendTactics() {
    const tactics = Object.fromEntries(
        Object.entries(tacticControls).map(([key, control]) => [
            key,
            Number(control.range.value) * 100
        ])
    );

    const packages = [
        { name: "updateTactics", exec: () => updateTactics(active_idTeam, tactics) }
    ]
    await execPackages(packages);
}