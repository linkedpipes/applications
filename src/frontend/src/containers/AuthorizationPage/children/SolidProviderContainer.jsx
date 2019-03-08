import React, { PureComponent } from 'react';
import SolidProviderComponent from './SolidProviderComponent';

class SolidProviderContainer extends PureComponent {
  state = {
    provider: '',
    open: false
  };

  handleChange = event => {
    this.setState({ [event.target.name]: event.target.value });
  };

  handleClose = () => {
    this.setState({ open: false });
  };

  handleOpen = () => {
    this.setState({ open: true });
  };

  render() {
    const { open } = this.state;
    const { handleChange, handleOpen, handleClose } = this;

    return (
      <SolidProviderComponent
        open={open}
        onClose={handleClose}
        onOpen={handleOpen}
        onChange={handleChange}
      />
    );
  }
}

export default SolidProviderContainer;
