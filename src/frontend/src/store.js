import { applyMiddleware, createStore, combineReducers } from "redux";
import datasourcesReducer from "./_reducers/datasources";
import pipelines from "./_reducers/pipelines";
import executions from "./_reducers/executions";
import dialogs from "./_reducers/dialogs";
import logger from "redux-logger";

export default () => {
  const store = createStore(
    combineReducers({
      datasources: datasourcesReducer,
      pipelines: pipelines,
      dialogs: dialogs,
      executions: executions
    }),
    window.__REDUX_DEVTOOLS_EXTENSION__ &&
      window.__REDUX_DEVTOOLS_EXTENSION__(),
    applyMiddleware(logger)
  );

  return store;
};
