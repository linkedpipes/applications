package com.linkedpipes.lpa.backend.testutil;

import com.linkedpipes.lpa.backend.util.ThrowableUtils.UnreachableStatementError;
import org.junit.Assert;

import static com.linkedpipes.lpa.backend.util.ThrowableUtils.rethrowAsUnchecked;

public final class TestUtils {

    // do not let people instantiate this
    private TestUtils() {
    }

    /**
     * Executes the given {@code executable} and checks whether it throws a throwable whose {@link #getClass() class} is
     * a subclass of {@code expectedClass}, checked as if by the {@code instanceof} keyword. If it does, the assertion
     * passes. If it throws another throwable, it is rethrown, wrapped in an unchecked exception. If the executable does
     * not throw any throwable, an {@link AssertionError} with an appropriate message is thrown.
     *
     * @param expectedClass the expected class of the throwable thrown
     * @param executable    the code to be executed
     */
    public static void assertThrows(Class<? extends Throwable> expectedClass, ThrowingExecutable<?> executable) {
        try {
            executable.execute();
        } catch (Throwable caught) {
            if (expectedClass.isInstance(caught)) {
                return;
            }
            rethrowAsUnchecked(caught);
            throw new UnreachableStatementError();
        }
        Assert.fail("Expected exception: " + expectedClass.getSimpleName());
    }

    /**
     * Executes the given {@code executable} and checks whether it throws a throwable whose {@link #getClass() class} is
     * exactly {@code expectedClass}. If it does, the assertion passes. If it throws another throwable, it is rethrown,
     * wrapped in an unchecked exception. If the executable does not throw any throwable, an {@link AssertionError} with
     * an appropriate message is thrown.
     *
     * @param expectedClass the expected class of the throwable thrown
     * @param executable    the code to be executed
     */
    public static void assertThrowsExactly(Class<? extends Throwable> expectedClass, ThrowingExecutable<?> executable) {
        try {
            executable.execute();
        } catch (Throwable caught) {
            if (caught.getClass() == expectedClass) {
                return;
            }
            rethrowAsUnchecked(caught);
            throw new UnreachableStatementError();
        }
        Assert.fail("Expected exactly exception: " + expectedClass.getSimpleName());
    }

}
