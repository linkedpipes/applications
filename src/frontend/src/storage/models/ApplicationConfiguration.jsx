/**
 * Model class for storing application configuration.
 */

import * as $rdf from 'rdflib';
import { GlobalUtils } from '@utils/';
import uuid from 'uuid';

const LPA = $rdf.Namespace('https://w3id.org/def/lpapps#');
const RDF = $rdf.Namespace('http://www.w3.org/1999/02/22-rdf-syntax-ns#');

const LPA_CONTEXT =
  'https://gist.githubusercontent.com/aorumbayev/36a4d2d87b721a406f12eaaa7aac3128/raw/4b5c66c10782b6e34bf0e895b2a0a6331af63676/lapps-ontology.jsonld';

export default class ApplicationConfiguration {
  configurationId: string;

  author: string;

  title: string;

  backgroundColor: string;

  graphIri: string;

  applicationData: string;

  etlExecutionIri: string;

  endpoint: string;

  visualizerType: string;

  filterConfiguration: Object;

  published: Date;

  constructor({
    configurationId,
    author,
    title,
    backgroundColor,
    graphIri,
    applicationData,
    etlExecutionIri,
    endpoint,
    visualizerType,
    filteredBy,
    published
  }) {
    this.configurationId = configurationId;
    this.author = author;
    this.title = title;
    this.backgroundColor = backgroundColor;
    this.graphIri = graphIri;
    this.applicationData = JSON.stringify(applicationData);
    this.etlExecutionIri = etlExecutionIri;
    this.endpoint = endpoint;
    this.visualizerType = visualizerType;
    this.filterConfiguration = filteredBy;
    this.published = published;
  }

  static from(json) {
    let jsonObject = json;

    if (typeof jsonObject === 'string' || jsonObject instanceof String)
      jsonObject = JSON.parse(json);

    return new ApplicationConfiguration(jsonObject);
  }

  static createUploadFilterConfigurationStatement(filtersConfiguration) {
    if (!filtersConfiguration) {
      return '';
    }
    const filtersState = filtersConfiguration.filtersState;

    const { filterGroups } = filtersState;
    const { nodesFilter, schemeFilter } = filterGroups;

    let nodesObject = {};
    if (nodesFilter !== undefined) {
      let nodesItems = [];

      nodesItems = nodesFilter.selectedOptions.items.map(item => {
        item['@type'] = 'FilterOption';
        item.visible = true;
        item.enabled = true;
        return item;
      });

      nodesObject = {
        '@type': 'NodesFilter',
        label: nodesFilter.label,
        enabled: nodesFilter.enabled,
        visible: nodesFilter.visible,
        filterType: nodesFilter.filterType,
        selectedOptions: {
          '@type': 'FilterOptionGroup',
          items: nodesItems
        }
      };
    }

    // eslint-disable-next-line no-unused-vars
    let schemeObject = {};
    if (schemeFilter !== undefined) {
      let schemeItems = [];

      schemeItems = schemeFilter.selectedOptions.map(item => {
        item['@type'] = 'FilterOption';
        item.visible = true;
        item.enabled = true;
        return item;
      });

      schemeObject = {
        '@type': 'SchemeFilter',
        label: schemeFilter.label,
        enabled: schemeFilter.enabled,
        visible: schemeFilter.visible,
        filterType: schemeFilter.filterType,
        selectedOptions: {
          '@type': 'FilterOptionGroup',
          items: schemeItems
        }
      };
    }

    return {
      '@type': 'FilterConfiguration',
      enabled: filtersState.enabled,
      visible: filtersState.visible,
      filterGroups: {
        '@type': 'FilterGroup',
        nodesFilter: nodesObject
      }
    };
  }

  static fromRawParameters(
    {
      applicationData,
      title,
      graphIri,
      etlExecutionIri,
      endpoint,
      visualizerType
    },
    filtersConfiguration,
    webId
  ): string {
    return new ApplicationConfiguration({
      '@context': LPA_CONTEXT,
      '@type': 'VisualizerConfiguration',
      configurationId: uuid.v4(),
      author: webId,
      title,
      backgroundColor: GlobalUtils.randDarkColor(),
      graphIri,
      published: new Date(Date.now()).toISOString(),
      etlExecutionIri,
      applicationData,
      endpoint,
      filteredBy: ApplicationConfiguration.createUploadFilterConfigurationStatement(
        filtersConfiguration
      ),
      visualizerType
    });
  }

