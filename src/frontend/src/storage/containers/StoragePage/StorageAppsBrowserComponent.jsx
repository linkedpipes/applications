// @flow
import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { StorageAppsBrowserCardComponent } from './children';
import AppConfiguration from '@storage/models/AppConfiguration';
import Emoji from 'react-emoji-render';
import uuid from 'uuid';

const styles = () => ({
  root: {
    minWidth: '920'
  },
  gridArea: {
    flexGrow: 1,
    marginTop: 5,
    marginLeft: 5,
    marginRight: 5
  }
});

type Props = {
  classes: {
    main: {},
    paper: {},
    avatar: {},
    form: {},
    gridList: {},
    root: {},
    gridArea: {}
  },
  applicationsMetadata: Array<AppConfiguration>,
  onHandleApplicationDeleted: Function,
  setApplicationLoaderStatus: Function
};

function StorageAppsBrowserComponent(props: Props) {
  const {
    classes,
    applicationsMetadata,
    onHandleApplicationDeleted,
    setApplicationLoaderStatus
  } = props;

  return (
    <div className={classes.root}>
      <div className={classes.gridArea}>
        <Grid container spacing={4}>
          {applicationsMetadata.length !== 0 ? (
            applicationsMetadata.map(metadata => (
              <Grid
                key={metadata.createdAt}
                item
                xs={3}
                sm={3}
                md={3}
                lg={2}
                xl={2}
              >
                <StorageAppsBrowserCardComponent
                  key={uuid.v4()}
                  applicationMetadata={metadata}
                  setApplicationLoaderStatus={setApplicationLoaderStatus}
                  onHandleApplicationDeleted={onHandleApplicationDeleted}
                />
              </Grid>
            ))
          ) : (
            <Typography variant="body2" align="center" gutterBottom>
              <Emoji text="No applications published yet ☹️" />
            </Typography>
          )}
        </Grid>
      </div>
    </div>
  );
}

StorageAppsBrowserComponent.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(StorageAppsBrowserComponent);

//

/* <div className={classes.main}> */
//       <Avatar className={classes.avatar}>
//         <StorageIcon />
//       </Avatar>
//       <Typography component="h1" variant="h5">
//         LPApps Storage
//       </Typography>
//       <form className={classes.form}>
//         {applicationsMetadata.length !== 0 ? (
//           <GridList spacing={20} cellHeight={200} className={classes.gridList}>
//             {applicationsMetadata.map(metadata => (
//               <StorageAppsBrowserCardComponent
//                 key={uuid.v4()}
//                 applicationMetadata={metadata}
//                 setApplicationLoaderStatus={setApplicationLoaderStatus}
//                 onHandleApplicationDeleted={onHandleApplicationDeleted}
//               />
//             ))}
//           </GridList>
//         ) : (
//           <Typography variant="body2" align="center" gutterBottom>
//             <Emoji text="No applications published yet ☹️" />
//           </Typography>
//         )}
//       </form>
//     </div>
