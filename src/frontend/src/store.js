import { applyMiddleware, createStore, combineReducers } from "redux";
import datasourcesReducer from "./_reducers/datasources";
import visualizers from "./_reducers/visualizers";
import etl_executions from "./_reducers/etl_executions";
import etl_exports from "./_reducers/etl_exports";
import logger from "redux-logger";
import globals from "./_reducers/globals";

export default () => {
  const store = createStore(
    combineReducers({
      globals: globals,
      datasources: datasourcesReducer,
      visualizers: visualizers,
      etl_executions: etl_executions,
      etl_exports: etl_exports
    }),
    window.__REDUX_DEVTOOLS_EXTENSION__ &&
      window.__REDUX_DEVTOOLS_EXTENSION__(),
    applyMiddleware(logger)
  );

  return store;
};
