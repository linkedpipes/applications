package com.linkedpipes.lpa.backend.util;

/**
 * A functional interface for wrapping code which produces objects and may throw.
 *
 * @param <R> type of the objects being supplied
 * @param <X> type of the throwable that may be thrown by the function
 */
@FunctionalInterface
public interface ThrowingSupplier<R, X extends Throwable> {

    R get() throws X;

}
