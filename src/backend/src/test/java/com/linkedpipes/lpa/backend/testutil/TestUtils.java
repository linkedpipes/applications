package com.linkedpipes.lpa.backend.testutil;

import org.junit.Assert;

import java.lang.reflect.InvocationTargetException;
import java.lang.reflect.Method;

public final class TestUtils {

    // do not let people instantiate this
    private TestUtils() {
    }

    public static <T extends Throwable, E extends T> void assertThrows(Class<E> expectedClass, ThrowingExecutable<T> executable) throws T {
        try {
            executable.execute();
        } catch (Throwable caught) {
            if (expectedClass.isInstance(caught)) {
                return;
            }
            throw caught;
        }
        Assert.fail("Expected exception: " + expectedClass.getSimpleName());
    }

    public static <T extends Throwable, E extends T> void assertThrowsExactly(Class<E> expectedClass, ThrowingExecutable<T> executable) throws T {
        try {
            executable.execute();
        } catch (Throwable caught) {
            if (caught.getClass() == expectedClass) {
                return;
            }
            throw caught;
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
        } catch (NoSuchMethodException | IllegalAccessException | InvocationTargetException e) {
            throw new RuntimeException(e);
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
        } catch (NoSuchMethodException | IllegalAccessException | InvocationTargetException e) {
            throw new RuntimeException(e);
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
}
