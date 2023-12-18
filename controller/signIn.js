// Newly Changed
const User = require('../models/User');
// Newly Changed
const { sendMail } = require('../controller/SendMailer');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const verifyUser = require('../models/verifyUser');
dotenv.config();

async function InsertVerifyUser(name, email, password) {
    try {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        const token = generateToken(email);

        const newUser = new verifyUser({
            name: name,
            email: email,
            password: hashedPassword,
            token: token
        });

        const activelink = `https://auth-ba.onrender.com/signin/${token}`;
        const content = `<h4>hi, There</h4>
        <h5>Welcome to the app</h5>
        <p>Thank you for signing up, Click on the below link to activate</p>
        <a href="${activelink}">Click Here</a>
        <p>Regards</p>
        <p>Team</p>`;

        await newUser.save();
        console.log(newUser);
        sendMail(email, "VerifyUser", content);
    } catch (e) {
        console.log(e); // Change 'error' to 'e' to log the actual error
    }
}

function generateToken(email) {
    // Include a return statement to return the generated token
    return jwt.sign(email, process.env.sign_up_SecretKey);
}

async function InsertSignupUser(token) {
    try {
        const userVerify = await verifyUser.findOne({ token: token });
        if (userVerify) {
            const newUser = new User({
                name: userVerify.name,
                email: userVerify.email,
                password: userVerify.password,
                forgetpassword: {}
            })
            await newUser.save();
            await userVerify.deleteOne({ token: token });
            const content = `<h4>hi, Register is Sucessfull</h4>
            <h5>Welcome to the app</h5>
            <p>Registered</p>
            <p>Regards</p>
            <p>Team</p>`;
            sendMail(newUser.email, "Registered Sucessfully", content)
            return `<h4>hi, Register is Sucessfull</h4>
            <h5>Welcome to the app</h5>
            <p>Registered</p>
            <p>Regards</p>
            <p>Team</p>`
        }
        return `<h4> Register is Failed</h4>
        <p>Your Link is expired ....?</p>
        <p>Regards</p>
        <p>Team</p>`
    } catch (error) {
        console.log(error);
        return `<html>
        <body>
        <h4> Register is Failed</h4>
        <p>You See Unexpected Error</p>
        <p>Regards</p>
        <p>Team</p>
        </body>
        </html>`
    }

}

module.exports = { InsertVerifyUser, InsertSignupUser };
