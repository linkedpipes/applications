// @flow
import React from 'react';
import IconButton from '@material-ui/core/IconButton/IconButton';
import MenuItem from '@material-ui/core/MenuItem/MenuItem';
import Menu from '@material-ui/core/Menu/Menu';
import SettingsIcon from '@material-ui/icons/Settings';
import PersonIcon from '@material-ui/icons/Person';
import RemoveIcon from '@material-ui/icons/Remove';
import AccountCircle from '@material-ui/icons/AccountCircleTwoTone';
import NotificationsIcon from '@material-ui/icons/NotificationsTwoTone';
import Badge from '@material-ui/core/Badge';
import ListItemIcon from '@material-ui/core/ListItemIcon/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText/ListItemText';

type Props = {
  anchorElement: Object,
  onHandleLogoutClicked: Function,
  onHandleMenuClose: Function,
  onHandleMenuOpen: Function,
  profileMenuIsOpen: Function,
  onHandleOpenProfile: Function,
  onHandleOpenSettings: Function,
  onHandleSetInboxDialogOpen: Function,
  currentInboxInvitations: Array<Object>
};

const UserProfileButtonComponent = ({
  anchorElement,
  profileMenuIsOpen,
  onHandleMenuClose,
  onHandleMenuOpen,
  onHandleLogoutClicked,
  onHandleOpenProfile,
  onHandleOpenSettings,
  onHandleSetInboxDialogOpen,
  currentInboxInvitations
}: Props) => (
  <div>
    <IconButton color="inherit" onClick={onHandleSetInboxDialogOpen}>
      <Badge badgeContent={currentInboxInvitations.length} color="secondary">
        <NotificationsIcon />
      </Badge>
    </IconButton>

    <IconButton color="inherit" onClick={onHandleMenuOpen}>
      <AccountCircle />
    </IconButton>

    <Menu
      anchorEl={anchorElement}
      anchorOrigin={{
        vertical: 'top',
        horizontal: 'center'
      }}
      transformOrigin={{
        vertical: 'bottom',
        horizontal: 'center'
      }}
      open={profileMenuIsOpen}
      onClose={onHandleMenuClose}
    >
      <MenuItem onClick={onHandleOpenProfile}>
        <ListItemIcon>
          <PersonIcon />
        </ListItemIcon>
        <ListItemText inset primary="Profile" />
      </MenuItem>
      <MenuItem onClick={onHandleOpenSettings}>
        <ListItemIcon>
          <SettingsIcon />
        </ListItemIcon>
        <ListItemText inset primary="Settings" />
      </MenuItem>
      <MenuItem onClick={onHandleLogoutClicked}>
        <ListItemIcon>
          <RemoveIcon />
        </ListItemIcon>
        <ListItemText inset primary="Logout" />
      </MenuItem>
    </Menu>
  </div>
);

export default UserProfileButtonComponent;
