package com.linkedpipes.lpa.backend.util;

import org.eclipse.egit.github.core.Gist;
import org.eclipse.egit.github.core.GistFile;
import org.eclipse.egit.github.core.client.GitHubClient;
import org.eclipse.egit.github.core.service.GistService;

import java.io.IOException;
import java.util.Collections;

import static com.linkedpipes.lpa.backend.Application.getConfig;

public final class GitHubUtils {

    public static String uploadGistFile(String fileName, String fileContent) throws IOException {
        GitHubClient client = new GitHubClient().setCredentials(getConfig().getString("lpa.github.username"), getConfig().getString("lpa.github.password"));
        Gist gist = new Gist().setDescription("RDF file in Turtle format, uploaded by user for use in discovery.");
        gist.setFiles(Collections.singletonMap(fileName, new GistFile().setContent(fileContent)));
        gist = new GistService(client).createGist(gist);
        return gist.getFiles().get(fileName).getRawUrl();
    }
}
