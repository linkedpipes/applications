package com.linkedpipes.lpa.backend.util;

import org.apache.commons.validator.routines.UrlValidator;

import java.util.Objects;
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

    public static boolean isValidHttpUri(String url){
        String[] schemes = {"http", "https"};
        UrlValidator urlValidator = new UrlValidator(schemes);
        return urlValidator.isValid(url);
    }

    /**
     * Concatenates the given string arguments into a URL string. {@code null} components and components consisting only
     * of slashes are ignored. Leading and trailing slashes are then stripped. The stripped strings are then joined with
     * a single slash.
     *
     * @param components the strings to be joined into a URL
     * @return a single-slash-joined string containing the arguments
     * @throws NullPointerException if {@code components} is {@code null}
     */
    public static String urlFrom(String... components) {
        return Stream.of(components)
                .filter(Objects::nonNull)
                .map(UrlUtils::stripSlashes)
                .filter(s -> !s.isEmpty())
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
