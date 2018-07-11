package org.openstreetmap.josm.plugins.kobomapper.utils.rx;

/**
 * Created by mossplix on 5/9/17.
 */

import rx.Observable;

public final class WaitUntilTransformer<T, R> implements Observable.Transformer<T, T> {
    private final Observable<R> until;

    public WaitUntilTransformer(final Observable<R> until) {
        this.until = until;
    }

    @Override
    public Observable<T> call(final Observable<T> source) {
        return until.take(1).flatMap(__ -> source);
    }
}
