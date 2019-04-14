import React from 'react';
import useWebId from './useWebId';

/**
 * Determines the display name of a component
 * https://reactjs.org/docs/higher-order-components.html
 */
export function getDisplayName(Component) {
  return Component.displayName || Component.name || 'Component';
}

/**
 * Creates a higher-order component with the given name.
 */
export function higherOrderComponent(name, createWrapper) {
  return Component => {
    const Wrapper = createWrapper(Component);
    Wrapper.displayName = `${name}(${getDisplayName(Component)})`;
    return Wrapper;
  };
}

/**
 * Higher-order component that passes the WebID of the logged-in user
 * to the webId property of the wrapped component.
 */
export default higherOrderComponent('WithWebId', Component => props => (
  <Component {...props} webId={useWebId()} />
));
