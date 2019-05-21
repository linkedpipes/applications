// @flow
import React, { PureComponent } from 'react';
import DiscoveriesTableComponent from './DiscoveriesTableComponent';
import { DiscoveryInformationDialog } from './children';
import UserService from '@utils/user.service';
import { connect } from 'react-redux';

type Props = {
  discoveriesList: Array<{ id: string, finished: boolean }>,
  onHandleSelectDiscoveryClick: Function,
  handleDiscoveryRowDeleteClicked: Function,
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

  handleDiscoveryRowDeleteClicked = (discovery: Object) => {
    const { webId } = this.props;
    UserService.deleteDiscovery(webId, discovery.discoveryId);
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

export default connect(mapStateToProps)(DiscoveriesTableContainer);
