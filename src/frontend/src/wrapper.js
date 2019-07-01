// @flow
import * as React from 'react';
import { Provider } from 'react-redux';
import withRoot from './withRoot';
import store from './store';
import { BrowserRouter as Router } from 'react-router-dom';
import { SocketContext } from '@utils';

const myStore = store();

type Props = {
  children: any
};

// eslint-disable-next-line prefer-const
let socket = {};

const Wrapper = withRoot(({ children }: Props) => (
  // eslint-disable-next-line react/jsx-filename-extension
  <Router>
    <SocketContext.Provider value={socket}>
      <Provider store={myStore}>{children}</Provider>
    </SocketContext.Provider>
  </Router>
));

export default Wrapper;
