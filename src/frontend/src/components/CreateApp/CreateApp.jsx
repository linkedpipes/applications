import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import withRoot from "../withRoot";
import SelectSources from "./SelectSources";
import "react-toastify/dist/ReactToastify.css";

class AssistantDemoPage extends React.Component {
  render() {
    return (
      <div style={{ padding: 50 }}>
        <SelectSources />
      </div>
    );
  }
}

AssistantDemoPage.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withRoot(withStyles()(AssistantDemoPage));
