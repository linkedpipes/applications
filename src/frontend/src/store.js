import { applyMiddleware, createStore, combineReducers, compose } from "redux";
import datasourcesReducer from "./_reducers/datasources";
import visualizers from "./_reducers/visualizers";
import etl_executions from "./_reducers/etl_executions";
import etl_exports from "./_reducers/etl_exports";
import logger from "redux-logger";
import globals from "./_reducers/globals";

const composeEnhancers =
  typeof window === "object" && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
    ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({
        // Specify extension’s options like name, actionsBlacklist, actionsCreators, serialize...
      })
    : compose;

const enhancer = composeEnhancers(applyMiddleware(logger));

export default () => {
  const store = createStore(
    combineReducers({
      globals: globals,
      datasources: datasourcesReducer,
      visualizers: visualizers,
      etl_executions: etl_executions,
      etl_exports: etl_exports
    }),
    enhancer
  );

  return store;
};
