const express = require('express');
const { AuthenticationUsers } = require('../controller/login');
const client = require('../redis');
const router = express.Router();


client.connect().then(() => {
    console.log("Connected to redis");
}).catch(e => console.log(e));

router.post('/', async (req, res) => {
    try {
        const { email, password } = req.body; // Remove await from here
        const loginCredentials = await AuthenticationUsers(email, password); // Correct misspelling here
        console.log(loginCredentials);
        if (loginCredentials === "Invalid Username or Password") {
            res.status(200).send("Invalid Username or Password"); // Sending success response with login credentials
        } else if (loginCredentials === "Server Busy") {
            res.status(200).send("Server Busy")
        } else {
            res.status(200).json({ token: loginCredentials.token }); // Sending error response
        }
    } catch (error) {
        res.status(500).json({ error: 'Server Error' }); // Sending server error response
    }
});

module.exports = router;
