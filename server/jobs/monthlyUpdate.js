import cron from "node-cron";
import { DB } from "../config/sqlite3-connect.js";

// Resets the membership days for each user on the first day of every month
const updateMembershipDays = async () => {
    try {
        // Update days_remaining based on membership_id
        DB.run(`
            UPDATE membership_remaining
            SET days_remaining = CASE 
                WHEN user_id IN (SELECT id FROM users WHERE membership_id = 1) THEN 12
                WHEN user_id IN (SELECT id FROM users WHERE membership_id = 2) THEN 16
                WHEN user_id IN (SELECT id FROM users WHERE membership_id = 3) THEN 1000
                ELSE days_remaining
            END
        `);

        console.log("Membership days updated successfully.");
    } catch (err) {
        console.error("Error updating membership days:", err.message);
    }
};

// Runs on the first day of every month at midnight
cron.schedule("0 0 1 * *", () => {
    console.log("Running monthly membership update...");
    updateMembershipDays();
});
