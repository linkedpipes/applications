import React, { PureComponent } from 'react';
import { NavigationBarComponent } from './NavigationBarComponent';

class NavigationBarContainer extends PureComponent {
  state = {
    drawerState: false
  };

  handleDrawerOpen = () => {
    this.setState({ drawerState: true });
  };

  handleDrawerClose = () => {
    this.setState({ drawerState: false });
  };

  render() {
    const { drawerState } = this.state;

    return (
      <NavigationBarComponent
        drawerState={drawerState}
        onHandleDrawerOpen={this.handleDrawerOpen}
        onHandleDrawerClose={this.handleDrawerClose}
      />
    );
  }
}

export const NavigationBar = NavigationBarContainer;
