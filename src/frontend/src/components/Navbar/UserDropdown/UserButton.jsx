import { Component } from "react";
import React from "react";
import IconButton from "@material-ui/core/IconButton/IconButton";
import MenuItem from "@material-ui/core/MenuItem/MenuItem";
import Menu from "@material-ui/core/Menu/Menu";
import SettingsIcon from '@material-ui/icons/Settings';
import PersonIcon from '@material-ui/icons/Person';
import RemoveIcon from '@material-ui/icons/Remove';
import AccountCircle from '@material-ui/icons/AccountCircle';
import ListItemIcon from "@material-ui/core/ListItemIcon/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText/ListItemText";


const styles = {
  root: {
    flexGrow: 1,
  },
  grow: {
    flexGrow: 1,
  },
  menuButton: {
    marginLeft: -12,
    marginRight: 20,
  },
};

class UserButton extends Component {

  state = {
    auth: true,
    anchorEl: null,
  };

  handleMenu = event => {
    this.setState({ anchorEl: event.currentTarget });
  };


  handleClose = () => {
    this.setState({ anchorEl: null });
  };

  render() {
    const { classes } = this.props;
    const { auth, anchorEl } = this.state;
    const open = Boolean(anchorEl);

    return (
      auth && (
        <div>
          <IconButton
            onClick={this.handleMenu}
            color="inherit"
          >
            <AccountCircle />
          </IconButton>

          <Menu
            anchorEl={anchorEl}
            anchorOrigin={{
              vertical: 'top',
              horizontal: 'center',
            }}
            transformOrigin={{
              vertical: 'bottom',
              horizontal: 'center',
            }}
            open={open}
            onClose={this.handleClose}
          >
            <MenuItem onClick={this.handleClose} >
              <ListItemIcon>
                <PersonIcon />
              </ListItemIcon>
              <ListItemText inset primary="Profile"
              />
            </MenuItem>
            <MenuItem onClick={this.handleClose} >
              <ListItemIcon>
                <SettingsIcon />
              </ListItemIcon>
              <ListItemText inset primary="Settings"
              />
            </MenuItem>
            <MenuItem onClick={this.handleClose} >
              <ListItemIcon>
                <RemoveIcon />
              </ListItemIcon>
              <ListItemText inset primary="Logout"
              />
            </MenuItem>
          </Menu>
        </div>
      )
    );
  }
}

export { UserButton }