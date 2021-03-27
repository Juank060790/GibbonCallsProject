import React from "react";
import { Switch, Route } from "react-router-dom";
import PrivateRoute from "./PrivateRoutes";
import LoginPage from "../containers/LoginPage";
import Dashboard from "../containers/Dashboard";
import NotFoundPage from "./NotFoundPage";
import SingleAudio from "../containers/SingleAudio";

const Routes = () => {
  return (
    <Switch>
      <Route exact path="/" component={LoginPage} />
      <Route exact path="/audio/audiolist/:id" component={SingleAudio} />
      <PrivateRoute exact path="/dashboard" component={Dashboard} />
      <Route component={NotFoundPage} />
    </Switch>
  );
};
export default Routes;
