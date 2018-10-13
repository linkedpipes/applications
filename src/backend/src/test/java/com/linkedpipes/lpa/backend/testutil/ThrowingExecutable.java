package com.linkedpipes.lpa.backend.testutil;

/**
 * Represents an executable that may throw any {@link Throwable}. Used in tests to wrap code which is expected to throw
 * exceptions.
 *
 * @param <T> expected exception type
 */
@FunctionalInterface
public interface ThrowingExecutable<T extends Throwable> {

    void execute() throws T;

}
