import React from 'react';
import PropTypes from 'prop-types';

const NotFoundPageComponent = ({ location }) => (
  <div>
    <h3>
      No match for <code>{location.pathname}</code>
    </h3>
  </div>
);

NotFoundPageComponent.propTypes = {
  location: PropTypes.any.isRequired
};

export default NotFoundPageComponent;
