// @flow
import React, { PureComponent } from 'react';
import { HeaderComponent } from './HeaderComponent';

type Props = {
  onDrawerToggle: Function
};

class HeaderContainer extends PureComponent<Props> {
  render() {
    const { onDrawerToggle } = this.props;
    return <HeaderComponent onDrawerToggle={onDrawerToggle} />;
  }
}

export const Header = HeaderContainer;
