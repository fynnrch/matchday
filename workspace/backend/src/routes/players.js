

export default class Players {
    constructor(app, auth, db) {
        this.app = app;
        this.auth = auth;
        this.db = db;

        this.regEndpoint_fetchPlayers();
    }

    regEndpoint_fetchPlayers() {
        this.app.get("/api/players/fetch/:idTeam", this.auth.requireAuth_API, async (req, res) => {
            const idTeam = Number(req.params.idTeam);
            
            // Return all players from idTeam
            const[players] = await this.db.query(
                `
                select pe.idPerson, pe.first_name, pe.last_name, pe.age, pl.pace, pl.endurance, pl.strength, pl.positioning, pl.ball_control, pl.passing, pl.shooting, pl.duel, v.from_season, v.from_day 
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
}