const admin = require("firebase-admin");
const functions = require("firebase-functions");
const permissions = require("./permissions.json")
const express = require("express");
const apiRoutes = express.Router();
const cors = require("cors");

const app = express()
admin.initializeApp({
    credential: admin.credential.cert(permissions),
    databaseURL: "https://fullaccezz-2756a-default-rtdb.firebaseio.com"
});

const routes = [
    require("./api/routes/initialApi"),
];

app.use(cors());

app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
    res.header("Access-Control-Allow-Credentials", true);
  
    next();
});

app.use("/api", apiRoutes);
routes.forEach((route) => {
  route.controller(app);
});

exports.app = functions.https.onRequest(app)
