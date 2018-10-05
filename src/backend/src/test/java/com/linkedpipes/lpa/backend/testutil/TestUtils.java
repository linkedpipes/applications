package com.linkedpipes.lpa.backend.testutil;

import com.linkedpipes.lpa.backend.util.ThrowableUtils.UnreachableStatementError;
import org.junit.Assert;

import java.lang.reflect.Field;
import java.lang.reflect.InvocationTargetException;
import java.lang.reflect.Method;

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

    /**
     * Invoke a method named {@code methodName} on the object {@code this_} with the given {@code arguments}. This
     * method first looks for private, protected, package-local and public methods declared in the class of {@code
     * this_} and then recursively in its superclasses. Useful for unit-testing the behavior of private and protected
     * methods.
     *
     * @param this_      the object to invoke the method on
     * @param methodName the name of the method to invoke
     * @param arguments  the list of objects to pass as arguments to the method invocation
     * @return the return value of the method invocation
     */
    public static Object invoke(Object this_, String methodName, Class<?>[] parameterTypes, Object... arguments) {
        try {
            return doInvoke(this_, methodName, parameterTypes, arguments);
        } catch (NoSuchMethodException | IllegalAccessException | InvocationTargetException ex) {
            rethrowAsUnchecked(ex);
            throw new UnreachableStatementError();
        }
    }

    /**
     * Invoke a method named {@code methodName} declared in {@code class_} with the given {@code arguments}. This method
     * looks for private, protected, package-local and public methods declared in {@code class_}. Useful for
     * unit-testing the behavior of private and protected methods.
     *
     * @param class_     the declaring class of the method to invoke
     * @param methodName the name of the method to invoke
     * @param arguments  the list of objects to pass as arguments to the method invocation
     * @return the return value of the method invocation
     */
    public static Object invokeStatic(Class<?> class_, String methodName, Class<?>[] parameterTypes, Object... arguments) {
        try {
            return doInvokeStatic(class_, methodName, parameterTypes, arguments);
        } catch (NoSuchMethodException | IllegalAccessException | InvocationTargetException ex) {
            rethrowAsUnchecked(ex);
            throw new UnreachableStatementError();
        }
    }

    public static Object getField(Object this_, String fieldName) {
        try {
            return doGetField(this_, fieldName);
        } catch (NoSuchFieldException | IllegalAccessException ex) {
            rethrowAsUnchecked(ex);
            throw new UnreachableStatementError();
        }
    }

    private static Object doInvoke(Object this_, String methodName, Class<?>[] parameterTypes, Object... arguments) throws NoSuchMethodException, IllegalAccessException, InvocationTargetException {
        Method method = getMethodInSuperclasses(this_.getClass(), methodName, parameterTypes);

        boolean accessible = method.canAccess(this_);
        try {
            if (!accessible) {
                method.setAccessible(true);
            }
            return method.invoke(this_, arguments);
        } finally {
            method.setAccessible(accessible);
        }
    }

    private static Object doInvokeStatic(Class<?> class_, String methodName, Class<?>[] parameterTypes, Object... arguments) throws NoSuchMethodException, IllegalAccessException, InvocationTargetException {
        Method method = class_.getDeclaredMethod(methodName, parameterTypes);

        boolean accessible = method.canAccess(null);
        try {
            if (!accessible) {
                method.setAccessible(true);
            }
            return method.invoke(null, arguments);
        } finally {
            method.setAccessible(accessible);
        }
    }

    private static Object doGetField(Object this_, String fieldName) throws NoSuchFieldException, IllegalAccessException {
        Field field = getFieldInSuperclasses(this_.getClass(), fieldName);

        boolean accessible = field.canAccess(this_);
        try {
            if (!accessible) {
                field.setAccessible(true);
            }
            return field.get(this_);
        } finally {
            field.setAccessible(accessible);
        }
    }

    private static Method getMethodInSuperclasses(Class<?> class_, String methodName, Class<?>... argumentTypes) throws NoSuchMethodException {
        try {
            return class_.getDeclaredMethod(methodName, argumentTypes);
        } catch (NoSuchMethodException ex) {
            Class<?> superclass = class_.getSuperclass();
            if (superclass == null) {
                throw ex;
            }
            return getMethodInSuperclasses(superclass, methodName, argumentTypes);
        }
    }

    private static Field getFieldInSuperclasses(Class<?> class_, String fieldName) throws NoSuchFieldException {
        try {
            return class_.getDeclaredField(fieldName);
        } catch (NoSuchFieldException ex) {
            Class<?> superclass = class_.getSuperclass();
            if (superclass == null) {
                throw ex;
            }
            return getFieldInSuperclasses(superclass, fieldName);
        }
    }

}
