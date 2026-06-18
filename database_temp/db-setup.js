const sqlite3 = require("sqlite3").verbose();
const bcrypt = require("bcrypt");
const path = require("path");
const fs = require("fs");

const dbDir = path.join(__dirname, "database");
const dbPath = path.join(dbDir, "assessment.sqlite");

if (!fs.existsSync(dbDir)) {
    fs.mkdirSync(dbDir);
}

const db = new sqlite3.Database(dbPath);

async function setupDatabase() {
    const adminHash = await bcrypt.hash("AdminPassword123!", 12);
    const userHash = await bcrypt.hash("UserPassword123!", 12);

    db.serialize(() => {
        db.run(`
            CREATE TABLE IF NOT EXISTS users (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                email TEXT UNIQUE NOT NULL,
                password_hash TEXT NOT NULL,
                role TEXT NOT NULL DEFAULT 'user',
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP
            )
        `);

        db.run(`
            CREATE TABLE IF NOT EXISTS accounts (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                account_name TEXT NOT NULL,
                account_reference TEXT UNIQUE NOT NULL,
                location TEXT,
                active INTEGER DEFAULT 1,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP
            )
        `);

        db.run(`
            CREATE TABLE IF NOT EXISTS reports (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                account_id INTEGER NOT NULL,
                generated_by INTEGER NOT NULL,
                start_date TEXT NOT NULL,
                end_date TEXT NOT NULL,
                file_name TEXT NOT NULL,
                file_path TEXT NOT NULL,
                status TEXT DEFAULT 'completed',
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (account_id) REFERENCES accounts(id),
                FOREIGN KEY (generated_by) REFERENCES users(id)
            )
        `);

        db.run(`
            INSERT OR IGNORE INTO users (email, password_hash, role)
            VALUES 
            ('admin@example.com', '${adminHash}', 'admin'),
            ('user@example.com', '${userHash}', 'user')
        `);

        db.run(`
            INSERT OR IGNORE INTO accounts (account_name, account_reference, location)
            VALUES
            ('Demo Care Home', 'ACC-CARE-001', 'Portsmouth'),
            ('Demo School', 'ACC-SCHOOL-001', 'Southampton'),
            ('Demo Office Building', 'ACC-OFFICE-001', 'London'),
            ('Demo Hotel', 'ACC-HOTEL-001', 'Manchester')
        `);

        console.log("Assessment database created successfully.");
        console.log("Database path:", dbPath);
        console.log("Admin login: admin@example.com / AdminPassword123!");
        console.log("User login: user@example.com / UserPassword123!");

        db.close();
    });
}

setupDatabase();