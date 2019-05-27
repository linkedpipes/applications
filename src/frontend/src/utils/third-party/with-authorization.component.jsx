/* eslint-disable */
import React from 'react';
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';

const mapStateToProps = state => {
  return {
    webId: state.user.webId
  };
};

export const withAuthorization = (Component, Loader) =>
  connect(mapStateToProps)(
    class WithAuthorization extends React.Component {
      render() {
        switch (this.props.webId) {
          case undefined:
            return (
              Loader || (
                <Redirect
                  to={{
                    pathname: '/login',
                    state: { prevPath: this.props.location.pathname }
                  }}
                />
              )
            );
          case null:
            return (
              <Redirect
                to={{
                  pathname: '/login',
                  state: { prevPath: this.props.location.pathname }
                }}
              />
            );
          default:
            return <Component {...this.props} />;
        }
      }
    }
  );
