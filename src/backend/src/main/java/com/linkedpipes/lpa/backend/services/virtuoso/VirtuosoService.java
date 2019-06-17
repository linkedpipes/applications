package com.linkedpipes.lpa.backend.services.virtuoso;

import com.linkedpipes.lpa.backend.Application;
import com.linkedpipes.lpa.backend.constants.ApplicationPropertyKeys;
import com.linkedpipes.lpa.backend.controllers.VirtuosoController;
import com.linkedpipes.lpa.backend.rdf.vocabulary.LPA;
import com.linkedpipes.lpa.backend.util.JenaUtils;
import org.jetbrains.annotations.NotNull;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Profile;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.StreamUtils;
import org.springframework.web.client.RestClientException;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.DefaultUriBuilderFactory;

import javax.annotation.PostConstruct;
import java.io.IOException;
import java.io.InputStream;
import java.net.URI;
import java.nio.charset.Charset;
import java.util.Objects;
import java.util.UUID;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Service
@Profile("!test")
public class VirtuosoService {

    @NotNull
    private static final Logger log = LoggerFactory.getLogger(VirtuosoService.class);
    @NotNull
    private static String GRAPH_NAME_SUFFIX = "graphNameSuffix";
    @NotNull
    private static final Pattern RESOURCE_FILENAME_PATTERN = Pattern.compile("^data-(?<" + GRAPH_NAME_SUFFIX + ">.*)\\.ttl$");

    @Value("classpath*:/com/linkedpipes/lpa/backend/services/virtuoso/data-*.ttl")
    private Resource[] resources;

    public static boolean checkNamedGraphExists(String graphName){
        return JenaUtils.graphExists(graphName);
    }

    public static void deleteNamedGraph(String graphName){
        JenaUtils.deleteGraph(graphName);
    }

    @PostConstruct
    public void createTestData() {
        log.info("Filling our Virtuoso with test data...");

        try {
            for (Resource resource : resources) {
                try (InputStream inputStream = resource.getInputStream()) {
                    Matcher matcher = RESOURCE_FILENAME_PATTERN
                            .matcher(Objects.requireNonNull(resource.getFilename()));
                    if (!matcher.matches()) {
                        throw new AssertionError("Pattern does not match");
                    }

                    String ttlData = StreamUtils.copyToString(inputStream, Charset.defaultCharset());
                    putTtlToVirtuoso(LPA.Generated.uri + matcher.group(GRAPH_NAME_SUFFIX), ttlData);
                }
            }

            log.info("Done!");
        } catch (IOException | RestClientException e) {
            log.error("Failed to fill Virtuoso with test data!", e);
        }
    }

    public static String putTtlToVirtuosoRandomGraph(@NotNull String ttlData){
        String graphName = VirtuosoController.GRAPH_NAME_PREFIX + UUID.randomUUID().toString();
        putTtlToVirtuoso(graphName, ttlData);
        return graphName;
    }

    public static void putTtlToVirtuoso(@NotNull String graphName, @NotNull String ttlData) {
        log.info(">>> graph {}", graphName);

        LinkedMultiValueMap<String, String> headers = new LinkedMultiValueMap<>();
        headers.add(HttpHeaders.CONTENT_TYPE, "text/turtle");
        HttpEntity<String> entity = new HttpEntity<>(ttlData, headers);
        URI uri = new DefaultUriBuilderFactory()
                .uriString(Application.getConfig().getString(ApplicationPropertyKeys.VirtuosoCrudEndpoint))
                .queryParam("graph", graphName)
                .build();

        new RestTemplate().put(uri, entity);
    }

}
