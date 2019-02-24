import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import DiscoverExamplesComponent from './DiscoverExamplesComponent';
import uuid from 'uuid';

const samples = [
  {
    id: uuid.v4(),
    label: 'DBPedia Earthquakes',
    URIS: [
      'https://ldcp.opendata.cz/resource/dbpedia/datasource-templates/Earthquake',
      'https://discovery.linkedpipes.com/resource/lod/templates/http---commons.dbpedia.org-sparql'
    ]
  },
  {
    id: uuid.v4(),
    label: 'Wikidata Timeline & Map',
    URIS: [
      'https://discovery.linkedpipes.com/resource/discovery/wikidata-06/config',
      'https://discovery.linkedpipes.com/vocabulary/discovery/Input',
      'https://discovery.linkedpipes.com/vocabulary/discovery/hasTemplate',
      'https://discovery.linkedpipes.com/resource/application/map-labeled-points/template',
      'https://discovery.linkedpipes.com/resource/application/map/template',
      'https://discovery.linkedpipes.com/resource/application/timeline-periods/template',
      'https://discovery.linkedpipes.com/resource/application/timeline/template',
      'https://discovery.linkedpipes.com/resource/transformer/schema-enddate-to-dcterms-date/template',
      'https://discovery.linkedpipes.com/resource/transformer/schema-name-to-dcterms-title/template',
      'https://discovery.linkedpipes.com/resource/transformer/schema-startdate-to-dcterms-date/template'
    ]
  }
];

class DiscoverExamplesContainer extends PureComponent {
  handleListItemClick = uris => {
    const value = uris.join(',\n');
    this.props.onInputExampleClicked(value);
  };

  render() {
    return (
      <DiscoverExamplesComponent
        classes={undefined}
        onHandleListItemClick={this.handleListItemClick}
        samples={samples}
      />
    );
  }
}

DiscoverExamplesContainer.propTypes = {
  onInputExampleClicked: PropTypes.func
};

export default DiscoverExamplesContainer;
