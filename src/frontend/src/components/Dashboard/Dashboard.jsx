import React, { Component } from "react";

class Dashboard extends Component {
  constructor(props) {
    super(props);

    this.state = {
      username: "",
      password: "",
      submitted: false
    };
  }

  render() {
    return <div>Dashboard</div>;
  }
}

export { Dashboard };
