

export default class Dashboard {
    constructor(app, auth, queries) {
        this.app = app;
        this.auth = auth;
        this.queries = queries;

        this.regEndpoint_Index();
    }

    regEndpoint_Index() {
        this.app.get("/api/dashboard/wasauchimmer", this.auth.requireAuth_API, (req, res) => {
            return res.json({ res: "Protected data", user: req.auth });
        });
    }
}