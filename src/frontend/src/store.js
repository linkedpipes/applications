import { applyMiddleware, createStore, combineReducers } from "redux";
import datasourcesReducer from "./_reducers/datasources";
import pipelines from "./_reducers/pipelines";
import dialogs from "./_reducers/dialogs";
import etl_executions from "./_reducers/etl_executions";
import etl_exports from "./_reducers/etl_exports";
import logger from "redux-logger";

export default () => {
  const store = createStore(
    combineReducers({
      datasources: datasourcesReducer,
      pipelines: pipelines,
      dialogs: dialogs,
      etl_executions: etl_executions,
      etl_exports: etl_exports
    }),
    window.__REDUX_DEVTOOLS_EXTENSION__ &&
      window.__REDUX_DEVTOOLS_EXTENSION__(),
    applyMiddleware(logger)
  );

  return store;
};
