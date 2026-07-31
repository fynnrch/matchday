

export default class Lineups {
    constructor(app, auth, db) {
        this.app = app;
        this.auth = auth;
        this.db = db;
        
        this.regEndpoint_fetchLineups();
        this.regEndpoint_insertLineups();
        this.regEndpoint_deleteLineups();
    }

    regEndpoint_fetchLineups() {
        this.app.get("/api/lineups/fetch/:idTeam", this.auth.requireAuth_API, async (req, res) => {
            const idTeam = Number(req.params.idTeam);
            
            // Return all lineups from idTeam
            const[lineup] = await this.db.query(
                `
                select idPerson, positionCode from Lineups
                where idTeam = ? and idTeam in (select idTeam from Teams where idClub in (select idClub from Users where idUser = ?));
                `,
                [idTeam, req.sub]
            );

            return res.json(lineup);
        });
    }

    regEndpoint_insertLineups() {
        this.app.post("/api/lineups/insert/:idTeam", this.auth.requireAuth_API, async (req, res) => {
            const idTeam = Number(req.params.idTeam);
            const { idPerson, positionCode } = req.body;

            if (!Number.isInteger(idTeam)) return res.status(400).json({ res: "Invalid idTeam" });
            if (!Number.isInteger(idPerson) || !positionCode) return res.status(400).json({ res: "Invalid lineup data" });
            
            let connection;

            try {
                connection = await this.db.getConnection();
                await connection.beginTransaction();

                //Check if idTeam belongs to sub and idPerson belongs to idTeam
                const[checkup] = await connection.query(
                    `
                    select 1 from Teams
                    where idTeam = ? and idTeam in (select idTeam from Teams where idClub in (select idClub from Users where idUser = ?))
                    and ? in (select idPerson from v_players_teams_active where idTeam = ?) LIMIT 1;
                    `,
                    [idTeam, req.sub, idPerson, idTeam]
                );
                if (checkup.length === 0) {
                    const error = new Error("Wrong parameter combination");
                    error.code = "WRONG_PARAMETER_COMBINATION";
                    throw error;
                }

                await connection.query(
                    `
                    INSERT INTO Lineups (idTeam, idPerson, positionCode)
                    VALUES (?, ?, ?)
                    `,
                    [idTeam, idPerson, positionCode]
                );

                await connection.commit();

                return res.status(201).json({ res: "Lineup entry created" });
            }
            catch (err) {
                await connection?.rollback();

                if (err.code === "ER_DUP_ENTRY") return res.status(409).json({ res: "Lineup entry already exists" });
                else if (err.code === "WRONG_PARAMETER_COMBINATION") return res.status(403).json({ res: "Wrong parameter combination" });
                else return res.status(500).json({ res: "Internal server error" });
            }
            finally {
                connection?.release();
            }
        });
    }

    regEndpoint_deleteLineups() {
        this.app.delete("/api/lineups/delete/:idTeam", this.auth.requireAuth_API, async (req, res) => {
            const idTeam = Number(req.params.idTeam);
            const { positionCode } = req.body;

            if (!Number.isInteger(idTeam)) return res.status(400).json({ res: "Invalid idTeam" });
            if (!positionCode) return res.status(400).json({ res: "Invalid lineup data" });
            
            let connection;

            try {
                connection = await this.db.getConnection();
                await connection.beginTransaction();

                //Check if idTeam belongs to sub
                const[checkup] = await connection.query(
                    `
                    select 1 from Teams
                    where idTeam = ? and idTeam in (select idTeam from Teams where idClub in (select idClub from Users where idUser = ?));
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
                    DELETE FROM Lineups
                    WHERE idTeam = ? AND positionCode = ?
                    ;`,
                    [idTeam, positionCode]
                );
                if (result.affectedRows === 0) {
                    const error = new Error("Lineup entry not found");
                    error.code = "LINEUP_ENTRY_NOT_FOUND";
                    throw error;
                }

                await connection.commit();

                return res.status(200).json({ res: "Lineup entry deleted" });
            }
            catch (err) {
                await connection?.rollback();

                if (err.code === "WRONG_PARAMETER_COMBINATION") return res.status(403).json({ res: "Wrong parameter combination" });
                else if (err.code === "LINEUP_ENTRY_NOT_FOUND") return res.status(404).json({ res: "Lineup entry not found" });
                else return res.status(500).json({ res: "Internal server error" });
            }
            finally {
                connection?.release();
            }
        });
    }
}