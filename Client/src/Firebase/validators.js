// Check if the email has valida characters.
const isEmail = (email) => {
  const regx = /^(([^<>()\[\]\\.,;:\s@”]+(\.[^<>()\[\]\\.,;:\s@”]+)*)|(“.+”))@((\[[0–9]{1,3}\.[0–9]{1,3}\.[0–9]{1,3}\.[0–9]{1,3}\])|(([a-zA-Z\-0–9]+\.)+[a-zA-Z]{2,}))$/;
  if (email.match(regx)) {
    return true;
  } else {
    return false;
  }
};
// Check if the value is empty.
const isEmpty = (string) => {
  if (string.trim() == "") return true;
  else return false;
};

// Validate if the signup data is valid and match.
exports.validateSignupData = (data) => {
  let errors = {};

  if (isEmpty(data.email)) {
    errors.email = "Must not be empty";
  } else if (!isEmail(data.email)) {
    errors.email = "Must be a valid email address";
  }

  if (isEmpty(data.password)) {
    errors.passwords = "Must not be empty";
  }

  if (data.password !== data.confirmPassword)
    errors.confirmPassword = "Passwords Must match";

  if (isEmpty(data.userName)) {
    errors.userName = "Must not be empty";
  }

  return {
    errors,
    valid: Object.keys(errors).length === 0 ? true : false,
  };
};

// Validate login data.
exports.validateLoginData = (data) => {
  let errors = {};

  if (isEmpty(data.email)) errors.email = "Must not be empty";
  if (isEmpty(data.password)) errors.password = "Must not be empty";

  return {
    errors,
    valid: Object.keys(errors).length === 0 ? true : false,
  };
};
