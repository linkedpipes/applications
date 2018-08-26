import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import withRoot from "./withRoot";
import SelectSources from "./SelectSources";
import "whatwg-fetch";
import "react-toastify/dist/ReactToastify.css";

class AssistantDemoPage extends React.Component {
  render() {
    return (
      <body>
        <div style={{ padding: 50 }}>
          <SelectSources />
        </div>
      </body>
    );
  }
}

AssistantDemoPage.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withRoot(withStyles()(AssistantDemoPage));
