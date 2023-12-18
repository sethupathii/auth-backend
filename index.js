const express = require('express');
const mongodb = require('./db');
const app = express();
const port = 4000;
const signinRouter = require('./routes/signin');
const loginRouter = require('./routes/login');
const homeRoute = require('./routes/home');
const cors = require('cors');
app.use(cors({ origin: "*" }));
app.use(express.json());

mongodb();

app.get('/', (req, res) => {
    res.send('sethu');
})

app.use("/signin", signinRouter);
app.use('/login', loginRouter);
app.use('/homes', homeRoute)

app.listen(port, (req, res) => {
    console.log("The server is running ... at the port of localhost:4000 ");
})