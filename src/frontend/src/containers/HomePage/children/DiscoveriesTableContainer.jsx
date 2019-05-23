// @flow
import React, { PureComponent } from 'react';
import DiscoveriesTableComponent from './DiscoveriesTableComponent';
import { DiscoveryInformationDialog } from './children';
import { Log, UserService } from '@utils';
import { userActions } from '@ducks/userDuck';
import { connect } from 'react-redux';
import { toast } from 'react-toastify';

type Props = {
  discoveriesList: Array<{ id: string, finished: boolean }>,
  onHandleSelectDiscoveryClick: Function,
  onSetApplicationLoaderStatus: Function,
  handleSetUserProfileAsync: Function,
  webId: string
};

type State = {
  open: boolean,
  selectedDiscovery: Object
};

class DiscoveriesTableContainer extends PureComponent<Props, State> {
  state = {
    open: false,
    selectedDiscovery: {}
  };

  handleClose = () => {
    this.setState({ selectedDiscovery: {}, open: false });
  };

  handleDiscoveryRowClicked = (discovery: Object) => {
    this.setState({
      open: true,
      selectedDiscovery: discovery
    });
  };

  handleDiscoveryRowDeleteClicked = async (discovery: Object) => {
    const {
      webId,
      onSetApplicationLoaderStatus,
      handleSetUserProfileAsync
    } = this.props;

    onSetApplicationLoaderStatus(true);

    const response = await UserService.deleteDiscovery(
      webId,
      discovery.discoveryId
    );
    if (response.status === 200) {
      await onSetApplicationLoaderStatus(false);
      await handleSetUserProfileAsync(response.data);
    } else {
      await onSetApplicationLoaderStatus(false);
      toast.error('Error! Unable to delete session. Try again later...', {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 5000
      });
    }
  };

  render() {
    const { discoveriesList, onHandleSelectDiscoveryClick } = this.props;
    const {
      handleDiscoveryRowClicked,
      handleClose,
      handleDiscoveryRowDeleteClicked
    } = this;
    const { selectedDiscovery, open } = this.state;
    return (
      <div>
        <DiscoveriesTableComponent
          discoveriesList={discoveriesList}
          onHandleSelectDiscoveryClick={onHandleSelectDiscoveryClick}
          onHandleDiscoveryRowClicked={handleDiscoveryRowClicked}
          onHandleDiscoveryRowDeleteClicked={handleDiscoveryRowDeleteClicked}
        />
        <DiscoveryInformationDialog
          selectedValue={selectedDiscovery}
          open={open}
          onClose={handleClose}
        />
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    webId: state.user.webId
  };
};

const mapDispatchToProps = dispatch => {
  const handleSetUserProfileAsync = userProfile =>
    dispatch(userActions.setUserProfileAsync(userProfile));

  return { handleSetUserProfileAsync };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(DiscoveriesTableContainer);
