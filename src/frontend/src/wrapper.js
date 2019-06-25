// @flow
import * as React from 'react';
import { Provider } from 'react-redux';
import withRoot from './withRoot';
import store from './store';
import { BrowserRouter as Router } from 'react-router-dom';

const myStore = store();

type Props = {
  children: any
};

const Wrapper = withRoot(({ children }: Props) => (
  <Router>
    <Provider store={myStore}>{children}</Provider>
  </Router>
));

export default Wrapper;
