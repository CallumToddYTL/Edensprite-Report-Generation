const express = require("express");
const bcrypt = require("bcrypt");

const router = express.Router();

module.exports = (db) => {

    // Login page
    router.get("/login", (req, res) => {

        if (req.session.user) {
            return res.redirect("/dashboard");
        }

        res.render("login", {
            error: null
        });

    });

    // Login form submission
    router.post("/login", (req, res) => {

        const { email, password } = req.body;

        if (!email || !password) {
            return res.render("login", {
                error: "Please enter an email and password."
            });
        }

        db.get(
            "SELECT * FROM users WHERE email = ?",
            [email],
            async (err, user) => {

                if (err) {
                    console.error(err);

                    return res.render("login", {
                        error: "An error occurred."
                    });
                }

                if (!user) {
                    return res.render("login", {
                        error: "Invalid email or password."
                    });
                }

                const validPassword = await bcrypt.compare(
                    password,
                    user.password_hash
                );

                if (!validPassword) {
                    return res.render("login", {
                        error: "Invalid email or password."
                    });
                }

                req.session.user = {
                    id: user.id,
                    email: user.email,
                    role: user.role
                };

                res.redirect("/dashboard");

            }
        );

    });

    // Logout
    router.post("/logout", (req, res) => {

        req.session.destroy(() => {
            res.redirect("/login");
        });

    });

    return router;
};