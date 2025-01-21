import sqlite3 from "sqlite3";

const sql3 = sqlite3.verbose();

const DB = new sql3.Database("./database.db", sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE, (err) => {
    if (err) return console.error(err.message);
    console.log("Connected to the SQLite database.");
});

// Create the class_categories table
let createClassCategoriesTable = `CREATE TABLE IF NOT EXISTS class_categories (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  description TEXT DEFAULT NULL,
  UNIQUE(id)
)`;
DB.run(createClassCategoriesTable, [], (err) => {
    if (err) {
        console.log("Error creating class_categories table");
        return;
    }
    console.log("CREATED CLASS CATEGORIES TABLE");
});

// Create the coaches table
let createCoachesTable = `CREATE TABLE IF NOT EXISTS coaches (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  specialty TEXT DEFAULT NULL
)`;
DB.run(createCoachesTable, [], (err) => {
    if (err) {
        console.log("Error creating coaches table");
        return;
    }
    console.log("CREATED COACHES TABLE");
});

// Create the membership_type table
let createMembershipTypeTable = `CREATE TABLE IF NOT EXISTS membership_type (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  type TEXT NOT NULL,
  max_classes_per_month INTEGER NOT NULL
)`;
DB.run(createMembershipTypeTable, [], (err) => {
    if (err) {
        console.log("Error creating membership_type table");
        return;
    }
    console.log("CREATED MEMBERSHIP TYPE TABLE");
});

// Create the users table
let createUsersTable = `CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  firstname TEXT NOT NULL,
  lastname TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  password TEXT NOT NULL,
  membership_id INTEGER NOT NULL,
  signup_date DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (membership_id) REFERENCES membership_type(id)
)`;
DB.run(createUsersTable, [], (err) => {
    if (err) {
        console.log("Error creating users table");
        return;
    }
    console.log("CREATED USERS TABLE");
});

// Create the membership_remaining table
let createMembershipRemainingTable = `CREATE TABLE IF NOT EXISTS membership_remaining (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  days_remaining INTEGER NOT NULL DEFAULT 0,
  FOREIGN KEY (user_id) REFERENCES users(id)
)`;
DB.run(createMembershipRemainingTable, [], (err) => {
    if (err) {
        console.log("Error creating membership_remaining table");
        return;
    }
    console.log("CREATED MEMBERSHIP REMAINING TABLE");
});

// Create the classes table
let createClassesTable = `CREATE TABLE IF NOT EXISTS classes (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  start_time DATETIME NOT NULL,
  end_time DATETIME NOT NULL,
  coach_id INTEGER NOT NULL,
  category_id INTEGER NOT NULL,
  admin_id INTEGER NOT NULL,
  FOREIGN KEY (coach_id) REFERENCES coaches(id),
  FOREIGN KEY (category_id) REFERENCES class_categories(id)
)`;
DB.run(createClassesTable, [], (err) => {
    if (err) {
        console.log("Error creating classes table");
        return;
    }
    console.log("CREATED CLASSES TABLE");
});

// Create the class_signups table
let createClassSignupsTable = `CREATE TABLE IF NOT EXISTS class_signups (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  class_id INTEGER NOT NULL,
  signup_date DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (class_id) REFERENCES classes(id),
  UNIQUE(user_id, class_id)
)`;
DB.run(createClassSignupsTable, [], (err) => {
    if (err) {
        console.log("Error creating class_signups table");
        return;
    }
    console.log("CREATED CLASS SIGNUPS TABLE");
});

export { DB };
