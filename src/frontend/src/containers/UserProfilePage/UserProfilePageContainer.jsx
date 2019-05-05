// @flow
import React, { PureComponent } from 'react';
import UserProfilePageComponent from './UserProfilePageComponent';
import { connect } from 'react-redux';
import { withAuthorization } from '@utils';

type Props = {
  userProfile: Object
};

class UserProfilePageContainer extends PureComponent<Props> {
  componentDidMount() {}

  render() {
    const { userProfile } = this.props;
    return <UserProfilePageComponent userProfile={userProfile} />;
  }
}

const mapStateToProps = state => {
  return {
    userProfile: state.user
  };
};

export default withAuthorization(
  connect(mapStateToProps)(UserProfilePageContainer)
);
