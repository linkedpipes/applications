import React from "react";
import SelectSources from "./SelectSources";

class CreateApp extends React.Component {
  render() {
    return (
      <div style={{ padding: 50 }}>
        <SelectSources />
      </div>
    );
  }
}

CreateApp.propTypes = {};

export { CreateApp };
