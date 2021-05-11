import React, { useState, Component } from "react";
import { loginUser } from "../../redux/actions/auth.actions";
import { connect } from "react-redux";
import { Redirect } from "react-router-dom";
import { Form, Button, Col } from "react-bootstrap";
import { useSelector, useDispatch } from "react-redux";
import { authActions } from "../../redux/actions/auth.actions";
import "../../App.css";

const LoginPage = (props) => {
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    email: "admin@admin.com",
    password: "123456",
  });
  const [errors, setErrors] = useState({
    email: "",
    password: "",
  });
  const isAuthenticated = props.isAuthenticated;
  const loading = props.loading;

  console.log(`props`, props);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    // Validate data if needed
    const { email, password } = formData;
    console.log(`email`, email, formData);
    dispatch(loginUser(email, password));
  };

  const testclick = () => {
    console.log(`object`);
  };

  if (isAuthenticated) {
    return <Redirect to="/dashboard" />;
  } else {
    return (
      <div className="loginPage">
        <Col lg={7} md={12} sm={12} xs={12} className="transparentLogin">
          <div></div>
        </Col>
        <Col className="Signincol" lg={5} md={12} sm={12} xs={12}>
          {" "}
          <div className="logincontainer">
            <Form className="formlogin" onSubmit={handleSubmit}>
              <div className="text-left mb-3">
                <p className="lead">
                  <i className="fas fa-user" /> Welcome back
                </p>
                <h1 className="heavyweight">Login</h1>
              </div>
              <Form.Group>
                <p>Email</p>
                <Form.Control
                  type="email"
                  required
                  placeholder="Email Address"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                />
                {errors.email && (
                  <small className="form-text text-danger">
                    {errors.email}
                  </small>
                )}
              </Form.Group>
              <Form.Group>
                <p>Password</p>
                <Form.Control
                  type="password"
                  placeholder="Password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  minLength="6"
                />
                {errors.password && (
                  <small className="form-text text-danger">
                    {errors.password}
                    <p>ALERT</p>
                  </small>
                )}
              </Form.Group>

              {loading ? (
                <Button
                  className="btn-block"
                  variant="primary"
                  type="button"
                  disabled
                >
                  <span
                    className="spinner-border spinner-border-sm"
                    role="status"
                    aria-hidden="true"
                  ></span>
                  Loading...
                </Button>
              ) : (
                <button
                  className="btn-block btn-login"
                  onClick={testclick}
                  type="submit"
                >
                  Login now
                </button>
              )}
            </Form>
          </div>
        </Col>
      </div>
    );
  }
};

function mapStateToProps(state) {
  return {
    isLoggingIn: state.auth.isLoggingIn,
    loginError: state.auth.loginError,
    isAuthenticated: state.auth.isAuthenticated,
  };
}

export default connect(mapStateToProps)(LoginPage);
