# Edensprite Report Generation Portal

This project is a secure web-based front-end application for generating and downloading PDF reports from stored Edensprite reporting data.

The application was created for the Software Engineering and DevOps module and is based on an internal Edensprite reporting workflow. For security and data protection reasons, this public repository does **not** contain live company data, live Salus credentials, production database credentials or real client reporting records.

## Purpose of the Application

The original Edensprite report generation process was executed through a Node.js command-line tool. This required technical knowledge to operate and was not suitable for wider internal use.

This project provides a web interface that allows authorised users to:

* Log in securely.
* View available demonstration accounts.
* Select a reporting period.
* Access previously generated PDF reports.
* Download report files through protected routes.

## Important Data Security Notice

This repository uses a temporary SQLite database created specifically for assessment and demonstration purposes.

The database contains:

* Sample user accounts.
* Sample client account records.
* Example report metadata.
* Example PDF report files.

The database does **not** contain:

* Real Edensprite client data.
* Live Salus telemetry records.
* Production system credentials.
* Real customer login details.
* Sensitive company database information.

This approach was used so that the application could be reviewed, executed and tested by assessors without exposing confidential organisational data.

## Technologies Used

* Node.js
* Express.js
* EJS
* SQLite
* bcrypt
* express-session
* HTML
* CSS
* JavaScript

## Project Structure

```text
Edensprite-Report-Generation/
│
├── app.js
├── package.json
├── README.md
│
├── assets/
│   ├── css/
│   │   └── global.css
│   ├── js/
│   │   └── menu.js
│   └── images/
│
├── database_temp/
│   ├── db-setup.js
│   └── database/
│       └── assessment.sqlite
│
├── middleware/
│   └── auth.js
│
├── report_output/
│   └── sample PDF reports
│
├── routes/
│   ├── auth.js
│   └── dashboard.js
│
├── test/
│   └── app.test.js
│
└── views/
    ├── login.ejs
    ├── dashboard.ejs
    └── reports.ejs
```

## Local Setup Instructions

### 1. Clone the Repository

```bash
git clone https://github.com/CallumToddYTL/Edensprite-Report-Generation.git
```

Then move into the project directory:

```bash
cd Edensprite-Report-Generation
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Set Up the Demonstration Database

The repository includes a database setup script that creates the temporary SQLite database and inserts sample records.

Run:

```bash
node database_temp/db-setup.js
```

This will create the SQLite database at:

```text
database_temp/database/assessment.sqlite
```

The database setup script creates:

* A `users` table.
* An `accounts` table.
* A `reports` table.
* Sample user accounts.
* Sample client accounts.

### 4. Start the Application

```bash
npm start
```

The application will start locally on:

```text
http://localhost:3000
```

### 5. Log In Using Demonstration Credentials

Admin login:

```text
Email: admin@example.com
Password: AdminPassword123!
```

User login:

```text
Email: user@example.com
Password: UserPassword123!
```

These credentials are for demonstration purposes only and are not connected to any real Edensprite systems.

## Running Tests

Automated tests can be executed using:

```bash
npm test
```

The test suite validates key security and functional behaviours, including:

* Redirecting unauthenticated users away from protected pages.
* Rejecting SQL Injection login attempts.
* Rejecting invalid report date ranges.

## SQLite Database Explanation

SQLite was used because it is lightweight, simple to configure and suitable for a demonstration environment.

A temporary SQLite database was created to avoid including real company database credentials or client records within a public GitHub repository. This ensures the application can be reviewed and tested safely without exposing confidential business information.

In the production environment, the application would connect to controlled internal data sources and live reporting systems. However, for this assessment version, the database is intentionally limited to anonymised sample data.

## Security Features

The application includes several security controls:

* Session-based authentication.
* Password hashing using bcrypt.
* Protected dashboard and report routes.
* Parameterised SQL queries.
* Validation of report date ranges.
* Restricted access to downloadable reports.

These controls were implemented to reduce exposure to common OWASP Top 10 risks, including Broken Access Control, Injection and Identification and Authentication Failures.

## Notes for Assessors

This repository is intended to demonstrate the secure design, development and testing of the Edensprite Report Generation Portal.

To run the application locally, follow the setup steps in this README. No real Edensprite credentials, real Salus credentials or confidential client information are required to run or assess the application.
