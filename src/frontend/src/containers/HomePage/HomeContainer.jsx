import HomeComponent from './HomeComponent';
import { connect } from 'react-redux';
import { userActions } from '@ducks/userDuck';
import { withWebId } from '@inrupt/solid-react-components';

const mapStateToProps = state => {
  return {
    userProfile: state.user
  };
};

const mapDispatchToProps = dispatch => {
  const handleSetUserProfile = userProfile =>
    dispatch(userActions.setUserProfile(userProfile));
  return {
    handleSetUserProfile
  };
};

const HomeContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(withWebId(HomeComponent));

export default HomeContainer;
