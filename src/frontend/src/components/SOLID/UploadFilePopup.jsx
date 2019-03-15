import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import { Uploader } from '@inrupt/solid-react-components';
import { toast } from 'react-toastify';
const FileClient = require('solid-file-client');

const styles = theme => ({
  root: {
    justifyContent: 'center'
  },
  card: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column'
  },
  cardContent: {
    flexGrow: 1
  },
  media: {
    objectFit: 'cover'
  },
  uploadButton: {
    marginTop: theme.spacing.unit * 3
  }
});

class UploadFilePopup extends React.Component {
  state = {
    textFieldValue: ''
  };

  loadData = url => {
    return fetch(url).then(response => {
      // console.log(url + " -> " + response.ok);
      if (response.ok) {
        return response.text();
      }
      throw new Error('Error message.');
    });
  };

  handleUploadFile = e => {
    e.preventDefault();
    const self = this;

    self.loadData(this.state.textFieldValue).then(ttlFile => {
      FileClient.createFile(
        'https://aorumbayev.solid.community/public/testtt/test.ttl'
      ).then(
        success => {
          console.log(`Created file.`);
          FileClient.updateFile(
            'https://aorumbayev.solid.community/public/testtt/test.ttl',
            JSON.stringify(ttlFile),
            'text/plain'
          ).then(
            success => {
              console.log(`Updated file!`);
              toast.success(
                'Uploaded file .ttl file into Comminuty POD ! :-)',
                {
                  position: toast.POSITION.TOP_RIGHT,
                  autoClose: 2000
                }
              );
            },
            err => console.log(err)
          );
        },
        err => console.log(err)
      );
    });

    // FileClient.createFolder(
    //   "https://aorumbayev.solid.community/public/testtt"
    // ).then(
    //   success => {
    //     console.log(`Created folder ${url}.`);
    //   },
    //   err => console.log(err)
    // );
  };

  handleTextFieldChange = e => {
    const rawText = e.target.value;
    this.setState({ textFieldValue: rawText });
  };

  render() {
    const { classes } = this.props;
    const { textFieldValue } = this.state;
    const self = this;

    return <Uploader />;
  }
}

UploadFilePopup.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(UploadFilePopup);
