package com.linkedpipes.lpa.backend.util;

import org.springframework.util.StringUtils;

import java.util.stream.Collectors;
import java.util.stream.Stream;

public class UrlUtils {

    private static final char SLASH = '/';
    private static final String SLASH_STRING = "" + SLASH;

    // do not let anyone instantiate this
    private UrlUtils() {
    }

    public static String urlFrom(String first, String... more) {
        return Stream.concat(Stream.of(first), Stream.of(more))
                .map(UrlUtils::stripSlashes)
                .filter(s -> !StringUtils.isEmpty(s))
                .collect(Collectors.joining(SLASH_STRING));
    }

    private static String stripSlashes(String input) {
        return stripTrailingSlashes(stripLeadingSlashes(input));
    }

    private static String stripLeadingSlashes(String input) {
        if (StringUtils.isEmpty(input)) {
            return input;
        }

        int i = 0;
        while (i < input.length() && input.charAt(i) == SLASH) {
            i++;
        }

        return input.substring(i);
    }

    private static String stripTrailingSlashes(String input) {
        if (StringUtils.isEmpty(input)) {
            return input;
        }

        int i = input.length() - 1;
        while (i >= 0 && input.charAt(i) == SLASH) {
            i--;
        }

        return input.substring(0, i + 1);
    }

}
