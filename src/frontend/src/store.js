import { applyMiddleware, createStore, combineReducers } from "redux";
import datasourcesReducer from "./reducers/datasources";
import pipelines from "./reducers/pipelines";
import etl_executions from "./reducers/etl_executions";
import etl_exports from "./reducers/etl_exports";
import dialogs from "./reducers/dialogs";
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
