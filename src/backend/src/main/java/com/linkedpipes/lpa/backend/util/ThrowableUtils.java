package com.linkedpipes.lpa.backend.util;

public class ThrowableUtils {

    // do not let anyone instantiate this
    private ThrowableUtils() {
    }

    public static <T> T wrapAsErrorIfThrows(ThrowingSupplier<T> supplier) {
        try {
            return supplier.get();
        } catch (Throwable thrown) {
            if (thrown instanceof Error) {
                throw (Error) thrown;
            }
            throw new Error(thrown);
        }
    }

    public interface ThrowingSupplier<T> {

        T get() throws Throwable;

    }
}

