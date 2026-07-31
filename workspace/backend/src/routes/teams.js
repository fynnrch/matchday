

export default class Teams {
    constructor(app, auth, db) {
        this.app = app;
        this.auth = auth;
        this.db = db;

        this.regEndpoint_fetchTeams();
    }

    regEndpoint_fetchTeams() {
        this.app.get("/api/teams/fetch", this.auth.requireAuth_API, async (req, res) => {

            // Return all teams from the current subject
            const[teams] = await this.db.query(
                `
                select idTeam, name from Teams where idClub in (select idClub from Users where idUser = ?)
                `,
                [req.sub]
            );

            return res.json(teams);
        });
    }
}