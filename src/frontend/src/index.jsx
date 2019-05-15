import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import * as Sentry from '@sentry/browser';
import store from './store';
import 'normalize.css/normalize.css';
import AppRouter from './AppRouter';
import GoogleAnalytics from 'react-ga';
import { Log } from '@utils';
// #if process.env.NODE_ENV !== 'production'
import './ReactotronConfig';
// #endif

const myStore = store();

if (process.env.NODE_ENV !== 'production') {
  localStorage.setItem('debug', 'lpapps:*');
}

const jsx = (
  <Provider store={myStore}>
    <AppRouter />
  </Provider>
);

// Sentry.init({
//   dsn: 'https://1da20b1a10f245cab2220da15f2a56a1@sentry.io/1283419',
//   environment: process.env.NODE_ENV,
//   debug: process.env.NODE_ENV !== 'production'
// });

Log.info(`
██╗     ██████╗  █████╗ ██████╗ ██████╗ ███████╗
██║     ██╔══██╗██╔══██╗██╔══██╗██╔══██╗██╔════╝
██║     ██████╔╝███████║██████╔╝██████╔╝███████╗
██║     ██╔═══╝ ██╔══██║██╔═══╝ ██╔═══╝ ╚════██║
███████╗██║     ██║  ██║██║     ██║     ███████║
╚══════╝╚═╝     ╚═╝  ╚═╝╚═╝     ╚═╝     ╚══════╝
`);

GoogleAnalytics.initialize('UA-139954974-1');

render(jsx, document.querySelector('#app'));
