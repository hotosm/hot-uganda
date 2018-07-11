package org.openstreetmap.josm.plugins.kobomapper.utils.rx;


/**
 * Created by mossplix on 4/28/17.
 */

public final class Operators {
    private Operators() {}

  static
    <T> ApiErrorOperator<T> apiError(final String st) {
        return new ApiErrorOperator<>(st);
    }
}
