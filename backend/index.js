const express = require('express');
const cookieParser = require('cookie-parser');
const path = require('path');
const authRouter = require('./routers/auth_router');


const PORT = 3000;
const app = express();
app.use(express.json());

app.use(cookieParser());

app.use('/api', authRouter);

function start() {
    try {
        app.listen(PORT, () => console.log('Server start on ' + PORT + ' port'));
    } catch (error) {
        console.log('Error:' + error);
    }
}
start();