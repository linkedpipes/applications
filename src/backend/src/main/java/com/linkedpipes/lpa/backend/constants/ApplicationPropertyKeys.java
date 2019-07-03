package com.linkedpipes.lpa.backend.constants;

public final class ApplicationPropertyKeys {

    public static final String VIRTUOSO_QUERY_ENDPOINT = "lpa.virtuoso.queryEndpoint";
    public static final String VIRTUOSO_CRUD_ENDPOINT = "lpa.virtuoso.crudEndpoint";
    public static final String DISCOVERY_SERVICE_URL = "lpa.discoveryServiceUrl";
    public static final String ETL_SERVICE_URL = "lpa.etlServiceUrl";
    public static final String DISCOVERY_POLLING_TIMEOUT = "lpa.timeout.discoveryPollingTimeoutMins";
    public static final String ETL_POLLING_TIMEOUT = "lpa.timeout.etlPollingTimeoutMins";
    public static final String DISCOVERY_POLLING_FREQUENCY = "lpa.timeout.discoveryPollingFrequencySecs";
    public static final String ETL_POLLING_FREQUENCY = "lpa.timeout.etlPollingFrequencySecs";

    private ApplicationPropertyKeys() {
    }

}
