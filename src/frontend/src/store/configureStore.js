import { createStore, combineReducers } from "redux";
import datasourcesReducer from "../reducers/datasources";
import pipelines from "../reducers/pipelines";

export default () => {
  const store = createStore(
    combineReducers({
      datasources: datasourcesReducer,
      pipelines: pipelines
    }),
    window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
  );

  return store;
};
