

export default class Players {
    constructor(app, auth, db) {
        this.app = app;
        this.auth = auth;
        this.db = db;

        this.regEndpoint_fetchPlayers();
        this.regEndpoint_fetchPlayerHistorys();
        this.regEndpoint_patchDev();
    }

    regEndpoint_fetchPlayers() {
        this.app.get("/api/players/fetch/:idTeam", this.auth.requireAuth_API, async (req, res) => {
            const idTeam = Number(req.params.idTeam);
            
            // Return all players from idTeam
            const[players] = await this.db.query(
                `
                select pe.idPerson, pe.first_name, pe.last_name, pe.age, pl.pace, pl.endurance, pl.strength, pl.positioning, pl.ball_control, pl.passing, pl.shooting, pl.duel, pl.dev, v.from_season, v.from_day 
                from v_players_teams_active v
                join Players pl using (idPerson)
                join Persons pe using(idPerson)
                where idTeam = ? and idTeam in (select idTeam from Teams where idClub in (select idClub from Users where idUser = ?));
                `,
                [idTeam, req.sub]
            );

            return res.json(players);
        });
    }

    regEndpoint_fetchPlayerHistorys() {
        this.app.get("/api/players/fetchHistory/:idPerson", this.auth.requireAuth_API, async (req, res) => {
            const idPerson = Number(req.params.idPerson);
            
            // Return all player history from idPerson
            const[history] = await this.db.query(
                `
                select c.name, pt.from_season, pt.from_day, pt.to_season, pt.to_day from Players_Teams pt
                join Teams using (idTeam)
                join Clubs c using (idClub)
                where idPerson = ? ORDER BY to_season IS NULL DESC, to_season DESC
                `,
                [idPerson]
            );

            return res.json(history);
        });
    }

    regEndpoint_patchDev() {
        this.app.patch("/api/players/patchDev/:idPerson", this.auth.requireAuth_API, async (req, res) => {
            const idPerson = Number(req.params.idPerson);
            const { newDev } = req.body;

            if (!Number.isInteger(idPerson) || idPerson <= 0) return res.status(400).json({ res: "Invalid idPerson" });
            
            const validDev = ["rest", "pace", "endurance", "strength", "positioning", "ball_control", "passing", "shooting", "duel"];
            if (!validDev.includes(newDev)) return res.status(400).json({ res: "Invalid dev value" });
            
            //Update dev on given Player
            const[result] = await this.db.query(
                `
                update Players
                set dev = ? where idPerson = ? and idPerson in (
                select idPerson from Players_Teams where to_season is null and to_day is null and idTeam in (
                select idTeam from Teams where idClub in (
                select idClub from Users where idUser = ?
                )));
                `,
                [newDev, idPerson, req.sub]
            );
            if (result.affectedRows === 0) {
                return res.status(404).json({ res: "Player not found" });
            }

            return res.status(200).json({ res: "Training patched" });
        });
    }
}