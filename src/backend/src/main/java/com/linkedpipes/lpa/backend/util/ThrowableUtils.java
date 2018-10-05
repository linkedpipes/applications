package com.linkedpipes.lpa.backend.util;

public final class ThrowableUtils {

    // do not let people instantiate this
    private ThrowableUtils() {
    }

    public static void rethrowAsUnchecked(Throwable cause) {
        if (cause instanceof RuntimeException) {
            throw (RuntimeException) cause;
        }
        if (cause instanceof Error) {
            throw (Error) cause;
        }
        throw new UncheckedThrowableWrapper(cause);
    }

    public static class UncheckedThrowableWrapper extends RuntimeException {

        private UncheckedThrowableWrapper(Throwable cause) {
            super(cause);
        }

    }

    public static class UnreachableStatementError extends Error {
    }

}
