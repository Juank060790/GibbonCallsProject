import React from "react";
import { Switch, Route } from "react-router-dom";
import PrivateRoute from "./PrivateRoutes";
import LoginPage from "../containers/LoginPage";
import Dashboard from "../containers/Dashboard";
import NotFoundPage from "./NotFoundPage";
import AlertMsg from "../layouts/Alerts";
import { connect } from "react-redux";

function Routes(props) {
  const { isAuthenticated, isVerifying } = props;
  return (
    <>
      <AlertMsg />
      <Switch>
        <Route exact path="/" component={LoginPage} />
        <PrivateRoute
          exact
          path="/dashboard"
          component={Dashboard}
          isAuthenticated={isAuthenticated}
          isVerifying={isVerifying}
        />
        <Route component={NotFoundPage} />
      </Switch>
    </>
  );
}

function mapStateToProps(state) {
  return {
    isAuthenticated: state.auth.isAuthenticated,
    isVerifying: state.auth.isVerifying,
  };
}

export default connect(mapStateToProps)(Routes);
