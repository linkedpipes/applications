import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import DiscoverExamplesComponent from './DiscoverExamplesComponent';
import uuid from 'uuid';
import axios from 'axios';
import { Log } from '@utils';

export const samples = [
  {
    id: uuid.v4(),
    type: 'sparqlEndpoint',
    label: 'Treemap Sample',
    sparqlEndpointIri: 'https://linked.opendata.cz/sparql',
    dataSampleIri:
      'https://raw.githubusercontent.com/linkedpipes/applications/develop/data/rdf/cpv-2008/sample.ttl',
    namedGraph: 'http://linked.opendata.cz/resource/dataset/cpv-2008'
  },
  {
    id: uuid.v4(),
    type: 'ttlFile',
    label: 'GoogleMaps Sample',
    fileUrl:
      'https://gist.githubusercontent.com/aorumbayev/a36d768c1058ae7c24863126b16f29a0/raw/a7cb691063ff16b235993ca7e85154bb540b50e7/demo_maps.ttl'
  }
];

class DiscoverExamplesContainer extends PureComponent {
  handleListItemClicked = item => {
    const { onInputExampleClicked } = this.props;
    const inputExample = item;
    if (item.type === 'ttlFile') {
      axios
        .get(item.fileUrl)
        .then(response => {
          inputExample.dataSourcesUris = response.data;
          onInputExampleClicked(inputExample);
        })
        .catch(error => {
          // handle error
          Log.error(error, 'DiscoverExamplesContainer');
        });
    } else {
      onInputExampleClicked(inputExample);
    }
  };

  render() {
    const { handleListItemClicked } = this;
    return (
      <DiscoverExamplesComponent
        classes={undefined}
        onHandleListItemClick={handleListItemClicked}
        samples={samples}
      />
    );
  }
}

DiscoverExamplesContainer.propTypes = {
  onInputExampleClicked: PropTypes.func.isRequired
};

export default DiscoverExamplesContainer;
