import { DB } from "../config/sqlite3-connect.js";

// Returns the classes for a given date. Date must be in 'yyyy-mm-dd' format
export const getClassesByDate = async (req, res) => {
    const { date } = req.query;

    if (!date) {
        return res.status(400).json({ error: "Date is required" });
    }

    try {
        const sql = `
            SELECT 
                strftime('%I:%M %p', c.start_time) AS time,
                strftime('%Y-%m-%d %H:%M:%S', c.end_time) AS endTimeLongFormat,
                co.name AS coach,
                cc.name AS name,
                c.id AS class_id
            FROM 
                classes c
            JOIN 
                coaches co ON c.coach_id = co.id
            JOIN 
                class_categories cc ON c.category_id = cc.id
            WHERE 
                DATE(c.start_time) = ?
            ORDER BY 
                c.start_time ASC`;

        const classes = await new Promise((resolve, reject) => {
            DB.all(sql, [date], (err, rows) => {
                if (err) {
                    return reject(err);
                }
                resolve(rows);
            });
        });

        res.json({ classes });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "An error occurred while fetching classes" });
    }
};

// Reserves a class for the user, if the user has at least one day of membership left
export const reserveClass = async (req, res) => {
    try {
        // Check if user has at least one day of membership left
        const reservationSql = "SELECT days_remaining FROM membership_remaining WHERE user_id = ?";
        const reservationRows = await new Promise((resolve, reject) => {
            DB.all(reservationSql, [req.userId], (err, rows) => {
                if (err) {
                    return reject(err);
                }
                resolve(rows);
            });
        });

        if (reservationRows[0].days_remaining === 0) {
            return res.status(403).json({ message: "No membership days left" });
        }

        // Get the class_id from the request body
        const { class_id } = req.body;

        // Insert the reservation into the class_signups table
        const insertSql = "INSERT INTO class_signups (user_id, class_id) VALUES (?, ?)";
        const result = await new Promise((resolve, reject) => {
            DB.run(insertSql, [req.userId, class_id], function (err) {
                if (err) {
                    return reject(err);
                }
                resolve(this);
            });
        });

        // Check if the insert was successful
        if (result.changes === 0) {
            return res.status(500).json({ message: "Failed to reserve the class" });
        }

        // Subtract one day of membership
        const updateMembershipSql =
            "UPDATE membership_remaining SET days_remaining = days_remaining - 1 WHERE user_id = ?";
        const result2 = await new Promise((resolve, reject) => {
            DB.run(updateMembershipSql, [req.userId], function (err) {
                if (err) {
                    return reject(err);
                }
                resolve(this);
            });
        });

        // Check if the membership update was successful
        if (result2.changes === 0) {
            return res.status(500).json({
                message: "Failed to update membership days remaining",
            });
        }

        // Return a success response
        return res.status(201).json({
            message: "Class reserved successfully",
            signupId: result.lastID,
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Server error" });
    }
};

// Checks if a class is reserved by a user
export const getReservations = async (req, res) => {
    try {
        const { class_id } = req.params;

        // Check if the class is reserved by the user
        const reservationSql = "SELECT * FROM class_signups WHERE user_id = ? AND class_id = ?";
        const reservationRows = await new Promise((resolve, reject) => {
            DB.all(reservationSql, [req.userId, class_id], (err, rows) => {
                if (err) {
                    return reject(err);
                }
                resolve(rows);
            });
        });

        // Return the reservation status
        return res.status(200).json({ isReserved: reservationRows.length > 0 });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Server error" });
    }
};

// Unreserves a class for the user
export const unreserveClass = async (req, res) => {
    try {
        // Get the class_id from the request body
        const { class_id } = req.body;

        // Delete the reservation from the class_signups table
        const deleteSql = "DELETE FROM class_signups WHERE user_id = ? AND class_id = ?";
        const result = await new Promise((resolve, reject) => {
            DB.run(deleteSql, [req.userId, class_id], function (err) {
                if (err) {
                    return reject(err);
                }
                resolve(this);
            });
        });

        // Check if the delete was successful
        if (result.changes === 0) {
            return res.status(404).json({ message: "Reservation not found" });
        }

        // Add one day of membership
        const updateMembershipSql =
            "UPDATE membership_remaining SET days_remaining = days_remaining + 1 WHERE user_id = ?";
        const result2 = await new Promise((resolve, reject) => {
            DB.run(updateMembershipSql, [req.userId], function (err) {
                if (err) {
                    return reject(err);
                }
                resolve(this);
            });
        });

        // Check if the membership update was successful
        if (result2.changes === 0) {
            return res.status(500).json({
                message: "Failed to update membership days remaining",
            });
        }

        return res.status(200).json({ message: "Class unreserved successfully" });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Server error" });
    }
};
