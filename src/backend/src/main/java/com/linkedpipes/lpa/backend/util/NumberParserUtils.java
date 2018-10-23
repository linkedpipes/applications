package com.linkedpipes.lpa.backend.util;
import org.apache.commons.lang3.StringUtils;

public class NumberParserUtils {

    public static Float tryParseFloat(String value) {

        if(StringUtils.isBlank(value)){
            return null;
        }

        try {
            return Float.parseFloat(value);
        }
        catch (NumberFormatException e) {
        }

        return null;
    }

    public static Double tryParseDouble(String value) {

        if(StringUtils.isBlank(value)){
            return null;
        }

        try {
            return Double.parseDouble(value);
        }
        catch (NumberFormatException e) {
        }

        return null;
    }
}
