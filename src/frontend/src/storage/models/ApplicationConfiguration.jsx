/**
 * Model class for storing application configuration.
 */

import * as $rdf from 'rdflib';
import uuid from 'uuid';
import { GlobalUtils } from '@utils/';

const LPA = $rdf.Namespace('https://w3id.org/def/lpapps#');
const RDF = $rdf.Namespace('http://www.w3.org/1999/02/22-rdf-syntax-ns#');

const LPA_CONTEXT =
  'https://gist.githubusercontent.com/aorumbayev/36a4d2d87b721a406f12eaaa7aac3128/raw/8707fd17f1231518a3353f29f904d349790f8ee2/lapps-ontology.jsonld';

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
    if (!filtersConfiguration || !filtersConfiguration.filtersState) {
      return '';
    }

    const filtersState = filtersConfiguration.filtersState;

    const { filterGroups } = filtersState;
    const { nodesFilter, schemeFilter, mapFilters } = filterGroups;

    let nodesObject = { '@type': 'NodesFilter', options: [] };
    if (nodesFilter !== undefined) {
      let nodesItems = [];

      nodesItems = nodesFilter.options.map(item => {
        item['@type'] = 'FilterOption';
        return item;
      });

      nodesObject = {
        '@type': 'NodesFilter',
        label: nodesFilter.label,
        enabled: nodesFilter.enabled,
        visible: nodesFilter.visible,
        filterType: nodesFilter.filterType,
        options: nodesItems
      };
    }

    // eslint-disable-next-line no-unused-vars
    let schemeObject = { '@type': 'SchemeFilter', options: [] };
    if (schemeFilter !== undefined) {
      let schemeItems = [];

      schemeItems = schemeFilter.options.map(item => {
        item['@type'] = 'FilterOption';
        return item;
      });

      schemeObject = {
        '@type': 'SchemeFilter',
        label: schemeFilter.label,
        enabled: schemeFilter.enabled,
        visible: schemeFilter.visible,
        filterType: schemeFilter.filterType,
        options: schemeItems
      };
    }

    let mapObject = { '@type': 'MapFilters', filters: [] };
    if (mapFilters !== undefined) {
      let mapFilterItems = [];

      mapFilterItems = mapFilters.filters.map(filter => {
        filter['@type'] = 'MapFilterGroup';
        filter.options = filter.options.map(filterOption => {
          filterOption['@type'] = 'FilterOption';
          return filterOption;
        });
        return filter;
      });

      mapObject = {
        '@type': 'MapFilters',
        label: mapFilters.label,
        enabled: mapFilters.enabled,
        visible: mapFilters.visible,
        filterType: mapFilters.filterType,
        filters: mapFilterItems
      };
    }

    const filterGroupsObject = { '@type': 'FilterGroup' };

    if (nodesFilter) {
      filterGroupsObject.nodesFilter = nodesObject;
    }
    if (schemeFilter) {
      filterGroupsObject.schemeFilter = schemeObject;
    }
    if (mapFilters) {
      filterGroupsObject.mapFilters = mapObject;
    }

    return {
      '@type': 'FilterConfiguration',
      enabled: filtersState.enabled,
      visible: filtersState.visible,
      filterGroups: filterGroupsObject
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

  parseFilterConfiguration = (
    store,
    doc,
    filterNode,
    filterGroupNode,
    namespaceKeyword,
    ontologyType,
    typeFilter
  ) => {
    if (typeFilter) {
      store.add(filterNode, RDF('type'), LPA(ontologyType), doc);
      store.add(filterNode, LPA('enabled'), $rdf.lit(typeFilter.enabled), doc);
      store.add(filterNode, LPA('visible'), $rdf.lit(typeFilter.visible), doc);
      store.add(filterNode, LPA('label'), $rdf.lit(typeFilter.label), doc);
      store.add(
        filterNode,
        LPA('filterType'),
        $rdf.lit(typeFilter.filterType),
        doc
      );

      if (ontologyType === 'NodesFilter' || ontologyType === 'SchemeFilter') {
        if (typeFilter.options) {
          const filterOptionStatements = typeFilter.options.map(option => {
            const filterOption = $rdf.blankNode();
            store.add(filterOption, RDF('type'), LPA('FilterOption'), doc);
            store.add(filterOption, LPA('uri'), $rdf.lit(option.uri), doc);
            store.add(filterOption, LPA('label'), $rdf.lit(option.label), doc);
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
            store.add(
              filterOption,
              LPA('selected'),
              $rdf.lit(option.selected),
              doc
            );
            return filterOption;
          });
          store.add(filterNode, LPA('options'), filterOptionStatements, doc);
        } else {
          store.add(filterNode, LPA('options'), [], doc);
        }
      }

      if (ontologyType === 'MapFilters') {
        if (typeFilter.filters) {
          const filtersStatements = typeFilter.filters.map(filter => {
            const filterGroup = $rdf.blankNode();
            store.add(filterGroup, RDF('type'), LPA('MapFilterGroup'), doc);
            store.add(
              filterGroup,
              LPA('filterUri'),
              $rdf.lit(filter.filterUri),
              doc
            );
            store.add(
              filterGroup,
              LPA('filterLabel'),
              $rdf.lit(filter.filterLabel),
              doc
            );

            if (filter.options) {
              const filterOptionStatements = filter.options.map(option => {
                const filterOption = $rdf.blankNode();
                store.add(filterOption, RDF('type'), LPA('FilterOption'), doc);
                store.add(filterOption, LPA('uri'), $rdf.lit(option.uri), doc);
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
                store.add(
                  filterOption,
                  LPA('selected'),
                  $rdf.lit(option.selected),
                  doc
                );
                return filterOption;
              });
              store.add(
                filterGroup,
                LPA('options'),
                filterOptionStatements,
                doc
              );
            }

            return filterGroup;
          });
          store.add(filterNode, LPA('filters'), filtersStatements, doc);
        } else {
          store.add(filterNode, LPA('filters'), [], doc);
        }
      }

      store.add(filterGroupNode, LPA(namespaceKeyword), filterNode, doc);
    }
  };

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

        const nodesFilter = $rdf.blankNode();
        this.parseFilterConfiguration(
          store,
          doc,
          nodesFilter,
          filterGroup,
          'nodesFilter',
          'NodesFilter',
          this.filterConfiguration.filterGroups.nodesFilter
        );

        const schemeFilter = $rdf.blankNode();
        this.parseFilterConfiguration(
          store,
          doc,
          schemeFilter,
          filterGroup,
          'schemeFilter',
          'SchemeFilter',
          this.filterConfiguration.filterGroups.schemeFilter
        );

        const mapFilters = $rdf.blankNode();
        this.parseFilterConfiguration(
          store,
          doc,
          mapFilters,
          filterGroup,
          'mapFilters',
          'MapFilters',
          this.filterConfiguration.filterGroups.mapFilters
        );

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

  static getFilterStructureFromTurtle(
    store,
    file,
    filterGroupsNode,
    namespaceKeyword,
    ontologyType
  ) {
    const filter = store.any(
      filterGroupsNode,
      LPA(namespaceKeyword),
      undefined,
      file
    );

    if (!filter) {
      return undefined;
    }

    const filterParams = { store, fileUrl: filter, file };

    const filterParsed = {
      '@type': ontologyType,
      label: ApplicationConfiguration.nodeToValue('label', filterParams),
      enabled: ApplicationConfiguration.nodeToValue('enabled', filterParams),
      visible: ApplicationConfiguration.nodeToValue('visible', filterParams),
      filterType: ApplicationConfiguration.nodeToValue(
        'filterType',
        filterParams
      )
    };

    if (ontologyType === 'NodesFilter' || ontologyType === 'SchemeFilter') {
      const options = store.any(filter, LPA('options'), undefined, file);

      const items =
        options !== undefined && options.elements ? options.elements : [];

      const selectedOptionsParsed = items.map(element => {
        const itemParams = { store, fileUrl: element, file };
        return {
          '@type': 'FilterOption',
          uri: ApplicationConfiguration.nodeToValue('uri', itemParams),
          label: ApplicationConfiguration.nodeToValue('label', itemParams),
          visible: ApplicationConfiguration.nodeToValue('visible', itemParams),
          enabled: ApplicationConfiguration.nodeToValue('enabled', itemParams),
          selected: ApplicationConfiguration.nodeToValue('selected', itemParams)
        };
      });

      filterParsed.options = selectedOptionsParsed;

      return filterParsed || { '@type': ontologyType, options: [] };
    }

    const filters = store.any(filter, LPA('filters'), undefined, file);

    const filterItems =
      filters !== undefined && filters.elements ? filters.elements : [];

    const selectedFiltersParsed = filterItems.map(element => {
      const itemParams = { store, fileUrl: element, file };

      const itemOptions = store.any(element, LPA('options'), undefined, file);

      const optionItems =
        itemOptions !== undefined && itemOptions.elements
          ? itemOptions.elements
          : [];

      const selectedOptionsParsed = optionItems.map(optionElement => {
        const optionItemParams = { store, fileUrl: optionElement, file };
        return {
          '@type': 'FilterOption',
          uri: ApplicationConfiguration.nodeToValue('uri', optionItemParams),
          label: ApplicationConfiguration.nodeToValue(
            'label',
            optionItemParams
          ),
          visible: ApplicationConfiguration.nodeToValue(
            'visible',
            optionItemParams
          ),
          enabled: ApplicationConfiguration.nodeToValue(
            'enabled',
            optionItemParams
          ),
          selected: ApplicationConfiguration.nodeToValue(
            'selected',
            optionItemParams
          )
        };
      });

      return {
        '@type': 'MapFilterGroup',
        filterLabel: ApplicationConfiguration.nodeToValue(
          'filterLabel',
          itemParams
        ),
        filterUri: ApplicationConfiguration.nodeToValue(
          'filterUri',
          itemParams
        ),
        options: selectedOptionsParsed
      };
    });

    filterParsed.filters = selectedFiltersParsed;

    return filterParsed || { '@type': ontologyType, filters: [] };
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

    let filterConfigurationParsed = { filterGroups: {} };

    if (filterGroups) {
      const filterGroupsParsed = {
        '@type': 'FilterGroup'
      };

      const nodesFilter = ApplicationConfiguration.getFilterStructureFromTurtle(
        store,
        file,
        filterGroups,
        'nodesFilter',
        'NodesFilter'
      );

      if (nodesFilter) {
        filterGroupsParsed.nodesFilter = nodesFilter;
      }

      const schemeFilter = ApplicationConfiguration.getFilterStructureFromTurtle(
        store,
        file,
        filterGroups,
        'schemeFilter',
        'SchemeFilter'
      );

      if (schemeFilter) {
        filterGroupsParsed.schemeFilter = schemeFilter;
      }

      const mapFilters = ApplicationConfiguration.getFilterStructureFromTurtle(
        store,
        file,
        filterGroups,
        'mapFilters',
        'MapFilters'
      );

      if (mapFilters) {
        filterGroupsParsed.mapFilters = mapFilters;
      }

      filterConfigurationParsed = {
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
    }

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
