package com.linkedpipes.lpa.backend.util;

import com.linkedpipes.lpa.backend.Application;
import com.linkedpipes.lpa.backend.constants.ApplicationPropertyKeys;
import com.typesafe.config.Config;
import org.eclipse.egit.github.core.Gist;
import org.eclipse.egit.github.core.GistFile;
import org.eclipse.egit.github.core.client.GitHubClient;
import org.eclipse.egit.github.core.service.GistService;

import java.io.IOException;
import java.util.Collections;

public final class GitHubUtils {

    public static String uploadGistFile(String fileName, String fileContent) throws IOException {
        Config conf = Application.getConfig();
        GitHubClient client = new GitHubClient().setCredentials(conf.getString(ApplicationPropertyKeys.GithubUser), conf.getString(ApplicationPropertyKeys.GithubPassword));
        Gist gist = new Gist().setDescription("RDF file in Turtle format, uploaded by user for use in discovery.");
        gist.setFiles(Collections.singletonMap(fileName, new GistFile().setContent(fileContent)));
        gist = new GistService(client).createGist(gist);
        return gist.getFiles().get(fileName).getRawUrl();
    }
}
