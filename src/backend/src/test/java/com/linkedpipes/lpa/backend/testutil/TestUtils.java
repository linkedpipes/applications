package com.linkedpipes.lpa.backend.testutil;

import org.junit.Assert;

public final class TestUtils {

    // do not let people instantiate this
    private TestUtils() {
    }

    public static <T extends Throwable, E extends T> void assertThrows(ThrowingExecutable<T> executable, Class<E> expectedClass) throws T {
        try {
            executable.execute();
        } catch (Throwable throwable) {
            if (!expectedClass.isInstance(throwable)) { // unexpected exception thrown
                throw throwable; // rethrow it
            }
        }
        Assert.fail("Expected exception: " + expectedClass.getSimpleName());
    }

    public static <T extends Throwable, E extends T> void assertThrowsExactly(ThrowingExecutable<T> executable, Class<E> expectedClass) throws T {
        try {
            executable.execute();
        } catch (Throwable throwable) {
            if (throwable.getClass() != expectedClass) { // unexpected exception thrown
                throw throwable; // rethrow it
            }
        }
        Assert.fail("Expected exception: " + expectedClass.getSimpleName());
    }

}
