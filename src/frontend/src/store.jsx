import { applyMiddleware, combineReducers, compose, createStore } from 'redux';
import logger from 'redux-logger';
import { discoverReducer } from '@containers';
import { discoveryReducer } from '@ducks/discoveryDuck';
import { globalReducer } from '@ducks/globalDuck';
import { etlReducer } from '@ducks/etlDuck';
import { userReducer } from '@ducks/userDuck';
import { visualizersReducer } from '@ducks/visualizersDuck';
import thunk from 'redux-thunk';
import Reactotron from './ReactotronConfig';

const composeEnhancers =
  // eslint-disable-next-line no-underscore-dangle
  typeof window === 'object' && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
    ? // eslint-disable-next-line no-underscore-dangle
      window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({
        // Specify extension’s options like name, actionsBlacklist, actionsCreators, serialize...
      })
    : compose;

const middlewares = [thunk, logger];

const enhancer =
  process.env.NODE_ENV !== 'production'
    ? composeEnhancers(
        applyMiddleware(...middlewares),
        Reactotron.createEnhancer()
      )
    : composeEnhancers(applyMiddleware(...middlewares));

const store = createStore(
  combineReducers({
    user: userReducer,
    globals: globalReducer,
    discover: discoverReducer,
    datasources: discoveryReducer,
    visualizers: visualizersReducer,
    etl: etlReducer
  }),
  enhancer
);
export default () => store;
