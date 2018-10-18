package com.linkedpipes.lpa.backend.util;

/**
 * A utility class for handling throwables and exceptions.
 */
public final class ThrowableUtils {

    // do not let people instantiate this
    private ThrowableUtils() {
    }

    /**
     * Throws a compile-time-unchecked exception caused by {@code cause}.
     *
     * @param cause the cause of the exception thrown
     * @throws RuntimeException          if {@code cause} is a RuntimeException
     * @throws Error                     if {@code cause} is an Error
     * @throws UncheckedThrowableWrapper otherwise
     */
    public static void rethrowAsUnchecked(Throwable cause) {
        if (cause instanceof RuntimeException) {
            throw (RuntimeException) cause;
        }
        if (cause instanceof Error) {
            throw (Error) cause;
        }
        throw new UncheckedThrowableWrapper(cause);
    }

    public static <T> T rethrowAsUnchecked(ThrowingSupplier<T> supplier) {
        try {
            return supplier.get();
        } catch (Throwable caught) {
            rethrowAsUnchecked(caught);
            throw new UnreachableStatementError();
        }
    }

    /**
     * A compile-time-unchecked wrapper for a throwable.
     */
    public static class UncheckedThrowableWrapper extends RuntimeException {

        private UncheckedThrowableWrapper(Throwable cause) {
            super(cause);
        }

    }

    /**
     * Is thrown when a line of code has been executed which should be impossible to reach. Often signifies a bug in the
     * control flow of the program.
     */
    public static class UnreachableStatementError extends Error {
    }

    /**
     * A functional interface for wrapping code which produces objects and may throw.
     *
     * @param <T> type of the objects being supplied
     */
    @FunctionalInterface
    public interface ThrowingSupplier<T> {

        T get() throws Throwable;

    }

}
