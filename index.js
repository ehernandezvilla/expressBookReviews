const express = require('express');
const jwt = require('jsonwebtoken');
const session = require('express-session')
const customer_routes = require('./router/auth_users.js').authenticated;
const genl_routes = require('./router/general.js').general;
require('dotenv').config();

const app = express();

app.use(express.json());

app.use("/customer",session({secret:process.env.SESSION_STORE,resave: true, saveUninitialized: true}))
// console.log(process.env.SESSION_STORE);

app.use("/customer/auth/*", function auth(req, res, next) {
    console.log(req.session); // Debug: Inspect the session
    if (req.session.user) {
        next();
    } else {
        res.status(401).json({ message: "Unauthorized access" });
    }
});
 
const PORT =5000;

app.use("/customer", customer_routes);
app.use("/", genl_routes);

app.listen(PORT,()=>
console.log(`Server is running on http://localhost:${PORT}`)
);
