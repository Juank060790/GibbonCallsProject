import React from "react";
import { Switch, Route } from "react-router-dom";
import PrivateRoute from "./PrivateRoutes";
import LoginPage from "../containers/LoginPage";
import Dashboard from "../containers/Dashboard";
import NotFoundPage from "./NotFoundPage";

const Routes = () => {
  return (
    <Switch>
      <PrivateRoute exact path="/dashboard" component={Dashboard} />
      <Route exact path="/" component={LoginPage} />
      <Route component={NotFoundPage} />
    </Switch>
  );
};
export default Routes;
