import Reactotron from 'reactotron-react-js';
import { reactotronRedux } from 'reactotron-redux';

const reactotron = Reactotron.configure({ name: 'LPApps Frontend' }).use(
  reactotronRedux()
);

if (process.env.NODE_ENV !== 'production') {
  reactotron.connect();
}

export default reactotron;
