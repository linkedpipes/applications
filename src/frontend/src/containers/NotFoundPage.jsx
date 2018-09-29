import React from "react";
import { Link } from "react-router-dom";

const NotFoundPage = ({ location }) => (
  <div>
    <h3>
      No match for <code>{location.pathname}</code>
    </h3>
  </div>
);

export default NotFoundPage;
