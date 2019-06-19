// @flow
import React from 'react';
import Grid from '@material-ui/core/Grid';
import { withStyles } from '@material-ui/core/styles';
import { connect } from 'react-redux';
import { Log } from '@utils';
import FilePondPluginFileValidateType from 'filepond-plugin-file-validate-type';
import { FilePond, registerPlugin } from 'react-filepond';
import './css/FilePondDarkStyle.css';

// Register the filepond plugins
registerPlugin(FilePondPluginFileValidateType);

type Props = {
  classes: { textField: {}, gridRoot: {}, itemGrid: {} },
  onHandleSetRdfFile: Function,
  onHandleSetRdfDataSampleFile: Function
};

const styles = () => ({
  gridRoot: {
    display: 'flex',
    flexWrap: 'wrap'
  },
  textField: {
    margin: 'auto',
    width: '100%',
    marginTop: '0.5rem'
  },
  itemGrid: {
    height: '100%',
    width: '100%',
    margin: 'auto'
  }
});

const extensionMap = {
  ttl: 'text/turtle',
  nt: 'application/n-triples',
  nq: 'application/n-quads',
  trig: 'application/trig',
  rdf: 'application/rdf+xml',
  jsonld: 'application/ld+json'
};

const DiscoverRdfFileDropInComponent = ({
  classes,
  onHandleSetRdfFile,
  onHandleSetRdfDataSampleFile
}: Props) => (
  <div className={classes.gridRoot}>
    <Grid container spacing={2}>
      <Grid item xs={12} sm={12}>
        <FilePond
          // eslint-disable-next-line no-return-assign, react/no-this-in-sfc
          labelIdle="Drag & Drop your RDF file"
          allowMultiple={false}
          allowFileTypeValidation
          acceptedFileTypes={[
            'text/turtle',
            'application/n-triples',
            'application/n-quads',
            'application/trig',
            'application/rdf+xml',
            'application/ld+json'
          ]}
          fileValidateTypeLabelExpectedTypesMap={{
            'text/turtle': '.ttl',
            'application/n-triples': '.nt',
            'application/n-quads': '.nq',
            'application/trig': '.trig',
            'application/rdf+xml': '.rdf',
            'application/ld+json': '.jsonld'
          }}
          fileValidateTypeDetectType={(file, type) =>
            new Promise(resolve => {
              Log.info(file, type);
              if (type === '') {
                const extension = file.name.split('.').pop();
                const resolvedType = extensionMap[extension];
                resolve(resolvedType);
              }
              resolve(type);
            })
          }
          className={classes.itemGrid}
          maxFiles={1}
          onupdatefiles={fileItems => {
            // Set current file objects to this.state
            onHandleSetRdfFile(
              fileItems.length === 1 ? fileItems[0].file : undefined
            );
          }}
        />
      </Grid>
      <Grid item xs={12} sm={12}>
        <FilePond
          // eslint-disable-next-line no-return-assign, react/no-this-in-sfc
          labelIdle="Drag & Drop your RDF data sample file"
          allowMultiple={false}
          allowFileTypeValidation
          acceptedFileTypes={['text/turtle']}
          fileValidateTypeLabelExpectedTypesMap={{
            'text/turtle': '.ttl'
          }}
          fileValidateTypeDetectType={(file, type) =>
            new Promise(resolve => {
              Log.info(file, type);
              if (type === '') {
                const extension = file.name.split('.').pop();
                resolve(extension === 'ttl' ? 'text/turtle' : '');
              }
              resolve(type);
            })
          }
          className={classes.itemGrid}
          maxFiles={1}
          onupdatefiles={fileItems => {
            // Set current file objects to this.state
            onHandleSetRdfDataSampleFile(
              fileItems.length === 1 ? fileItems[0].file : undefined
            );
          }}
        />
      </Grid>
    </Grid>
  </div>
);

const mapStateToProps = state => {
  return {
    sparqlEndpointIri: state.discover.sparqlEndpointIri,
    dataSampleIri: state.discover.dataSampleIri,
    namedGraph: state.discover.namedGraph
  };
};

export default connect(mapStateToProps)(
  withStyles(styles)(DiscoverRdfFileDropInComponent)
);
