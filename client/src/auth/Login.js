import React, { Component } from "react";
// import { Route } from "react-router-dom";
import axios from "axios";
import { Link } from "react-router-dom";

class Login extends Component {
  state = {
    username: "",
    password: ""
  };

  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <div>
          <label>Username</label>
          <input
            name="username"
            value={this.state.username}
            onChange={this.handleChange}
            placeholder="username"
            type="text"
          />
        </div>
        <div>
          <label>Password</label>
          <input
            name="password"
            value={this.state.password}
            onChange={this.handleChange}
            placeholder="password"
            type="password"
          />
        </div>
        <Link to="/users">
          <button type="submit">Login</button>
        </Link>
      </form>
    );
  }

  handleChange = event => {
    this.setState({ [event.target.name]: event.target.value });
    // const {name, value } = event.target;
    // this.setState({[name]: value });
  };

  handleSubmit = event => {
    event.preventDefault();
    axios
      .post("http://localhost:8000/api/login", this.state)
      .then(res => {
        // console.log(res.data)
        localStorage.setItem("jwt", res.data);
      })
      .catch(err => {
        console.log(err);
      });
  };
}

export default Login;
