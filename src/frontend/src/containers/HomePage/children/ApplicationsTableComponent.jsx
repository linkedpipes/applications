// @flow
import * as React from 'react';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Button from '@material-ui/core/Button';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import uuid from 'uuid';
import { AppConfiguration, StorageToolbox } from '@storage';
import moment from 'moment';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import IconButton from '@material-ui/core/IconButton';
import RemoveIcon from '@material-ui/icons/RemoveCircle';
import { withStyles } from '@material-ui/core/styles';

const styles = () => ({
  root: {
    overflowX: 'auto'
  }
});

type Props = {
  applicationsList: Array<AppConfiguration>,
  onHandleAppClicked: Function,
  onHandleShareAppClicked: Function,
  onHandleDeleteAppClicked: Function,
  classes: Object
};

const ApplicationsTableComponent = ({
  applicationsList,
  onHandleShareAppClicked,
  onHandleAppClicked,
  onHandleDeleteAppClicked,
  classes
}: Props) => (
  <div>
    {(applicationsList && applicationsList.length) > 0 ? (
      <Paper classes={classes}>
        <Table>
          <TableHead>
            <TableRow key={uuid()}>
              <TableCell align="center">Action</TableCell>
              <TableCell align="center">Share</TableCell>
              <TableCell align="center">Remove</TableCell>
              <TableCell align="center">Title</TableCell>
              <TableCell align="center">Type</TableCell>
              <TableCell align="center">Created At</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {applicationsList.map((metadata, index) => (
              <TableRow key={uuid()}>
                <TableCell
                  align="center"
                  component="th"
                  scope="row"
                  padding="checkbox"
                >
                  <Button
                    size="small"
                    variant="contained"
                    color="secondary"
                    onClick={() => {
                      onHandleAppClicked(metadata);
                    }}
                  >
                    Modify
                  </Button>
                </TableCell>
                <TableCell
                  align="center"
                  component="th"
                  scope="row"
                  padding="checkbox"
                >
                  <CopyToClipboard
                    text={StorageToolbox.appIriToPublishUrl(
                      metadata.solidFileUrl,
                      metadata.configuration.endpoint
                    )}
                    onCopy={onHandleShareAppClicked}
                  >
                    <Button size="small" variant="contained" color="primary">
                      Copy URL
                    </Button>
                  </CopyToClipboard>
                </TableCell>
                <TableCell
                  align="center"
                  component="th"
                  scope="row"
                  padding="checkbox"
                >
                  <IconButton
                    id={`delete_application_session_button_${index}`}
                    key={`button_application_${metadata.solidFileTitle}`}
                    aria-label="Decline"
                    onClick={() => onHandleDeleteAppClicked(metadata)}
                  >
                    <RemoveIcon />
                  </IconButton>
                </TableCell>
                <TableCell align="center" component="th" scope="row">
                  {metadata.configuration.title}
                </TableCell>
                <TableCell align="center">
                  {metadata.configuration.endpoint}
                </TableCell>
                <TableCell align="center">{`${moment(
                  metadata.configuration.published
                ).format('lll')}`}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>
    ) : (
      <Paper>
        <Typography variant="body1" gutterBottom>
          No applications found
        </Typography>
      </Paper>
    )}
  </div>
);

export default withStyles(styles)(ApplicationsTableComponent);
