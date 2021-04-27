import "../scss/main.scss";
import React from "react";
import { Route, Switch } from "react-router";
import Layout from "./Layout";

class App extends React.Component {
  render() {
    return (
      <Switch>
        <Route exact path="/" component={Layout} />
        {/* <Route path="/story" component={EditorialLayout}*/}
      </Switch>
    );
  }
}

export default App;
