// ===============
// Generic imports
// ===============

import express from "express";
import mysql from "mysql2/promise";
import cors from "cors";
import path from "path";
import cookieParser from "cookie-parser";
import { fileURLToPath } from "url";

// =============
// Generic setup
// =============

const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(cors());
app.use(express.json());
app.use(cookieParser());
app.use("/assets", express.static(path.join(__dirname, "public")));

const db = mysql.createPool({
    host: "mariadb",
    port: 3306,

    user: "apiuser",
    password: "apiuser",

    database: "server_1",

    connectionLimit: 10
});

// ==============
// Custom imports
//===============

import Queries from "./routes/queries.js";
import Auth from "./routes/auth.js";

import Lineups from "./routes/lineups.js";
import Players from "./routes/players.js";
import Tactics from "./routes/tactics.js";
import Teams from "./routes/teams.js";

// ============
// Custom setup
// ============

const auth = new Auth(app, db);
const queries = new Queries(app, db);

const lineups = new Lineups(app, auth, db);
const players = new Players(app, auth, db);
const tactics = new Tactics(app, auth, db);
const teams = new Teams(app, auth, db);

// ===========
// Page routes
// ===========

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "pages/index.html"));
});

app.get("/dashboard", auth.requireAuth_PAGE, (req, res) => {
    res.sendFile(path.join(__dirname, "pages/dashboard.html"));
});

app.get("/teammanagement", auth.requireAuth_PAGE, (req, res) => {
    res.sendFile(path.join(__dirname, "pages/teammanagement.html"));
});

app.get("/talentpool", auth.requireAuth_PAGE, (req, res) => {
    res.sendFile(path.join(__dirname, "pages/talentpool.html"));
});

// ======
// Listen
// ======

app.listen(3000, () => {
    console.log("Backend läuft auf Port 3000");
});