



const teams = ["1. Mannschaft", "2. Mannschaft", "Jugendmannschaft"]
const teamsSwitch = document.getElementById("teamsSwitch");
teams.forEach((team, index) => {
    const option = document.createElement("option");
    option.value = index;
    option.textContent = team;
    teamsSwitch.appendChild(option);
});