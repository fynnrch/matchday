

export default class Tactics {
    constructor(app, auth, db) {
        this.app = app;
        this.auth = auth;
        this.db = db;

        this.regEndpoint_fetchTactics();
        this.regEndpoint_updateTactics();
    }

    regEndpoint_fetchTactics() {
        this.app.get("/api/tactics/fetch/:idTeam", this.auth.requireAuth_API, async (req, res) => {
            const idTeam = Number(req.params.idTeam);
            
            // Return all lineups from idTeam
            const[tactics] = await this.db.query(
                `
                select pace, endurance, strength, positioning, ball_control, passing, shooting, duel from Tactics
                where idTeam = ? and idTeam in (select idTeam from Teams where idClub in (select idClub from Users where idUser = ?));
                `,
                [idTeam, req.sub]
            );

            return res.json(tactics[0]);
        });
    }

    regEndpoint_updateTactics() {
        this.app.put("/api/tactics/update/:idTeam", this.auth.requireAuth_API, async (req, res) => {
            const idTeam = Number(req.params.idTeam);
            const { tactics } = req.body;

            if (!Number.isInteger(idTeam)  || idTeam <= 0) return res.status(400).json({ res: "Invalid idTeam" });
            if (!tactics || typeof tactics !== "object" || Array.isArray(tactics)) return res.status(400).json({ res: "Invalid tactics object" });

            const requiredKeys = [ "pace", "endurance", "strength", "positioning", "ball_control", "passing", "shooting", "duel" ];
            if (Object.keys(tactics).length !== requiredKeys.length || requiredKeys.some(key => !(key in tactics) || !Number.isFinite(tactics[key]) || tactics[key] < 0 || tactics[key] > 100 * 100) || Object.values(tactics).reduce((sum, value) => sum + value, 0) !== 10000) return res.status(400).json({ res: "Invalid tactics data" });

            let connection;

            try {
                connection = await this.db.getConnection();
                await connection.beginTransaction();

                //Check if idTeam belongs to sub
                const[checkup] = await connection.query(
                    `
                    select 1 from Teams
                    where idTeam = ? and idTeam in (select idTeam from Teams where idClub in (select idClub from Users where idUser = ?)) LIMIT 1;
                    `,
                    [idTeam, req.sub]
                );
                if (checkup.length === 0) {
                    const error = new Error("Wrong parameter combination");
                    error.code = "WRONG_PARAMETER_COMBINATION";
                    throw error;
                }

                const [result] = await connection.query(
                    `
                    UPDATE Tactics
                    SET
                        pace = ?,
                        endurance = ?,
                        strength = ?,
                        positioning = ?,
                        ball_control = ?,
                        passing = ?,
                        shooting = ?,
                        duel = ?
                    WHERE idTeam = ?;
                    `,
                    [tactics.pace, tactics.endurance, tactics.strength, tactics.positioning, tactics.ball_control, tactics.passing, tactics.shooting, tactics.duel, idTeam]
                );
                if (result.affectedRows === 0) {
                    await connection.rollback();
                    return res.status(404).json({ res: "Tactics not found" });
                }

                await connection.commit();

                return res.status(200).json({ res: "Tactics updated" });
            }
            catch (err) {
                await connection?.rollback();

                if (err.code === "WRONG_PARAMETER_COMBINATION") return res.status(403).json({ res: "Wrong parameter combination" });
                else return res.status(500).json({ res: "Internal server error" });
            }
            finally {
                connection?.release();
            }
        });
    }
}