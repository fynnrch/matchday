

export default class Queries {
    constructor(app, db) {
        this.app = app;
        this.db = db
    
        this.regEndpoint_checkEmail();
        this.regEndpoint_checkUsername();
        this.regEndpoint_checkClubname();
        this.regEndpoint_checkAbbreviation();
    }

    regEndpoint_checkEmail() {
        this.app.post("/api/queries/checkEmail", async (req, res) => {
            try {    
                const { inp } = req.body;

                if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(inp)) return res.status(400).json({ res: "Invalid email" });

                const [rows] = await this.db.query(
                    `
                    SELECT 1
                    FROM Users
                    WHERE email = ?
                    LIMIT 1
                    `,
                    [inp]
                );

                if (rows.length > 0) {
                    return res.status(409).json({ res: "Already taken" });
                }

                return res.status(200).json({ res: "Available" }); 
            }
            catch {
                return res.status(500).json({ res: "Internal server error" }); 
            }
        });
    }

    regEndpoint_checkUsername() {
        this.app.post("/api/queries/checkUsername", async (req, res) => {
            try {    
                const { inp } = req.body;

                if (!/^[a-zA-Z0-9_.\- ]+$/.test(inp)) return res.status(400).json({ res: "Invalid username" });
                if (inp.length < 3) return res.status(400).json({ res: "Username too short" });

                const [rows] = await this.db.query(
                    `
                    SELECT 1
                    FROM Users
                    WHERE username = ?
                    LIMIT 1
                    `,
                    [inp]
                );

                if (rows.length > 0) {
                    return res.status(409).json({ res: "Already taken" });
                }

                return res.status(200).json({ res: "Available" }); 
            }
            catch {
                return res.status(500).json({ res: "Internal server error" }); 
            }
        });
    }

    regEndpoint_checkClubname() {
        this.app.post("/api/queries/checkClubname", async (req, res) => {
            try {
                const { inp } = req.body;

                if (!/^[a-zA-Z0-9_.\- ]+$/.test(inp)) return res.status(400).json({ res: "Invalid clubname" });
                if (inp.length < 3) return res.status(400).json({ res: "Clubname too short" });

                const [rows] = await this.db.query(
                    `
                    SELECT 1
                    FROM Clubs
                    WHERE name = ?
                    LIMIT 1
                    `,
                    [inp]
                );

                if (rows.length > 0) {
                    return res.status(409).json({ res: "Already taken" });
                }

                return res.status(200).json({ res: "Available" }); 
            }
            catch {
                return res.status(500).json({ res: "Internal server error" }); 
            }
        });
    }

    regEndpoint_checkAbbreviation() {
        this.app.post("/api/queries/checkAbbreviation", async (req, res) => {
            try {
                const { inp } = req.body;

                if (!/^[a-zA-Z0-9_.\- ]+$/.test(inp)) return res.status(400).json({ res: "Invalid abbreviation" });
                if (inp.length != 5) return res.status(400).json({ res: "Abbreviation should contain 5 letters" });

                const [rows] = await this.db.query(
                    `
                    SELECT 1
                    FROM Clubs
                    WHERE abbreviation = ?
                    LIMIT 1
                    `,
                    [inp]
                );

                if (rows.length > 0) {
                    return res.status(409).json({ res: "Already taken" });
                }

                return res.status(200).json({ res: "Available" }); 
            }
            catch {
                return res.status(500).json({ res: "Internal server error" }); 
            }
        });
    }
}