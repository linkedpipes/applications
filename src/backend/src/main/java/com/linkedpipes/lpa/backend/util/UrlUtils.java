package com.linkedpipes.lpa.backend.util;

import org.springframework.util.StringUtils;

import java.util.stream.Collectors;
import java.util.stream.Stream;

/**
 * A utility class for easier handling of strings which represent a URL.
 */
public final class UrlUtils {

    private static final char SLASH = '/';
    private static final String SLASH_STRING = "" + SLASH;

    // do not let anyone instantiate this
    private UrlUtils() {
    }

    /**
     * Concatenates the given string arguments by ignoring any leading or trailing slashes and then joining the results
     * with a single slash. Empty components and components consisting only of slashes are ignored.
     *
     * @param first first component of the URL
     * @param more  other components of the URL
     * @return a single-slash-joined string containing the arguments
     */
    public static String urlFrom(String first, String... more) {
        return Stream.concat(Stream.of(first), Stream.of(more))
                .map(UrlUtils::stripSlashes)
                .filter(s -> !StringUtils.isEmpty(s.trim()))
                .collect(Collectors.joining(SLASH_STRING));
    }

    private static String stripSlashes(String input) {
        return stripTrailingSlashes(stripLeadingSlashes(input));
    }

    private static String stripLeadingSlashes(String input) {
        if (input == null) {
            return null;
        }

        int i = 0;
        while (i < input.length() && input.charAt(i) == SLASH) {
            i++;
        }

        return input.substring(i);
    }

    private static String stripTrailingSlashes(String input) {
        if (input == null) {
            return null;
        }

        int i = input.length() - 1;
        while (i >= 0 && input.charAt(i) == SLASH) {
            i--;
        }

        return input.substring(0, i + 1);
    }

}
