require("dotenv").config();

const express = require("express");
const session = require("express-session");
const sqlite3 = require("sqlite3").verbose();
const path = require("path");

const app = express();

const db = new sqlite3.Database(
    "./database_temp/database/assessment.sqlite"
);

// View Engine
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Static Assets
app.use(
    "/assets",
    express.static(path.join(__dirname, "assets"))
);

// Sessions
app.use(
    session({
        secret: process.env.SESSION_SECRET || "dev-secret",
        resave: false,
        saveUninitialized: false,
        cookie: {
            httpOnly: true,
            sameSite: "lax",
            maxAge: 1000 * 60 * 60
        }
    })
);

// Routes
const authRoutes = require("./routes/auth")(db);
const dashboardRoutes = require("./routes/dashboard")(db);

app.use("/", authRoutes);
app.use("/", dashboardRoutes);

// Root Route
app.get("/", (req, res) => {
    res.redirect("/login");
});

// 404 Handler
app.use((req, res) => {
    res.status(404).send("Page not found");
});

// Start Server
app.listen(3000, () => {
    console.log("Running on http://localhost:3000");
});

if (require.main === module) {
    app.listen(3000, () => {
        console.log("Running on http://localhost:3000");
    });
}

module.exports = app;