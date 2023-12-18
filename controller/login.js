

//new 
const User = require('../models/User');
const dotenv = require('dotenv');
dotenv.config();

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const client = require('../redis');

async function CheckUser(email) {
    try {
        const user = await User.findOne({ email: email });
        console.log(`The user is ${user}`);
        if (user) {
            return true;
        } else {
            return false;
        }
    } catch (err) {
        return "Server Busy";
    }
}

async function AuthenticationUsers(email, password) {
    try {
        const userCheck = await User.findOne({ email: email });
        if (!userCheck) {
            return "Invalid Username or Password";
        }

        const validPassword = await bcrypt.compare(password, userCheck.password);
        if (validPassword) {
            const token = jwt.sign({ email }, process.env.login_secret_keys);
            const response = {
                id: userCheck._id,
                name: userCheck.name,
                email: userCheck.email,
                token: token,
                status: true
            };
            await client.set(`key-${email}`, JSON.stringify(response))
            await User.findOneAndUpdate({ email: userCheck.email }, { $set: { token: token } }, { new: true });
            return response;
        } else {
            return "Invalid Username or Password";
        }
    } catch (error) {
        console.log(error);
        return "Server Busy";
    }
}

async function Authorization(token) {
    try {
        const decodeToken = jwt.verify(token, process.env.login_secret_keys);
        if (decodeToken) {
            const email = decodeToken.email;
            const auth = await client.get(`key-${email}`)
            if (auth) {
                const data = JSON.parse(auth);
                return data;
            } else {
                const data = await User.findOne({ email: email })
                return data;
            }
        } else {
            return false;
        }
    }catch(e){
        console.log(e);
    }
}

module.exports = { CheckUser, AuthenticationUsers,Authorization };
