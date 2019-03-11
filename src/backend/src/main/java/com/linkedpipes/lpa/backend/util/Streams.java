package com.linkedpipes.lpa.backend.util;

import java.util.Iterator;
import java.util.stream.Stream;
import java.util.stream.StreamSupport;

public final class Streams {

    private Streams() {
    }

    public static <T> Stream<T> sequentialFromIterable(Iterable<T> iterable) {
        return StreamSupport.stream(iterable.spliterator(), false);
    }

    public static <T> Stream<T> sequentialFromIterator(Iterator<T> iterator) {
        return sequentialFromIterable(() -> iterator);
    }

}
