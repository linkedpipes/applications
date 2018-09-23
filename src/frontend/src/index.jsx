import React from "react";
import {render} from "react-dom";
import { Provider } from "react-redux";
import store from './store'

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