import { DB } from "./sqlite3-connect.js";
import { sampleUser, sampleClassSignups, sampleMembershipRemaining, coaches, membershipTypes, classCategories, classes } from "./seedData.js"; 

export const seedDatabase = () => {
    // Check if table already has data. To not duplicate the data on server restart
    DB.get(`SELECT COUNT(*) AS count FROM class_categories`, (err, row) => {
        if (err) {
            console.error("Error checking class_categories:", err.message);
            return;
        }

        if (row.count === 0) {
            // Insert initial data into class_categories
            const insertClassCategories = `INSERT INTO class_categories (name, description) VALUES (?, ?)`;
            classCategories.forEach((category) => {
                DB.run(insertClassCategories, [category.name, category.description], (err) => {
                    if (err) {
                        console.log(
                            "Error inserting initial data into class_categories:",
                            err.message
                        );
                    }
                });
            });
            console.log("INSERTED CLASS CATEGORIES");
        }
    });

    // Check if table already has data. To not duplicate the data on server restart
    DB.get(`SELECT COUNT(*) AS count FROM coaches`, (err, row) => {
        if (err) {
            console.error("Error checking coaches:", err.message);
            return;
        }

        if (row.count === 0) {
            // Insert initial data into coaches
            const insertCoaches = `INSERT INTO coaches (name, specialty) VALUES (?, ?)`;
            coaches.forEach((coach) => {
                DB.run(insertCoaches, [coach.name, coach.specialty], (err) => {
                    if (err) {
                        console.log("Error inserting initial data into coaches:", err.message);
                    }
                });
            });
            console.log("INSERTED COACHES");
        }
    });

    // Check if table already has data. To not duplicate the data on server restart
    DB.get(`SELECT COUNT(*) AS count FROM membership_type`, (err, row) => {
        if (err) {
            console.error("Error checking membership_type:", err.message);
            return;
        }

        if (row.count === 0) {
            // Insert initial data into membership_type
            const insertMembershipTypes = `INSERT INTO membership_type (type, max_classes_per_month) VALUES (?, ?)`;
            membershipTypes.forEach((membership) => {
                DB.run(
                    insertMembershipTypes,
                    [membership.type, membership.maxClassesPerMonth],
                    (err) => {
                        if (err) {
                            console.log(
                                "Error inserting initial data into membership_type:",
                                err.message
                            );
                        }
                    }
                );
            });
            console.log("INSERTED MEMBERSHIP TYPES");
        }
    });

    // Check if table already has data. To not duplicate the data on server restart
    DB.get(`SELECT COUNT(*) AS count FROM classes`, (err, row) => {
        if (err) {
            console.error("Error checking classes:", err.message);
            return;
        }

        if (row.count === 0) {
            // Insert initial data into classes
            const insertClasses = `INSERT INTO classes (start_time, end_time, coach_id, category_id, admin_id) VALUES (?, ?, ?, ?, ?)`;
            classes.forEach((cls) => {
                DB.run(
                    insertClasses,
                    [cls.startTime, cls.endTime, cls.coachId, cls.categoryId, cls.adminId],
                    (err) => {
                        if (err) {
                            console.log("Error inserting initial data into classes:", err.message);
                        }
                    }
                );
            });
            console.log("INSERTED CLASSES");
        }
    });

    // Check if table already has data. To not duplicate the data on server restart
    DB.get(`SELECT COUNT(*) AS count FROM users`, (err, row) => {
        if (err) {
            console.error("Error checking users:", err.message);
            return;
        }

        if (row.count === 0) {
            // Insert initial data into users
            const insertUsers = `INSERT INTO users (firstname, lastname, email, password, membership_id) VALUES (?, ?, ?, ?, ?)`;
            sampleUser.forEach((user) => {
                DB.run(
                    insertUsers,
                    [user.firstName, user.lastName, user.email, user.password, user.membershipId],
                    (err) => {
                        if (err) {
                            console.log("Error inserting initial data into users:", err.message);
                        }
                    }
                );
            });
            console.log("INSERTED USERS");
        }
    });

    // Check if table already has data. To not duplicate the data on server restart
    DB.get(`SELECT COUNT(*) AS count FROM class_signups`, (err, row) => {
        if (err) {
            console.error("Error checking class_signups", err.message);
            return;
        }

        if (row.count === 0) {
            // Insert initial data into class_signups
            const insertClassSignups = `INSERT INTO class_signups (user_id, class_id) VALUES (?, ?)`;
            sampleClassSignups.forEach((signup) => {
                DB.run(insertClassSignups, [signup.user_id, signup.class_id], (err) => {
                    if (err) {
                        console.log(
                            "Error inserting initial data into class_signups:",
                            err.message
                        );
                    }
                });
            });
            console.log("INSERTED CLASS SIGNUPS");
        }
    });

    // Check if table already has data. To not duplicate the data on server restart
    DB.get(`SELECT COUNT(*) AS count FROM membership_remaining`, (err, row) => {
        if (err) {
            console.error("Error checking membership_remaining:", err.message);
            return;
        }

        if (row.count === 0) {
            // Insert initial data into membership_remaining
            const insertMembershipRemaining = `INSERT INTO membership_remaining (user_id, days_remaining) VALUES (?, ?)`;
            sampleMembershipRemaining.forEach((remaining) => {
                DB.run(
                    insertMembershipRemaining,
                    [remaining.user_id, remaining.days_remaining],
                    (err) => {
                        if (err) {
                            console.log(
                                "Error inserting initial data into membership_remaining:",
                                err.message
                            );
                        }
                    }
                );
            });
            console.log("INSERTED MEMBERSHIP REMAINING");
        }
    });
};
