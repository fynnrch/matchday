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
import Dashboard from "./routes/dashboard.js";

// ============
// Custom setup
// ============

const auth = new Auth(app, db);
const queries = new Queries(app, db);

const dashboard = new Dashboard(app, auth, queries);

// ===========
// Page routes
// ===========

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "pages/index.html"));
});

app.get("/dashboard", auth.requireAuth_PAGE, (req, res) => {
    res.sendFile(path.join(__dirname, "pages/dashboard.html"));
});

app.get("/teams", auth.requireAuth_PAGE, (req, res) => {
    res.sendFile(path.join(__dirname, "pages/teams.html"));
});

app.get("/pool", auth.requireAuth_PAGE, (req, res) => {
    res.sendFile(path.join(__dirname, "pages/pool.html"));
});

// ======
// Listen
// ======

app.listen(3000, () => {
    console.log("Backend läuft auf Port 3000");
});