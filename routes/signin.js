const express = require('express');
const {CheckUser} = require('../controller/login');
const { InsertVerifyUser, InsertSignupUser } = require('../controller/signIn');
const router = express.Router();

router.get('/:token', async (req, res) => {
    try {
        const token = req.params.token;
        const response = await InsertSignupUser(token)
        res.status(200).send(response);
    } catch (error) {
        console.log(error);
        res.status(500).send(
            `<html>
             <body>
             <h4> Register is Failed</h4>
             <p>You See Unexpected Error</p>
             <p>Regards</p>
             <p>Team</p>
             </body>
             </html>`
        )
    }
})

router.post('/verify', async (req, res) => {
    try {
        const { name, email, password } = req.body;
        console.log(name, email, password);
        const registerCreditials = await CheckUser(email);
        if (registerCreditials === false) {
            await InsertVerifyUser(name, email, password)
            res.status(200).send(true)
        } else if (registerCreditials === true) {
            res.status(200).send(false)
        } else if (registerCreditials === 'Server Busy') {
            res.status(500).send("Server Busy");
        }
    } catch (error) {

    }
})



module.exports = router;