  toTurtle = async appConfigurationMetadataPath => {
    const appConfigFile = $rdf.sym(appConfigurationMetadataPath);
    const doc = appConfigFile.doc();

    const store = $rdf.graph();
    store.add(appConfigFile, RDF('type'), LPA('VisualizerConfiguration'), doc);
    store.add(appConfigFile, LPA('author'), $rdf.sym(this.author), doc);
    store.add(appConfigFile, LPA('endpoint'), $rdf.lit(this.endpoint), doc);
    store.add(
      appConfigFile,
      LPA('etlExecutionIri'),
      $rdf.lit(this.etlExecutionIri),
      doc
    );
    store.add(appConfigFile, LPA('graphIri'), $rdf.lit(this.graphIri), doc);
    store.add(
      appConfigFile,
      LPA('configurationId'),
      $rdf.lit(this.configurationId),
      doc
    );
    store.add(appConfigFile, LPA('published'), $rdf.lit(this.published), doc);
    store.add(
      appConfigFile,
      LPA('applicationData'),
      $rdf.lit(this.applicationData),
      doc
    );
    store.add(
      appConfigFile,
      LPA('backgroundColor'),
      $rdf.lit(this.backgroundColor),
      doc
    );
    store.add(appConfigFile, LPA('title'), $rdf.lit(this.title), doc);
    store.add(
      appConfigFile,
      LPA('visualizerType'),
      $rdf.lit(this.visualizerType),
      doc
    );

    const filterOptionGroup = $rdf.blankNode();
    const nodesFilter = $rdf.blankNode();
    const filterGroup = $rdf.blankNode();
    const filtersConfiguration = $rdf.blankNode();

    if (this.filterConfiguration) {
      store.add(
        filtersConfiguration,
        RDF('type'),
        LPA('FilterConfiguration'),
        doc
      );
      store.add(
        filtersConfiguration,
        LPA('enabled'),
        $rdf.lit(this.filterConfiguration.enabled),
        doc
      );
      store.add(
        filtersConfiguration,
        LPA('visible'),
        $rdf.lit(this.filterConfiguration.enabled),
        doc
      );

      if (this.filterConfiguration.filterGroups) {
        store.add(filterGroup, RDF('type'), LPA('FilterGroup'), doc);

        if (this.filterConfiguration.filterGroups.nodesFilter) {
          store.add(nodesFilter, RDF('type'), LPA('NodesFilter'), doc);
          store.add(
            nodesFilter,
            LPA('enabled'),
            $rdf.lit(this.filterConfiguration.filterGroups.nodesFilter.enabled),
            doc
          );
          store.add(
            nodesFilter,
            LPA('visible'),
            $rdf.lit(this.filterConfiguration.filterGroups.nodesFilter.visible),
            doc
          );
          store.add(
            nodesFilter,
            LPA('label'),
            $rdf.lit(this.filterConfiguration.filterGroups.nodesFilter.label),
            doc
          );
          store.add(
            nodesFilter,
            LPA('filterType'),
            $rdf.lit(
              this.filterConfiguration.filterGroups.nodesFilter.filterType
            ),
            doc
          );

          if (
            this.filterConfiguration.filterGroups.nodesFilter.selectedOptions
          ) {
            store.add(
              filterOptionGroup,
              RDF('type'),
              LPA('FilterOptionGroup'),
              doc
            );

            if (
              this.filterConfiguration.filterGroups.nodesFilter.selectedOptions
                .items
            ) {
              const filterOptionStatements = this.filterConfiguration.filterGroups.nodesFilter.selectedOptions.items.map(
                option => {
                  const filterOption = $rdf.blankNode();
                  store.add(
                    filterOption,
                    RDF('type'),
                    LPA('FilterOption'),
                    doc
                  );
                  store.add(
                    filterOption,
                    LPA('uri'),
                    $rdf.lit(option.uri),
                    doc
                  );
                  store.add(
                    filterOption,
                    LPA('label'),
                    $rdf.lit(option.label),
                    doc
                  );
                  store.add(
                    filterOption,
                    LPA('visible'),
                    $rdf.lit(option.visible),
                    doc
                  );
                  store.add(
                    filterOption,
                    LPA('enabled'),
                    $rdf.lit(option.enabled),
                    doc
                  );
                  return filterOption;
                }
              );
              store.add(
                filterOptionGroup,
                LPA('items'),
                filterOptionStatements,
                doc
              );
            } else {
              store.add(filterOptionGroup, LPA('items'), [], doc);
            }

            store.add(
              nodesFilter,
              LPA('selectedOptions'),
              filterOptionGroup,
              doc
            );
          }

          store.add(filterGroup, LPA('nodesFilter'), nodesFilter, doc);
        }

        store.add(filtersConfiguration, LPA('filterGroups'), filterGroup, doc);
      }
    }

    store.add(appConfigFile, LPA('filteredBy'), filtersConfiguration, doc);

    return $rdf.serialize(
      null,
      store,
      appConfigurationMetadataPath,
      'text/turtle'
    );
  };

