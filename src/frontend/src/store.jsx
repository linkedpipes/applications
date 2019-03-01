import { applyMiddleware, createStore, combineReducers, compose } from 'redux';
import datasourcesReducer from './_reducers/datasources';
import visualizers from './_reducers/visualizers';
import etl_executions from './_reducers/etl_executions';
import etl_exports from './_reducers/etl_exports';
import filters from './_reducers/filters';
import markers from './_reducers/markers';
import logger from 'redux-logger';
import globals from './_reducers/globals';
import { discoverReducer } from '@containers';
import Reactotron from './ReactotronConfig';
import thunk from 'redux-thunk';

const composeEnhancers =
  typeof window === 'object' && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
    ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({
        // Specify extension’s options like name, actionsBlacklist, actionsCreators, serialize...
      })
    : compose;

const middlewares = [thunk, logger];

const enhancer = composeEnhancers(applyMiddleware(...middlewares));

export default () => {
  const store = Reactotron.createStore(
    combineReducers({
      globals,
      discover: discoverReducer,
      datasources: datasourcesReducer,
      visualizers,
      etl_executions,
      etl_exports,
      filters,
      markers
    }),
    enhancer
  );

  return store;
};
