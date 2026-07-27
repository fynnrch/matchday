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
        if (teams.length === 0) return; //TODO implement schutz gegen user ohne teams
        
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
    article.innerHTML = `
        <div class="inline enable-flex space-between">
            <div>
                <p><strong>${player.firstname} ${player.lastname}</strong></p>
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
        const allSelected = selectedPlayers.length === teams.find(team => team.idTeam === active_idTeam).players.length;
        const alreadySelected = selectedPlayers.some(pl => pl.idPerson === player.idPerson);

        if (multiSelect) {
            if (alreadySelected) {
                article.classList.remove("active");
                selectedPlayers = selectedPlayers.filter(pl => pl.idPerson !== player.idPerson);
            }
            else {
                article.classList.add("active");
                selectedPlayers.push(player);
            }
        }
        else {
            Array.from(playerContainer.children).forEach(ch => ch.classList.remove("active"));

            if (allSelected) {
                article.classList.add("active");
                selectedPlayers = [player];
            }
            else if (alreadySelected) {
                selectedPlayers = [];
            }
            else {
                article.classList.add("active");
                selectedPlayers = [player];
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
    if (playerInLineup !== undefined) position = playerInLineup.pos;

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
    
    checkForMultiSelection();

    configureSelectAll();
    configureSelection();
}

//buttonDeselectAll
buttonDeselectAll.onclick = () => {
    Array.from(playerContainer.children).forEach(child => child.classList.remove("active"));
    selectedPlayers = [];

    checkForMultiSelection();

    configureSelectAll();
    configureSelection();
}

// TODO
// Wenn irgendeine FUnktion wie verschieben zwischen zwei teams zb läuft eine art loading pop up screen rüberjagen zur sicherheit
// oder betreffenden button einfach erstmal ausgrauen bzw select, ggfs popup mit sucessfull aber weiss nicht

//selectTraining
selectTraining.onchange = () => {
    console.log("TODO: Implement function")
}

//transferMarkt
transferMarkt.onchange = () => {
    console.log("TODO: Implement function")
}

//transferTeam
transferTeam.onchange = () => {
    console.log("TODO: Implement function")
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

const buttonLineup = document.getElementById("buttonLineup");
const buttonTactics = document.getElementById("buttonTactics");

const footballPitch = document.getElementById("footballPitch");
const bench = document.getElementById("bench");
const allSlots = Array.from(footballPitch.children).concat(Array.from(bench.children));

// TODO
// Wenn irgendeine FUnktion läuft im fetch ladebildschirm
// oder betreffenden button einfach erstmal ausgrauen bzw select, ggfs popup mit sucessfull aber weiss nicht

function UI_initLineupTactics() {
    setupLineup();
    updateFormation();
}

function setupLineup() {
    const activeTeam = teams.find(team => team.idTeam === active_idTeam);
    activeTeam.lineup.forEach(entry => setupSlot(entry));
}

function setupSlot(entry) {
    const slot = getSlot(entry.pos);
    
    if (entry.idPerson === null) {
        slot.classList.remove("assigned");
        slot.dataset.idPerson = "";
        slot.children[1].textContent = "Empty";
    }
    else {
        slot.classList.add("assigned");
        slot.dataset.idPerson = `${entry.idPerson}`;
        slot.children[1].textContent = teams.find(team => team.idTeam === active_idTeam).players.find(player => player.idPerson === entry.idPerson).lastname;
    }
}

function getSlot(pos) {
    return allSlots.find(slot => slot.dataset.position === pos);
}

function updateFormation() {
    //TODO implement
}

buttonLineup.onclick = () => {
    if (buttonLineup.classList.contains("active")) return;

    buttonLineup.classList.toggle("active");
    buttonTactics.classList.toggle("active");
}

buttonTactics.onclick = () => {
    if (buttonTactics.classList.contains("active")) return;

    buttonLineup.classList.toggle("active");
    buttonTactics.classList.toggle("active");
}

async function assignLineup(idPerson, pos) {
    teams.find(team => team.idTeam === active_idTeam).lineup.find(entry => entry.pos === pos).idPerson = idPerson;

    //fetch /api/lineup/assign#(idPerson, pos)
    /*
    const packages = [
        { name: "Lineup", load: fetchLineup }
    ]
    await loadData(packages);*/
}

async function revokeLineup(pos) {
    teams.find(team => team.idTeam === active_idTeam).lineup.find(entry => entry.pos === pos).idPerson = null;

    //fetch /api/lineup/assign#(idPerson, pos)
    /*
    const packages = [
        { name: "Lineup", load: fetchLineup }
    ]
    await loadData(packages);*/
}

for (const slot of allSlots) {
    slot.onclick = async () => {
        if (slot.parentElement.classList.contains("has-selected-player")) {
            //Revoke last entry from lineup
            if (slot.dataset.idPerson !== "") await revokeLineup(slot.dataset.position);
            //Revoke double player entries from roster
            for (const tmpSlot of allSlots) if (Number(tmpSlot.dataset.idPerson) === selectedPlayers[0].idPerson) await revokeLineup(tmpSlot.dataset.position);
            
            await assignLineup(selectedPlayers[0].idPerson, slot.dataset.position);

            UI_initPlayers();
            UI_initPlayerActions();
            UI_initLineupTactics();
        }
    }

    slot.oncontextmenu = async (event) => {
        event.preventDefault();

        if (slot.dataset.idPerson !== "") {
            await revokeLineup(slot.dataset.position);
            
            UI_initPlayers();
            UI_initPlayerActions();
            UI_initLineupTactics();
        }
    }
}