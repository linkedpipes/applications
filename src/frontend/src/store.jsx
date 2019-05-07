import { applyMiddleware, combineReducers, compose, createStore } from 'redux';
import logger from 'redux-logger';
import { discoverReducer } from '@containers';
import { discoveryReducer } from '@ducks/discoveryDuck';
import { globalReducer } from '@ducks/globalDuck';
import { etlReducer } from '@ducks/etlDuck';
import { userReducer } from '@ducks/userDuck';
import { visualizersReducer } from '@ducks/visualizersDuck';
import { applicationReducer } from '@ducks/applicationDuck';
import { filtersReducer } from '@ducks/filtersDuck';
import thunk from 'redux-thunk';
import Reactotron from './ReactotronConfig';

const composeEnhancers =
  // eslint-disable-next-line no-underscore-dangle
  typeof window === 'object' && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
    ? // eslint-disable-next-line no-underscore-dangle
      window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({
        // Specify extenreadFolderion’s options like name, actionsBlacklist, actionsCreators, serialize...
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

const appReducer = combineReducers({
  user: userReducer,
  globals: globalReducer,
  discover: discoverReducer,
  discovery: discoveryReducer,
  visualizers: visualizersReducer,
  etl: etlReducer,
  application: applicationReducer,
  filters: filtersReducer
});

const rootReducer = (state, action) => {
  if (action.type === 'USER_LOGOUT') {
    state = undefined;
  }

  return appReducer(state, action);
};

const store = createStore(rootReducer, enhancer);
export default () => store;
