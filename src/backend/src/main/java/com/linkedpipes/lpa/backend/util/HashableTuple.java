package com.linkedpipes.lpa.backend.util;

import org.jetbrains.annotations.NotNull;
import org.jetbrains.annotations.Nullable;

import java.util.Arrays;

public class HashableTuple {

    private final Object[] items;

    public HashableTuple(@NotNull Object... args) {
        this.items = args;
    }

    @Override
    public boolean equals(@Nullable Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        HashableTuple tuple = (HashableTuple) o;
        return Arrays.equals(items, tuple.items);
    }

    @Override
    public int hashCode() {
        return Arrays.hashCode(items);
    }

}