  static nodeToValue(statement, { store, fileUrl, file }) {
    const result = store.any(fileUrl, LPA(statement), undefined, file).value;
    return result === 'true' || result === 'false'
      ? JSON.parse(result)
      : result;
  }

  static fromTurtle(store, fileUrl, file) {
    const params = { store, fileUrl, file };

    const filteredBy = store.any(fileUrl, LPA('filteredBy'), undefined, file);
    const filteredByParams = { store, fileUrl: filteredBy, file };

    const filterGroups = store.any(
      filteredBy,
      LPA('filterGroups'),
      undefined,
      file
    );

    const nodesFilter = store.any(
      filterGroups,
      LPA('nodesFilter'),
      undefined,
      file
    );

    const nodesFilterParams = { store, fileUrl: nodesFilter, file };

    const selectedOptions = store.any(
      nodesFilter,
      LPA('selectedOptions'),
      undefined,
      file
    );

    let items = store.any(selectedOptions, LPA('items'), undefined, file);
    items = items !== undefined ? items.elements : [];

    const selectedOptionsParsed = {
      '@type': 'FilterOptionGroup',
      items: items.map(element => {
        const itemParams = { store, fileUrl: element, file };
        return {
          '@type': 'FilterOption',
          uri: ApplicationConfiguration.nodeToValue('uri', itemParams),
          label: ApplicationConfiguration.nodeToValue('label', itemParams),
          visible: ApplicationConfiguration.nodeToValue('visible', itemParams),
          enabled: ApplicationConfiguration.nodeToValue('enabled', itemParams)
        };
      })
    };

    const nodesFilterParsed = {
      '@type': 'NodesFilter',
      label: ApplicationConfiguration.nodeToValue('label', nodesFilterParams),
      enabled: ApplicationConfiguration.nodeToValue(
        'enabled',
        nodesFilterParams
      ),
      visible: ApplicationConfiguration.nodeToValue(
        'visible',
        nodesFilterParams
      ),
      filterType: ApplicationConfiguration.nodeToValue(
        'filterType',
        nodesFilterParams
      ),
      selectedOptions: selectedOptionsParsed
    };

    const filterGroupsParsed = {
      '@type': 'FilterGroup',
      nodesFilter: nodesFilterParsed
    };

    const filterConfigurationParsed = {
      '@type': 'FilterConfiguration',
      enabled: ApplicationConfiguration.nodeToValue(
        'enabled',
        filteredByParams
      ),
      visible: ApplicationConfiguration.nodeToValue(
        'visible',
        filteredByParams
      ),
      filterGroups: filterGroupsParsed
    };

    return new ApplicationConfiguration({
      '@context': LPA_CONTEXT,
      '@type': 'VisualizerConfiguration',
      configurationId: ApplicationConfiguration.nodeToValue(
        'configurationId',
        params
      ),
      author: ApplicationConfiguration.nodeToValue('author', params),
      title: ApplicationConfiguration.nodeToValue('title', params),
      backgroundColor: ApplicationConfiguration.nodeToValue(
        'backgroundColor',
        params
      ),
      graphIri: ApplicationConfiguration.nodeToValue('graphIri', params),
      published: new Date(
        ApplicationConfiguration.nodeToValue('published', params)
      ),
      etlExecutionIri: ApplicationConfiguration.nodeToValue(
        'etlExecutionIri',
        params
      ),
      applicationData: ApplicationConfiguration.nodeToValue(
        'applicationData',
        params
      ),
      endpoint: ApplicationConfiguration.nodeToValue('endpoint', params),
      visualizerType: ApplicationConfiguration.nodeToValue(
        'visualizerType',
        params
      ),
      filteredBy: filterConfigurationParsed
    });
  }
}
