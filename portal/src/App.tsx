import React from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";

import PageNotFound from "./containers/PageNotFound";
import LogInPage from "./components/Login";
import Dashboard from "./components/Dashboard";

function App() {
  return (
    <BrowserRouter>
      <div>
        <Switch>
          <Route exact path="/" component={Dashboard} />
          <Route exact path="/portal" component={PageNotFound} />
          <Route exact path="/login" component={LogInPage} />
          <Route exact path="/dashboard" component={Dashboard} />
          {/* <Redirect to = 'dashboard'/> */}
        </Switch>
      </div>
    </BrowserRouter>
  );
}

export default App;
