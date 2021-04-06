const cors = require("cors");
const app = require("express")();
var indexRouter = require("./routes/index");
const functions = require("firebase-functions");

app.use(cors());
app.use("/", indexRouter);

exports.api = functions.https.onRequest(app);
