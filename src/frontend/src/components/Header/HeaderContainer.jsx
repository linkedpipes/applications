// @flow
import React, { PureComponent } from 'react';
import { HeaderComponent } from './HeaderComponent';

type Props = {};

class HeaderContainer extends PureComponent<Props> {
  render() {
    return <HeaderComponent />;
  }
}

export const Header = HeaderContainer;
