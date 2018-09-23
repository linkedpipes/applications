import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import "normalize.css/normalize.css";
import "./_styles/styles.scss";
import AppRouter from "./AppRouter";
import store from './store'

const myStore = store();

const jsx = (
  <Provider store={myStore}>
    <AppRouter />
  </Provider>
);

ReactDOM.render(jsx, document.querySelector("#app"));