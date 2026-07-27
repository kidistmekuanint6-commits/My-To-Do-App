const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");

const app = express();

const PORT = 3000;


/* =========================================================
   MIDDLEWARE
========================================================= */

app.use(cors());

app.use(express.json());


/* =========================================================
   REMINDERS FILE
========================================================= */

const remindersFile =
    path.join(__dirname, "reminders.json");


/* =========================================================
   LOAD REMINDERS FROM FILE
========================================================= */

function loadReminders() {

    try {

        if (
            !fs.existsSync(
                remindersFile
            )
        ) {

            fs.writeFileSync(
                remindersFile,
                "[]"
            );

            return [];

        }


        const data =
            fs.readFileSync(
                remindersFile,
                "utf8"
            );


        return JSON.parse(
            data
        );


    } catch (error) {

        console.error(
            "Error loading reminders:",
            error
        );

        return [];

    }

}


/* =========================================================
   SAVE REMINDERS TO FILE
========================================================= */

function saveReminders(
    reminders
) {

    fs.writeFileSync(

        remindersFile,

        JSON.stringify(
            reminders,
            null,
            4
        )

    );

}


/* =========================================================
   HOME / TEST ROUTE
========================================================= */

app.get(
    "/",
    (req, res) => {

        res.json({

            message:
                "To-Do Reminder Server is working! 🌸"

        });

    }
);


/* =========================================================
   CREATE REMINDER
========================================================= */

app.post(
    "/reminders",
    (req, res) => {

        const reminder =
            req.body;


        /* CHECK REQUIRED DATA */

        if (
            !reminder.text ||
            !reminder.reminder
        ) {

            return res.status(
                400
            ).json({

                error:
                    "Task text and reminder time are required."

            });

        }


        /* LOAD EXISTING REMINDERS */

        const reminders =
            loadReminders();


        /* CREATE NEW REMINDER */

        const newReminder = {

            id:
                Date.now(),

            text:
                reminder.text,

            reminder:
                reminder.reminder,

            completed:
                reminder.completed ||
                false,

            notified:
                false

        };


        /* ADD TO ARRAY */

        reminders.push(
            newReminder
        );


        /* SAVE TO JSON FILE */

        saveReminders(
            reminders
        );


        /* SHOW IN TERMINAL */

        console.log(
            "New reminder added:",
            newReminder
        );


        /* SEND RESPONSE */

        res.status(
            201
        ).json({

            message:
                "Reminder created successfully! 🌸",

            reminder:
                newReminder

        });

    }
);


/* =========================================================
   GET ALL REMINDERS
========================================================= */

app.get(
    "/reminders",
    (req, res) => {

        const reminders =
            loadReminders();


        res.json(
            reminders
        );

    }
);


/* =========================================================
   DELETE REMINDER
========================================================= */

app.delete(
    "/reminders/:id",
    (req, res) => {

        const reminderId =
            Number(
                req.params.id
            );


        let reminders =
            loadReminders();


        reminders =
            reminders.filter(
                function(reminder) {

                    return (
                        reminder.id !==
                        reminderId
                    );

                }
            );


        saveReminders(
            reminders
        );


        console.log(
            "Reminder deleted:",
            reminderId
        );


        res.json({

            message:
                "Reminder deleted successfully."

        });

    }
);


/* =========================================================
   START SERVER
========================================================= */

app.listen(
    PORT,
    () => {

        console.log(
            `Reminder server running at http://localhost:${PORT}`
        );

        console.log(
            "Reminder storage: reminders.json"
        );

    }
);