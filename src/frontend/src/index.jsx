import React from "react";
import { render } from "react-dom";
import { Provider } from "react-redux";
import store from "./store";
import * as Sentry from "@sentry/browser";

import "normalize.css/normalize.css";
import "./_styles/styles.scss";
import AppRouter from "./AppRouter";

const myStore = store();

const jsx = (
  <Provider store={myStore}>
    <AppRouter />
  </Provider>
);

render(jsx, document.querySelector("#app"));

Sentry.init({
  dsn: "https://1da20b1a10f245cab2220da15f2a56a1@sentry.io/1283419"
});
