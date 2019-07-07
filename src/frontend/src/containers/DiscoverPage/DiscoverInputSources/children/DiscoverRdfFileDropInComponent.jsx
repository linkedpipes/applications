// @flow
import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import { connect } from 'react-redux';
import FilePondPluginFileValidateType from 'filepond-plugin-file-validate-type';
import { FilePond, registerPlugin } from 'react-filepond';
import { Log } from '@utils';
import './css/FilePondDarkStyle.css';

// Register the filepond plugins
registerPlugin(FilePondPluginFileValidateType);

type Props = {
  classes: { textField: {}, gridRoot: {}, itemGrid: {} },
  onHandleSetRdfFile: Function,
  onHandleSetRdfDataSampleFile: Function
};

const styles = () => ({
  inputElement: {
    marginTop: '1rem',
    marginBottom: '1rem'
  },
  textField: {
    width: '100%',
    marginTop: '1rem',
    marginBottom: '1rem'
  },
  itemGrid: {
    height: '100%',
    width: '100%',
    marginBottom: '1rem'
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
    <FilePond
      // eslint-disable-next-line no-return-assign, react/no-this-in-sfc
      labelIdle="Drag & Drop your RDF file or click me to choose (.ttl, .nt, .ng, .trig, .rdf or .jsonld)"
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
        // eslint-disable-next-line prefer-const
        let file = fileItems.length === 1 ? fileItems[0].file : undefined;
        if (file && file.type === '') {
          const extension = file.name.split('.').pop();
          const resolvedType = extensionMap[extension];
          file = new File([file], file.name, { type: resolvedType });
        }
        onHandleSetRdfFile(file);
      }}
    />
    <FilePond
      // eslint-disable-next-line no-return-assign, react/no-this-in-sfc
      labelIdle="(Optional) Drag & Drop your RDF data sample file or click me to choose (.ttl, .nt, .ng, .trig, .rdf or .jsonld)"
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
        // eslint-disable-next-line prefer-const
        let file = fileItems.length === 1 ? fileItems[0].file : undefined;
        if (file && file.type === '') {
          const extension = file.name.split('.').pop();
          const resolvedType = extensionMap[extension];
          file = new File([file], file.name, { type: resolvedType });
        }
        onHandleSetRdfDataSampleFile(file);
      }}
    />
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
