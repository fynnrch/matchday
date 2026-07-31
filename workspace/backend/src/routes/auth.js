import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const JWT_SECRET = "secret";

export default class Auth {
    constructor(app, db) {
        this.app = app;
        this.db = db
    
        this.regEndpoint_Register();
        this.regEndpoint_Login();
        this.regEndpoint_Refresh();
        this.regEndpoint_Logout();
    }

    regEndpoint_Register() {
        this.app.post("/api/auth/register", async (req, res) => {
            let connection;

            try {
                const { inpEmail, inpUsername, inpPassword, inpClubname, inpAbbreviation } = req.body;

                if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(inpEmail)) return res.status(400).json({ res: "Invalid email" });
                if (!/^[a-zA-Z0-9_.\- ]+$/.test(inpUsername)) return res.status(400).json({ res: "Invalid username" });
                if (!/^[a-zA-Z0-9_.\- ]+$/.test(inpClubname)) return res.status(400).json({ res: "Invalid clubname" });
                if (!/^[a-zA-Z0-9_.\- ]+$/.test(inpAbbreviation)) return res.status(400).json({ res: "Invalid abbreviation" });
                
                if (inpUsername.length < 3) return res.status(400).json({ res: "Username too short" });
                if (inpPassword.length < 8) return res.status(400).json({ res: "Password too short" });
                if (inpClubname.length < 3) return res.status(400).json({ res: "Clubname too short" });
                if (inpAbbreviation.length != 5) return res.status(400).json({ res: "Abbreviation should contain 5 letters" });

                const passwordHash = await bcrypt.hash(inpPassword, 12);

                // ==============
                // DB transaction
                // ==============

                connection = await this.db.getConnection();
                await connection.beginTransaction();

                // Find npc club
                const[resSelectClub] = await connection.query(
                    `
                    SELECT idClub
                    FROM Clubs
                    WHERE is_player = 0
                    LIMIT 1
                    `
                );
                if (resSelectClub.length === 0) {
                    const error = new Error("Server full");
                    error.code = "SERVER_FULL";
                    throw error;
                }
                const idClub = resSelectClub[0].idClub;
        
                //Create user upon npc club
                const [resInsertUser] = await connection.query(
                    `
                    INSERT INTO Users (idClub, email, username, password_hash)
                    VALUES (?, ?, ?, ?)
                    `,
                    [idClub, inpEmail, inpUsername, passwordHash]
                );
                const idUser = resInsertUser.insertId;

                //Update Club with user credentials
                const [resUpdateClub] = await connection.query(
                    `
                    UPDATE Clubs
                    SET name = ?,
                        abbreviation = ?,
                        is_player = 1
                    WHERE idClub = ?
                    `,
                    [inpClubname, inpAbbreviation, idClub]
                );

                await connection.commit();

                const token = jwt.sign(
                    {
                        sub: idUser
                    },
                    JWT_SECRET, { expiresIn: "15m" }
                );

                res.cookie("token", token, {
                    httpOnly: true,
                    secure: true,
                    sameSite: "lax",
                    maxAge: 1000 * 60 * 15
                });

                return res.status(201).json({ res: "Registration completed successfully" });
            }
            catch (err) {
                if (connection) await connection.rollback();

                if (err.code === "ER_DUP_ENTRY") return res.status(409).json({ res: "Credentials already taken" });
                else if (err.code === "SERVER_FULL") return res.status(409).json({ res: "Server is full" });
                else return res.status(500).json({ res: "Internal server error" });
            }    
            finally {
                if (connection) connection.release();
            }
        });
    }

    regEndpoint_Login() {
        this.app.post("/api/auth/login", async (req, res) => {
            try {
                const { inpEmail, inpPassword } = req.body;

                if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(inpEmail)) return res.status(400).json({ res: "Invalid email" });

                if (inpPassword.length < 8) return res.status(400).json({ res: "Password too short" });

                // ==============
                // DB query
                // ==============

                const [rows] = await this.db.query(
                    `
                    SELECT idUser, idClub, email, username, password_hash
                    FROM Users
                    WHERE email = ?
                    LIMIT 1
                    `,
                    [inpEmail]
                );

                if (rows.length === 0) return res.status(401).json({ res: "Invalid login credentials"});
                
                const user = rows[0];
                const passwordOk = await bcrypt.compare(inpPassword, user.password_hash);

                if (!passwordOk) return res.status(401).json({ res: "Invalid login credentials"});
                
                const token = jwt.sign(
                    {
                        sub: user.idUser
                    },
                    JWT_SECRET, { expiresIn: "15m" }
                );

                res.cookie("token", token, {
                    httpOnly: true,
                    secure: true,
                    sameSite: "lax",
                    maxAge: 1000 * 60 * 15
                });

                return res.status(200).json({ res: "Login successful" });
            }
            catch {
                return res.status(500).json({ res: "Internal server error" });
            }
        });
    }

    regEndpoint_Refresh() {
        this.app.post("/api/auth/refresh", this.requireAuth_API, async (req, res) => {
            try {
                const token = jwt.sign(
                    {
                        sub: req.sub
                    },
                    JWT_SECRET, { expiresIn: "15m" }
                );

                res.cookie("token", token, {
                    httpOnly: true,
                    secure: true,
                    sameSite: "lax",
                    maxAge: 1000 * 60 * 15
                });

                return res.status(200).json({ res: "Refresh successful" });
            }
            catch {
                return res.status(500).json({ res: "Internal server error" });
            }
        });
    }

    regEndpoint_Logout() {
        this.app.post("/api/auth/logout", (req, res) => {
            res.clearCookie("token", {
                httpOnly: true,
                secure: true,
                sameSite: "lax"
            });
            return res.status(200).json({ res: "Logout successful" });
        });
    }

    requireAuth_API(req, res, next) {
        const token = req.cookies.token;

        if (!token) {
            return res.status(401).json({ res: "Missing token" });
        }

        try {
            const payload = jwt.verify(token, JWT_SECRET);
            req.sub = payload.sub; 

            next();
        } 
        catch {
            return res.status(401).json({ res: "Invalid token" });
        }
    }

    requireAuth_PAGE(req, res, next) {
        const token = req.cookies.token;

        if (!token) {
            return res.redirect("/");
        }

        try {
            const payload = jwt.verify(token, JWT_SECRET);
            req.sub = payload.sub;

            next();
        } 
        catch {
            return res.redirect("/");
        }
    }
}