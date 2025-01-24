import bcrypt from "bcrypt";
import { DB } from "../config/sqlite3-connect.js";

// Returns name of user. Used for Navbar component
export const home = async (req, res) => {
    try {
        const sql = "SELECT firstname, lastname FROM users WHERE id = ?";
        const user = await new Promise((resolve, reject) => {
            DB.get(sql, [req.userId], (err, row) => {
                if (err) {
                    return reject(err);
                }
                resolve(row);
            });
        });

        return res.status(200).json(user);
    } catch (err) {
        return res.status(500).json({ message: "Server error" });
    }
};

// Updates user profile
export const updateUserProfile = async (req, res) => {
    const { firstName, lastName, email, currentPassword, newPassword, membershipId } = req.body;

    try {
        // Check if the user exists, and return user info
        const userSql = "SELECT * FROM users WHERE id = ?";
        const userRows = await new Promise((resolve, reject) => {
            DB.all(userSql, [req.userId], (err, rows) => {
                if (err) {
                    return reject(err);
                }
                resolve(rows);
            });
        });

        if (userRows.length === 0) {
            return res.status(404).json({ message: "User does not exist" });
        }

        // Verify current password if new password is provided
        if (newPassword) {
            const isMatch = await bcrypt.compare(currentPassword, userRows[0].password);
            if (!isMatch) {
                return res.status(401).json({ message: "Current password is incorrect" });
            }
        }

        // Prepare the update query
        const updates = [];
        const values = [];

        if (firstName) {
            updates.push("firstname = ?");
            values.push(firstName);
        }
        if (lastName) {
            updates.push("lastname = ?");
            values.push(lastName);
        }
        if (email) {
            updates.push("email = ?");
            values.push(email);
        }
        if (newPassword) {
            const hashPassword = await bcrypt.hash(newPassword, 10);
            updates.push("password = ?");
            values.push(hashPassword);
        }
        if (membershipId) {
            updates.push("membership_id = ?");
            values.push(membershipId);
        }

        // If there are updates, execute the query
        if (updates.length > 0) {
            const query = `UPDATE users SET ${updates.join(", ")} WHERE id = ?`;
            values.push(req.userId);
            await new Promise((resolve, reject) => {
                DB.run(query, values, function (err) {
                    if (err) {
                        return reject(err);
                    }
                    resolve(this);
                });
            });
        }

        return res.status(200).json({ message: "Profile updated successfully" });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Server error" });
    }
};

// Returns user profile info to pre-populate update form
export const getUserProfile = async (req, res) => {
    try {
        const sql = "SELECT firstname, lastname, email, membership_id FROM users WHERE id = ?";
        const user = await new Promise((resolve, reject) => {
            DB.get(sql, [req.userId], (err, row) => {
                if (err) {
                    return reject(err);
                }
                resolve(row);
            });
        });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Return the user information excluding the password
        const userProfile = {
            firstName: user.firstname,
            lastName: user.lastname,
            email: user.email,
            membershipId: user.membership_id,
        };

        return res.status(200).json(userProfile);
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Server error" });
    }
};

// Returns the number of membership days remaining for the user
export const getDaysRemaining = async (req, res) => {
    try {
        const sql = "SELECT days_remaining FROM membership_remaining WHERE user_id = ?";
        const membership = await new Promise((resolve, reject) => {
            DB.get(sql, [req.userId], (err, row) => {
                if (err) {
                    return reject(err);
                }
                resolve(row);
            });
        });

        if (!membership) {
            return res.status(404).json({ message: "Membership record not found for this user" });
        }

        const daysRemaining = membership.days_remaining;
        return res.status(200).json({ days_remaining: daysRemaining });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Server error" });
    }
};

// Returns a list of classes that the user has signed up for, or has attended. With columns: class_date, class_time, class_category, coach_name
export const getClassAttendance = async (req, res) => {
    const userId = req.userId;
    const attendanceType = req.query.attendanceType;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    try {
        const sql = `
            SELECT 
                DATE(c.start_time) AS class_date, 
                strftime('%I:%M %p', c.start_time) AS class_time,
                cc.name AS class_category,
                co.name AS coach_name
            FROM 
                users u
            JOIN 
                class_signups cs ON u.id = cs.user_id
            JOIN 
                classes c ON cs.class_id = c.id
            JOIN 
                class_categories cc ON c.category_id = cc.id
            JOIN 
                coaches co ON c.coach_id = co.id
            WHERE 
                u.id = ? AND 
                c.start_time ${attendanceType === "past" ? "<" : ">"} datetime('now', 'localtime')
            ORDER BY 
                c.start_time ${attendanceType === "past" ? "DESC" : "ASC"}
            LIMIT ? OFFSET ?`;

        const classes = await new Promise((resolve, reject) => {
            DB.all(sql, [userId, limit, offset], (err, rows) => {
                if (err) {
                    return reject(err);
                }
                resolve(rows);
            });
        });

        return res.status(200).json(classes);
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Server error", error: err.message });
    }
};
