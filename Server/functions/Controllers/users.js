const { db } = require("../Utils/admin");
const config = require("../Utils/config");
const firebase = require("firebase");
var bcrypt = require("bcrypt");
firebase.initializeApp(config);
const {
  validateSignupData,
  validateLoginData,
} = require("../utils/validators");

exports.signup = (req, res) => {
  const newUser = {
    email: req.body.email,
    password: req.body.password,
    confirmPassword: req.body.confirmPassword,
    userName: req.body.userName,
  };

  const { valid, errors } = validateSignupData(newUser);

  if (!valid) return res.status(400).json(errors);

  let token, userId;
  db.doc(`/users/${newUser.userName}`)
    .get()
    .then((doc) => {
      if (doc.exists) {
        return res
          .status(400)
          .json({ userName: "this email has already taken" });
      } else {
        return firebase
          .auth()
          .createUserWithEmailAndPassword(newUser.email, newUser.password);
      }
    })
    .then((data) => {
      userId = data.user.uid;
      return data.user.getIdToken();
    })
    .then((idToken) => {
      token = idToken;

      const hashedPassword = bcrypt.hashSync(newUser.password, 6);

      const userCredentials = {
        userName: newUser.userName,
        email: newUser.email,
        password: hashedPassword,
        createdAt: new Date().toISOString(),
        userId,
      };
      return db.doc(`/users/${newUser.userName}`).set(userCredentials);
    })
    .then(() => {
      return res.status(201).json({ token });
    })
    .catch((err) => {
      console.error(err);
      if (err.code === "auth/email-already-in-use") {
        return res.status(400).json({ email: "Email is already in use" });
      } else {
        return res.status(500).json({ error: err.code });
      }
    });
};

exports.login = (req, res) => {
  const user = {
    email: req.body.email,
    password: req.body.password,
  };
  const { valid, errors } = validateLoginData(user);

  if (!valid) return res.status(400).json(errors);

  firebase
    .auth()
    .signInWithEmailAndPassword(user.email, user.password)
    .then((data) => {
      return data.user.getIdToken();
    })
    .then((token) => {
      return res.json({ token, user });
    })
    .catch((err) => {
      console.error(err);
      if (err.code === "auth/wrong-password") {
        return res
          .status(403)
          .json({ general: "Wrong credentials, please try again" });
      } else return res.status(500).json({ error: err.code });
    });
};

// On request gets authenticated user if there's a token.
exports.getAuthenticatedUser = (req, res) => {
  let userData;
  db.doc(`/users/${req.user.userName}`)
    .get()
    .then((doc) => {
      if (doc.exists) {
        userData = doc.data();
        return res.json(userData);
      }
    })
    .catch((err) => {
      console.error(err);
      if (
        err.code === "auth/argument-error" ||
        err.code === "auth/id-token-expired"
      ) {
        return res
          .status(403)
          .json({ general: "Wrong credentials, please try again" });
      } else return res.status(500).json({ error: err.code });
    });
};
