package com.linkedpipes.lpa.backend.util;

import org.jetbrains.annotations.NotNull;

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
            private final Map<HashableTuple, R> memo = new HashMap<>();

            @Override
            public R apply(T1 arg1, T2 arg2) {
                HashableTuple tuple = new HashableTuple(arg1, arg2);
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
            private final Map<HashableTuple, R> memo = new HashMap<>();

            @Override
            public R apply(T1 arg1, T2 arg2, T3 arg3) {
                HashableTuple tuple = new HashableTuple(arg1, arg2, arg3);
                if (memo.containsKey(tuple)) {
                    return memo.get(tuple);
                }

                R result = function.apply(arg1, arg2, arg3);
                memo.put(tuple, result);
                return result;
            }
        };
    }

}
