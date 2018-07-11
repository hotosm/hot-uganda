package org.openstreetmap.josm.plugins.kobomapper.utils.rx;

/**
 * Created by mossplix on 5/9/17.
 */

import rx.Observable;

public final class IgnoreValuesTransformer<S> implements Observable.Transformer<S, Void> {
    @Override
    public Observable<Void> call(final Observable<S> source) {
        return source.map(__ -> null);
    }
}
