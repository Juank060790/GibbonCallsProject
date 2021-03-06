// Firebase Authenticator validator, it helps in the api to check if the user is authenticate it or not.
// If the user auth, the user will have acces to the apis using this validator.

// const { admin, db } = require("./admin");
const { admin, db } = require("firebase-admin");

module.exports = (req, res, next) => {
  let idToken;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer ")
  ) {
    idToken = req.headers.authorization.split(`Bearer `)[1];
  } else {
    console.error("No token found");
    return res.status(403).json({ error: "Unauthorized" });
  }
  admin
    .auth()
    .verifyIdToken(idToken)
    .then((decodedToken) => {
      req.user = decodedToken;
      return db
        .collection("users")
        .where("uid", "==", req.user.uid)
        .limit(1)
        .get();
    })
    .then((data) => {
      req.user.userName = data.docs[0].data().userName;
      return next();
    })
    .catch((err) => {
      console.error("Error While verifying token ", err);
      return res.status(403).json(err);
    });
};
