const cors = require("cors");
const app = require("express")();
app.use(cors());
var indexRouter = require("./routes/index");
const functions = require("firebase-functions");

app.use("/", indexRouter);

exports.api = functions.https.onRequest(app);
