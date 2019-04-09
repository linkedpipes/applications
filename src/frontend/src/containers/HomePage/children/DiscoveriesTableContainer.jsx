// @flow
import React, { PureComponent } from 'react';
import DiscoveriesTableComponent from './DiscoveriesTableComponent';
import { DiscoveryInformationDialog } from './children';

type Props = {
  discoveriesList: Array<{ id: string, finished: boolean }>,
  onHandleSelectDiscoveryClick: Function
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

  handleDiscoveryRowClicked = (discovery: string) => {
    this.setState({
      open: true,
      selectedDiscovery: discovery
    });
  };

  render() {
    const { discoveriesList, onHandleSelectDiscoveryClick } = this.props;
    const { handleDiscoveryRowClicked, handleClose } = this;
    const { selectedDiscovery, open } = this.state;
    return (
      <div>
        <DiscoveriesTableComponent
          discoveriesList={discoveriesList}
          onHandleSelectDiscoveryClick={onHandleSelectDiscoveryClick}
          onHandleDiscoveryRowClicked={handleDiscoveryRowClicked}
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

export default DiscoveriesTableContainer;
