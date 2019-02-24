package com.linkedpipes.lpa.backend.util;

import org.jetbrains.annotations.NotNull;
import org.jetbrains.annotations.Nullable;

import java.util.Arrays;
import java.util.HashMap;
import java.util.Map;
import java.util.function.BiFunction;
import java.util.function.Function;

public final class Memoizer {

    private Memoizer() {
    }

    @NotNull
    public static <T, R> Function<T, R> memoize(@NotNull Function<T, R> function) {
        return new Function<>() {
            private final Map<T, R> memo = new HashMap<>();

            @Override
            public R apply(T arg) {
                if (memo.containsKey(arg)) {
                    return memo.get(arg);
                }

                R result = function.apply(arg);
                memo.put(arg, result);
                return result;
            }
        };
    }

    @NotNull
    public static <T1, T2, R> BiFunction<T1, T2, R> memoize(@NotNull BiFunction<T1, T2, R> function) {
        return new BiFunction<>() {
            private final Map<Tuple, R> memo = new HashMap<>();

            @Override
            public R apply(T1 arg1, T2 arg2) {
                Tuple tuple = new Tuple(arg1, arg2);
                if (memo.containsKey(tuple)) {
                    return memo.get(tuple);
                }

                R result = function.apply(arg1, arg2);
                memo.put(tuple, result);
                return result;
            }
        };
    }

    @NotNull
    public static <T1, T2, T3, R> TriFunction<T1, T2, T3, R> memoize(@NotNull TriFunction<T1, T2, T3, R> function) {
        return new TriFunction<>() {
            private final Map<Tuple, R> memo = new HashMap<>();

            @Override
            public R apply(T1 arg1, T2 arg2, T3 arg3) {
                Tuple tuple = new Tuple(arg1, arg2, arg3);
                if (memo.containsKey(tuple)) {
                    return memo.get(tuple);
                }

                R result = function.apply(arg1, arg2, arg3);
                memo.put(tuple, result);
                return result;
            }
        };
    }

    private static class Tuple {

        private final Object[] items;

        Tuple(@NotNull Object... args) {
            this.items = args;
        }

        @Override
        public boolean equals(@Nullable Object o) {
            if (this == o) return true;
            if (o == null || getClass() != o.getClass()) return false;
            Tuple tuple = (Tuple) o;
            return Arrays.equals(items, tuple.items);
        }

        @Override
        public int hashCode() {
            return Arrays.hashCode(items);
        }

    }

}
