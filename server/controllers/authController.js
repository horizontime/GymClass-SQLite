import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { DB } from "../config/sqlite3-connect.js";
import "dotenv/config";


// Registers a new user. Checks if user already exists, returns error if they do, otherwise creates a new user
export const signup = async (req, res) => {
    const { firstName, lastName, email, password, membershipId } = req.body;
    try {
        // Check if the user already exists
        const userExists = await new Promise((resolve, reject) => {
            DB.get("SELECT * FROM users WHERE email = ?", [email], (err, row) => {
                if (err) {
                    return reject(err);
                }
                resolve(row);
            });
        });

        if (userExists) {
            return res.status(409).json({ message: "User already exists" });
        }

        // Hash the password
        const hashPassword = await bcrypt.hash(password, 10);

        // Prepare the SQL statement
        const sql = `
            INSERT INTO users (firstname, lastname, email, password, membership_id) 
            VALUES (?, ?, ?, ?, ?)
        `;

        // Insert the new user
        DB.run(sql, [firstName, lastName, email, hashPassword, membershipId], function (err) {
            if (err) {
                console.error("Error inserting user:", err.message);
                return res.status(500).json({ message: err.message });
            }

            const userId = this.lastID;

            // Determine days_remaining to set based on membership_id
            let daysRemaining;
            switch (Number(membershipId)) {
                case 1:
                    daysRemaining = 12;
                    break;
                case 2:
                    daysRemaining = 16;
                    break;
                case 3:
                    daysRemaining = 999;
                    break;
                default:
                    daysRemaining = 0;
            }

            // Insert days_remaining into membership_remaining table
            const membershipSql = `
                INSERT INTO membership_remaining (user_id, days_remaining) 
                VALUES (?, ?)
            `;
            DB.run(membershipSql, [userId, daysRemaining], function (err) {
                if (err) {
                    console.error("Error inserting membership remaining:", err.message);
                    return res.status(500).json({ message: err.message });
                }

                return res.status(201).json({ message: "User created successfully" });
            });
        });
    } catch (err) {
        console.error("Error during signup:", err.message); // Log the error
        return res.status(500).json(err.message);
    }
};




// Logs in a user. Checks if user exists, returns error if they don't, otherwise returns a token
export const login = async (req, res) => {
    const { email, password } = req.body;
    try {
        // Prepare the SQL statement
        const sql = "SELECT * FROM users WHERE email = ?";

        // Query the database
        DB.all(sql, [email], async (err, rows) => {
            if (err) {
                console.error("Error querying users:", err.message);
                return res.status(500).json({ message: err.message });
            }

            if (rows.length === 0) {
                return res.status(401).json({ message: "Email or password is incorrect." });
            }

            // Compare the password
            const isMatch = await bcrypt.compare(password, rows[0].password);
            if (!isMatch) {
                return res.status(401).json({ message: "Email or password is incorrect." });
            }

            // Generate a token
            const token = jwt.sign({ id: rows[0].id }, process.env.JWT_SECRET_KEY, {
                expiresIn: "3h",
            });
            return res.status(200).json({ token: token });
        });
    } catch (err) {
        console.error("Error during login:", err.message);
        return res.status(500).json({ message: err.message });
    }
};

// Logs in a user. Checks if user exists, returns error if they don't, otherwise returns a token
// export const login = async (req, res) => {
//     const { email, password } = req.body;
//     console.log(email, password);
//     try {
//         // Prepare the SQL statement
//         const sql = "SELECT * FROM users WHERE email = ?";

//         // Query the database using a Promise
//         const rows = await new Promise((resolve, reject) => {
//             DB.all(sql, [email], (err, rows) => {
//                 if (err) {
//                     console.error("Error querying users:", err.message);
//                     return reject(err);
//                 }
//                 resolve(rows);
//             });
//         });
//         console.log(rows);
//         if (rows.length === 0) {
//             return res.status(401).json({ message: "Email or password is incorrect." });
//         }

//         // Compare the password
//         const isMatch = await bcrypt.compare(password, rows[0].password);
//         if (!isMatch) {
//             return res.status(401).json({ message: "Email or password is incorrect." });
//         }
//         console.log(isMatch);
//         // Generate a token
//         const token = jwt.sign({ id: rows[0].id }, process.env.JWT_SECRET_KEY, {
//             expiresIn: "3h",
//         });
//         console.log(token);
//         return res.status(200).json({ token: token });
//     } catch (err) {
//         console.error("Error during login:", err.message);
//         return res.status(500).json({ message: err.message });
//     }
// };

// Verifies a token. This is used to protect the React routes for the app
export const verifyToken = async (req, res, next) => {
    try {
        const token = req.headers["authorization"].split(" ")[1];
        if (!token) {
            return res.status(403).json({ message: "No Token Provided" });
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
        req.userId = decoded.id; // now the req.userId can be used in the routes that follow

        next();
    } catch (err) {
        return res.status(500).json({ message: "server error" });
    }
};
