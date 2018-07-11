package org.openstreetmap.josm.plugins.kobomapper.utils.rx;

import org.openstreetmap.josm.plugins.kobomapper.utils.ObjectUtils;
import rx.Observable;

/**
 * Created by mossplix on 4/29/17.
 */

public final class CoalesceTransformer<T> implements Observable.Transformer<T, T> {
    private final T theDefault;

    public CoalesceTransformer(final T theDefault) {
        this.theDefault = theDefault;
    }

    @Override
    public  Observable<T> call(final Observable<T> source) {
        return source
                .map(ObjectUtils.coalesceWith(theDefault));
    }
}
