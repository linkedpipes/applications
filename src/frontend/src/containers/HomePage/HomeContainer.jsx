import HomeComponent from './HomeComponent';
import { connect } from 'react-redux';
import { userActions } from '@ducks/userDuck';
import { withWebId, withAuthorization } from '@inrupt/solid-react-components';
import { discoverActions } from '../DiscoverPage/duck';

const mapStateToProps = state => {
  return {
    userProfile: state.user,
    discoveriesList: state.user.discoverySessions,
    pipelinesList: state.user.pipelineExecutions,
    applicationsList: state.user.applications
  };
};

const mapDispatchToProps = dispatch => {
  const onInputExampleClicked = sample =>
    dispatch(discoverActions.setSelectedInputExample(sample));
  const handleSetUserProfile = userProfile =>
    dispatch(userActions.setUserProfile(userProfile));
  return {
    handleSetUserProfile,
    onInputExampleClicked
  };
};

export default withAuthorization(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(withWebId(HomeComponent))
);
