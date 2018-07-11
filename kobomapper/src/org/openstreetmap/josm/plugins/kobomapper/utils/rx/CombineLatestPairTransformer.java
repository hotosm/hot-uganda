package org.openstreetmap.josm.plugins.kobomapper.utils.rx;


import org.openstreetmap.josm.plugins.kobomapper.utils.Pair;
import rx.Observable;

/**
 * Created by mossplix on 4/29/17.
 */

public final class CombineLatestPairTransformer<S, T> implements Observable.Transformer<S, Pair<S, T>> {

    private final Observable<T> second;

    public CombineLatestPairTransformer(final Observable<T> second) {
        this.second = second;
    }

    @Override
    public Observable<Pair<S, T>> call(final Observable<S> first) {
        return Observable.combineLatest(first, second, Pair::new);
    }
}
