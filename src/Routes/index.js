import React from "react";
import { Switch, Route } from "react-router-dom";
import PrivateRoute from "./PrivateRoutes";
import LoginPage from "../containers/LoginPage";
import Dashboard from "../containers/Dashboard";

const Routes = () => {
  return (
    <Switch>
      <PrivateRoute exact path="/dashboard" component={Dashboard} />
      <Route path="/" component={LoginPage} />
    </Switch>
  );
};
export default Routes;
