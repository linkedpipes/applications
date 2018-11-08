import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import BottomNavigation from "@material-ui/core/BottomNavigation";
import BottomNavigationAction from "@material-ui/core/BottomNavigationAction";
import HomeIcon from "@material-ui/icons/Home";
import ViewModuleIcon from "@material-ui/icons/ViewModule";
import HelpIcon from "@material-ui/icons/Help";
import { withRouter } from "react-router-dom";

const styles = {
  root: {
    textAlign: "center",
    position: "fixed",
    left: "0",
    bottom: "0",
    height: "60px",
    width: "100%"
  }
};

class SimpleBottomNavigation extends React.Component {
  state = {};

  handleChange = (event, value) => {
    if (value === "dashboard") {
      this.props.history.push("/dashboard");
    } else if (value === "application") {
      this.props.history.push("/select-sources");
    } else if (value === "about") {
      this.props.history.push("/about");
    }
  };

  render() {
    const { classes } = this.props;
    const { value } = this.state;

    return (
      <footer>
        <BottomNavigation
          value={value}
          onChange={this.handleChange}
          showLabels
          className={classes.root}
        >
          <BottomNavigationAction
            value="dashboard"
            label="Dashboard"
            icon={<HomeIcon />}
          />
          <BottomNavigationAction
            value="application"
            label="Applications"
            icon={<ViewModuleIcon />}
          />
          <BottomNavigationAction
            value="about"
            label="About"
            icon={<HelpIcon />}
          />
        </BottomNavigation>
      </footer>
    );
  }
}

SimpleBottomNavigation.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withRouter(withStyles(styles)(SimpleBottomNavigation));
