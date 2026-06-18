const express = require("express");
const fs = require("fs");
const path = require("path");

const router = express.Router();

const { requireAuth } = require("../middleware/auth");

module.exports = (db) => {

    function getReportDirectory() {
        const possibleFolders = [
            path.join(process.cwd(), "report_output"),
            path.join(process.cwd(), "report-output"),
            path.join(process.cwd(), "generated-reports"),
            path.join(__dirname, "../report_output")
        ];

        return possibleFolders.find(folder => fs.existsSync(folder));
    }

    function getReports() {
        const reportDir = getReportDirectory();

        console.log("REPORT DIR FOUND:", reportDir);

        if (!reportDir) {
            return [];
        }

        return fs.readdirSync(reportDir)
            .filter(file => file.toLowerCase().endsWith(".pdf"))
            .map(file => {
                const filePath = path.join(reportDir, file);
                const stats = fs.statSync(filePath);

                return {
                    file_name: file,
                    created_at: stats.mtime.toLocaleString(),
                    download_url: `/download-file/${encodeURIComponent(file)}`
                };
            })
            .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
            .slice(0, 5);
    }

    router.get("/dashboard", requireAuth, (req, res) => {
        db.all("SELECT * FROM accounts WHERE active = 1", [], (err, projects) => {
            if (err) {
                console.error("ACCOUNTS ERROR:", err.message);
                return res.status(500).send("Database Error");
            }

            const reports = getReports();

            res.render("dashboard", {
                user: req.session.user,
                projects: projects || [],
                reports
            });
        });
    });

    router.get("/reports", requireAuth, (req, res) => {
        const reports = getReports();

        res.render("reports", {
            user: req.session.user,
            reports
        });
    });

    router.post("/generate-report", requireAuth, (req, res) => {
        const { project, startDate, endDate } = req.body;

        if (!project || !startDate || !endDate) {
            return res.status(400).send("All fields are required.");
        }

        if (new Date(endDate) < new Date(startDate)) {
            return res.status(400).send("End date cannot be before start date.");
        }

        res.redirect("/dashboard");
    });

    router.get("/download-file/:filename", requireAuth, (req, res) => {
        const reportDir = getReportDirectory();

        if (!reportDir) {
            return res.status(404).send("Report folder not found.");
        }

        const filename = path.basename(req.params.filename);
        const filePath = path.join(reportDir, filename);

        if (!fs.existsSync(filePath)) {
            return res.status(404).send("Report not found.");
        }

        res.download(filePath, filename);
    });

    return router;
};