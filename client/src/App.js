import React, { Component } from "react";
import logo from "./logo.svg";
import "./App.css";
import { Route } from "react-router-dom";
import Login from './auth/Login'
import Users from './users/Users'


class App extends Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to React</h1>
        </header>
     
     <Route path="/login" component={Login}/>
     <Route path="/users" component={Users}/>
      </div>
    );
  }
}

export default App;
